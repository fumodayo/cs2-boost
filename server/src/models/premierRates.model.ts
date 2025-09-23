import { Schema, model, Document } from 'mongoose';

export interface IRateTier {
    start: number;
    end: number;
    rate: number;
}

export interface IRegionRates extends Document {
    name: string;
    value: string;
    rates: IRateTier[];
}

export interface IPremierRates extends Document {
    unitPrice: number;
    regions: IRegionRates[];
}

const RateTierSchema = new Schema<IRateTier>(
    {
        start: { type: Number, required: true },
        end: { type: Number, required: true },
        rate: { type: Number, required: true },
    },
    { _id: false },
);

const RegionRatesSchema = new Schema<IRegionRates>(
    {
        name: {
            type: String,
            required: [true, 'Tên khu vực là bắt buộc'],
            trim: true,
        },
        value: {
            type: String,
            required: [true, 'Giá trị định danh (value) là bắt buộc'],
            uppercase: true,
            trim: true,
        },
        rates: {
            type: [RateTierSchema],
            required: true,
        },
    },
    { _id: false },
);

const PremierRatesSchema = new Schema<IPremierRates>(
    {
        unitPrice: {
            type: Number,
            required: [true, 'Đơn giá chung (unitPrice) là bắt buộc'],
            default: 10,
        },
        regions: {
            type: [RegionRatesSchema],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const PremierRateModel = model<IPremierRates>('PremierRates', PremierRatesSchema);

export default PremierRateModel;
