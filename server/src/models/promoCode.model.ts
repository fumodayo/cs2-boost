import mongoose, { Model, Document } from 'mongoose';
import { ORDER_TYPES } from '../constants';

export interface IPromoCode extends Document {
    code: string;
    description?: string;
    discountPercent: number;
    maxDiscount?: number;
    minOrderAmount?: number;
    usageLimit: number;
    usedCount: number;
    applicableOrderTypes: string[];
    validFrom: Date;
    validUntil: Date;
    isActive: boolean;
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const promoCodeSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        discountPercent: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },
        maxDiscount: {
            type: Number,
            default: 0, 
        },
        minOrderAmount: {
            type: Number,
            default: 0,
        },
        usageLimit: {
            type: Number,
            default: 0, 
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        applicableOrderTypes: {
            type: [String],
            enum: Object.values(ORDER_TYPES),
            default: Object.values(ORDER_TYPES), 
        },
        validFrom: {
            type: Date,
            required: true,
        },
        validUntil: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true },
);

promoCodeSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

const PromoCode: Model<IPromoCode> = mongoose.model<IPromoCode>('PromoCode', promoCodeSchema);

export default PromoCode;