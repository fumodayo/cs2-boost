import { NextFunction, Response } from 'express';
import { NOTIFY_TYPE, ORDER_STATUS } from '../constants';
import Notification from '../models/notification.model';
import Order from '../models/order.model';
import Receipt from '../models/receipt.model';
import { getReceiverSocketID, io } from '../socket/socket';
import { AuthRequest } from '../types';
import { errorHandler } from '../utils/error';
import { generateUserId } from '../utils/generate';

/**
 * @route POST /api/receipt/create-receipt
 * @access Private
 * @description Tạo hóa đơn, thay đổi trạng thái của order và gửi thông bào đến cho mọi partner muốn nhận order
 */
const createReceipt = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user.id;
        const boost_id = req.body.boost_id;

        if (!boost_id) {
            return next(errorHandler(400, 'Thiếu boost_id'));
        }

        const order = await Order.findOne({ boost_id });
        if (!order) {
            return next(errorHandler(404, 'Đơn hàng không tồn tại'));
        }

        const existingReceipt = await Receipt.findOne({ order: order._id });
        if (existingReceipt) {
            return next(errorHandler(404, 'Đơn hàng không tồn tại'));
        }

        const newReceipt = new Receipt({
            receipt_id: generateUserId(),
            payment_method: 'vn-pay',
            price: order.price,
            user: user_id,
            order: order._id,
        });

        await newReceipt.save();

        if (order.assign_partner) {
            order.status = ORDER_STATUS.WAITING;

            await new Notification({
                sender: user_id,
                receiver: order.assign_partner,
                boost_id: order.boost_id,
                content: 'Bạn có một đơn hàng mới cần xác nhận.',
                type: NOTIFY_TYPE.BOOST,
            }).save();

            const socketId = getReceiverSocketID(order.assign_partner.toString());
            if (socketId) io.to(socketId).emit('newNotify');
        } else {
            order.status = ORDER_STATUS.IN_ACTIVE;

            await Notification.deleteOne({ type: NOTIFY_TYPE.NEW_ORDER });

            await new Notification({
                boost_id: order.boost_id,
                content: 'Có một đơn hàng mới!',
                type: NOTIFY_TYPE.NEW_ORDER,
            }).save();

            io.in('partners').emit('newNotify');
        }

        await order.save();
        res.json({ success: true });
    } catch (e) {
        next(e);
    }
};

/**
 * @route GET /api/receipt/get-receipts
 * @access Private (User)
 * @description Trả về danh sách hóa đơn tương ứng với các đơn hàng mà user đã thanh toán.
 *              Thường dùng để xem lại các giao dịch đã hoàn tất, mục đích kế toán hoặc xác nhận thanh toán.
 */
const getReceipts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id: user_id } = req.user;
    const {
        sort = '-createdAt',
        search = '',
        page = '1',
        'per-page': perPageRaw = '15',
    } = req.query as Record<string, string>;
    const pageNum = parseInt(page);
    const perPage = parseInt(perPageRaw);
    try {
        const filters = search
            ? {
                  $or: [
                      { boost_id: { $regex: search, $options: 'i' } },
                      { type: { $regex: search, $options: 'i' } },
                      { status: { $regex: search, $options: 'i' } },
                      { title: { $regex: search, $options: 'i' } },
                  ],
              }
            : {};

        const query = { user: user_id, ...filters };

        const [total, receipts] = await Promise.all([
            Receipt.countDocuments(query),
            Receipt.find(query)
                .sort(sort)
                .skip((pageNum - 1) * perPage)
                .limit(perPage)
                .populate({ path: 'user', select: '-password' })
                .populate({ path: 'order', select: '-password' }),
        ]);

        if (!receipts.length) return next(errorHandler(404, 'Receipt not found'));

        res.status(200).json({ receipts, total });
    } catch (e) {
        next(e);
    }
};

export { createReceipt, getReceipts };
