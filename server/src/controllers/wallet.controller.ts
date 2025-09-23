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

export { getPartnerWalletStats };
