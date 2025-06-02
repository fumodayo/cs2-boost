import express, { RequestHandler } from 'express';
import { getReceipts } from '../controllers/receipt.controller';
import { verifyToken } from '../utils/verifyToken';

const router = express.Router();

router.get('/get-receipts', verifyToken, getReceipts as RequestHandler);

export default router;
