import mongoose from 'mongoose';
import { RECEIPT_STATUS } from '../constants';

const receiptSchema = new mongoose.Schema(
    {
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        receipt_id: {
            type: String,
            required: true,
        },
        payment_method: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: RECEIPT_STATUS,
            default: RECEIPT_STATUS.COMPLETED,
        },
    },
    {
        timestamps: true,
    },
);

const Receipt = mongoose.model('Receipt', receiptSchema);

export default Receipt;