import { Schema, Document, model, Model } from 'mongoose';

export interface ILevelFarming extends Document {
    unitPrice: number;
}

const LevelFarmingConfigSchema = new Schema<ILevelFarming>(
    {
        unitPrice: {
            type: Number,
            required: [true, 'Đơn giá (unitPrice) là bắt buộc'],
            default: 10,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const LevelFarmingModel: Model<ILevelFarming> = model<ILevelFarming>(
    'LevelFarmingModel',
    LevelFarmingConfigSchema,
);

export default LevelFarmingModel;
