import Notification, { INotification } from '../models/notification.model';
import { NOTIFY_TYPE, ORDER_STATUS } from '../constants';
import { getReceiverSocketID, io } from '../socket/socket';
import Order from '../models/order.model';

interface CreateNotificationParams {
    sender?: string;
    receiver: string;
    boost_id?: string;
    report_id?: string;
    title?: string;
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

    /**
     * Tạo notification về pending order mới (không có receiver - dành cho tất cả partners).
     * Xóa notification NEW_ORDER cũ để chỉ giữ 1 notification mới nhất.
     */
    public async createPendingOrderNotification(order: any): Promise<void> {
        try {

            await Notification.deleteMany({ type: NOTIFY_TYPE.NEW_ORDER });

            await new Notification({
                boost_id: order.boost_id,
                content: 'You have a new assigned order to confirm.',
                type: NOTIFY_TYPE.NEW_ORDER,
            }).save();

            io.in('partners').emit('notification:new');
        } catch (error) {
            console.error('Failed to create pending order notification:', error);
        }
    }

    /**
     * Xóa notification NEW_ORDER nếu không còn pending orders.
     */
    public async removePendingOrderNotificationIfEmpty(): Promise<void> {
        try {
            const pendingOrdersCount = await Order.countDocuments({
                status: { $in: [ORDER_STATUS.IN_ACTIVE, ORDER_STATUS.WAITING] },
            });

            if (pendingOrdersCount === 0) {
                await Notification.deleteMany({ type: NOTIFY_TYPE.NEW_ORDER });
                io.in('partners').emit('notification:updated');
            }
        } catch (error) {
            console.error('Failed to remove pending order notification:', error);
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