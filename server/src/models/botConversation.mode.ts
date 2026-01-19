import mongoose from 'mongoose';

const botConversationSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'BotMessage',
                default: [],
            },
        ],
    },
    { timestamps: true },
);

const BotConversation = mongoose.model('BotConversation', botConversationSchema);
export default BotConversation;