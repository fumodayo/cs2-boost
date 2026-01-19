import express, { RequestHandler } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { createPaymentUrl, getBillReturn } from '../controllers/vnpay.controller';

const router = express.Router();

router.post('/create-payment-url', protect as RequestHandler, createPaymentUrl as RequestHandler);
router.get('/bill-return', protect as RequestHandler, getBillReturn as RequestHandler);

export default router;