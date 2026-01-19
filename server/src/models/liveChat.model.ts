import mongoose from 'mongoose';
import { LIVE_CHAT_STATUS } from '../constants';

const liveChatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        guestId: {
            type: String,
            default: null,
            index: true,
        },
        guestEmail: {
            type: String,
            default: null,
            trim: true,
            lowercase: true,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: Object.values(LIVE_CHAT_STATUS),
            default: LIVE_CHAT_STATUS.WAITING,
        },
    },
    { timestamps: true },
);

liveChatSchema.index({ user: 1 });
liveChatSchema.index({ status: 1 });
liveChatSchema.index({ admin: 1 });

const LiveChat = mongoose.model('LiveChat', liveChatSchema);

export default LiveChat;