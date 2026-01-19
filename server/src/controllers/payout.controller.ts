import mongoose, { Types } from 'mongoose';
import Payout, { IPayout } from '../models/payout.model';
import Wallet from '../models/wallet.model';
import Transaction from '../models/transaction.model';
import { errorHandler } from '../utils/error';
import { AuthRequest } from '../interfaces';
import { PAYOUT_STATUS, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../constants';
import { NextFunction, Request, Response } from 'express';

/**
 * @desc    (Admin) Lấy danh sách các yêu cầu rút tiền.
 *          Hỗ trợ lọc theo trạng thái và có phân trang đầy đủ.
 * @route   GET /api/payouts
 * @access  Private (Admin)
 */
const getPayouts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status = PAYOUT_STATUS.PENDING, page = 1, limit = 10 } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const query = { status: status as string };

        const [payouts, total] = await Promise.all([
            Payout.find(query)
                .populate('partner')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Payout.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            data: payouts,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    (Partner) Tạo một yêu cầu rút tiền từ số dư khả dụng.
 *          Hệ thống sẽ trừ tiền khỏi 'balance' và cộng vào 'pending_withdrawal' trong ví.
 * @route   POST /api/payouts/request
 * @access  Private (Partner)
 */
const createPayoutRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id: partner_id } = req.user;
        const { amount } = req.body;

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return next(errorHandler(400, 'Invalid payout amount provided.'));
        }

        const wallet = await Wallet.findOne({ owner: partner_id }).session(session);

        if (!wallet) {
            throw errorHandler(404, 'Wallet not found for this user.');
        }
        if (wallet.balance < amount) {
            throw errorHandler(400, 'Insufficient balance for this payout request.');
        }

        wallet.balance -= amount;
        wallet.pending_withdrawal += amount;
        await wallet.save({ session });

        const newPayout = new Payout({
            partner: partner_id,
            amount,
            status: PAYOUT_STATUS.PENDING,
        });
        await newPayout.save({ session });

        await session.commitTransaction();
        res.status(201).json({
            success: true,
            message: 'Withdrawal request has been successfully created.',
            data: newPayout,
        });
    } catch (e) {
        await session.abortTransaction();
        next(e);
    } finally {
        session.endSession();
    }
};

/**
 * @desc    (Admin) Phê duyệt một yêu cầu rút tiền.
 *          Hệ thống sẽ cập nhật ví, tạo giao dịch chi trả, và cập nhật trạng thái Payout.
 * @route   POST /api/payouts/:payoutId/approve
 * @access  Private (Admin)
 */
const approvePayout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id: adminId } = req.user;
        const { payoutId } = req.params;

        const payout = await Payout.findById<IPayout>(payoutId).session(session);
        if (!payout || payout.status !== PAYOUT_STATUS.PENDING) {
            throw errorHandler(404, 'Pending payout request not found or already processed.');
        }

        const wallet = await Wallet.findOne({ owner: payout.partner }).session(session);
        if (!wallet) {
            throw errorHandler(404, "Partner's wallet not found.");
        }

        wallet.pending_withdrawal -= payout.amount;
        wallet.total_withdrawn += payout.amount;
        await wallet.save({ session });

        const transaction = new Transaction({
            user: payout.partner,
            type: TRANSACTION_TYPE.PAYOUT,
            amount: -payout.amount,
            description: `Payout #${payout._id.toString().slice(-6)} approved by admin.`,
            status: TRANSACTION_STATUS.COMPLETED,
            related_payout: payout._id,
        });
        await transaction.save({ session });

        payout.status = PAYOUT_STATUS.APPROVED;
        payout.processed_by = new Types.ObjectId(adminId);
        payout.transaction = new Types.ObjectId(transaction._id as string);
        const updatedPayout = await payout.save({ session });

        await session.commitTransaction();
        res.status(200).json({
            success: true,
            message: 'Withdrawal request approved successfully.',
            data: updatedPayout,
        });
    } catch (e) {
        await session.abortTransaction();
        next(e);
    } finally {
        session.endSession();
    }
};

/**
 * @desc    (Admin) Từ chối một yêu cầu rút tiền.
 *          Hệ thống sẽ hoàn tiền lại vào số dư khả dụng (balance) cho partner.
 * @route   POST /api/payouts/:payoutId/decline
 * @access  Private (Admin)
 */
const declinePayout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id: adminId } = req.user;
        const { payoutId } = req.params;

        const payout = await Payout.findById(payoutId).session(session);
        if (!payout || payout.status !== PAYOUT_STATUS.PENDING) {
            throw errorHandler(404, 'Pending payout request not found or already processed.');
        }

        const wallet = await Wallet.findOne({ owner: payout.partner }).session(session);
        if (!wallet) {
            throw errorHandler(404, "Partner's wallet not found.");
        }
        wallet.pending_withdrawal -= payout.amount;
        wallet.balance += payout.amount;
        await wallet.save({ session });

        payout.status = PAYOUT_STATUS.DECLINED;
        payout.processed_by = new Types.ObjectId(adminId);
        const updatedPayout = await payout.save({ session });

        await session.commitTransaction();
        res.status(200).json({
            success: true,
            message: 'Request declined. Funds have been refunded to Partners balance.',
            data: updatedPayout,
        });
    } catch (e) {
        await session.abortTransaction();
        next(e);
    } finally {
        session.endSession();
    }
};

export { getPayouts, createPayoutRequest, approvePayout, declinePayout };