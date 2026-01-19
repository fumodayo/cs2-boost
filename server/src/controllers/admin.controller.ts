import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import { errorHandler } from '../utils/error';
import Order from '../models/order.model';
import Transaction from '../models/transaction.model';
import Payout from '../models/payout.model';
import NotificationModel from '../models/notification.model';
import EmailTemplate from '../models/emailTemplate.model';
import Announcement from '../models/announcement.model';
import SystemSettings from '../models/systemSettings.model';
import PromoCode from '../models/promoCode.model';
import PartnerRequest, { PARTNER_REQUEST_STATUS } from '../models/partnerRequest.model';
import { ROLE, NOTIFY_TYPE } from '../constants';
import { AuthRequest } from '../interfaces';
import { generateUserId } from '../utils/generate';
import {
    buildQueryOrderOptions,
    buildQueryUserOptions,
    orderPopulates,
} from '../helpers/admin.helper';
import { io, getReceiverSocketID } from '../socket/socket';
import { sendEmail } from '../utils/sendEmail';

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
 *          Không thể ban user có role ADMIN.
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

        if (userToBan.role?.includes(ROLE.ADMIN)) {
            return next(errorHandler(403, 'Cannot ban an admin user.'));
        }

        const banExpiresAt =
            days && days > 0 ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : null;
        userToBan.is_banned = true;
        userToBan.ban_reason = reason;
        userToBan.ban_expires_at = banExpiresAt;
        await userToBan.save();

        const userSocketId = getReceiverSocketID(userId);
        if (userSocketId) {
            io.to(userSocketId).emit('user:banned', {
                is_banned: true,
                ban_reason: reason,
                ban_expires_at: banExpiresAt,
            });
        }

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

        const userSocketId = getReceiverSocketID(userId);
        if (userSocketId) {
            io.to(userSocketId).emit('user:unbanned', {
                is_banned: false,
                ban_reason: null,
                ban_expires_at: null,
            });
        }

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

        const statsPipeline = [
            { $match: { createdAt: { $gte: dateLimit } } },
            {
                $group: {
                    _id: '$type', 
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
        const netProfit = grossRevenue + (stats.FEE || 0); 
        const totalPayouts = Math.abs(stats.PAYOUT || 0); 

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

/**
 * @desc    Admin cập nhật thông tin người dùng (email, password).
 * @route   PUT /api/admin/users/:userId
 * @access  Private (Admin)
 */
const updateUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const { email_address, password } = req.body;

        if (!email_address && !password) {
            return next(
                errorHandler(400, 'At least one field (email_address or password) is required.'),
            );
        }

        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return next(errorHandler(404, 'User not found.'));
        }

        if (email_address && email_address !== userToUpdate.email_address) {
            const emailExists = await User.findOne({
                email_address,
                _id: { $ne: userId },
            });
            if (emailExists) {
                return next(errorHandler(409, 'Email address is already taken by another user.'));
            }
            userToUpdate.email_address = email_address;
        }

        const passwordUpdated = !!password;
        if (password) {
            userToUpdate.password = password;
        }

        await userToUpdate.save();

        if (passwordUpdated) {
            try {
                const template = await EmailTemplate.findOne({ name: 'password_reset_by_admin' });
                if (template) {
                    let htmlContent = template.html_content;
                    let subject = template.subject;

                    htmlContent = htmlContent.replace(/\{\{username\}\}/g, userToUpdate.username);
                    htmlContent = htmlContent.replace(/\{\{password\}\}/g, password);
                    subject = subject.replace(/\{\{username\}\}/g, userToUpdate.username);

                    await sendEmail({
                        to: userToUpdate.email_address,
                        subject,
                        html: htmlContent,
                    });
                }
            } catch (emailError) {
                console.error('Failed to send password reset email:', emailError);

            }
        }

        const userObj = userToUpdate.toObject();
        const { password: _, ...safeUser } = userObj;

        res.status(200).json({
            success: true,
            message: passwordUpdated
                ? 'User information updated successfully. Password reset email sent.'
                : 'User information updated successfully.',
            data: safeUser,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin phát thông báo đến tất cả người dùng.
 * @route   POST /api/admin/announcements
 * @access  Private (Admin)
 */
const broadcastAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content, image } = req.body;

        if (!title || !content) {
            return next(errorHandler(400, 'Title and content are required.'));
        }

        const users = await User.find().select('_id');

        const notifications = users.map((user) => ({
            receiver: user._id,
            title,
            content,
            image: image || null,
            type: 'ANNOUNCEMENT',
            isRead: false,
        }));

        await NotificationModel.insertMany(notifications);

        io.emit('notification:announcement', {
            title,
            content,
            image,
            type: 'ANNOUNCEMENT',
            createdAt: new Date(),
        });

        try {
            const template = await EmailTemplate.findOne({ name: 'announcement' });
            if (template) {
                const clientUsers = await User.find({ role: ROLE.CLIENT }).select('email_address');

                for (const user of clientUsers) {
                    try {
                        let htmlContent = template.html_content;
                        let subject = template.subject;
                        htmlContent = htmlContent.replace(/\{\{title\}\}/g, title);
                        htmlContent = htmlContent.replace(/\{\{content\}\}/g, content);
                        htmlContent = htmlContent.replace(/\{\{image\}\}/g, image || '');
                        subject = subject.replace(/\{\{title\}\}/g, title);

                        await sendEmail({ to: user.email_address, subject, html: htmlContent });
                    } catch (emailError) {
                        console.error(
                            `Failed to send announcement email to ${user.email_address}:`,
                            emailError,
                        );
                    }
                }
            }
        } catch (emailError) {
            console.error('Failed to send announcement emails:', emailError);
        }

        res.status(200).json({
            success: true,
            message: `Announcement sent to ${users.length} users.`,
            data: { recipientCount: users.length },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin lấy danh sách tất cả email templates.
 * @route   GET /api/admin/email-templates
 * @access  Private (Admin)
 */
const getEmailTemplates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const templates = await EmailTemplate.find().sort({ name: 1 });
        res.status(200).json({
            success: true,
            data: templates,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin lấy chi tiết một email template.
 * @route   GET /api/admin/email-templates/:id
 * @access  Private (Admin)
 */
const getEmailTemplateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const template = await EmailTemplate.findById(id);

        if (!template) {
            return next(errorHandler(404, 'Email template not found.'));
        }

        res.status(200).json({
            success: true,
            data: template,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin cập nhật một email template.
 * @route   PUT /api/admin/email-templates/:id
 * @access  Private (Admin)
 */
const updateEmailTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { subject, html_content, is_active } = req.body;

        const template = await EmailTemplate.findById(id);

        if (!template) {
            return next(errorHandler(404, 'Email template not found.'));
        }

        if (subject !== undefined) template.subject = subject;
        if (html_content !== undefined) template.html_content = html_content;
        if (is_active !== undefined) template.is_active = is_active;

        await template.save();

        res.status(200).json({
            success: true,
            message: 'Email template updated successfully.',
            data: template,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin gửi email thông báo mật khẩu mới cho user.
 * @route   POST /api/admin/email-templates/send-password-reset
 * @access  Private (Admin)
 */
const sendPasswordResetEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return next(errorHandler(400, 'User ID and password are required.'));
        }

        const user = await User.findById(userId).select('username email_address');
        if (!user) {
            return next(errorHandler(404, 'User not found.'));
        }

        const template = await EmailTemplate.findOne({ name: 'password_reset_by_admin' });
        if (!template) {
            return next(
                errorHandler(404, 'Email template not found. Please seed the templates first.'),
            );
        }

        let htmlContent = template.html_content;
        let subject = template.subject;

        htmlContent = htmlContent.replace(/\{\{username\}\}/g, user.username);
        htmlContent = htmlContent.replace(/\{\{password\}\}/g, password);
        subject = subject.replace(/\{\{username\}\}/g, user.username);

        const { sendEmail } = await import('../utils/sendEmail.js');
        await sendEmail({
            to: user.email_address,
            subject,
            html: htmlContent,
        });

        res.status(200).json({
            success: true,
            message: `Password reset email sent to ${user.email_address}`,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy danh sách tất cả announcements.
 * @route   GET /api/admin/announcements
 * @access  Private (Admin)
 */
const getAnnouncements = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: announcements,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Tạo announcement mới.
 * @route   POST /api/admin/announcements
 * @access  Private (Admin)
 */
const createAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content, image } = req.body;

        if (!title || !content) {
            return next(errorHandler(400, 'Title and content are required.'));
        }

        const announcement = await Announcement.create({ title, content, image });

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully.',
            data: announcement,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Xóa announcement.
 * @route   DELETE /api/admin/announcements/:id
 * @access  Private (Admin)
 */
const deleteAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const announcement = await Announcement.findByIdAndDelete(id);
        if (!announcement) {
            return next(errorHandler(404, 'Announcement not found.'));
        }

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully.',
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Broadcast announcement as notification to all users.
 * @route   POST /api/admin/announcements/:id/broadcast
 * @access  Private (Admin)
 */
const broadcastAnnouncementById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return next(errorHandler(404, 'Announcement not found.'));
        }

        const users = await User.find().select('_id');

        const notifications = users.map((user) => ({
            receiver: user._id,
            title: announcement.title,
            content: announcement.content,
            image: announcement.image || null,
            type: 'ANNOUNCEMENT',
            isRead: false,
        }));

        await NotificationModel.insertMany(notifications);

        io.emit('notification:announcement', {
            title: announcement.title,
            content: announcement.content,
            image: announcement.image,
            type: 'ANNOUNCEMENT',
            createdAt: new Date(),
        });

        res.status(200).json({
            success: true,
            message: `Announcement broadcasted to ${users.length} users.`,
            data: { recipientCount: users.length },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Gửi email announcement đến tất cả client và partner users.
 * @route   POST /api/admin/email-templates/send-announcement
 * @access  Private (Admin)
 */
const sendAnnouncementEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const template = await EmailTemplate.findOne({ name: 'announcement' });
        if (!template) {
            return next(errorHandler(404, 'Announcement email template not found.'));
        }

        const users = await User.find({ role: { $in: [ROLE.CLIENT, ROLE.PARTNER] } }).select(
            'email_address',
        );
        let sentCount = 0;

        for (const user of users) {
            try {
                await sendEmail({
                    to: user.email_address,
                    subject: template.subject,
                    html: template.html_content,
                });
                sentCount++;
            } catch (emailError) {
                console.error(`Failed to send email to ${user.email_address}:`, emailError);
            }
        }

        res.status(200).json({
            success: true,
            message: `Announcement email sent to ${sentCount} users.`,
            data: { sentCount },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy cấu hình hệ thống hiện tại (bao gồm tỷ lệ hoa hồng).
 * @route   GET /api/admin/settings
 * @access  Private (Admin)
 */
const getSystemSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let settings = await SystemSettings.findOne();

        if (!settings) {
            settings = await SystemSettings.create({
                partnerCommissionRate: 0.8,
                cancellationPenaltyRate: 0.05,
            });
        }

        res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Cập nhật cấu hình hệ thống (tỷ lệ hoa hồng).
 * @route   PUT /api/admin/settings
 * @access  Private (Admin)
 */
const updateSystemSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { partnerCommissionRate, cancellationPenaltyRate } = req.body;

        if (partnerCommissionRate !== undefined) {
            if (partnerCommissionRate < 0.5 || partnerCommissionRate > 0.95) {
                return next(
                    errorHandler(400, 'Partner commission rate must be between 50% and 95%.'),
                );
            }
        }

        if (cancellationPenaltyRate !== undefined) {
            if (cancellationPenaltyRate < 0.01 || cancellationPenaltyRate > 0.2) {
                return next(
                    errorHandler(400, 'Cancellation penalty rate must be between 1% and 20%.'),
                );
            }
        }

        let settings = await SystemSettings.findOne();

        if (!settings) {
            settings = new SystemSettings({
                partnerCommissionRate: partnerCommissionRate ?? 0.8,
                cancellationPenaltyRate: cancellationPenaltyRate ?? 0.05,
                updatedBy: req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : undefined,
            });
        } else {
            if (partnerCommissionRate !== undefined) {
                settings.partnerCommissionRate = partnerCommissionRate;
            }
            if (cancellationPenaltyRate !== undefined) {
                settings.cancellationPenaltyRate = cancellationPenaltyRate;
            }
            settings.updatedBy = req.user?.id
                ? new mongoose.Types.ObjectId(req.user.id)
                : undefined;
        }

        await settings.save();

        res.status(200).json({
            success: true,
            message: 'System settings updated successfully.',
            data: settings,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy danh sách yêu cầu đăng ký Partner.
 * @route   GET /api/admin/partner-requests
 * @access  Private (Admin)
 */
const getPartnerRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query['per-page'] as string) || 15;
        const status = req.query.status as string;
        const search = req.query.search as string;

        const filters: Record<string, any> = {};
        if (status && Object.values(PARTNER_REQUEST_STATUS).includes(status as any)) {
            filters.status = status;
        }

        let userIds: string[] = [];
        if (search) {
            const users = await User.find({
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { email_address: { $regex: search, $options: 'i' } },
                    { full_name: { $regex: search, $options: 'i' } },
                ],
            }).select('_id');
            userIds = users.map((u) => u._id.toString());
            filters.user = { $in: userIds };
        }

        const [total, requests] = await Promise.all([
            PartnerRequest.countDocuments(filters),
            PartnerRequest.find(filters)
                .populate('user', 'username email_address profile_picture user_id')
                .populate('reviewed_by', 'username')
                .sort({ createdAt: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage),
        ]);

        const pendingRequests = requests.filter((r) => r.status === PARTNER_REQUEST_STATUS.PENDING);

        const fullNames = pendingRequests.map((r) => r.full_name).filter(Boolean);
        const cccdNumbers = pendingRequests.map((r) => r.cccd_number).filter(Boolean);
        const phoneNumbers = pendingRequests.map((r) => r.phone_number).filter(Boolean);

        let existingPartners: {
            _id: string;
            username: string;
            email_address: string;
            profile_picture: string;
            full_name?: string;
            cccd_number?: string;
            phone_number?: string;
            is_banned: boolean;
        }[] = [];

        if (fullNames.length > 0 || cccdNumbers.length > 0 || phoneNumbers.length > 0) {
            existingPartners = await User.find({
                role: ROLE.PARTNER,
                $or: [
                    { full_name: { $in: fullNames } },
                    { cccd_number: { $in: cccdNumbers } },
                    { phone_number: { $in: phoneNumbers } },
                ],
            }).select(
                '_id username email_address profile_picture full_name cccd_number phone_number is_banned',
            );
        }

        type MatchingPartner = {
            _id: string;
            username: string;
            email_address: string;
            profile_picture: string;
            is_banned: boolean;
        };

        const fullNameMap = new Map<string, MatchingPartner>();
        const cccdMap = new Map<string, MatchingPartner>();
        const phoneMap = new Map<string, MatchingPartner>();

        existingPartners.forEach((partner) => {
            const partnerInfo: MatchingPartner = {
                _id: partner._id.toString(),
                username: partner.username,
                email_address: partner.email_address,
                profile_picture: partner.profile_picture,
                is_banned: partner.is_banned,
            };

            if (partner.full_name) {
                fullNameMap.set(partner.full_name, partnerInfo);
            }
            if (partner.cccd_number) {
                cccdMap.set(partner.cccd_number, partnerInfo);
            }
            if (partner.phone_number) {
                phoneMap.set(partner.phone_number, partnerInfo);
            }
        });

        const requestsWithDuplicates = requests.map((request) => {
            const requestObj = request.toObject();
            if (request.status === PARTNER_REQUEST_STATUS.PENDING) {
                const duplicates: {
                    field: 'full_name' | 'cccd_number' | 'phone_number';
                    matchingPartner: MatchingPartner;
                }[] = [];

                const matchingFullName = fullNameMap.get(request.full_name);
                if (matchingFullName) {
                    duplicates.push({ field: 'full_name', matchingPartner: matchingFullName });
                }

                const matchingCCCD = cccdMap.get(request.cccd_number);
                if (matchingCCCD) {
                    duplicates.push({ field: 'cccd_number', matchingPartner: matchingCCCD });
                }

                const matchingPhone = phoneMap.get(request.phone_number);
                if (matchingPhone) {
                    duplicates.push({ field: 'phone_number', matchingPartner: matchingPhone });
                }

                return { ...requestObj, duplicates };
            }
            return requestObj;
        });

        res.status(200).json({
            success: true,
            data: requestsWithDuplicates,
            pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin duyệt yêu cầu đăng ký Partner.
 * @route   POST /api/admin/partner-requests/:id/approve
 * @access  Private (Admin)
 */
const approvePartnerRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const partnerRequest = await PartnerRequest.findById(id);
        if (!partnerRequest) {
            return next(errorHandler(404, 'Partner request not found.'));
        }

        if (partnerRequest.status !== PARTNER_REQUEST_STATUS.PENDING) {
            return next(errorHandler(400, 'This request has already been processed.'));
        }

        partnerRequest.status = PARTNER_REQUEST_STATUS.APPROVED;
        partnerRequest.reviewed_by = new mongoose.Types.ObjectId(req.user.id);
        partnerRequest.reviewed_at = new Date();
        await partnerRequest.save();

        const existingUser = await User.findById(partnerRequest.user).select('language');
        const userLanguage = existingUser?.language || 'vietnamese';

        const updatedUser = await User.findByIdAndUpdate(
            partnerRequest.user,
            {
                $addToSet: { role: ROLE.PARTNER },
                $set: {
                    partner_request_status: 'approved',
                    is_verified: true,

                    full_name: partnerRequest.full_name,
                    cccd_number: partnerRequest.cccd_number,
                    cccd_issue_date: partnerRequest.cccd_issue_date,
                    date_of_birth: partnerRequest.date_of_birth,
                    gender: partnerRequest.gender,
                    address: partnerRequest.address,
                    phone_number: partnerRequest.phone_number,
                },
            },
            { new: true },
        ).select('-password');

        const notificationMessages = {
            vietnamese: {
                title: 'Chúc mừng! Bạn đã trở thành Partner! 🎉',
                content:
                    'Yêu cầu đăng ký Partner của bạn đã được duyệt. Hãy bắt đầu nhận đơn hàng ngay!',
            },
            english: {
                title: 'Congratulations! You are now a Partner! 🎉',
                content:
                    'Your Partner registration request has been approved. Start accepting orders now!',
            },
        };

        const messages =
            notificationMessages[userLanguage as keyof typeof notificationMessages] ||
            notificationMessages.vietnamese;

        const notification = await NotificationModel.create({
            receiver: partnerRequest.user,
            title: messages.title,
            content: messages.content,
            type: NOTIFY_TYPE.PARTNER_APPROVED,
            isRead: false,
            link: '/settings', 
        });

        const userSocketId = getReceiverSocketID(partnerRequest.user.toString());
        if (userSocketId) {
            io.to(userSocketId).emit('partnerApproved', {
                notification,
                user: updatedUser,
                showCelebration: true, 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Partner request approved successfully.',
            data: partnerRequest,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin từ chối yêu cầu đăng ký Partner.
 * @route   POST /api/admin/partner-requests/:id/reject
 * @access  Private (Admin)
 */
const rejectPartnerRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const partnerRequest = await PartnerRequest.findById(id);
        if (!partnerRequest) {
            return next(errorHandler(404, 'Partner request not found.'));
        }

        if (partnerRequest.status !== PARTNER_REQUEST_STATUS.PENDING) {
            return next(errorHandler(400, 'This request has already been processed.'));
        }

        const existingUser = await User.findById(partnerRequest.user).select('language');
        const userLanguage = existingUser?.language || 'vietnamese';

        const reasonMessages: Record<string, { vi: string; en: string }> = {
            duplicate_name: {
                vi: 'Tên đầy đủ trùng với Partner khác',
                en: 'Full name matches another Partner',
            },
            duplicate_cccd: {
                vi: 'Số CCCD trùng với Partner khác',
                en: 'CCCD number matches another Partner',
            },
            cccd_expired: {
                vi: 'Ngày cấp CCCD đã hết hạn',
                en: 'CCCD issue date has expired',
            },
            invalid_info: {
                vi: 'Thông tin không hợp lệ',
                en: 'Invalid information',
            },
            other: {
                vi: 'Không đạt yêu cầu',
                en: 'Does not meet requirements',
            },
        };

        const reasonText = reasonMessages[reason]
            ? userLanguage === 'english'
                ? reasonMessages[reason].en
                : reasonMessages[reason].vi
            : userLanguage === 'english'
              ? 'Does not meet requirements'
              : 'Không đạt yêu cầu';

        partnerRequest.status = PARTNER_REQUEST_STATUS.REJECTED;
        partnerRequest.reviewed_by = new mongoose.Types.ObjectId(req.user.id);
        partnerRequest.reviewed_at = new Date();
        partnerRequest.reject_reason = reasonText;
        await partnerRequest.save();

        await User.findByIdAndUpdate(partnerRequest.user, {
            $set: { partner_request_status: 'none' },
        });

        const notificationMessages = {
            vietnamese: {
                title: 'Yêu cầu đăng ký Partner bị từ chối',
                content: `Yêu cầu của bạn đã bị từ chối. Lý do: ${reasonText}. Bạn có thể gửi lại yêu cầu mới.`,
            },
            english: {
                title: 'Partner Registration Request Rejected',
                content: `Your request has been rejected. Reason: ${reasonText}. You can submit a new request.`,
            },
        };

        const messages =
            notificationMessages[userLanguage as keyof typeof notificationMessages] ||
            notificationMessages.vietnamese;

        const notification = await NotificationModel.create({
            receiver: partnerRequest.user,
            title: messages.title,
            content: messages.content,
            type: NOTIFY_TYPE.PARTNER_REJECTED,
            isRead: false,
            link: '/settings', 
        });

        const userSocketId = getReceiverSocketID(partnerRequest.user.toString());
        if (userSocketId) {
            io.to(userSocketId).emit('partnerRejected', {
                notification,
                reason: partnerRequest.reject_reason,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Partner request rejected.',
            data: partnerRequest,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy danh sách tất cả mã khuyến mãi.
 * @route   GET /api/admin/promo-codes
 * @access  Private (Admin)
 */
const getPromoCodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filters, sort, page, perPage } = buildQueryOrderOptions(req.query, [
            'code',
            'description',
        ]);

        const [total, promoCodes] = await Promise.all([
            PromoCode.countDocuments(filters),
            PromoCode.find(filters)
                .sort((sort as string) || '-createdAt')
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate('createdBy', 'username')
                .lean(),
        ]);

        res.status(200).json({
            success: true,
            data: promoCodes,
            pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy chi tiết một mã khuyến mãi.
 * @route   GET /api/admin/promo-codes/:id
 * @access  Private (Admin)
 */
const getPromoCodeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const promoCode = await PromoCode.findById(id).populate('createdBy', 'username');

        if (!promoCode) {
            return next(errorHandler(404, 'Promo code not found.'));
        }

        res.status(200).json({
            success: true,
            data: promoCode,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Tạo mã khuyến mãi mới.
 * @route   POST /api/admin/promo-codes
 * @access  Private (Admin)
 */
const createPromoCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const {
            code,
            description,
            discountPercent,
            maxDiscount,
            minOrderAmount,
            usageLimit,
            applicableOrderTypes,
            validFrom,
            validUntil,
            isActive,
        } = req.body;

        if (!code || !discountPercent || !validFrom || !validUntil) {
            return next(
                errorHandler(400, 'Code, discountPercent, validFrom, and validUntil are required.'),
            );
        }

        if (discountPercent > 50) {
            return next(errorHandler(400, 'Discount percent cannot exceed 50%.'));
        }

        const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
        if (existingCode) {
            return next(errorHandler(409, 'Promo code already exists.'));
        }

        const promoCode = await PromoCode.create({
            code: code.toUpperCase(),
            description,
            discountPercent,
            maxDiscount: maxDiscount || 0,
            minOrderAmount: minOrderAmount || 0,
            usageLimit: usageLimit || 0,
            applicableOrderTypes: applicableOrderTypes || ['premier', 'wingman', 'level_farming'],
            validFrom: new Date(validFrom),
            validUntil: new Date(validUntil),
            isActive: isActive !== undefined ? isActive : true,
            createdBy: req.user?.id,
        });

        res.status(201).json({
            success: true,
            message: 'Promo code created successfully.',
            data: promoCode,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Cập nhật mã khuyến mãi.
 * @route   PUT /api/admin/promo-codes/:id
 * @access  Private (Admin)
 */
const updatePromoCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        delete updateData.usedCount;
        delete updateData.createdBy;

        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase();
            const existingCode = await PromoCode.findOne({
                code: updateData.code,
                _id: { $ne: id },
            });
            if (existingCode) {
                return next(errorHandler(409, 'Promo code already exists.'));
            }
        }

        if (updateData.discountPercent && updateData.discountPercent > 50) {
            return next(errorHandler(400, 'Discount percent cannot exceed 50%.'));
        }

        const promoCode = await PromoCode.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!promoCode) {
            return next(errorHandler(404, 'Promo code not found.'));
        }

        res.status(200).json({
            success: true,
            message: 'Promo code updated successfully.',
            data: promoCode,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Xóa mã khuyến mãi.
 * @route   DELETE /api/admin/promo-codes/:id
 * @access  Private (Admin)
 */
const deletePromoCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const promoCode = await PromoCode.findByIdAndDelete(id);
        if (!promoCode) {
            return next(errorHandler(404, 'Promo code not found.'));
        }

        res.status(200).json({
            success: true,
            message: 'Promo code deleted successfully.',
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
    updateUserByAdmin,
    broadcastAnnouncement,
    getEmailTemplates,
    getEmailTemplateById,
    updateEmailTemplate,
    sendPasswordResetEmail,
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    broadcastAnnouncementById,
    sendAnnouncementEmail,
    getSystemSettings,
    updateSystemSettings,
    getPartnerRequests,
    approvePartnerRequest,
    rejectPartnerRequest,
    getPromoCodes,
    getPromoCodeById,
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
};