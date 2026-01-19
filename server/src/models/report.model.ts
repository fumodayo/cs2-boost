import mongoose from 'mongoose';
import { REPORT_STATUS, VALID_REASONS } from '../constants';

const reportSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
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

                type: mongoose.Schema.Types.ObjectId,
                ref: 'Conversation',
                default: null,
            },
            partner: {

                type: mongoose.Schema.Types.ObjectId,
                ref: 'Conversation',
                default: null,
            },
        },
        resolution: {

            type: String,
            default: null,
        },
        adminLastReadAt: {

            type: Date,
            default: null,
        },
    },
    { timestamps: true },
);

const Report = mongoose.model('Report', reportSchema);

export default Report;