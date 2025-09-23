import mongoose from 'mongoose';
import { REPORT_STATUS, VALID_REASONS } from '../constants';

const reportSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        handler: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        title: { type: String, enum: VALID_REASONS, required: true },
        description: { type: String, default: '' },
        status: {
            type: String,
            enum: Object.values(REPORT_STATUS),
            default: REPORT_STATUS.PENDING,
        },
        conversations: {
            client: {
                // Cuộc trò chuyện giữa Admin và người gửi (Client)
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Conversation',
                default: null,
            },
            partner: {
                // Cuộc trò chuyện giữa Admin và người bị báo cáo (Partner)
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Conversation',
                default: null,
            },
        },
    },
    { timestamps: true },
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
