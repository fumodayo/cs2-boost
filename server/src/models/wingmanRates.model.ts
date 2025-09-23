import { Schema, Document, model, Model } from 'mongoose';

export interface IRankRate {
    code: string;
    name: string;
    image: string;
    rate: number;
}

export interface IRegionWingmanRates {
    name: string;
    value: string;
    rates: IRankRate[];
}

export interface IWingmanRates extends Document {
    unitPrice: number;
    regions: IRegionWingmanRates[];
}

const RankRateSchema = new Schema<IRankRate>(
    {
        code: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        rate: { type: Number, required: true },
    },
    { _id: false },
);

const RegionWingmanRatesSchema = new Schema<IRegionWingmanRates>(
    {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, uppercase: true, trim: true },
        rates: { type: [RankRateSchema], required: true },
    },
    { _id: false },
);

const WingmanRatesSchema = new Schema<IWingmanRates>(
    {
        unitPrice: {
            type: Number,
            required: [true, 'Đơn giá (unitPrice) là bắt buộc'],
            default: 10000,
        },
        regions: {
            type: [RegionWingmanRatesSchema],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const WingmanRatesModel: Model<IWingmanRates> = model<IWingmanRates>(
    'WingmanRates',
    WingmanRatesSchema,
);

export default WingmanRatesModel;
