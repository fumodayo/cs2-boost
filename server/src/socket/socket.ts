import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import { ROLE } from '../constants';

const whiteList = ['http://localhost:3000'];

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: whiteList,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true,
    },
});

type SocketMap = Record<string, string>;

const userSockets: SocketMap = {};
const partnerSockets: SocketMap = {};
const adminSockets: SocketMap = {};

export const getReceiverSocketID = (receiver_id: string): string | undefined =>
    userSockets[receiver_id];

/**
 * Lấy danh sách socket ID của tất cả các admin đang online.
 * @returns {string[]} Mảng các socket ID.
 */
export const getAdminSocketIds = (): string[] => {
    return Object.values(adminSockets);
};

const emitOnlineUsers = () => {
    io.emit('getOnlineUsers', Object.keys(userSockets));
};

const emitOnlinePartners = () => {
    io.emit('getOnlinePartners', Object.keys(partnerSockets));
};

io.on('connection', async (socket) => {
    const userId = socket.handshake.query.user_id as string;

    if (!userId) {
        console.log('A user connected without user_id');
        return;
    }

    userSockets[userId] = socket.id;
    emitOnlineUsers();

    const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);

    if (isValidObjectId) {
        try {
            const user = await User.findById(userId).select('role');

            if (user) {
                if (user.role?.includes(ROLE.PARTNER)) {
                    partnerSockets[userId] = socket.id;
                    socket.join('partners'); 
                    emitOnlinePartners();
                }
                if (user.role?.includes(ROLE.ADMIN)) {
                    adminSockets[userId] = socket.id;
                }
            }
        } catch (e) {
            console.error('Failed to fetch user role on socket connection:', e);
        }
    }

    socket.on('disconnect', () => {
        delete userSockets[userId];
        delete partnerSockets[userId];
        delete adminSockets[userId];

        emitOnlineUsers();
        emitOnlinePartners();
    });
});

export { app, io, server };