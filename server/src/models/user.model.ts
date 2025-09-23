import mongoose, { Schema, Types } from 'mongoose';
import { ROLE, IP_STATUS } from '../constants';
import bcryptjs from 'bcryptjs';
import Wallet from './wallet.model';

export interface IIPAddressProps {
    ip_location: string;
    device: string;
    country: string;
    status?: string;
}

export interface ISocialLinkProps {
    type?: string;
    link?: string;
}

const IPAddressSchema = new mongoose.Schema<IIPAddressProps>(
    {
        ip_location: { type: String, required: true },
        device: { type: String, required: true },
        country: { type: String, required: true },
        status: {
            type: String,
            enum: IP_STATUS,
            default: IP_STATUS.ONLINE,
        },
    },
    { timestamps: true },
);

const socialLinkSchema = new Schema<ISocialLinkProps>({
    type: String,
    link: String,
});
export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email_address: string;
    password: string; // Password luôn là string sau khi hash
    user_id: string;
    profile_picture: string;
    role: string[];
    is_verified: boolean;
    address?: string;
    cccd_number?: string;
    cccd_issue_date?: Date;
    date_of_birth?: Date;
    gender?: string;
    language?: string;
    phone_number?: string;
    full_name?: string;
    total_followers: number;
    total_working_time: number;
    total_completion_rate: number;
    total_orders_completed: number;
    total_orders_taken: number;
    total_rating: number;
    total_reviews: number;
    social_links: (ISocialLinkProps & { _id?: Types.ObjectId })[];
    details?: string;
    following: Types.ObjectId[];
    followers_count: number;
    ip_addresses: (IIPAddressProps & { _id?: Types.ObjectId })[];
    otp?: string | null;
    otp_expiry?: number | null;
    is_banned: boolean;
    ban_reason: string | null;
    ban_expires_at: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        email_address: { type: String, required: true, unique: true },
        password: { type: String, required: true, unique: true },
        profile_picture: {
            type: String,
            required: true,
            default:
                'https://res.cloudinary.com/du93troxt/image/upload/v1714744499/avatar_qyersf.jpg',
        },
        user_id: { type: String, required: true, unique: true },
        role: { type: [String], enum: ROLE, default: [ROLE.CLIENT] },

        // VERIFY
        is_verified: { type: Boolean, required: true, default: false },
        address: { type: String },
        cccd_number: { type: String },
        cccd_issue_date: { type: Date },
        date_of_birth: { type: Date },
        gender: { type: String },
        language: { type: String, default: 'vietnamese' },
        phone_number: { type: String },
        full_name: { type: String },

        // DETAILS
        total_followers: { type: Number, required: true, default: 0 },
        total_working_time: { type: Number, required: true, default: 0 },
        total_completion_rate: { type: Number, required: true, default: 100 },
        total_orders_completed: { type: Number, required: true, default: 0 },
        total_orders_taken: { type: Number, required: true, default: 0 },
        total_rating: { type: Number, required: true, default: 0 },
        total_reviews: { type: Number, required: true, default: 0 },
        // reviews: [],
        social_links: [socialLinkSchema],
        details: { type: String },

        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        followers_count: { type: Number, default: 0 },

        // BAN/ UNBAN
        is_banned: { type: Boolean, default: false },
        ban_reason: { type: String, default: null },
        ban_expires_at: { type: Date, default: null },

        // IP ADDRESSES
        ip_addresses: [IPAddressSchema],

        // FORGOT_PASSWORD
        otp: {
            type: String,
        },
        otp_expiry: {
            type: Number,
        },
    },
    { timestamps: true },
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcryptjs.hash(this.password, 10);
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.post('save', async function (doc, next) {
    const isNewUser = doc.createdAt.getTime() === doc.updatedAt.getTime();

    if (isNewUser) {
        try {
            await Wallet.create({
                owner: doc._id,
            });
        } catch (error) {
            console.error('Failed to create initial wallet for user:', error);
        }
    }

    next();
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
