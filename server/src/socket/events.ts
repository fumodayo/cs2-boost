import { getReceiverSocketID, io } from './socket';

const sendNotification = (userId: string) => {
    const socketId = getReceiverSocketID(userId);
    if (socketId) io.to(socketId).emit('newNotify');
};

export { sendNotification };