import webpush from 'web-push';
import Subscription from '../models/subscription.model';
import { ISubscription } from '../models/subscription.model';

export type NotificationType = 'updated_order' | 'new_order';

interface PushPayload {
    title: string;
    body: string;
    icon?: string;
    url?: string;
}

const sendNotification = async (subscription: ISubscription, payload: PushPayload) => {
    try {
        const pushSubscriptionPayload = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
        };

        await webpush.sendNotification(pushSubscriptionPayload, JSON.stringify(payload));

        console.log(`Push notification sent successfully to user ${subscription.user}.`);
    } catch (error: any) {
        console.error(`Error sending push notification to user ${subscription.user}:`, error);
        if (error.statusCode === 410) {
            await Subscription.findByIdAndDelete(subscription._id);
            console.log(`Removed expired subscription for user ${subscription.user}.`);
        }
    }
};

const triggerPushNotification = async (
    userId: string,
    type: NotificationType,
    payload: PushPayload,
) => {
    try {
        const subscription = await Subscription.findOne({ user: userId });

        if (!subscription) {
            return;
        }

        if (subscription.settings[type] === false) {
            console.log(`User ${userId} has disabled notifications for type: ${type}.`);
            return;
        }

        await sendNotification(subscription, payload);
    } catch (error) {
        console.error(`Failed to trigger push notification for user ${userId}:`, error);
    }
};

const triggerPushNotificationToMany = async (
    userIds: string[],
    type: NotificationType,
    payload: PushPayload,
) => {
    try {
        const subscriptions = await Subscription.find({ user: { $in: userIds } });

        for (const sub of subscriptions) {
            if (sub.settings[type] === true) {
                await sendNotification(sub, payload);
            }
        }
    } catch (error) {
        console.error(`Failed to trigger push notification to many users:`, error);
    }
};

export const pushService = {
    triggerPushNotification,
    triggerPushNotificationToMany,
};
