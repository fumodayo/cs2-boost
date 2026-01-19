import mongoose, { Model } from 'mongoose';
import { ORDER_STATUS, ORDER_TYPES } from '../constants';

export interface IOrder extends Document {
    title: string;
    boost_id: string;
    type: string;
    server: string;
    price: number;
    game: string;
    begin_rating?: number;
    end_rating?: number;
    begin_rank?: string;
    end_rank?: string;
    begin_exp?: number;
    end_exp?: number;
    total_time?: number;
    options: any[];
    retryCount: number;
    status: string;
    status_history: Array<{
        status: string;
        date: Date;
        admin_action?: boolean;
        admin_id?: mongoose.Types.ObjectId;
        action?: string;
        previous_partner?: mongoose.Types.ObjectId;
        new_partner?: mongoose.Types.ObjectId;
    }>;
    user?: mongoose.Types.ObjectId;
    partner?: mongoose.Types.ObjectId;
    assign_partner?: mongoose.Types.ObjectId | null;
    account?: mongoose.Types.ObjectId;
    conversation?: mongoose.Types.ObjectId;
    review?: mongoose.Types.ObjectId;
    promoCode?: string;
    discountAmount?: number;
    originalPrice?: number;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        boost_id: { type: String, required: true },
        type: {
            type: String,
            enum: ORDER_TYPES,
            required: true,
        },
        server: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        game: {
            type: String,
            default: 'counter-strike-2',
        },
        begin_rating: {
            type: Number,
        },
        end_rating: {
            type: Number,
        },
        begin_rank: {
            type: String,
        },
        end_rank: {
            type: String,
        },
        begin_exp: {
            type: Number,
        },
        end_exp: {
            type: Number,
        },
        total_time: {
            type: Number,
        },
        options: {
            type: Array,
            default: [],
        },
        retryCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ORDER_STATUS,
            default: ORDER_STATUS.PENDING,
        },
        status_history: [
            {
                status: { type: String, enum: ORDER_STATUS },
                date: { type: Date, default: Date.now },
                admin_action: { type: Boolean, default: false },
                admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                action: { type: String },
                previous_partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                new_partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            },
        ],
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        partner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        assign_partner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
        },
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
        },
        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },
        promoCode: {
            type: String,
            default: null,
        },
        discountAmount: {
            type: Number,
            default: 0,
        },
        originalPrice: {
            type: Number,
            default: null,
        },
    },
    { timestamps: true },
);

orderSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.status_history.push({
            status: this.status,
            date: new Date(),
        });
    }
    next();
});

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);

export default Order;