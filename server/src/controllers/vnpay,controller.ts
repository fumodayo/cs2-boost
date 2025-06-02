import { NextFunction, Request, Response } from 'express';
import { errorHandler } from '../utils/error';
import { BuildPaymentUrl, dateFormat, parseDate, VerifyReturnUrl, VNPay } from 'vnpay';
import dotenv from 'dotenv';
import { AuthRequest } from '../types';
import Receipt from '../models/receipt.model';
import { generateUserId } from '../utils/generate';
import Order from '../models/order.model';
import { NOTIFY_TYPE, ORDER_STATUS } from '../constants';
import Notification from '../models/notification.model';
import { getReceiverSocketID, io } from '../socket/socket';

dotenv.config();

if (!process.env.VNPAY_SECURE_SECRET || !process.env.VNPAY_TMN_CODE) {
    throw new Error('Missing VNPAY_SECURE_SECRET or VNPAY_TMN_CODE');
}

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE,
    secureSecret: process.env.VNPAY_SECURE_SECRET,
    testMode: true,
    vnpayHost: 'https://sandbox.vnpayment.vn',
});

/**
 * Post request for payment redirect form
 */
const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const { amountInput, contentPayment, productTypeSelect, langSelect } = req.body;

        // Validate input
        if (!amountInput || amountInput <= 0) {
            return next(errorHandler(400, 'Invalid amount'));
        }

        /**
         * Prepare data for build payment url
         * Note: In the VNPay documentation, it's stated that you must multiply the amount by 100
         * However, when using the `vnpay` library, it automatically handles this for you
         */
        const data: BuildPaymentUrl = {
            vnp_Amount: amountInput,
            vnp_IpAddr:
                req.headers.forwarded ||
                req.ip ||
                req.socket.remoteAddress ||
                req.connection.remoteAddress ||
                '127.0.0.1',
            vnp_TxnRef: new Date().getTime().toString(),
            vnp_OrderInfo: contentPayment,
            vnp_OrderType: productTypeSelect,
            vnp_ReturnUrl: process.env.VNPAY_RETURN_URL ?? 'http://localhost:3000/bill-return',
            vnp_Locale: langSelect,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow),
            // vnp_BankCode: '123',
        };

        const url = vnpay.buildPaymentUrl(data);

        console.log(url);
        res.send({ success: true, url: url });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

/**
 * Get request for return url, just use for ui
 * Query string example: http://localhost:5030/api/v1/vn-pay/bill-return?vnp_Amount=1000000&vnp_Command=pay...
 */
const getBillReturn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = vnpay.verifyReturnUrl(req.query as unknown as VerifyReturnUrl);

        const formattedPayDate = parseDate(result.vnp_PayDate ?? 'Invalid Date').toLocaleString();

        const boost_id = result.vnp_OrderInfo;
        const user_id = req.user.id;

        // Nếu thanh toán thành công thì tạo receipt
        if (result.isSuccess && boost_id && user_id) {
            const order = await Order.findOne({ boost_id });

            if (order) {
                const existingReceipt = await Receipt.findOne({ order: order._id });

                if (!existingReceipt) {
                    const newReceipt = new Receipt({
                        receipt_id: generateUserId(),
                        payment_method: 'vn-pay',
                        price: order.price,
                        user: user_id,
                        order: order._id,
                    });

                    await newReceipt.save();

                    if (order.assign_partner) {
                        order.status = ORDER_STATUS.WAITING;

                        await new Notification({
                            sender: user_id,
                            receiver: order.assign_partner,
                            boost_id: order.boost_id,
                            content: 'Bạn có một đơn hàng mới cần xác nhận.',
                            type: NOTIFY_TYPE.BOOST,
                        }).save();

                        const socketId = getReceiverSocketID(order.assign_partner.toString());
                        if (socketId) io.to(socketId).emit('newNotify');
                    } else {
                        order.status = ORDER_STATUS.IN_ACTIVE;

                        await Notification.deleteOne({ type: NOTIFY_TYPE.NEW_ORDER });

                        await new Notification({
                            boost_id: order.boost_id,
                            content: 'Có một đơn hàng mới!',
                            type: NOTIFY_TYPE.NEW_ORDER,
                        }).save();

                        io.in('partners').emit('newNotify');
                    }

                    await order.save();
                }
            }
        }

        res.send({
            ...result,
            vnp_PayDate: formattedPayDate,
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

export { createPayment, getBillReturn };
