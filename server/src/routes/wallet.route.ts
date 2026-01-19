import express, { RequestHandler } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import { ROLE } from '../constants';
import { getPartnerWalletStats, getPartnerTransactions } from '../controllers/wallet.controller';

const router = express.Router();
router.use(protect as RequestHandler, authorize(ROLE.PARTNER) as RequestHandler);
router.get('/me/stats', getPartnerWalletStats as RequestHandler);
router.get('/me/transactions', getPartnerTransactions as RequestHandler);

export default router;