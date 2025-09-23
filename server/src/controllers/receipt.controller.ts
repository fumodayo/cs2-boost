import { NextFunction, Response } from 'express';
import Order from '../models/order.model';
import Receipt from '../models/receipt.model';
import { errorHandler } from '../utils/error';
import { generateUserId } from '../utils/generate';
import { AuthRequest } from '../interfaces';

/**
 * @desc    Tạo một hóa đơn sau khi thanh toán thành công.
 *          Hàm này cập nhật trạng thái đơn hàng và gửi thông báo đến các Partner liên quan.
 * @route   POST /api/receipts
 * @access  Private
 */
const createReceipt = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user.id;
        const { boost_id: boostId } = req.body;

        if (!boostId) {
            return next(errorHandler(400, 'Thiếu boost_id'));
        }

        const order = await Order.findOne({ boost_id: boostId });
        if (!order) {
            return next(errorHandler(404, 'Đơn hàng không tồn tại'));
        }

        const existingReceipt = await Receipt.findOne({ order: order._id });
        if (existingReceipt) {
            return next(errorHandler(409, 'Hóa đơn cho đơn hàng này đã tồn tại'));
        }

        const newReceipt = new Receipt({
            receipt_id: generateUserId(),
            payment_method: 'vn-pay',
            price: order.price,
            user: user_id,
            order: order._id,
        });

        await newReceipt.save();

        res.status(201).json({
            success: true,
            message: 'Invoice created successfully.',
            data: newReceipt,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy danh sách hóa đơn của người dùng đang đăng nhập.
 *          Hỗ trợ phân trang và tìm kiếm theo `receipt_id`.
 * @route   GET /api/receipts
 * @access  Private
 */
const getReceipts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: user_id } = req.user;
        const {
            sort = '-createdAt',
            search = '',
            page = '1',
            'per-page': perPageRaw = '5',
        } = req.query as Record<string, string>;
        const pageNum = parseInt(page);
        const perPageNum = parseInt(perPageRaw);

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
                .skip((pageNum - 1) * perPageNum)
                .limit(perPageNum)
                .populate({ path: 'user', select: '-password' })
                .populate({ path: 'order', select: '-password' }),
        ]);

        res.status(200).json({
            success: true,
            data: receipts,
            pagination: {
                total,
                page: pageNum,
                perPage: perPageNum,
                totalPages: Math.ceil(total / perPageNum),
            },
        });
    } catch (e) {
        next(e);
    }
};

export { createReceipt, getReceipts };
