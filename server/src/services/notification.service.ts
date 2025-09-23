import Notification, { INotification } from '../models/notification.model';
import { NOTIFY_TYPE } from '../constants';
import { getReceiverSocketID, io } from '../socket/socket';

interface CreateNotificationParams {
    sender?: string;
    receiver: string;
    boost_id?: string;
    content: string;
    type: (typeof NOTIFY_TYPE)[keyof typeof NOTIFY_TYPE];
}

class NotificationService {
    public async createAndNotify(params: CreateNotificationParams): Promise<INotification | null> {
        try {
            const notification = new Notification(params);
            await notification.save();

            const receiverSocketId = getReceiverSocketID(params.receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('notification:new', notification);
            }
            return notification;
        } catch (error) {
            console.error('Failed to create and send notification:', error);
            return null;
        }
    }
    public broadcastNewOrder(order: any): void {
        const newOrderNotifyPayload = {
            boost_id: order.boost_id,
            content: `A new order "${order.title}" is available!`,
            type: NOTIFY_TYPE.NEW_ORDER,
            createdAt: new Date(),
        };
        io.in('partners').emit('order:new', newOrderNotifyPayload);
    }

    public broadcastOrderStatusChange(): void {
        io.emit('order:statusChanged');
    }
}

export const notificationService = new NotificationService();
