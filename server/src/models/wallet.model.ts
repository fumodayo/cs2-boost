import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWallet extends Document {
    owner: mongoose.Types.ObjectId;
    balance: number;
    escrow_balance: number;
    total_earnings: number;
    total_withdrawn: number;
    pending_withdrawal: number;
    debt: number;
}

const walletSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        balance: { type: Number, default: 0, min: 0 },
        escrow_balance: { type: Number, default: 0, min: 0 },
        total_earnings: { type: Number, default: 0 },
        total_withdrawn: { type: Number, default: 0 },
        pending_withdrawal: { type: Number, default: 0 },
        debt: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true },
);

const Wallet: Model<IWallet> = mongoose.model<IWallet>('Wallet', walletSchema);
export default Wallet;
