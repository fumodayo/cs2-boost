import { Response, NextFunction } from 'express';
import { NOTIFY_TYPE, ROLE } from '../constants';
import { AuthRequest } from '../types';
import Notification from '../models/notification.model';
import { errorHandler } from '../utils/error';
import { getReceiverSocketID, io } from '../socket/socket';

/**
 * @route POST /api/notify/get-notify
 * @access Private
 * @description Lấy thông báo theo người dùng
 */
const getNotify = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id: user_id, role } = req.user;
    try {
        let query = role.includes(ROLE.PARTNER)
            ? { $or: [{ type: NOTIFY_TYPE.NEW_ORDER }, { receiver: user_id }] }
            : { receiver: user_id };

        const notify = await Notification.find(query)
            .sort({ updatedAt: -1 })
            .populate({ path: 'sender', select: '-password' });

        if (!notify) {
            return next(errorHandler(404, 'Notify not found'));
        }

        res.status(200).json(notify);
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/notify/read-notify
 * @access Private
 * @description Đánh dấu các thông báo đã đọc
 */
const readNotify = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id: notify_id } = req.params;
    const { id: user_id } = req.user;

    try {
        // Đánh dấu thông báo là đã đọc và trả về bản ghi mới sau khi cập nhật
        const updatedNotify = await Notification.findByIdAndUpdate(
            notify_id,
            { isRead: true },
            { new: true },
        );

        if (!updatedNotify) return next(errorHandler(404, "Can't update notification"));

        // Gửi socket event tới client để reload thông báo nếu người dùng đang online
        const socketId = getReceiverSocketID(user_id);
        if (socketId) {
            io.to(socketId).emit('newNotify');
        }
        res.status(201).json('notify updated');
    } catch (e) {
        next(e);
    }
};

export { getNotify, readNotify };
