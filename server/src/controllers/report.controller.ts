import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { REPORT_STATUS, NOTIFY_TYPE } from '../constants';
import Conversation from '../models/conversation.model';
import Notification from '../models/notification.model';
import Report from '../models/report.model';
import User from '../models/user.model';
import { getReceiverSocketID, io, getAdminSocketIds } from '../socket/socket';
import { errorHandler } from '../utils/error';
import { AuthRequest } from '../interfaces';
import { reportPopulates } from '../helpers/report.helper';

/**
 * @desc    Người dùng gửi một báo cáo về một người dùng khác.
 *          Hệ thống sẽ tạo một báo cáo mới và thông báo real-time đến các Admin.
 * @route   POST /api/reports
 * @access  Private
 */
const sendReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const senderId = req.user!.id;
        const { reportedUserId, title, description, orderId } = req.body;

        if (!reportedUserId || !title) {
            return next(errorHandler(400, 'Reported user and title are required.'));
        }

        if (orderId) {
            const existingReport = await Report.findOne({
                sender: senderId,
                order: orderId,
            });
            if (existingReport) {
                return next(errorHandler(400, 'You have already reported this order.'));
            }
        }

        const newReport = new Report({
            sender: senderId,
            receiver: reportedUserId,
            order: orderId || null,
            title,
            description,
            status: REPORT_STATUS.PENDING,
        });

        await newReport.save();
        await newReport.populate('sender', 'username profile_picture');

        const adminSocketIds = getAdminSocketIds();
        if (adminSocketIds.length > 0) {
            adminSocketIds.forEach((socketId) => {
                io.to(socketId).emit('new_report_submitted', newReport);
            });
        }

        const adminUsers = await User.find({ role: 'admin' }).select('_id');
        const adminNotifications = adminUsers.map((admin) =>
            new Notification({
                receiver: admin._id,
                title: 'New Report Submitted',
                content: `${(newReport.sender as any).username} has submitted a new report and needs review.`,
                report_id: newReport._id.toString(),
                type: NOTIFY_TYPE.NEW_REPORT,
            }).save(),
        );
        await Promise.all(adminNotifications);

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
            data: newReport,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    (Admin) Lấy danh sách tất cả các báo cáo trong hệ thống.
 *          Dữ liệu trả về đã được populate đầy đủ thông tin.
 * @route   GET /api/reports
 * @access  Private (Admin)
 */
const getReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { status } = req.query;

        const filter: any = {};
        if (status) {
            filter.status = status;
        }

        const reports = await Report.find(filter)
            .populate(reportPopulates)
            .populate({
                path: 'conversations.client',
                populate: { path: 'messages', select: 'createdAt' },
            })
            .populate({
                path: 'conversations.partner',
                populate: { path: 'messages', select: 'createdAt' },
            })
            .sort({ createdAt: -1 });

        const reportsWithUnread = reports.map((report: any) => {
            const reportObj = report.toObject();
            let hasUnreadMessages = false;

            if (report.conversations.client || report.conversations.partner) {
                const clientMessages = report.conversations.client?.messages || [];
                const partnerMessages = report.conversations.partner?.messages || [];
                const allMessages = [...clientMessages, ...partnerMessages];

                if (allMessages.length > 0) {

                    if (!report.adminLastReadAt) {
                        hasUnreadMessages = true;
                    } else {

                        hasUnreadMessages = allMessages.some(
                            (msg: any) =>
                                new Date(msg.createdAt) > new Date(report.adminLastReadAt),
                        );
                    }
                }
            }

            return {
                ...reportObj,
                hasUnreadMessages,
            };
        });

        res.status(200).json({ success: true, data: reportsWithUnread });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng lấy danh sách các báo cáo liên quan đến mình.
 *          Bao gồm báo cáo đã gửi và báo cáo mình là người bị tố cáo.
 * @route   GET /api/report/me
 * @access  Private
 */
const getMyReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const reports = await Report.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .populate('sender', 'username profile_picture')
            .populate('receiver', 'username profile_picture')
            .populate('handler', 'username profile_picture')
            .populate({
                path: 'conversations.client',
                populate: { path: 'messages', populate: { path: 'sender', select: 'username' } },
            })
            .populate({
                path: 'conversations.partner',
                populate: { path: 'messages', populate: { path: 'sender', select: 'username' } },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: reports });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    (Admin) Tiếp nhận một báo cáo để xử lý.
 *          Hành động này tạo ra hai cuộc trò chuyện riêng biệt cho việc điều tra.
 * @route   PATCH /api/report/:reportId/accept
 * @access  Private (Admin)
 */
const acceptReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { reportId } = req.params;
        const adminId = req.user!.id;

        const reportExists = await Report.findById(reportId);
        if (!reportExists) return next(errorHandler(404, 'Report not found.'));
        if (reportExists.status !== REPORT_STATUS.PENDING)
            return next(errorHandler(400, 'Report has already been handled.'));

        const clientConversation = new Conversation({
            participants: [reportExists.sender, new Types.ObjectId(adminId)],
        });

        const partnerConversation = new Conversation({
            participants: [reportExists.receiver, new Types.ObjectId(adminId)],
        });

        await Promise.all([clientConversation.save(), partnerConversation.save()]);

        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            {
                $set: {
                    status: REPORT_STATUS.IN_PROGRESS,
                    handler: new Types.ObjectId(adminId),
                    'conversations.client': clientConversation._id,
                    'conversations.partner': partnerConversation._id,
                },
            },
            { new: true },
        )
            .populate('sender', 'username profile_picture')
            .populate('receiver', 'username profile_picture')
            .populate({ path: 'conversations.client', populate: { path: 'messages' } })
            .populate({ path: 'conversations.partner', populate: { path: 'messages' } });

        if (!updatedReport) {
            return next(
                errorHandler(500, 'Failed to update the report after creating conversations.'),
            );
        }

        const clientNotification = new Notification({
            sender: adminId,
            receiver: updatedReport.sender._id,
            title: 'Report Accepted',
            content: `Your report "${reportExists.title}" has been accepted. An admin is now reviewing it. You can now chat with admin.`,
            report_id: reportId,
            type: NOTIFY_TYPE.REPORT_ACCEPTED,
        });
        await clientNotification.save();

        const partnerNotification = new Notification({
            sender: adminId,
            receiver: updatedReport.receiver._id,
            title: 'Investigation Started',
            content: `An investigation regarding a report about you has started. You can now chat with admin.`,
            report_id: reportId,
            type: NOTIFY_TYPE.REPORT_ACCEPTED,
        });
        await partnerNotification.save();

        const clientSocketId = getReceiverSocketID(updatedReport.sender._id.toString());
        if (clientSocketId) {
            io.to(clientSocketId).emit('support_chat_started', updatedReport);
            io.to(clientSocketId).emit('notification:new', clientNotification);
        }

        const partnerSocketId = getReceiverSocketID(updatedReport.receiver._id.toString());
        if (partnerSocketId) {
            io.to(partnerSocketId).emit('investigation_chat_started', updatedReport);
            io.to(partnerSocketId).emit('notification:new', partnerNotification);
        }

        res.status(200).json({
            success: true,
            message: 'Report accepted. Two conversations created.',
            data: updatedReport,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    (Admin) Đóng một báo cáo sau khi đã xử lý xong.
 *          Cập nhật trạng thái báo cáo thành "Đã giải quyết".
 * @route   PATCH /api/report/:reportId/resolve
 * @access  Private (Admin)
 */
const resolveReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { reportId } = req.params;
        const { resolution } = req.body;

        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            {
                status: REPORT_STATUS.RESOLVED,
                resolution: resolution || null,
            },
            { new: true },
        );

        if (!updatedReport) return next(errorHandler(404, 'Report not found.'));

        const clientSocketId = getReceiverSocketID(updatedReport.sender._id.toString());
        if (clientSocketId) {
            io.to(clientSocketId).emit('report_resolved', updatedReport);
        }

        const partnerSocketId = getReceiverSocketID(updatedReport.receiver._id.toString());
        if (partnerSocketId) {
            io.to(partnerSocketId).emit('report_resolved', updatedReport);
        }

        res.status(200).json({ success: true, message: 'Report resolved.', data: updatedReport });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    (Admin) Từ chối một báo cáo không hợp lệ.
 *          Cập nhật trạng thái báo cáo thành "Từ chối".
 * @route   PATCH /api/report/:reportId/reject
 * @access  Private (Admin)
 */
const rejectReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { reportId } = req.params;
        const { resolution } = req.body;
        const adminId = req.user?.id;

        const reportExists = await Report.findById(reportId);
        if (!reportExists) return next(errorHandler(404, 'Report not found.'));

        if (reportExists.status === REPORT_STATUS.RESOLVED) {
            return next(errorHandler(400, 'Cannot reject a resolved report.'));
        }

        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            {
                status: REPORT_STATUS.REJECT,
                resolution: resolution || null,
                handler: adminId,
            },
            { new: true },
        ).populate(reportPopulates);

        const rejectionReason = resolution || 'No reason provided';
        const notificationContent = `Your report "${reportExists.title}" has been rejected. Reason: ${rejectionReason}`;

        const notification = new Notification({
            sender: adminId,
            receiver: updatedReport!.sender._id,
            title: 'Report Rejected',
            content: notificationContent,
            report_id: reportId,
            type: NOTIFY_TYPE.REPORT_REJECTED,
        });
        await notification.save();

        const clientSocketId = getReceiverSocketID(updatedReport!.sender._id.toString());
        if (clientSocketId) {
            io.to(clientSocketId).emit('report_rejected', updatedReport);
            io.to(clientSocketId).emit('notification:new', notification);
        }

        const partnerSocketId = getReceiverSocketID(updatedReport!.receiver._id.toString());
        if (partnerSocketId) {
            io.to(partnerSocketId).emit('report_rejected', updatedReport);
        }

        res.status(200).json({ success: true, message: 'Report rejected.', data: updatedReport });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Kiểm tra xem người dùng đã report cho một order cụ thể chưa.
 * @route   GET /api/report/check-order/:orderId
 * @access  Private
 */
const checkOrderReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { orderId } = req.params;

        if (!orderId) {
            return next(errorHandler(400, 'Order ID is required.'));
        }

        const existingReport = await Report.findOne({
            sender: userId,
            order: orderId,
        });

        res.status(200).json({
            success: true,
            hasReported: !!existingReport,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin đánh dấu report đã đọc.
 * @route   PATCH /api/report/:reportId/mark-read
 * @access  Private (Admin)
 */
const markReportAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { reportId } = req.params;

        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { adminLastReadAt: new Date() },
            { new: true },
        );

        if (!updatedReport) {
            return next(errorHandler(404, 'Report not found.'));
        }

        res.status(200).json({
            success: true,
            message: 'Report marked as read.',
            data: updatedReport,
        });
    } catch (e) {
        next(e);
    }
};

export {
    sendReport,
    getReports,
    getMyReports,
    acceptReport,
    resolveReport,
    rejectReport,
    checkOrderReport,
    markReportAsRead,
};