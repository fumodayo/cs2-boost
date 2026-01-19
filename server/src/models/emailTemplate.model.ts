import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailTemplate extends Document {
    name: string;
    subject: string;
    html_content: string;
    variables: string[];
    description?: string;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const emailTemplateSchema = new Schema<IEmailTemplate>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            enum: [
                'welcome',
                'forgot_password',
                'announcement',
                'password_reset_by_admin',
                'payment_success',
            ],
        },
        subject: {
            type: String,
            required: true,
        },
        html_content: {
            type: String,
            required: true,
        },
        variables: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

const EmailTemplate = mongoose.model<IEmailTemplate>('EmailTemplate', emailTemplateSchema);

export default EmailTemplate;