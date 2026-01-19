import mongoose, { Schema, Document, Model } from 'mongoose';
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from '../constants';

export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId; 
    type: string;
    amount: number;
    description: string;
    status: string;
    related_order?: mongoose.Types.ObjectId;
    related_payout?: mongoose.Types.ObjectId;
}

const transactionSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: Object.values(TRANSACTION_TYPE), required: true },
        amount: { type: Number, required: true },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(TRANSACTION_STATUS),
            default: TRANSACTION_STATUS.COMPLETED,
        },
        related_order: { type: Schema.Types.ObjectId, ref: 'Order' },
        related_payout: { type: Schema.Types.ObjectId, ref: 'Payout' },
    },
    { timestamps: true },
);

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
    'Transaction',
    transactionSchema,
);
export default Transaction;