import { Response, NextFunction, Request } from 'express';
import { errorHandler } from '../utils/error';
import { getReceiverSocketID, io } from '../socket/socket';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import BotConversation from '../models/botConversation.mode';
import BotMessage from '../models/botMessage.model';
import axios from 'axios';
import { PERSONALITY_INSTRUCTION } from '../constants';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-latest',
    systemInstruction: PERSONALITY_INSTRUCTION,
});

/**
 * @desc    Gửi tin nhắn đến AI, lưu vào DB và nhận phản hồi
 * @route   POST /api/v1/bot-chat/send
 * @access  Private
 */
const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message, imageUrl, userId } = req.body;
        console.log({ message, imageUrl, userId });

        if (!message && !imageUrl) {
            return next(errorHandler(400, 'Message or image URL is required.'));
        }

        let conversation = await BotConversation.findOne({ user_id: userId });
        if (!conversation) {
            conversation = await BotConversation.create({ user_id: userId });
        }

        const userMessage = new BotMessage({
            conversation_id: conversation._id,
            role: 'user',
            text: message || '',
            imageUrl: imageUrl,
        });
        await userMessage.save();
        conversation.messages.push(userMessage._id);
        await conversation.save();

        res.status(201).json({ success: true, message: 'Message received.', data: userMessage });

        (async () => {
            try {
                const contentParts: Part[] = [];

                if (imageUrl) {
                    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                    const imageBuffer = Buffer.from(response.data, 'binary');
                    const mimeType = response.headers['content-type'];

                    contentParts.push({
                        inlineData: {
                            data: imageBuffer.toString('base64'),
                            mimeType,
                        },
                    });
                }

                if (message) {
                    contentParts.push({ text: message });
                }

                const result = await geminiModel.generateContent({
                    contents: [{ role: 'user', parts: contentParts }],
                });
                const aiResponseText = result.response.text();

                const aiMessage = new BotMessage({
                    conversation_id: conversation._id,
                    role: 'model',
                    text: aiResponseText,
                });
                await aiMessage.save();
                conversation.messages.push(aiMessage._id);
                await conversation.save();

                const userSocketId = getReceiverSocketID(userId);
                if (userSocketId) {
                    io.to(userSocketId).emit('newAIMessage', aiMessage);
                }
            } catch (aiError) {
                console.error('AI Generation or Image Fetch Error:', aiError);
                const userSocketId = getReceiverSocketID(userId);
                if (userSocketId) {
                    io.to(userSocketId).emit('aiError', {
                        message: 'AI failed to process the request.',
                    });
                }
            }
        })();
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy toàn bộ lịch sử chat AI của user
 * @route   GET /api/v1/bot-chat/history
 * @access  Private
 */
const getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
        const conversation = await BotConversation.findOne({ user_id: userId }).populate(
            'messages',
        );

        if (!conversation) {
            return res.status(200).json({ success: true, data: [] });
        }

        res.status(200).json({ success: true, data: conversation.messages });
    } catch (e) {
        next(e);
    }
};

export { sendMessage, getHistory };
