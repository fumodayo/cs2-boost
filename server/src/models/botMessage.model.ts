import mongoose from 'mongoose';

const botMessageSchema = new mongoose.Schema(
    {
        conversation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BotConversation',
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'model'], // model là AI
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
        },
    },
    { timestamps: true },
);

const BotMessage = mongoose.model('BotMessage', botMessageSchema);
export default BotMessage;
