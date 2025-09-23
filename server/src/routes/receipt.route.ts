import express, { RequestHandler } from 'express';
import { createReceipt, getReceipts } from '../controllers/receipt.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();
router.use(protect as RequestHandler);

router
    .route('/')
    .get(getReceipts as RequestHandler)
    .post(createReceipt as RequestHandler);

export default router;
