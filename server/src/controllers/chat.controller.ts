import { Request, Response, NextFunction } from 'express';
import { NOTIFY_TYPE } from '../constants';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';
import { getReceiverSocketID, io } from '../socket/socket';
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
        const { message, boost_id } = req.body;
        const { conversationId } = req.params;
        const { id: sender_id } = req.user;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return next(errorHandler(404, 'Conversation not found'));

        const receiver_id = conversation.participants.find(
            (participantId) => participantId.toString() !== sender_id,
        );
        if (!receiver_id) return next(errorHandler(400, 'Receiver not found'));

        await Notification.deleteMany({
            boost_id: boost_id,
            type: NOTIFY_TYPE.MESSAGE,
        });

        await notificationService.createAndNotify({
            sender: sender_id,
            receiver: receiver_id.toString(),
            boost_id,
            content: message,
            type: NOTIFY_TYPE.MESSAGE,
        });

        const newMessage = new Message({
            sender: sender_id,
            message,
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

        const conversation = await Conversation.findById(conversationId).populate('messages');

        if (!conversation) return next(errorHandler(404, 'Conversation not found'));

        res.status(200).json({ success: true, data: conversation.messages });
    } catch (e) {
        next(e);
    }
};

export { sendMessage, getMessages };
