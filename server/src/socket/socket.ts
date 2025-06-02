import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import User from '../models/user.model';
import { ROLE } from '../constants';
import cors from 'cors';

const whiteList = ['http://localhost:3000'];

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: whiteList,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

type SocketMap = Record<string, string>;

const userSockets: SocketMap = {};
const partnerSockets: SocketMap = {};

export const getReceiverSocketID = (receiver_id: string): string | undefined =>
    userSockets[receiver_id];

const emitOnlineUsers = () => {
    io.emit('getOnlineUsers', Object.keys(userSockets));
};

const emitOnlinePartners = () => {
    io.emit('getOnlinePartners', Object.keys(partnerSockets));
};

io.on('connection', async (socket) => {
    const userId = socket.handshake.query.user_id as string;

    if (!userId) return;

    userSockets[userId] = socket.id;
    emitOnlineUsers();

    try {
        const user = await User.findById(userId);
        if (user?.role?.includes(ROLE.PARTNER)) {
            socket.join('partners');
            partnerSockets[userId] = socket.id;
            emitOnlinePartners;
        }
    } catch (e) {
        console.log('Failed to fetch user', e);
    }

    socket.on('disconnect', () => {
        delete userSockets[userId];
        delete partnerSockets[userId];

        emitOnlineUsers();
        emitOnlinePartners();
    });
});

export { app, io, server };
