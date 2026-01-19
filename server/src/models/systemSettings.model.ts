import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemSettings extends Document {
    partnerCommissionRate: number; 
    cancellationPenaltyRate: number; 
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const SystemSettingsSchema = new Schema<ISystemSettings>(
    {
        partnerCommissionRate: {
            type: Number,
            default: 0.8,
            min: 0.5,
            max: 0.95,
        },
        cancellationPenaltyRate: {
            type: Number,
            default: 0.05,
            min: 0.01,
            max: 0.2,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true },
);

const SystemSettings = mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema);

export default SystemSettings;