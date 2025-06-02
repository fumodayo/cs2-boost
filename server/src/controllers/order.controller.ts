import { Request, Response, NextFunction } from 'express';
import Order from '../models/order.model';
import { errorHandler } from '../utils/error';
import { AuthRequest, INotification } from '../types';
import { NOTIFY_TYPE, ORDER_STATUS, ROLE } from '../constants';
import { buildQueryOrderOptions, orderPopulates } from '../utils/queryHelpers';
import { generateUserId } from '../utils/generate';
import Notification from '../models/notification.model';
import Receipt from '../models/receipt.model';
import { getReceiverSocketID, io } from '../socket/socket';
import { sendNotification } from '../socket/events';
import Conversation from '../models/conversation.model';
import { createNotification, emitNotification, emitOrderStatusChange } from '../helpers';
import Account from '../models/account.model';

/**
 * @route GET /api/order/get-order-by-id/:id
 * @access Private (User)
 * @description Trả về thông tin chi tiết của một đơn hàng theo boost ID (mã đơn).
 *              Gồm thông tin tài khoản, dịch vụ, trạng thái đơn hàng, lịch sử cập nhật.
 *              Dùng khi người dùng click vào một đơn để xem chi tiết.
 */
const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findOne({ boost_id: req.params.id }).populate([
            { path: 'user', select: '-password' },
            { path: 'partner', select: '-password' },
            { path: 'assign_partner', select: '-password' },
            { path: 'conversation' },
            { path: 'account' },
            {
                path: 'review',
                populate: { path: 'sender', select: 'username profile_picture' },
            },
        ]);

        if (!order) return next(errorHandler(404, 'Order not found'));

        res.status(200).json(order);
    } catch (e) {
        next(e);
    }
};

/**
 * @route GET /api/order/get-orders
 * @access Private (User)
 * @description Lấy tất cả các đơn hàng mà người dùng hiện tại đã tạo.
 *              Dùng để hiển thị lịch sử mua hàng, trạng thái các đơn (đang xử lý, đã hoàn tất, đã hủy, v.v).
 *              Token xác thực được dùng để xác định user đang đăng nhập.
 */
const getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userid = req.user.id;
    const { filters, sort, page, perPage } = buildQueryOrderOptions(req.query, [
        'boost_id',
        'type',
        'status',
        'title',
    ]);

    try {
        const query = { user: userid, ...filters };

        const [total, orders] = await Promise.all([
            Order.countDocuments(query),
            Order.find(query)
                .sort(sort as string)
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate(orderPopulates),
        ]);

        if (!orders.length) {
            return next(errorHandler(404, 'Orders not found'));
        }

        res.status(200).json({ orders, total });
    } catch (e) {
        next(e);
    }
};

/**
 * @route GET /api/order/get-pending-orders
 * @access Private (Partner)
 * @description Trả về danh sách các đơn hàng đang chờ được partner tiếp nhận.
 *              Dành riêng cho partner để lựa chọn các đơn muốn thực hiện.
 */
const getPendingOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { role, id: user_id } = req.user;

    if (!role.includes(ROLE.PARTNER)) {
        return next(errorHandler(402, 'You do not have permission to do that'));
    }

    const { filters, sort, page, perPage } = buildQueryOrderOptions(req.query, [
        'boost_id',
        'type',
        'status',
        'title',
    ]);

    try {
        const query = {
            $and: [
                { $nor: [{ user: user_id }] },
                {
                    $or: [
                        { status: ORDER_STATUS.IN_ACTIVE },
                        { assign_partner: user_id, status: ORDER_STATUS.WAITING },
                    ],
                },
                { ...filters },
            ],
        };

        const [total, orders] = await Promise.all([
            Order.countDocuments(query),
            Order.find(query)
                .sort(sort as string)
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate(orderPopulates),
        ]);

        if (!orders.length) {
            return next(errorHandler(404, 'Orders not found'));
        }

        res.status(200).json({ orders, total });
    } catch (e) {
        next(e);
    }
};

/**
 * @route GET /api/order/get-progress-orders
 * @access Private (Partner)
 * @description Trả về danh sách đơn hàng đang được partner thực hiện.
 *              Bao gồm các đơn đã nhận nhưng chưa hoàn thành.
 */
const getProgressOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { role, id: user_id } = req.user;

    if (!role.includes(ROLE.PARTNER)) {
        return next(errorHandler(402, 'You do not have permission to do that'));
    }

    const { filters, sort, page, perPage } = buildQueryOrderOptions(req.query, [
        'boost_id',
        'type',
        'status',
        'title',
    ]);

    try {
        const query = {
            partner: user_id,
            ...filters,
        };

        const [total, orders] = await Promise.all([
            Order.countDocuments(query),
            Order.find(query)
                .sort(sort as string)
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate(orderPopulates),
        ]);

        if (!orders.length) {
            return next(errorHandler(404, 'Orders not found'));
        }

        res.status(200).json({ orders, total });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/order/create-order/:id
 * @access Private (User)
 * @description Tạo một đơn hàng mới dựa trên ID dịch vụ (service id).
 *              Người dùng cung cấp các thông tin cấu hình dịch vụ, hệ thống sẽ lưu và khởi tạo đơn.
 */
const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userid = req.user.id;
        if (userid !== req.params.id)
            return next(errorHandler(401, 'You can order only your account'));

        const order = new Order({
            boost_id: generateUserId(),
            user: userid,
            ...req.body,
        });

        await order.save();

        res.status(201).json({ success: true, order_id: order.boost_id });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/order/payment-order/:customer_id/:order_id
 * @access Private (User)
 * @description Tiến hành thanh toán cho đơn hàng cụ thể.
 *              Dùng customer_id để xác định người thanh toán và order_id để xác định đơn cần thanh toán.
 *              Hệ thống kiểm tra số dư, trạng thái đơn và thực hiện thanh toán.
 */
const paymentOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userid = req.user.id;
        const { customer_id, order_id } = req.params;
        const { payment_method, price, assign_partner } = req.body;

        if (userid !== customer_id) {
            return next(errorHandler(401, 'You can payment only your account'));
        }

        const order = await Order.findOne({ boost_id: order_id });
        if (!order) return next(errorHandler(404, 'Order not found'));

        if (assign_partner) {
            order.status = ORDER_STATUS.WAITING;
            order.assign_partner = assign_partner;

            await new Notification({
                sender: userid,
                receiver: assign_partner,
                boost_id: order.boost_id,
                content: 'wants you to accept order.',
                type: NOTIFY_TYPE.BOOST,
            } as INotification).save();

            //socket.emit to assign_partner
            const receiver_socket_id = getReceiverSocketID(assign_partner);
            if (receiver_socket_id) io.to(receiver_socket_id).emit('newNotify');
        } else {
            order.status = ORDER_STATUS.IN_ACTIVE;

            await Notification.deleteOne({ type: NOTIFY_TYPE.NEW_ORDER });

            await new Notification({
                boost_id: order.boost_id,
                content: 'New order created!',
                type: NOTIFY_TYPE.NEW_ORDER,
            }).save();

            // socket.emit to partners
            io.in('partners').emit('newNotify');
        }

        await order.save();

        const receipt = new Receipt({
            receipt_id: generateUserId(),
            payment_method,
            price,
            user: userid,
            order: order._id,
        });

        await receipt.save();

        res.status(201).json({ success: true, message: 'Receipt created successfully' });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/order/refuse-order/:id
 * @access Private (User)
 * @description Người dùng từ chối đơn hàng trước khi đơn được partner nhận.
 *              Sau khi từ chối, đơn hàng có thể được xóa hoặc đưa về trạng thái "từ chối".
 */
const refuseOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const boostId = req.params.id;
    try {
        const order = await Order.findOne({ boostId });
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (!order.user) return next(errorHandler(400, 'Order missing user field'));

        const isUserRequester = order.user.toString() === userId;
        const receiverId = isUserRequester
            ? order.assign_partner?.toString()
            : order.user.toString();

        await new Notification({
            sender: userId,
            receiver: receiverId,
            boost_id: order.boost_id,
            content: `had refuse ${order.title}`,
            type: NOTIFY_TYPE.BOOST,
        }).save();

        // SOCKET - notify receiver
        if (receiverId) {
            sendNotification(receiverId);
        }

        order.assign_partner = null;
        order.status = ORDER_STATUS.IN_ACTIVE;
        await order.save();

        // SOCKET - broadcast status change
        io.emit('statusOrderChange');

        res.status(201).json({ success: true, message: 'Success refuse order' });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/order/accept-order/:id
 * @access Private (Partner)
 * @description Partner tiếp nhận đơn hàng để bắt đầu thực hiện boost.
 *              Đơn hàng sẽ chuyển sang trạng thái "in progress".
 */
const acceptOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id: partner_id, role } = req.user;
    const { id: boost_id } = req.params;
    try {
        if (!role?.includes(ROLE.PARTNER))
            return next(errorHandler(403, 'You do not have permission to perform this action'));

        const order = await Order.findOne({ boost_id }).populate('user');
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (order.partner) return next(errorHandler(409, 'Order already has a partner assigned'));

        order.assign_partner = null;

        const conversation = await new Conversation({
            participants: [order.user, partner_id],
            messages: [],
        }).save();

        Object.assign(order, {
            partner: partner_id,
            status: ORDER_STATUS.IN_PROGRESS,
            conversation: conversation._id,
        });
        await order.save();

        await createNotification({
            sender: partner_id,
            receiver: order.user?._id?.toString(),
            boost_id,
            content: `Has accepted ${order.title}`,
            type: NOTIFY_TYPE.BOOST,
        });

        if (order?.user?._id) {
            emitNotification(order.user._id.toString());
        }
        emitOrderStatusChange();

        res.status(200).json({ success: true, message: 'Order accepted successfully' });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/order/completed-order/:id
 * @access Private (Partner)
 * @description Đánh dấu đơn hàng là đã hoàn tất sau khi thực hiện xong dịch vụ.
 *              Thường đi kèm với cập nhật trạng thái, hình ảnh hoàn thành, v.v.
 */
const completedOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id: partner_id, role } = req.user;
    const { id: boost_id } = req.params;
    try {
        if (!role.includes(ROLE.PARTNER))
            return next(errorHandler(403, 'You do not have permission to perform this action'));

        const order = await Order.findOne({ boost_id }).populate('user');
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (order.partner?.toString() !== partner_id)
            return next(errorHandler(403, 'Not allowed to complete this order'));

        order.status = ORDER_STATUS.COMPLETED;
        await order.save();

        await createNotification({
            sender: partner_id,
            receiver: order.user?._id?.toString(),
            boost_id,
            content: `Has completed order ${order.title}`,
            type: NOTIFY_TYPE.BOOST,
        });

        if (order?.user?._id) {
            emitNotification(order.user._id.toString());
        }
        emitOrderStatusChange();

        res.status(200).json({ success: true, message: 'Order accepted successfully' });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/order/cancel-order/:id
 * @access Private (Partner)
 * @description Partner hủy đơn hàng đang thực hiện (ví dụ: không thể hoàn thành, có vấn đề tài khoản, v.v).
 *              Đơn hàng sẽ chuyển về trạng thái hủy và có thể được khôi phục.
 */
const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id: partner_id, role } = req.user;
    const { id: boost_id } = req.params;
    try {
        if (!role.includes(ROLE.PARTNER))
            return next(errorHandler(403, 'You do not have permission to perform this action'));

        const order = await Order.findOne({ boost_id }).populate('user');
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (order.partner?.toString() !== partner_id)
            return next(errorHandler(403, 'Not allowed to cancel this order'));

        order.status = ORDER_STATUS.CANCEL;
        await order.save();

        await createNotification({
            sender: partner_id,
            receiver: order.user?._id?.toString(),
            boost_id,
            content: `Has cancelled order ${order.title}`,
            type: NOTIFY_TYPE.BOOST,
        });

        if (order?.user?._id) {
            emitNotification(order.user._id.toString());
        }
        emitOrderStatusChange();

        res.status(201).json({ success: true, message: 'Order cancelled successfully.' });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/order/renew-order/:id
 * @access Private (User)
 * @description Gia hạn một đơn hàng cũ (đã hoàn tất hoặc hủy) để sử dụng lại dịch vụ đó.
 *              Có thể dùng lại thông tin tài khoản cũ, hoặc sửa đổi trước khi tiếp tục.
 */
const renewOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id: user_id } = req.user;
    const { id: boost_id } = req.params;
    try {
        const order = await Order.findOne({ boost_id });
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (order.user?.toString() !== user_id || order.status !== ORDER_STATUS.COMPLETED)
            return next(errorHandler(403, 'Not allowed to renew this order'));

        const newOrder = new Order({
            ...order.toObject(),
            _id: undefined,
            boost_id: generateUserId(),
            user: user_id,
        });

        await newOrder.save();
        order.retryCount += 1;
        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order renewed successfully',
            boost_id: newOrder.boost_id,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/order/recovery-order/:id
 * @access Private (User)
 * @description Khôi phục một đơn hàng đã bị hủy để tiếp tục xử lý.
 *              Thường áp dụng khi người dùng vô tình hủy đơn hoặc thay đổi ý định.
 */
const recoveryOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id: user_id } = req.user;
    const { id: boost_id } = req.params;
    try {
        const order = await Order.findOne({ boost_id });
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (order.user?.toString() !== user_id || order.status !== ORDER_STATUS.CANCEL)
            return next(errorHandler(403, 'Not allowed to recover this order'));

        const newOrder = new Order({
            ...order.toObject(),
            _id: undefined,
            boost_id: generateUserId(),
            user: user_id,
            status: ORDER_STATUS.IN_ACTIVE,
        });

        await newOrder.save();
        order.retryCount += 1;
        await order.save();

        const existNotify = await Notification.findOne({ type: NOTIFY_TYPE.NEW_ORDER });
        if (existNotify) await existNotify.deleteOne();

        await createNotification({
            boost_id: newOrder.boost_id,
            content: 'New order created!',
            type: NOTIFY_TYPE.NEW_ORDER,
        });

        io.in('partners').emit('newNotify');
        emitOrderStatusChange();

        res.status(201).json({ success: true, order_id: newOrder.boost_id });
    } catch (e) {
        next(e);
    }
};

/**
 * @route DELETE /api/order/delete-order/:id
 * @access Private (User)
 * @description Xóa hoàn toàn một đơn hàng khỏi hệ thống (chỉ khi chưa thanh toán hoặc chưa xử lý).
 *              Dùng để dọn dẹp đơn hàng nháp hoặc sai thông tin.
 */
const deleteOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id: boost_id } = req.params;
    const { id: user_id } = req.user;
    try {
        const order = await Order.findOne({ boost_id });
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (order.user?.toString() !== user_id)
            return next(errorHandler(403, 'Not authorized to delete this order'));

        await Order.deleteOne({ boost_id });

        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/order/add-account/:id
 * @access Private (User)
 * @description Thêm thông tin tài khoản game cần boost vào đơn hàng tương ứng.
 *              Thường được gọi sau khi tạo đơn nhưng trước khi partner tiếp nhận.
 */
const addAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user_id = req.user?.id;
    const boost_id = req.params.id;
    const { login, password, backup_code } = req.body;
    try {
        const account = new Account({ user_id, login, password, backup_code });
        await account.save();

        const updatedOrder = await Order.findOneAndUpdate(
            { boost_id },
            { $set: { account: account._id } },
            { new: true },
        );

        if (!updatedOrder) {
            return next(errorHandler(400, 'Failed to link account to order'));
        }

        res.status(201).json({ success: true, message: 'Account created and linked successfully' });
        await account.save();
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/order/edit-account/:id
 * @access Private (User)
 * @description Chỉnh sửa thông tin tài khoản đã cung cấp trong đơn hàng.
 *              Có thể dùng khi người dùng muốn đổi mật khẩu hoặc sai thông tin lúc đầu.
 */
const editAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const account_id = req.params.id;
    const user_id = req.user?.id;
    const { login, password, backup_code } = req.body;
    try {
        const account = await Account.findById(account_id);

        if (!account) {
            return next(errorHandler(404, 'Account not found'));
        }

        if (account.user_id.toString() !== user_id) {
            return next(errorHandler(401, 'You are not authorized to edit this account'));
        }

        Object.assign(account, { login, password, backup_code });
        await account.save();

        res.status(200).json({ success: true, message: 'Account updated successfully' });
    } catch (e) {
        next(e);
    }
};



export {
    getOrders,
    getPendingOrders,
    getProgressOrders,
    getOrderById,
    createOrder,
    paymentOrder,
    refuseOrder,
    acceptOrder,
    completedOrder,
    cancelOrder,
    renewOrder,
    recoveryOrder,
    deleteOrder,
    addAccount,
    editAccount,
};
