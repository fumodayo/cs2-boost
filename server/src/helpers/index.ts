import Notification from '../models/notification.model';
import { getReceiverSocketID, io } from '../socket/socket';

const emitNotification = (receiverId: string, event = 'newNotify') => {
    const socketId = getReceiverSocketID(receiverId);
    if (socketId) io.to(socketId).emit(event);
};

const emitOrderStatusChange = () => {
    io.emit('statusOrderChange');
};

const createNotification = async (params: {
    sender?: string;
    receiver?: string;
    boost_id: string;
    content: string;
    type: string;
}) => {
    const notify = new Notification(params);
    await notify.save();
};

export { emitNotification, emitOrderStatusChange, createNotification };