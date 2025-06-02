import express, { RequestHandler } from 'express';
import { createPayment, getBillReturn } from '../controllers/vnpay,controller';
import { verifyToken } from '../utils/verifyToken';

const router = express.Router();
router.post('/create-payment', createPayment);
router.get('/bill-return', verifyToken, getBillReturn as RequestHandler);

export default router;
