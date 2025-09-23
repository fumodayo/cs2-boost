import { Response, NextFunction } from 'express';
import Notification from '../models/notification.model';
import { errorHandler } from '../utils/error';
import { getReceiverSocketID, io } from '../socket/socket';
import { AuthRequest } from '../interfaces';

/**
 * @desc    Lấy danh sách thông báo cho người dùng đã đăng nhập.
 *          Partner sẽ thấy cả thông báo về đơn hàng mới và thông báo cá nhân. Các vai trò khác chỉ thấy thông báo cá nhân.
 * @route   GET /api/notify
 * @access  Private
 */
const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: user_id } = req.user;

        const notifications = await Notification.find({ receiver: user_id })
            .sort({ updatedAt: -1 })
            .populate({ path: 'sender', select: '-password' });

        res.status(200).json({ success: true, data: notifications });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Đánh dấu một thông báo cụ thể là đã đọc.
 *          Gửi sự kiện socket để client cập nhật UI real-time.
 * @route   PATCH /api/notify/:notifyId/read
 * @access  Private
 */
const readNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { notifyId } = req.params;
        const { id: user_id } = req.user;

        const updatedNotification = await Notification.findByIdAndUpdate(
            notifyId,
            { isRead: true },
            { new: true },
        );

        if (!updatedNotification) return next(errorHandler(404, "Can't update notification"));

        const socketId = getReceiverSocketID(user_id);
        if (socketId) {
            io.to(socketId).emit('notification:updated');
        }

        res.status(200).json({
            success: true,
            message: 'The notification has been marked as read.',
            data: updatedNotification,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Đánh dấu tất cả thông báo chưa đọc của người dùng là đã đọc.
 *          Gửi sự kiện socket để client cập nhật UI real-time.
 * @route   PATCH /api/notify/read-all
 * @access  Private
 */
const readAllNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: user_id } = req.user;
        const result = await Notification.updateMany(
            { receiver: user_id, isRead: false },
            { $set: { isRead: true } },
        );

        if (result.modifiedCount > 0) {
            const socketId = getReceiverSocketID(user_id);
            if (socketId) {
                io.to(socketId).emit('notification:updated');
            }
        }

        res.status(200).json({
            success: true,
            message: 'All unread notifications have been marked as read.',
            data: {
                modifiedCount: result.modifiedCount,
            },
        });
    } catch (e) {
        next(e);
    }
};

export { getNotifications, readNotification, readAllNotifications };
