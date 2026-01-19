import { Request, Response, NextFunction } from 'express';
import Order from '../models/order.model';
import { errorHandler } from '../utils/error';
import {
    CONVERSATION_STATUS,
    NOTIFY_TYPE,
    ORDER_STATUS,
    ROLE,
    TRANSACTION_TYPE,
} from '../constants';
import { generateUserId } from '../utils/generate';
import Notification from '../models/notification.model';
import Conversation from '../models/conversation.model';
import { createNotification, emitNotification, emitOrderStatusChange } from '../helpers';
import Account from '../models/account.model';
import { AuthRequest } from '../interfaces';
import mongoose from 'mongoose';
import Wallet from '../models/wallet.model';
import Transaction from '../models/transaction.model';
import User from '../models/user.model';
import { buildQueryOrderOptions, orderPopulates } from '../helpers/order.helper';
import { notificationService } from '../services/notification.service';
import { pushService } from '../services/push.service';
import SystemSettings from '../models/systemSettings.model';
import PromoCode from '../models/promoCode.model';
import Receipt from '../models/receipt.model';

/**
 * @desc    Lấy chi tiết một đơn hàng bằng `boostId`.
 * @route   GET /api/orders/:boostId
 * @access  Private
 */
const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boostId = req.params.boostId;
        const order = await Order.findOne({ boost_id: boostId }).populate(orderPopulates);

        if (!order) return next(errorHandler(404, 'Order not found'));

        res.status(200).json({ success: true, data: order });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy danh sách đơn hàng của người dùng đang đăng nhập.
 * @route   GET /api/orders/my-orders
 * @access  Private (User)
 */
const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: user_id } = req.user;

        const { filters, sort, page, perPage } = buildQueryOrderOptions(req.query, [
            'boost_id',
            'type',
            'status',
            'title',
        ]);

        const query = { user: user_id, ...filters };

        const [total, orders] = await Promise.all([
            Order.countDocuments(query),
            Order.find(query)
                .sort(sort as string)
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate(orderPopulates),
        ]);

        res.status(200).json({
            success: true,
            data: orders,
            pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Partner lấy danh sách đơn hàng đang chờ nhận.
 * @route   GET /api/order/pending
 * @access  Private (Partner)
 */
const getPendingOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: user_id } = req.user;

        const { filters, sort, page, perPage } = buildQueryOrderOptions(req.query, [
            'boost_id',
            'type',
            'status',
            'title',
        ]);
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

        res.status(200).json({
            success: true,
            data: orders,
            pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Partner lấy danh sách đơn hàng đang thực hiện.
 * @route   GET /api/orders/in-progress
 * @access  Private (Partner)
 */
const getProgressOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: user_id } = req.user;

        const { filters, sort, page, perPage } = buildQueryOrderOptions(req.query, [
            'boost_id',
            'type',
            'status',
            'title',
        ]);
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

        res.status(200).json({
            success: true,
            data: orders,
            pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng tạo một đơn hàng mới.
 * @route   POST /api/orders
 * @access  Private (User)
 */
const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: user_id } = req.user;

        const newOrder = new Order({
            boost_id: generateUserId(),
            user: user_id,
            ...req.body,
        });
        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully.',
            data: newOrder.boost_id,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng gán một Partner cụ thể cho đơn hàng.
 * @route   POST /api/orders/:boostId/assign
 * @access  Private (User)
 */
const assignPartner = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { boostId } = req.params;
        const { partnerId } = req.body;
        const { id: userId } = req.user;

        const order = await Order.findOneAndUpdate(
            { boost_id: boostId, user: userId },
            { assign_partner: partnerId },
            { new: true },
        );
        if (!order) {
            return next(errorHandler(404, 'Order not found.'));
        }
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Partner successfully assigned to the order.',
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng và assign partner từ chối order được gán.
 * @route   POST /api/orders/:boostId/refuse
 * @access  Private (User)
 */
const refuseOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: userId } = req.user;
        const { boostId } = req.params;

        const order = await Order.findOne({ boost_id: boostId });
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (!order.user) return next(errorHandler(400, 'Order missing user field'));

        const isUserRequester = order.user.toString() === userId;
        const receiverId = isUserRequester
            ? order.assign_partner?.toString()
            : order.user.toString();

        const sender = await User.findById(userId).select('username');
        const senderName = sender?.username || 'Partner';

        if (receiverId) {
            await notificationService.createAndNotify({
                sender: userId,
                receiver: receiverId,
                boost_id: order.boost_id,
                content: `${senderName} has refused the order: ${order.title}`,
                type: NOTIFY_TYPE.BOOST,
            });

            const payload = {
                title: 'Order assignment refused',
                body: `${senderName} has refused the assignment for order: "${order.title}"`,
                url: `/boosts/${order.boost_id}`,
            };
            await pushService.triggerPushNotification(receiverId, 'updated_order', payload);
        }

        const partners = await User.find({ role: ROLE.PARTNER }).select('_id');
        const partnerIds = partners.map((p) => p._id.toString());

        if (partnerIds.length > 0) {
            const payload = {
                title: 'New Order Available!',
                body: `A new order "${order.title}" is ready to be taken.`,
                url: '/pending-boosts',
            };
            await pushService.triggerPushNotificationToMany(partnerIds, 'new_order', payload);
        }

        order.assign_partner = null;
        order.status = ORDER_STATUS.IN_ACTIVE;
        await order.save();

        await notificationService.createPendingOrderNotification(order);

        emitOrderStatusChange();

        res.status(201).json({ success: true, message: 'Success refuse order' });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Partner chấp nhận một đơn hàng.
 * @route   POST /api/orders/:boostId/accept
 * @access  Private (Partner)
 */
const acceptOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { boostId } = req.params;
        const { id: partner_id } = req.user;

        const order = await Order.findOne({ boost_id: boostId }).session(session);
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (order.status !== ORDER_STATUS.IN_ACTIVE && order.status !== ORDER_STATUS.WAITING) {
            throw errorHandler(400, 'This order is not available to be accepted.');
        }
        if (order.partner) return next(errorHandler(409, 'Order already has a partner assigned'));

        const partnerUser = await User.findById(partner_id).session(session);
        if (!partnerUser) {
            throw errorHandler(404, 'Partner account not found');
        }
        partnerUser.total_orders_taken += 1;

        if (partnerUser.total_orders_taken > 0) {
            partnerUser.total_completion_rate =
                (partnerUser.total_orders_completed / partnerUser.total_orders_taken) * 100;
        } else {
            partnerUser.total_completion_rate = 100;
        }
        await partnerUser.save({ session });

        order.assign_partner = null;

        const settings = await SystemSettings.findOne().session(session);
        const commissionRate = settings?.partnerCommissionRate ?? 0.8;
        const potentialEarning = order.price * commissionRate;
        const partnerWallet = await Wallet.findOne({ owner: partner_id }).session(session);
        if (!partnerWallet) throw errorHandler(404, `Wallet for partner ${partner_id} not found.`);

        partnerWallet.escrow_balance += potentialEarning;
        await partnerWallet.save({ session });

        const conversation = await new Conversation({
            participants: [order.user, partner_id],
            messages: [],
        }).save({ session });

        Object.assign(order, {
            partner: partner_id,
            status: ORDER_STATUS.IN_PROGRESS,
            conversation: conversation._id,
        });
        await order.save({ session });

        const partner = await User.findById(partner_id).select('username');
        const partnerName = partner?.username || 'Partner';

        if (order.user) {
            await notificationService.createAndNotify({
                sender: partner_id,
                receiver: order.user.toString(),
                boost_id: boostId,
                content: `${partnerName} has accepted your order: ${order.title}`,
                type: NOTIFY_TYPE.BOOST,
            });
        }

        await session.commitTransaction();

        if (order.user) {
            const payload = {
                title: 'Your order has been accepted!',
                body: `${partnerName} has accepted your order: "${order.title}"`,
                url: `/orders/boosts/${order.boost_id}`,
            };
            await pushService.triggerPushNotification(
                order.user.toString(),
                'updated_order',
                payload,
            );
        }

        if (order?.user) {
            emitNotification(order.user.toString());
        }
        emitOrderStatusChange();

        await notificationService.removePendingOrderNotificationIfEmpty();

        res.status(200).json({ success: true, message: 'Order accepted successfully' });
    } catch (e) {
        await session.abortTransaction();
        next(e);
    } finally {
        session.endSession();
    }
};

/**
 * @desc    Partner đánh dấu đơn hàng đã hoàn thành.
 * @route   POST /api/orders/:boostId/complete
 * @access  Private (Partner)
 */
const completedOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id: partner_id } = req.user;
        const { boostId } = req.params;

        const order = await Order.findOne({ boost_id: boostId }).session(session).populate('user');
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (order.partner?.toString() !== partner_id) {
            return next(errorHandler(403, 'Not allowed to complete this order'));
        }
        if (order.status !== ORDER_STATUS.IN_PROGRESS) {
            throw errorHandler(400, 'Order is not in progress.');
        }

        const partnerUser = await User.findById(partner_id).session(session);
        if (!partnerUser) {
            throw errorHandler(404, 'Partner account not found');
        }
        partnerUser.total_orders_completed += 1;

        if (order.total_time && order.total_time > 0) {
            const timeInHours = Math.round((order.total_time / 60) * 100) / 100;
            partnerUser.total_working_time += timeInHours;
        }
        if (partnerUser.total_orders_taken > 0) {
            const completionRate =
                (partnerUser.total_orders_completed / partnerUser.total_orders_taken) * 100;
            partnerUser.total_completion_rate = Math.round(completionRate * 100) / 100;
        }
        await partnerUser.save({ session });

        const settings = await SystemSettings.findOne().session(session);
        const commissionRate = settings?.partnerCommissionRate ?? 0.8;
        const partnerEarning = order.price * commissionRate;
        const partnerWallet = await Wallet.findOne({ owner: partner_id }).session(session);
        if (!partnerWallet) throw errorHandler(404, `Wallet not found for partner ${partner_id}`);
        if (partnerWallet.escrow_balance < partnerEarning) {
            throw errorHandler(409, `Escrow balance is inconsistent.`);
        }

        partnerWallet.escrow_balance -= partnerEarning;
        partnerWallet.total_earnings += partnerEarning;

        let earningAfterDebt = partnerEarning;
        if (partnerWallet.debt > 0) {

            const debtToPay = Math.min(partnerWallet.debt, partnerEarning); 
            partnerWallet.debt -= debtToPay; 
            earningAfterDebt -= debtToPay; 
        }

        partnerWallet.balance += earningAfterDebt;
        await partnerWallet.save({ session });

        await Transaction.create(
            [
                {
                    user: partner_id,
                    type: TRANSACTION_TYPE.PARTNER_COMMISSION,
                    amount: partnerEarning,
                    description: `Commission from completed order ${order.boost_id}. An amount may have been used to offset debt.`,
                    related_order: order._id,
                },
            ],
            { session },
        );

        await Transaction.create(
            [
                {
                    user: order.user,
                    type: TRANSACTION_TYPE.SALE,
                    amount: order.price,
                    description: `Payment for order ${order.boost_id}`,
                    related_order: order._id,
                },
            ],
            { session },
        );

        order.status = ORDER_STATUS.COMPLETED;
        await order.save({ session });

        if (order.conversation) {
            await Conversation.findByIdAndUpdate(
                order.conversation,
                { status: CONVERSATION_STATUS.CLOSED },
                { session },
            );
        }

        const completedPartner = await User.findById(partner_id).select('username');
        const completedPartnerName = completedPartner?.username || 'Partner';

        if (order.user?._id) {
            await notificationService.createAndNotify({
                sender: partner_id,
                receiver: order.user._id.toString(),
                boost_id: boostId,
                content: `${completedPartnerName} has completed order: ${order.title}`,
                type: NOTIFY_TYPE.BOOST,
            });
        }

        await session.commitTransaction();

        if (order.user?._id) {
            const payload = {
                title: 'Your order is complete!',
                body: `Your order "${order.title}" has been successfully completed.`,
                url: `/orders/boosts/${order.boost_id}`,
            };
            await pushService.triggerPushNotification(
                order.user._id.toString(),
                'updated_order',
                payload,
            );
        }

        if (order?.user?._id) {
            emitNotification(order.user._id.toString());
        }
        emitOrderStatusChange();

        res.status(200).json({ success: true, message: 'Order accepted successfully' });
    } catch (e) {
        await session.abortTransaction();
        next(e);
    } finally {
        session.endSession();
    }
};

/**
 * @desc    Partner hủy một đơn hàng đang thực hiện.
 * @route   POST /api/orders/:boostId/cancel
 * @access  Private (Partner)
 */
const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id: partner_id } = req.user;
    const { boostId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findOne({ boost_id: boostId }).populate('user');
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (order.partner?.toString() !== partner_id)
            return next(errorHandler(403, 'Not allowed to cancel this order'));
        if (order.status !== ORDER_STATUS.IN_PROGRESS) {
            throw errorHandler(400, 'Only in-progress orders can be cancelled by a partner.');
        }

        const settings = await SystemSettings.findOne().session(session);
        const commissionRate = settings?.partnerCommissionRate ?? 0.8;
        const penaltyRate = settings?.cancellationPenaltyRate ?? 0.05;
        const escrowedAmount = order.price * commissionRate;
        const penaltyAmount = order.price * penaltyRate;

        const partnerWallet = await Wallet.findOne({ owner: partner_id }).session(session);
        if (!partnerWallet) throw errorHandler(404, `Wallet not found for partner ${partner_id}`);

        if (partnerWallet.escrow_balance < escrowedAmount) {
            throw errorHandler(409, 'Escrow balance is inconsistent. Please contact support.');
        }

        partnerWallet.escrow_balance -= escrowedAmount;
        let penaltyPaid = 0;

        if (partnerWallet.balance >= penaltyAmount) {
            partnerWallet.balance -= penaltyAmount;
            penaltyPaid = penaltyAmount;
        } else {
            penaltyPaid = penaltyAmount;
            const remainingPenalty = penaltyAmount - partnerWallet.balance;
            partnerWallet.balance = 0;
            partnerWallet.debt += remainingPenalty;
        }
        await partnerWallet.save({ session });

        await Transaction.create(
            [
                {
                    user: partner_id,
                    type: TRANSACTION_TYPE.PENALTY,
                    amount: -penaltyPaid,
                    description: `Penalty for cancelling order ${order.boost_id}. Outstanding debt may apply.`,
                    related_order: order._id,
                },
            ],
            { session },
        );

        order.status = ORDER_STATUS.CANCEL;

        await order.save({ session });

        if (order.conversation) {
            await Conversation.findByIdAndUpdate(
                order.conversation,
                { status: CONVERSATION_STATUS.CLOSED },
                { session },
            );
        }

        const cancelPartner = await User.findById(partner_id).select('username');
        const cancelPartnerName = cancelPartner?.username || 'Partner';

        if (order.user?._id) {
            await notificationService.createAndNotify({
                sender: partner_id,
                receiver: order.user._id.toString(),
                boost_id: boostId,
                content: `${cancelPartnerName} has cancelled order: ${order.title}. It is now available again.`,
                type: NOTIFY_TYPE.BOOST,
            });
        }

        await session.commitTransaction();

        if (order.user?._id) {
            const partner = await User.findById(partner_id).select('username');
            const payload = {
                title: 'An order has been cancelled',
                body: `${partner?.username || 'A partner'} has cancelled the order: "${order.title}". It is now available again.`,
                url: `/orders/boosts/${order.boost_id}`,
            };
            await pushService.triggerPushNotification(
                order.user._id.toString(),
                'updated_order',
                payload,
            );
        }

        if (order?.user?._id) {
            emitNotification(order.user._id.toString());
        }
        emitOrderStatusChange();

        res.status(201).json({
            success: true,
            message:
                'Order cancelled successfully. A penalty has been applied or recorded as debt.',
        });
    } catch (e) {
        await session.abortTransaction();
        next(e);
    } finally {
        session.endSession();
    }
};

/**
 * @desc    Người dùng gia hạn một đơn hàng đã hoàn thành.
 * @route   POST /api/orders/:boostId/renew
 * @access  Private (User)
 */
const renewOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id: user_id } = req.user;
        const { boostId } = req.params;

        const originalOrder = await Order.findOne({ boost_id: boostId }).session(session);
        if (!originalOrder) return next(errorHandler(404, 'Order not found'));
        if (
            originalOrder.user?.toString() !== user_id ||
            originalOrder.status !== ORDER_STATUS.COMPLETED
        )
            return next(errorHandler(403, 'Not allowed to renew this order'));

        if (originalOrder.retryCount > 0) {
            return next(errorHandler(400, 'This order has already been renewed.'));
        }

        const orderData = {
            title: originalOrder.title,
            type: originalOrder.type,
            server: originalOrder.server,
            price: originalOrder.price,
            game: originalOrder.game,
            begin_rating: originalOrder.begin_rating,
            end_rating: originalOrder.end_rating,
            begin_rank: originalOrder.begin_rank,
            end_rank: originalOrder.end_rank,
            begin_exp: originalOrder.begin_exp,
            end_exp: originalOrder.end_exp,
            total_time: originalOrder.total_time,
            options: originalOrder.options,
            account: originalOrder.account, 
        };

        const newOrder = new Order({
            ...orderData,
            boost_id: generateUserId(),
            user: user_id,
            status: ORDER_STATUS.PENDING,
            retryCount: 0,
        });

        await newOrder.save();
        originalOrder.retryCount += 1;
        await originalOrder.save({ session });

        await session.commitTransaction();

        emitOrderStatusChange();

        res.status(201).json({
            success: true,
            message: 'Order renewed successfully',
            data: newOrder.boost_id,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng khôi phục một đơn hàng đã hủy.
 * @route   POST /api/orders/:boostId/recover
 * @access  Private (User)
 */
const recoveryOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id: user_id } = req.user;
        const { boostId } = req.params;

        const originalOrder = await Order.findOne({ boost_id: boostId }).session(session);
        if (!originalOrder) return next(errorHandler(404, 'Ordper not found'));
        if (
            originalOrder.user?.toString() !== user_id ||
            originalOrder.status !== ORDER_STATUS.CANCEL
        )
            return next(errorHandler(403, 'Not allowed to recover this order'));
        if (originalOrder.retryCount > 0) {
            throw errorHandler(400, 'This order has already been recovered or renewed.');
        }

        const orderData = {
            title: originalOrder.title,
            type: originalOrder.type,
            server: originalOrder.server,
            price: originalOrder.price,
            game: originalOrder.game,
            begin_rating: originalOrder.begin_rating,
            end_rating: originalOrder.end_rating,
            begin_rank: originalOrder.begin_rank,
            end_rank: originalOrder.end_rank,
            begin_exp: originalOrder.begin_exp,
            end_exp: originalOrder.end_exp,
            total_time: originalOrder.total_time,
            options: originalOrder.options,
            account: originalOrder.account,
        };

        const newOrder = new Order({
            ...orderData,
            boost_id: generateUserId(),
            user: user_id,
            status: ORDER_STATUS.IN_ACTIVE,
        });

        await newOrder.save();
        originalOrder.retryCount += 1;
        await originalOrder.save({ session });

        await Notification.deleteOne({ type: NOTIFY_TYPE.NEW_ORDER }).session(session);
        await createNotification({
            boost_id: newOrder.boost_id,
            content: 'New order created!',
            type: NOTIFY_TYPE.NEW_ORDER,
        });

        await session.commitTransaction();

        const partners = await User.find({ role: ROLE.PARTNER }).select('_id');
        const partnerIds = partners.map((p) => p._id.toString());

        if (partnerIds.length > 0) {
            const payload = {
                title: 'Recovered Order Available!',
                body: `An order "${newOrder.title}" has been recovered and is now available.`,
                url: '/pending-boosts',
            };
            await pushService.triggerPushNotificationToMany(partnerIds, 'new_order', payload);
        }

        notificationService.broadcastNewOrder(newOrder);
        emitOrderStatusChange();

        res.status(201).json({
            success: true,
            message: 'Order has been restored',
            data: newOrder.boost_id,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng xóa một đơn hàng.
 * @route   DELETE /api/orders/:boostId
 * @access  Private (User)
 */
const deleteOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { boostId } = req.params;
        const { id: userId } = req.user;

        const order = await Order.findOne({ boost_id: boostId });
        if (!order) return next(errorHandler(404, 'Order not found'));
        if (order.user?.toString() !== userId)
            return next(errorHandler(403, 'Not orized to delete this order'));

        await Order.deleteOne({ boost_id: boostId });

        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng thêm thông tin tài khoản game vào đơn hàng.
 * @route   POST /api/orders/:boostId/account
 * @access  Private (User)
 */
const addAccountToOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { boostId } = req.params;
        const { id: userId } = req.user;
        const { login, password, backup_code } = req.body;

        const newAccount = new Account({ user_id: userId, login, password, backup_code });
        await newAccount.save();

        const updatedOrder = await Order.findOneAndUpdate(
            { boost_id: boostId },
            { $set: { account: newAccount._id } },
        );

        if (!updatedOrder) {
            return next(errorHandler(400, 'Failed to link account to order'));
        }

        res.status(201).json({
            success: true,
            message: 'Account created and linked successfully',
            data: newAccount,
        });
        await newAccount.save();
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng chỉnh sửa thông tin tài khoản game đã liên kết.
 * @route   PATCH /api/orders/accounts/:accountId
 * @access  Private (User)
 */
const editAccountOnOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { accountId } = req.params;
        const { id: userId } = req.user;
        const { login, password, backup_code } = req.body;

        const account = await Account.findById(accountId);

        if (!account) {
            return next(errorHandler(404, 'Account not found'));
        }

        if (account.user_id.toString() !== userId) {
            return next(errorHandler(401, 'You are not orized to edit this account'));
        }

        Object.assign(account, { login, password, backup_code });
        await account.save();
        const updatedAccount = await account.save();

        res.status(200).json({
            success: true,
            message: 'Account updated successfully',
            data: updatedAccount,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Validate a promo code and calculate discount.
 * @route   POST /api/orders/validate-promo
 * @access  Private
 */
const validatePromoCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code, orderType, orderAmount } = req.body;

        if (!code || !orderType || !orderAmount) {
            return next(errorHandler(400, 'Code, orderType, and orderAmount are required.'));
        }

        const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

        if (!promoCode) {
            return res.status(404).json({
                success: false,
                message: 'Promo code not found.',
            });
        }

        if (!promoCode.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Promo code is not active.',
            });
        }

        const now = new Date();
        if (now < promoCode.validFrom || now > promoCode.validUntil) {
            return res.status(400).json({
                success: false,
                message: 'Promo code has expired or is not yet valid.',
            });
        }

        if (promoCode.usageLimit > 0 && promoCode.usedCount >= promoCode.usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'Promo code usage limit has been reached.',
            });
        }

        if (!promoCode.applicableOrderTypes.includes(orderType)) {
            return res.status(400).json({
                success: false,
                message: `Promo code is not applicable for ${orderType} orders.`,
            });
        }

        if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount is ${promoCode.minOrderAmount}.`,
            });
        }

        let discountAmount = (orderAmount * promoCode.discountPercent) / 100;

        if (promoCode.maxDiscount && promoCode.maxDiscount > 0) {
            discountAmount = Math.min(discountAmount, promoCode.maxDiscount);
        }

        const finalPrice = orderAmount - discountAmount;

        res.status(200).json({
            success: true,
            data: {
                code: promoCode.code,
                discountPercent: promoCode.discountPercent,
                discountAmount,
                originalPrice: orderAmount,
                finalPrice,
                maxDiscount: promoCode.maxDiscount,
            },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Complete a free order (100% promo discount).
 * @route   POST /api/order/:boostId/complete-free
 * @access  Private
 */
const completeFreeOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { boostId } = req.params;
        const { promoCode: promoCodeStr } = req.body;
        const userId = req.user.id;

        const order = await Order.findOne({ boost_id: boostId }).session(session);
        if (!order) {
            await session.abortTransaction();
            return next(errorHandler(404, 'Order not found'));
        }

        if (order.user?.toString() !== userId) {
            await session.abortTransaction();
            return next(errorHandler(403, 'You are not authorized to complete this order'));
        }

        if (order.status !== ORDER_STATUS.PENDING) {
            await session.abortTransaction();
            return next(errorHandler(400, 'Order is not in pending status'));
        }

        if (!promoCodeStr) {
            await session.abortTransaction();
            return next(errorHandler(400, 'Promo code is required for free orders'));
        }

        const promo = await PromoCode.findOne({ code: promoCodeStr.toUpperCase() }).session(
            session,
        );
        if (!promo) {
            await session.abortTransaction();
            return next(errorHandler(404, 'Promo code not found'));
        }

        let discountAmount = (order.price * promo.discountPercent) / 100;
        if (promo.maxDiscount && promo.maxDiscount > 0) {
            discountAmount = Math.min(discountAmount, promo.maxDiscount);
        }
        const finalPrice = order.price - discountAmount;

        if (finalPrice > 0) {
            await session.abortTransaction();
            return next(
                errorHandler(400, 'This is not a free order. Please use the payment gateway.'),
            );
        }

        const newReceipt = new Receipt({
            receipt_id: generateUserId(),
            payment_method: 'promo-code',
            price: 0,
            user: userId,
            order: order._id,
        });
        await newReceipt.save({ session });

        promo.usedCount += 1;
        await promo.save({ session });

        order.promoCode = promo.code;

        if (order.assign_partner) {
            order.status = ORDER_STATUS.WAITING;

            await notificationService.createAndNotify({
                sender: userId,
                receiver: order.assign_partner.toString(),
                boost_id: order.boost_id,
                content: 'You have a new assigned order to confirm.',
                type: NOTIFY_TYPE.BOOST,
            });

            const user = await User.findById(userId).select('username').session(session);
            const payload = {
                title: 'New Assigned Order!',
                body: `User ${user?.username || ''} has completed a free order assigned to you: "${order.title}"`,
                url: `/pending-boosts`,
            };
            await pushService.triggerPushNotification(
                order.assign_partner.toString(),
                'updated_order',
                payload,
            );
        } else {
            order.status = ORDER_STATUS.IN_ACTIVE;

            notificationService.broadcastNewOrder(order);

            const partners = await User.find({ role: ROLE.PARTNER }).select('_id').session(session);
            const partnerIds = partners.map((p) => p._id.toString());

            if (partnerIds.length > 0) {
                const payload = {
                    title: 'New Order Available!',
                    body: `A new order "${order.title}" is ready to be taken.`,
                    url: '/pending-boosts',
                };
                await pushService.triggerPushNotificationToMany(partnerIds, 'new_order', payload);
            }
        }

        await order.save({ session });
        await session.commitTransaction();

        notificationService.broadcastOrderStatusChange();

        res.status(200).json({
            success: true,
            message: 'Free order completed successfully',
            data: {
                boostId: order.boost_id,
                promoCode: promo.code,
                discountApplied: discountAmount,
            },
        });
    } catch (e) {
        await session.abortTransaction();
        next(e);
    } finally {
        session.endSession();
    }
};

export {
    getMyOrders,
    getPendingOrders,
    getProgressOrders,
    getOrderById,
    createOrder,
    assignPartner,
    refuseOrder,
    acceptOrder,
    completedOrder,
    cancelOrder,
    renewOrder,
    recoveryOrder,
    deleteOrder,
    addAccountToOrder,
    editAccountOnOrder,
    validatePromoCode,
    completeFreeOrder,
};