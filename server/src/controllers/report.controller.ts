import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { REPORT_STATUS } from '../constants';
import Conversation from '../models/conversation.model';
import Report from '../models/report.model';
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
        const { reportedUserId, title, description } = req.body;

        if (!reportedUserId || !title) {
            return next(errorHandler(400, 'Reported user and title are required.'));
        }

        const newReport = new Report({
            sender: senderId,
            receiver: reportedUserId,
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
        const reports = await Report.find().populate(reportPopulates).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: reports });
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

        const clientSocketId = getReceiverSocketID(updatedReport.sender._id.toString());
        if (clientSocketId) {
            io.to(clientSocketId).emit('support_chat_started', updatedReport);
        }

        const partnerSocketId = getReceiverSocketID(updatedReport.receiver._id.toString());
        if (partnerSocketId) {
            io.to(partnerSocketId).emit('investigation_chat_started', updatedReport);
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
        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { status: REPORT_STATUS.RESOLVED },
            { new: true },
        );

        if (!updatedReport) return next(errorHandler(404, 'Report not found.'));

        const userSocketId = getReceiverSocketID(updatedReport.sender._id.toString());
        if (userSocketId) {
            io.to(userSocketId).emit('report_resolved', updatedReport);
        }

        res.status(200).json({ success: true, message: 'Report resolved.', data: updatedReport });
    } catch (e) {
        next(e);
    }
};

export { sendReport, getReports, getMyReports, acceptReport, resolveReport };
