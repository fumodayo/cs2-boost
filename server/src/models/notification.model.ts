import mongoose from 'mongoose';
import { NOTIFY_TYPE } from '../constants';

const notifySchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        boost_id: {
            type: String,
        },
        content: {
            type: String,
        },
        isRead: {
            type: Boolean,
            required: true,
            default: false,
        },
        type: {
            type: String,
            enum: NOTIFY_TYPE,
            default: NOTIFY_TYPE.BOOST,
        },
    },
    { timestamps: true },
);

const Notification = mongoose.model('Notification', notifySchema);

export default Notification;
