import express from 'express';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route';
import vnpayRoute from './routes/vnpay.route';
import uploadRouter from './routes/upload.route';
import orderRouter from './routes/order.route';
import chatRouter from './routes/chat.route';
import notifyRouter from './routes/notify.route';
import statisticsRouter from './routes/statistics.route';
import reviewRouter from './routes/review.route';
import reportRouter from './routes/report.route';
import adminRouter from './routes/admin.route';
import userRouter from './routes/user.route';
import receiptRouter from './routes/receipt.route';
import dotenv from 'dotenv';
import { connectToMongoDB } from './database/connectToMongoDB';
import { app, server } from './socket/socket';
import cors from 'cors';

dotenv.config();
connectToMongoDB();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/vn-pay', vnpayRoute);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/notify', notifyRouter);
app.use('/api/v1/statistics', statisticsRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/report', reportRouter);
app.use('/api/v1/receipt', receiptRouter);
app.use('/api/v1/admin', adminRouter);

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

const PORT = 5030;

server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
