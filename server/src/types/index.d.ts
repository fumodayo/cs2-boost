import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface IIPAddressProps {
    ip_location: string;
    device: string;
    country: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISocialLinkProps {
    id: Types.ObjectId;
    type?: string;
    link?: string;
}

export interface IUserProps {
    _id: Types.ObjectId;

    username: string;
    email_address: string;
    password?: string;
    user_id: string;
    profile_picture: string;
    role: string[];

    // Verification
    is_verified: boolean;
    address?: string;
    cccd_number?: string;
    cccd_issue_date?: Date;
    date_of_birth?: Date;
    gender?: string;
    language?: string;
    phone_number?: string;
    full_name?: string;

    // Details
    total_followers: number;
    total_working_time: number;
    total_completion_rate: number;
    total_rating: number;
    total_reviews: number;
    social_links?: ISocialLinkProps[];
    details?: string;

    following: ObjectId[]; // references to User
    followers_count: number;

    // IP Addresses
    ip_addresses: IIPAddressProps[];

    // Forgot Password
    otp?: string;
    otp_expiry?: Date;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthRequest extends Request {
    user: {
        id: string;
        role: string[];
    };
}

export interface INotification extends Document {
    sender?: mongoose.Types.ObjectId;
    receiver?: mongoose.Types.ObjectId;
    boost_id: string;
    content: string;
    isRead: boolean;
    type: (typeof NOTIFY_TYPE)[keyof typeof NOTIFY_TYPE];
    createdAt?: Date;
    updatedAt?: Date;
}
