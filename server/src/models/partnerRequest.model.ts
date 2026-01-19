import { Schema, model, Document, Types } from 'mongoose';

export const PARTNER_REQUEST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
} as const;

export interface IPartnerRequest extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    status: (typeof PARTNER_REQUEST_STATUS)[keyof typeof PARTNER_REQUEST_STATUS];

    full_name: string;
    cccd_number: string;
    cccd_issue_date: Date;
    date_of_birth: Date;
    gender: string;
    address: string;
    phone_number: string;

    reviewed_by?: Types.ObjectId;
    reviewed_at?: Date;
    reject_reason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const partnerRequestSchema = new Schema<IPartnerRequest>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: Object.values(PARTNER_REQUEST_STATUS),
            default: PARTNER_REQUEST_STATUS.PENDING,
        },

        full_name: { type: String, required: true },
        cccd_number: { type: String, required: true },
        cccd_issue_date: { type: Date, required: true },
        date_of_birth: { type: Date, required: true },
        gender: { type: String, required: true },
        address: { type: String, required: true },
        phone_number: { type: String, required: true },

        reviewed_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reviewed_at: { type: Date },
        reject_reason: { type: String },
    },
    { timestamps: true },
);

const PartnerRequest = model<IPartnerRequest>('PartnerRequest', partnerRequestSchema);

export default PartnerRequest;