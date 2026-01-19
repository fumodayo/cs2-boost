import { Response, NextFunction } from 'express';
import Wallet from '../models/wallet.model';
import Transaction from '../models/transaction.model';
import { errorHandler } from '../utils/error';
import { AuthRequest } from '../interfaces';

/**
 * @desc    (Partner) Lấy thống kê ví và các giao dịch gần đây.
 *          Bao gồm số dư, tiền đang ký quỹ, tiền chờ rút, và 5 giao dịch mới nhất.
 * @route   GET /api/wallets/me/stats
 * @access  Private (Partner)
 */
const getPartnerWalletStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: partner_id } = req.user;

        const [wallet, recentTransactions] = await Promise.all([
            Wallet.findOne({ owner: partner_id }),
            Transaction.find({ user: partner_id }).sort({ createdAt: -1 }).limit(5),
        ]);

        if (!wallet) {
            return next(errorHandler(404, 'Wallet not found for this partner.'));
        }

        res.status(200).json({
            success: true,
            data: {
                stats: wallet,
                recentTransactions,
            },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    (Partner) Lấy danh sách giao dịch với phân trang và filter.
 * @route   GET /api/wallets/me/transactions
 * @access  Private (Partner)
 */
const getPartnerTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: partner_id } = req.user;
        const {
            page = 1,
            limit = 10,
            search = '',
            type = '',
            startDate = '',
            endDate = '',
        } = req.query;

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const filter: Record<string, any> = { user: partner_id };

        if (type && typeof type === 'string') {
            const types = type.split(',').filter((t) => t.trim());
            if (types.length > 0) {
                filter.type = { $in: types };
            }
        }

        if (search && typeof search === 'string') {
            filter.description = { $regex: search, $options: 'i' };
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate as string);
            }
            if (endDate) {
                const end = new Date(endDate as string);
                end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
        }

        const [transactions, total] = await Promise.all([
            Transaction.find(filter)
                .populate('related_order', '_id boost_id title type status game')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Transaction.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: {
                data: transactions,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
        });
    } catch (e) {
        next(e);
    }
};

export { getPartnerWalletStats, getPartnerTransactions };