import { Request, Response, NextFunction } from 'express';
import { CONVERSATION_STATUS, LIVE_CHAT_STATUS, NOTIFY_TYPE } from '../constants';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';
import LiveChat from '../models/liveChat.model';
import { getAdminSocketIds, getReceiverSocketID, io } from '../socket/socket';
import { errorHandler } from '../utils/error';
import { AuthRequest } from '../interfaces';
import mongoose from 'mongoose';

/**
 * @desc    User tạo một live chat mới để được hỗ trợ
 * @route   POST /api/live-chat
 * @access  Private
 */
const createLiveChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { subject, message } = req.body;
        const userId = req.user.id;

        if (!subject || !message) {
            return next(errorHandler(400, 'Subject and message are required.'));
        }

        const existingChat = await LiveChat.findOne({
            user: userId,
            status: { $in: [LIVE_CHAT_STATUS.WAITING, LIVE_CHAT_STATUS.IN_PROGRESS] },
        });

        if (existingChat) {
            return next(errorHandler(400, 'You already have an active support chat.'));
        }

        const conversation = new Conversation({
            participants: [userId],
            status: CONVERSATION_STATUS.OPEN,
        });
        await conversation.save();

        const firstMessage = new Message({
            sender: userId,
            message,
            conversation_id: conversation._id,
        });
        await firstMessage.save();
        conversation.messages.push(firstMessage._id);
        await conversation.save();

        const liveChat = new LiveChat({
            user: userId,
            conversation: conversation._id,
            subject,
            status: LIVE_CHAT_STATUS.WAITING,
        });
        await liveChat.save();

        const populatedChat = await LiveChat.findById(liveChat._id)
            .populate('user', 'username profile_picture')
            .populate({
                path: 'conversation',
                populate: {
                    path: 'messages',
                    populate: { path: 'sender', select: 'username profile_picture' },
                },
            });

        const adminSocketIds = getAdminSocketIds();
        adminSocketIds.forEach((socketId) => {
            io.to(socketId).emit('newLiveChat', populatedChat);
        });

        res.status(201).json({
            success: true,
            message: 'Support chat created successfully.',
            data: populatedChat,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Guest tạo một live chat mới với email
 * @route   POST /api/live-chat/guest
 * @access  Public
 */
const createGuestLiveChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { guestId, email, subject, message } = req.body;

        if (!guestId || !email || !subject || !message) {
            return next(errorHandler(400, 'Guest ID, email, subject and message are required.'));
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(errorHandler(400, 'Invalid email format.'));
        }

        const existingChat = await LiveChat.findOne({
            guestId,
            status: { $in: [LIVE_CHAT_STATUS.WAITING, LIVE_CHAT_STATUS.IN_PROGRESS] },
        });

        if (existingChat) {

            const populatedChat = await LiveChat.findById(existingChat._id).populate({
                path: 'conversation',
                populate: {
                    path: 'messages',
                    populate: { path: 'sender', select: 'username profile_picture' },
                },
            });
            return res.status(200).json({
                success: true,
                message: 'Returning existing chat.',
                data: populatedChat,
            });
        }

        const conversation = new Conversation({
            participants: [],
            status: CONVERSATION_STATUS.OPEN,
        });
        await conversation.save();

        const firstMessage = new Message({
            message,
            conversation_id: conversation._id,
            guestEmail: email, 
        });
        await firstMessage.save();
        conversation.messages.push(firstMessage._id);
        await conversation.save();

        const liveChat = new LiveChat({
            guestId,
            guestEmail: email,
            conversation: conversation._id,
            subject,
            status: LIVE_CHAT_STATUS.WAITING,
        });
        await liveChat.save();

        const populatedChat = await LiveChat.findById(liveChat._id).populate({
            path: 'conversation',
            populate: {
                path: 'messages',
                populate: { path: 'sender', select: 'username profile_picture' },
            },
        });

        const adminSocketIds = getAdminSocketIds();
        adminSocketIds.forEach((socketId) => {
            io.to(socketId).emit('newLiveChat', populatedChat);
        });

        res.status(201).json({
            success: true,
            message: 'Guest support chat created successfully.',
            data: populatedChat,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Guest lấy live chat hiện tại
 * @route   GET /api/live-chat/guest/:guestId
 * @access  Public
 */
const getGuestLiveChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { guestId } = req.params;

        if (!guestId) {
            return next(errorHandler(400, 'Guest ID is required.'));
        }

        const liveChat = await LiveChat.findOne({
            guestId,
            status: { $in: [LIVE_CHAT_STATUS.WAITING, LIVE_CHAT_STATUS.IN_PROGRESS] },
        })
            .populate('admin', 'username profile_picture')
            .populate({
                path: 'conversation',
                populate: {
                    path: 'messages',
                    populate: { path: 'sender', select: 'username profile_picture' },
                },
            });

        res.status(200).json({
            success: true,
            data: liveChat,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Guest gửi tin nhắn trong live chat
 * @route   POST /api/live-chat/guest/:guestId/messages
 * @access  Public
 */
const sendGuestLiveChatMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { guestId } = req.params;
        const { message } = req.body;

        if (!message) {
            return next(errorHandler(400, 'Message is required.'));
        }

        const liveChat = await LiveChat.findOne({
            guestId,
            status: { $in: [LIVE_CHAT_STATUS.WAITING, LIVE_CHAT_STATUS.IN_PROGRESS] },
        });

        if (!liveChat) {
            return next(errorHandler(404, 'Live chat not found.'));
        }

        if (liveChat.status === LIVE_CHAT_STATUS.CLOSED) {
            return next(errorHandler(400, 'This chat has been closed.'));
        }

        const conversation = await Conversation.findById(liveChat.conversation);
        if (!conversation) {
            return next(errorHandler(404, 'Conversation not found.'));
        }

        const newMessage = new Message({
            message,
            conversation_id: conversation._id,
            guestEmail: liveChat.guestEmail,
        });
        await newMessage.save();
        conversation.messages.push(newMessage._id);
        await conversation.save();

        if (liveChat.admin) {
            const adminSocketId = getReceiverSocketID(liveChat.admin.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit('liveChatMessage', {
                    liveChatId: liveChat._id,
                    message: newMessage,
                });
            }
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully.',
            data: newMessage,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Merge guest chats vào user account sau khi đăng nhập/đăng ký
 * @route   POST /api/live-chat/merge
 * @access  Private
 */
const mergeGuestChats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { guestId } = req.body;

        if (!guestId) {
            return res.status(200).json({
                success: true,
                message: 'No guest ID provided.',
                merged: 0,
            });
        }

        const guestChats = await LiveChat.find({ guestId });

        if (guestChats.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No guest chats found.',
                merged: 0,
            });
        }

        for (const chat of guestChats) {
            chat.user = new mongoose.Types.ObjectId(userId);

            const conversation = await Conversation.findById(chat.conversation);
            if (conversation) {
                if (
                    !conversation.participants.some(
                        (p: mongoose.Types.ObjectId) => p.toString() === userId,
                    )
                ) {
                    conversation.participants.push(new mongoose.Types.ObjectId(userId));
                    await conversation.save();
                }

                await Message.updateMany(
                    {
                        conversation_id: conversation._id,
                        sender: { $exists: false },
                    },
                    { sender: userId },
                );
            }

            await chat.save();
        }

        res.status(200).json({
            success: true,
            message: `Merged ${guestChats.length} guest chat(s) to your account.`,
            merged: guestChats.length,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    User lấy live chat hiện tại của mình
 * @route   GET /api/live-chat
 * @access  Private
 */
const getMyLiveChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;

        const liveChat = await LiveChat.findOne({
            user: userId,
            status: { $in: [LIVE_CHAT_STATUS.WAITING, LIVE_CHAT_STATUS.IN_PROGRESS] },
        })
            .populate('user', 'username profile_picture')
            .populate('admin', 'username profile_picture')
            .populate({
                path: 'conversation',
                populate: {
                    path: 'messages',
                    populate: { path: 'sender', select: 'username profile_picture' },
                },
            });

        res.status(200).json({
            success: true,
            data: liveChat,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin lấy tất cả live chats (pending và in-progress)
 * @route   GET /api/live-chat/admin
 * @access  Admin
 */
const getAllLiveChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const liveChats = await LiveChat.find({
            status: { $in: [LIVE_CHAT_STATUS.WAITING, LIVE_CHAT_STATUS.IN_PROGRESS] },
        })
            .populate('user', 'username profile_picture email')
            .populate('admin', 'username profile_picture')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: liveChats,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin nhận xử lý một live chat
 * @route   POST /api/live-chat/:id/assign
 * @access  Admin
 */
const assignLiveChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        const liveChat = await LiveChat.findById(id);
        if (!liveChat) {
            return next(errorHandler(404, 'Live chat not found.'));
        }

        if (liveChat.status !== LIVE_CHAT_STATUS.WAITING) {
            return next(errorHandler(400, 'This chat has already been assigned.'));
        }

        liveChat.admin = new mongoose.Types.ObjectId(adminId);
        liveChat.status = LIVE_CHAT_STATUS.IN_PROGRESS;
        await liveChat.save();

        const conversation = await Conversation.findById(liveChat.conversation);
        const adminExists = conversation?.participants.some(
            (p: mongoose.Types.ObjectId) => p.toString() === adminId,
        );
        if (conversation && !adminExists) {
            conversation.participants.push(new mongoose.Types.ObjectId(adminId));
            await conversation.save();
        }

        const populatedChat = await LiveChat.findById(id)
            .populate('user', 'username profile_picture')
            .populate('admin', 'username profile_picture')
            .populate({
                path: 'conversation',
                populate: {
                    path: 'messages',
                    populate: { path: 'sender', select: 'username profile_picture' },
                },
            });

        const userSocketId = getReceiverSocketID(liveChat.user.toString());
        if (userSocketId) {
            io.to(userSocketId).emit('liveChatAssigned', populatedChat);
        }

        const adminSocketIds = getAdminSocketIds();
        adminSocketIds.forEach((socketId) => {
            io.to(socketId).emit('liveChatUpdated', populatedChat);
        });

        res.status(200).json({
            success: true,
            message: 'Chat assigned successfully.',
            data: populatedChat,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Đóng live chat
 * @route   POST /api/live-chat/:id/close
 * @access  Private (Admin hoặc User sở hữu chat)
 */
const closeLiveChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const liveChat = await LiveChat.findById(id);
        if (!liveChat) {
            return next(errorHandler(404, 'Live chat not found.'));
        }

        const isOwner = liveChat.user.toString() === userId;
        const isAssignedAdmin = liveChat.admin?.toString() === userId;

        if (!isOwner && !isAssignedAdmin) {
            return next(errorHandler(403, 'You are not authorized to close this chat.'));
        }

        liveChat.status = LIVE_CHAT_STATUS.CLOSED;
        await liveChat.save();

        await Conversation.findByIdAndUpdate(liveChat.conversation, {
            status: CONVERSATION_STATUS.CLOSED,
        });

        const userSocketId = getReceiverSocketID(liveChat.user.toString());
        if (userSocketId) {
            io.to(userSocketId).emit('liveChatClosed', { id: liveChat._id });
        }

        if (liveChat.admin) {
            const adminSocketId = getReceiverSocketID(liveChat.admin.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit('liveChatClosed', { id: liveChat._id });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Chat closed successfully.',
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy tin nhắn của một live chat
 * @route   GET /api/live-chat/:id/messages
 * @access  Private
 */
const getLiveChatMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const liveChat = await LiveChat.findById(id);
        if (!liveChat) {
            return next(errorHandler(404, 'Live chat not found.'));
        }

        const isOwner = liveChat.user.toString() === userId;
        const isAssignedAdmin = liveChat.admin?.toString() === userId;

        if (!isOwner && !isAssignedAdmin) {
            return next(errorHandler(403, 'You are not authorized to view this chat.'));
        }

        const conversation = await Conversation.findById(liveChat.conversation).populate({
            path: 'messages',
            populate: { path: 'sender', select: 'username profile_picture' },
        });

        res.status(200).json({
            success: true,
            data: conversation?.messages || [],
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Gửi tin nhắn trong live chat
 * @route   POST /api/live-chat/:id/messages
 * @access  Private
 */
const sendLiveChatMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const senderId = req.user.id;

        if (!message) {
            return next(errorHandler(400, 'Message is required.'));
        }

        const liveChat = await LiveChat.findById(id);
        if (!liveChat) {
            return next(errorHandler(404, 'Live chat not found.'));
        }

        if (liveChat.status === LIVE_CHAT_STATUS.CLOSED) {
            return next(errorHandler(400, 'This chat has been closed.'));
        }

        const isOwner = liveChat.user.toString() === senderId;
        const isAssignedAdmin = liveChat.admin?.toString() === senderId;

        if (!isOwner && !isAssignedAdmin) {
            return next(errorHandler(403, 'You are not authorized to send messages in this chat.'));
        }

        const conversation = await Conversation.findById(liveChat.conversation);
        if (!conversation) {
            return next(errorHandler(404, 'Conversation not found.'));
        }

        const newMessage = new Message({
            sender: senderId,
            message,
            conversation_id: conversation._id,
        });
        await newMessage.save();
        conversation.messages.push(newMessage._id);
        await conversation.save();

        const populatedMessage = await newMessage.populate('sender', 'username profile_picture');

        const receiverId = isOwner ? liveChat.admin?.toString() : liveChat.user.toString();
        if (receiverId) {
            const receiverSocketId = getReceiverSocketID(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('liveChatMessage', {
                    liveChatId: liveChat._id,
                    message: populatedMessage,
                });
            }
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

export {
    createLiveChat,
    createGuestLiveChat,
    getMyLiveChat,
    getGuestLiveChat,
    getAllLiveChats,
    assignLiveChat,
    closeLiveChat,
    getLiveChatMessages,
    sendLiveChatMessage,
    sendGuestLiveChatMessage,
    mergeGuestChats,
};