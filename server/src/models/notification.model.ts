import { Schema, model, Document, Types } from 'mongoose';
import { NOTIFY_TYPE } from '../constants';

export interface INotification extends Document {
    sender?: Types.ObjectId;
    receiver?: Types.ObjectId;

    boost_id?: string;
    report_id?: string;

    title?: string;
    image?: string;

    content: string;

    isRead: boolean;
    type: (typeof NOTIFY_TYPE)[keyof typeof NOTIFY_TYPE];

    createdAt: Date;
    updatedAt: Date;
}

const notifySchema = new Schema<INotification>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        boost_id: {
            type: String,
        },
        report_id: {
            type: String,
        },
        title: {
            type: String,
        },
        image: {
            type: String,
        },
        content: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            required: true,
            default: false,
        },
        type: {
            type: String,
            enum: Object.values(NOTIFY_TYPE),
            default: NOTIFY_TYPE.BOOST,
        },
    },
    { timestamps: true },
);

const Notification = model<INotification>('Notification', notifySchema);

export default Notification;