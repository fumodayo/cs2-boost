import { Request, Response, NextFunction } from 'express';
import { NOTIFY_TYPE } from '../constants';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';
import Notification from '../models/notification.model';
import { getReceiverSocketID, io } from '../socket/socket';
import { AuthRequest } from '../types';
import { errorHandler } from '../utils/error';

/**
 * @route POST /api/chat/:id/message
 * @access Private
 * @description This endpoint allows a user to send a message in a chat.
 * It creates a new message, updates the conversation, and sends a notification.
 */
const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { message, boost_id } = req.body;
    const { id: chat_id } = req.params;
    const { id: sender_id } = req.user;

    try {
        // Tìm cuộc trò chuyện
        const conversation = await Conversation.findById(chat_id);
        if (!conversation) return next(errorHandler(404, 'Conversation not found'));

        // Tìm người nhận: người còn lại trong participants
        const receiver_id = conversation.participants.find((user) => user.toString() !== sender_id);
        if (!receiver_id) return next(errorHandler(400, 'Receiver not found'));

        // Tạo tin nhắn mới
        const newMessage = new Message({ sender: sender_id, receiver: receiver_id, message });

        // Thêm ID tin nhắn vào cuộc trò chuyện
        conversation.messages.push(newMessage._id);

        // Xoá thông báo cũ nếu tồn tại
        await Notification.deleteOne({ boost_id, sender: sender_id });

        // Tạo thông báo mới
        const newNotify = new Notification({
            sender: sender_id,
            receiver: receiver_id,
            boost_id,
            content: message,
            type: NOTIFY_TYPE.MESSAGE,
        });

        // Lưu tất cả cùng lúc
        await Promise.all([newMessage.save(), conversation.save(), newNotify.save()]);

        // Gửi tin nhắn qua socket tới tất cả
        io.emit('newMessage', {
            sender_id: newMessage.sender,
            message: newMessage.message,
            updatedAt: newMessage.updatedAt,
        });

        // Gửi thông báo mới tới socket người nhận
        const receiver_socket_id = getReceiverSocketID(receiver_id.toString());
        if (receiver_socket_id) {
            io.to(receiver_socket_id).emit('newNotify');
        }

        res.status(201).json({ success: true, message: newMessage });
    } catch (e) {
        next(e);
    }
};

/**
 * @route GET /api/chat/:id/message
 * @access Private
 * @description This endpoint retrieves all messages in a chat.
 * It populates the messages in the conversation.
 */
const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    const { id: chat_id } = req.params;

    try {
        // Lấy conversation và các message
        const conversation = await Conversation.findById(chat_id).populate('messages');

        if (!conversation) return next(errorHandler(404, 'Conversation not found'));

        res.status(200).json(conversation.messages);
    } catch (e) {
        next(e);
    }
};

export { sendMessage, getMessages };
