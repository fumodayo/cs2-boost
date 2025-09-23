import { Schema, model, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
    user: Types.ObjectId;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    settings: {
        updated_order: boolean;
        new_messages: boolean;
        new_order: boolean;
    };
}

const subscriptionSchema = new Schema<ISubscription>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        endpoint: { type: String, required: true },
        keys: {
            p256dh: { type: String, required: true },
            auth: { type: String, required: true },
        },
        settings: {
            updated_order: { type: Boolean, default: true },
            new_messages: { type: Boolean, default: true },
            new_order: { type: Boolean, default: true },
        },
    },
    { timestamps: true },
);

const Subscription = model<ISubscription>('Subscription', subscriptionSchema);
export default Subscription;
