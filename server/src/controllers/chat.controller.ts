import { Request, Response, NextFunction } from 'express';
import { NOTIFY_TYPE } from '../constants';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';
import User from '../models/user.model';
import { getReceiverSocketID, io, getAdminSocketIds } from '../socket/socket';
import { errorHandler } from '../utils/error';
import { AuthRequest } from '../interfaces';
import { notificationService } from '../services/notification.service';
import Notification from '../models/notification.model';

/**
 * @desc    Gửi một tin nhắn vào một cuộc trò chuyện.
 *          Hệ thống sẽ tạo tin nhắn mới, cập nhật cuộc trò chuyện, và gửi thông báo real-time.
 * @route   POST /api/chat/:conversationId/messages
 * @access  Private
 */
const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { message, boost_id, report_id, images } = req.body;
        const { conversationId } = req.params;
        const { id: sender_id } = req.user;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return next(errorHandler(404, 'Conversation not found'));

        const receiver_id = conversation.participants.find(
            (participantId) => participantId.toString() !== sender_id,
        );
        if (!receiver_id) return next(errorHandler(400, 'Receiver not found'));

        const senderUser = await User.findById(sender_id).select('role username');

        await Notification.deleteMany({
            $or: [
                { boost_id: boost_id, type: NOTIFY_TYPE.MESSAGE },
                { report_id: report_id, type: NOTIFY_TYPE.REPORT_MESSAGE },
                { report_id: report_id, type: NOTIFY_TYPE.NEW_REPORT_MESSAGE },
            ],
        });

        if (report_id) {

            await notificationService.createAndNotify({
                sender: sender_id,
                receiver: receiver_id.toString(),
                report_id,
                title: 'New Reply in Report',
                content:
                    message ||
                    (images && images.length > 0 ? `Sent ${images.length} image(s)` : ''),
                type: NOTIFY_TYPE.REPORT_MESSAGE,
            });

            if (senderUser && !senderUser.role.includes('admin')) {
                const adminUsers = await User.find({ role: 'admin' }).select('_id');
                const adminNotifications = adminUsers.map((admin: any) =>
                    new Notification({
                        receiver: admin._id,
                        title: 'New Message in Report',
                        content: `${senderUser.username || 'A user'} sent a message in a report conversation.`,
                        report_id,
                        type: NOTIFY_TYPE.NEW_REPORT_MESSAGE,
                    }).save(),
                );
                await Promise.all(adminNotifications);

                const adminSocketIds = getAdminSocketIds();
                if (adminSocketIds.length > 0) {
                    adminSocketIds.forEach((socketId: string) => {
                        io.to(socketId).emit('new_report_message', { report_id, sender_id });
                    });
                }
            }
        } else {

            await notificationService.createAndNotify({
                sender: sender_id,
                receiver: receiver_id.toString(),
                boost_id,
                content:
                    message ||
                    (images && images.length > 0 ? `Sent ${images.length} image(s)` : ''),
                type: NOTIFY_TYPE.MESSAGE,
            });
        }

        const newMessage = new Message({
            sender: sender_id,
            message: message || '',
            images: images || [],
            conversation_id: conversationId,
        });
        conversation.messages.push(newMessage._id);
        await Promise.all([newMessage.save(), conversation.save()]);

        const populatedMessage = await newMessage.populate('sender', 'username profile_picture');
        const receiverSocketId = getReceiverSocketID(receiver_id.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', populatedMessage);
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully.',
            data: populatedMessage,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy tất cả tin nhắn của một cuộc trò chuyện.
 *          Tin nhắn trả về đã được populate thông tin người gửi.
 * @route   GET /api/chat/:conversationId/messages
 * @access  Private
 */
const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId).populate({
            path: 'messages',
            populate: {
                path: 'sender',
                select: 'username profile_picture',
            },
        });

        if (!conversation) return next(errorHandler(404, 'Conversation not found'));

        res.status(200).json({ success: true, data: conversation.messages });
    } catch (e) {
        next(e);
    }
};

export { sendMessage, getMessages };