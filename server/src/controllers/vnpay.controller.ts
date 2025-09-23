import { NextFunction, Request, Response } from 'express';
import { errorHandler } from '../utils/error';
import { BuildPaymentUrl, dateFormat, parseDate, VerifyReturnUrl, VNPay } from 'vnpay';
import dotenv from 'dotenv';
import Receipt from '../models/receipt.model';
import { generateUserId } from '../utils/generate';
import Order from '../models/order.model';
import { NOTIFY_TYPE, ORDER_STATUS, ROLE } from '../constants';
import mongoose from 'mongoose';
import { AuthRequest } from '../interfaces';
import User from '../models/user.model';
import { pushService } from '../services/push.service';
import { notificationService } from '../services/notification.service';

dotenv.config();

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE!,
    secureSecret: process.env.VNPAY_SECURE_SECRET!,
    testMode: true,
    vnpayHost: 'https://sandbox.vnpayment.vn',
});

/**
 * @desc    Tạo URL thanh toán VNPay để chuyển hướng người dùng.
 * @route   POST /api/vnpay/create-payment-url
 * @access  Private
 */
const createPaymentUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const { amountInput, contentPayment, productTypeSelect, langSelect } = req.body;

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

        const paymentUrl = vnpay.buildPaymentUrl(data);

        res.status(200).json({ success: true, data: paymentUrl });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Xử lý URL trả về từ VNPay sau khi người dùng hoàn tất thanh toán.
 *          Hàm này xác thực, tạo hóa đơn, cập nhật đơn hàng và gửi tất cả thông báo.
 * @route   GET /api/vnpay/return
 * @access  Private
 */
const getBillReturn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = vnpay.verifyReturnUrl(req.query as unknown as VerifyReturnUrl);
        const formattedPayDate = parseDate(result.vnp_PayDate ?? 'Invalid Date').toLocaleString();
        const boost_id = result.vnp_OrderInfo;
        const user_id = req.user.id;

        if (result.isSuccess && boost_id && user_id) {
            const order = await Order.findOne({ boost_id });
            if (order) {
                const existingReceipt = await Receipt.findOne({ order: order._id });

                if (!existingReceipt) {
                    const session = await mongoose.startSession();
                    session.startTransaction();
                    try {
                        const newReceipt = new Receipt({
                            receipt_id: generateUserId(),
                            payment_method: 'vn-pay',
                            price: order.price,
                            user: user_id,
                            order: order._id,
                        });
                        await newReceipt.save({ session });

                        if (order.assign_partner) {
                            order.status = ORDER_STATUS.WAITING;

                            await notificationService.createAndNotify({
                                sender: user_id,
                                receiver: order.assign_partner.toString(),
                                boost_id: order.boost_id,
                                content: 'You have a new assigned order to confirm.',
                                type: NOTIFY_TYPE.BOOST,
                            });

                            const user = await User.findById(user_id).select('username');
                            const payload = {
                                title: 'New Assigned Order!',
                                body: `User ${user?.username || ''} has paid for an order assigned to you: "${order.title}"`,
                                url: `/pending-boosts`,
                            };
                            await pushService.triggerPushNotification(
                                order.assign_partner.toString(),
                                'updated_order',
                                payload,
                            );
                        } else {
                            order.status = ORDER_STATUS.IN_ACTIVE;

                            notificationService.broadcastNewOrder(order);

                            const partners = await User.find({ role: ROLE.PARTNER }).select('_id');
                            const partnerIds = partners.map((p) => p._id.toString());

                            if (partnerIds.length > 0) {
                                const payload = {
                                    title: 'New Order Available!',
                                    body: `A new order "${order.title}" is ready to be taken.`,
                                    url: '/pending-boosts',
                                };
                                await pushService.triggerPushNotificationToMany(
                                    partnerIds,
                                    'new_order',
                                    payload,
                                );
                            }
                        }

                        await order.save({ session });
                        await session.commitTransaction();

                        notificationService.broadcastOrderStatusChange();
                    } catch (error) {
                        await session.abortTransaction();
                        return next(error);
                    } finally {
                        session.endSession();
                    }
                }
            }
        }

        res.send({
            ...result,
            vnp_PayDate: formattedPayDate,
        });
    } catch (e) {
        next(e);
    }
};

export { createPaymentUrl, getBillReturn };
