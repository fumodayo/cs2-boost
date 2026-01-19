import mongoose, { Schema, Document, Model } from 'mongoose';
import { PAYOUT_STATUS } from '../constants';

export interface IPayout extends Document {
    _id: mongoose.Types.ObjectId;
    partner: mongoose.Types.ObjectId;
    amount: number;
    status: string;
    processed_by?: mongoose.Types.ObjectId;
    transaction?: mongoose.Types.ObjectId;
}

const payoutSchema = new Schema(
    {
        partner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: Object.values(PAYOUT_STATUS),
            default: PAYOUT_STATUS.PENDING,
        },
        processed_by: { type: Schema.Types.ObjectId, ref: 'User' },
        transaction: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    },
    { timestamps: true },
);

const Payout: Model<IPayout> = mongoose.model<IPayout>('Payout', payoutSchema);
export default Payout;