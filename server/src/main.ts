import express, { NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route';
import vnpayRoute from './routes/vnpay.route';
import uploadRouter from './routes/upload.route';
import orderRouter from './routes/order.route';
import chatRouter from './routes/chat.route';
import reviewRouter from './routes/review.route';
import reportRouter from './routes/report.route';
import adminRouter from './routes/admin.route';
import userRouter from './routes/user.route';
import receiptRouter from './routes/receipt.route';
import utilityRouter from './routes/utility.route';
import rateRouter from './routes/rate.route';
import walletRouter from './routes/wallet.route';
import revenueRouter from './routes/revenue.route';
import payoutRouter from './routes/payout.route';
import pushRouter from './routes/push.route';
import notificationRouter from './routes/notification.route';
import botChatRouter from './routes/botchat.route';
import liveChatRouter from './routes/liveChat.route';
import dotenv from 'dotenv';
import { connectToMongoDB } from './database/connectToMongoDB';
import { app, server } from './socket/socket';
import cors from 'cors';
import webpush from 'web-push';
import { initCCCDExpirationJob } from './jobs/cccdExpirationJob';

dotenv.config();
connectToMongoDB();

initCCCDExpirationJob();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
};

if (
    !process.env.VNPAY_SECURE_SECRET ||
    !process.env.VNPAY_TMN_CODE ||
    !process.env.VAPID_PUBLIC_KEY ||
    !process.env.VAPID_PRIVATE_KEY
) {
    throw new Error('Missing required environment variables (VNPAY or VAPID keys).');
}

webpush.setVapidDetails(
    `mailto:${process.env.ADMIN_EMAIL || 'admin@example.com'}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
);
console.log('Web-push configured successfully.');

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/vn-pay', vnpayRoute);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/report', reportRouter);
app.use('/api/v1/receipts', receiptRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/utils', utilityRouter);
app.use('/api/v1/rates', rateRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/revenue', revenueRouter);
app.use('/api/v1/payout', payoutRouter);
app.use('/api/v1/push', pushRouter);
app.use('/api/v1/notification', notificationRouter);
app.use('/api/v1/bot-chat', botChatRouter);
app.use('/api/v1/live-chat', liveChatRouter);

app.get('/', (req, res) => {
    res.json('Server is running');
});

app.use((err: any, req: any, res: any, next: any) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

const PORT = 5040;

server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));