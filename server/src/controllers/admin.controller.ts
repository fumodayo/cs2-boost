import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { errorHandler } from '../utils/error';
import Order from '../models/order.model';
import Transaction from '../models/transaction.model';
import Payout from '../models/payout.model';
import { ROLE } from '../constants';
import { generateUserId } from '../utils/generate';
import {
    buildQueryOrderOptions,
    buildQueryUserOptions,
    orderPopulates,
} from '../helpers/admin.helper';

/**
 * @desc    Admin lấy danh sách tất cả người dùng trong hệ thống.
 *          Hỗ trợ phân trang, sắp xếp, tìm kiếm và lọc theo vai trò, trạng thái xác thực.
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const searchFields = ['username', 'email_address', 'full_name', 'phone_number'];
        const { filters, sort, page, perPage } = buildQueryUserOptions(req.query, searchFields);

        const [total, users] = await Promise.all([
            User.countDocuments(filters),
            User.find(filters)
                .select('-password -otp -otp_expiry')
                .sort(sort)
                .skip((page - 1) * perPage)
                .limit(perPage),
        ]);

        res.status(200).json({
            success: true,
            data: users,
            pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin tạo một tài khoản người dùng mới.
 *          Tài khoản được tạo sẽ mặc định là đã xác thực.
 * @route   POST /api/admin/users
 * @access  Private (Admin)
 */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email_address, password, role } = req.body;

        if (!username || !email_address || !password || !role) {
            return next(
                errorHandler(400, 'All fields (username, email, password, role) are required.'),
            );
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email_address }],
        });

        if (existingUser) {
            return next(errorHandler(409, 'Username or email address is already taken.'));
        }

        const newUser = new User({
            username,
            email_address,
            password,
            role,
            user_id: generateUserId(),
            is_verified: true,
        });

        const userObj = (await newUser.save()).toObject();

        const { password: _, ...safeUser } = userObj;

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data: safeUser,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin lấy danh sách tất cả đơn hàng trong hệ thống.
 *          Có thể lọc theo `userId` để xem đơn hàng của một người dùng cụ thể.
 * @route   GET /api/admin/orders
 * @access  Private (Admin)
 */
const getAdminOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const searchFields = ['boost_id', 'type', 'status', 'title', 'user.username', 'user.email'];

        const {
            filters: baseFilters,
            sort,
            page,
            perPage,
        } = buildQueryOrderOptions(req.query, searchFields);

        const finalConditions = baseFilters.$and || [];

        const { userId } = req.query;
        if (userId && typeof userId === 'string') {
            const user = await User.findById(userId).select('role').lean();

            if (!user) {
                return res.status(200).json({
                    success: true,
                    data: [],
                    pagination: { total: 0, page, perPage, totalPages: 0 },
                });
            }

            if (user.role.includes(ROLE.PARTNER)) {
                finalConditions.push({
                    $or: [{ user: userId }, { partner: userId }, { assign_partner: userId }],
                });
            } else {
                finalConditions.push({ user: userId });
            }
        }

        const finalFilters = finalConditions.length > 0 ? { $and: finalConditions } : {};

        const [total, orders] = await Promise.all([
            Order.countDocuments(finalFilters),
            Order.find(finalFilters)
                .sort((sort as string) || '-createdAt')
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate(orderPopulates)
                .lean(),
        ]);

        return res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage),
            },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin lấy thông tin chi tiết của một đơn hàng bằng ID.
 * @route   GET /api/admin/orders/:orderId
 * @access  Private (Admin)
 */
const getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate(orderPopulates)
            .populate('status_history.admin_id', 'username');

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin cấm (ban) một người dùng.
 *          Có thể cấm vĩnh viễn hoặc theo số ngày.
 * @route   POST /api/admin/users/:userId/ban
 * @access  Private (Admin)
 */
const banUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const { reason, days } = req.body;

        if (!reason) {
            return next(errorHandler(400, 'The reason for the ban is required.'));
        }

        const userToBan = await User.findById(userId);
        if (!userToBan) {
            return next(errorHandler(404, 'User not found.'));
        }

        const banExpiresAt =
            days && days > 0 ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : null;
        userToBan.is_banned = true;
        userToBan.ban_reason = reason;
        userToBan.ban_expires_at = banExpiresAt;
        await userToBan.save();

        res.status(200).json({
            success: true,
            message: `User ${userToBan.username} has been banned.`,
            data: userToBan,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin gỡ cấm (unban) cho một người dùng.
 * @route   POST /api/admin/users/:userId/unban
 * @access  Private (Admin)
 */
const unbanUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        const userToUnban = await User.findById(userId);

        if (!userToUnban) {
            return next(errorHandler(404, 'User not found.'));
        }

        if (!userToUnban.is_banned) {
            return next(errorHandler(400, 'This user is not banned.'));
        }

        userToUnban.set('is_banned', false);
        userToUnban.set('ban_reason', null);
        userToUnban.set('ban_expires_at', null);

        await userToUnban.save();

        res.status(200).json({
            success: true,
            message: `User ${userToUnban.username} has been unbanned.`,
            data: userToUnban,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy các chỉ số thống kê tài chính quan trọng cho dashboard.
 *          Thống kê doanh thu, lợi nhuận, chi trả trong một khoảng thời gian (mặc định 30 ngày).
 * @route   GET /api/admin/stats/revenue
 * @access  Private (Admin)
 */
const getRevenueStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const days = parseInt(req.query.days as string) || 30;
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        // Lấy tổng giao dịch theo loại
        const statsPipeline = [
            { $match: { createdAt: { $gte: dateLimit } } },
            {
                $group: {
                    _id: '$type', // Nhóm theo loại giao dịch (SALE, FEE, PAYOUT)
                    totalAmount: { $sum: '$amount' },
                },
            },
        ];

        const results = await Transaction.aggregate(statsPipeline);
        const stats: { [key: string]: number } = {};
        results.forEach((item) => {
            stats[item._id] = item.totalAmount;
        });

        const pendingPayouts = await Payout.aggregate([
            { $match: { status: 'PENDING' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        const grossRevenue = stats.SALE || 0;
        const netProfit = grossRevenue + (stats.FEE || 0); // Giả sử FEE là chi phí (số âm)
        const totalPayouts = Math.abs(stats.PAYOUT || 0); // PAYOUT là số âm

        res.status(200).json({
            success: true,
            data: {
                grossRevenue,
                netProfit,
                totalPayouts,
                pendingPayouts: pendingPayouts[0]?.total || 0,
            },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy danh sách tất cả giao dịch trong hệ thống.
 *          Hỗ trợ phân trang, sắp xếp và tìm kiếm theo thông tin người dùng hoặc mô tả.
 * @route   GET /api/admin/transactions
 * @access  Private (Admin)
 */
const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filters, sort, page, perPage } = buildQueryOrderOptions(req.query, [
            'description',
            'user.username',
        ]);

        const [total, transactions] = await Promise.all([
            Transaction.countDocuments(filters),
            Transaction.find(filters)
                .sort(sort as string)
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate({ path: 'user', select: 'username profile_picture user_id' }),
        ]);

        res.status(200).json({
            success: true,
            data: transactions,
            pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
        });
    } catch (e) {
        next(e);
    }
};

export {
    getUsers,
    getAdminOrders,
    getOrderDetails,
    banUser,
    unbanUser,
    getRevenueStats,
    getAllTransactions,
    createUser,
};
