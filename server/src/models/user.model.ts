import mongoose from 'mongoose';
import { ROLE, IP_STATUS } from '../constants';
import bcryptjs from 'bcryptjs';

const IPAddressSchema = new mongoose.Schema(
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

const userSchema = new mongoose.Schema(
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
        total_completion_rate: { type: Number, required: true, default: 0 },
        total_rating: { type: Number, required: true, default: 0 },
        total_reviews: { type: Number, required: true, default: 0 },
        // reviews: [],
        social_links: [
            {
                id: { type: String },
                type: { type: String },
                link: { type: String },
            },
        ],
        details: { type: String },

        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        followers_count: { type: Number, default: 0 },

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

const User = mongoose.model('User', userSchema);

export default User;
