import mongoose from 'mongoose';
import { CONVERSATION_STATUS } from '../constants';

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message',
                default: [],
            },
        ],
        status: {
            type: String,
            enum: Object.values(CONVERSATION_STATUS),
            default: CONVERSATION_STATUS.OPEN,
        },
    },
    { timestamps: true },
);

conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;