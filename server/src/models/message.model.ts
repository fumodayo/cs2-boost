import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        conversation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        message: {
            type: String,
            required: function (this: { images?: string[] }) {

                return !this.images || this.images.length === 0;
            },
        },
        images: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;