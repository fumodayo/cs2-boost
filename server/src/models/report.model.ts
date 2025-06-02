import mongoose from 'mongoose';
import { REPORT_STATUS, VALID_REASONS } from '../constants';

const reportSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            enum: VALID_REASONS,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: REPORT_STATUS,
            default: REPORT_STATUS.PENDING,
        },
    },
    { timestamps: true },
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
