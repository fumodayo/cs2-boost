import express, { RequestHandler } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import { ROLE } from '../constants';
import {
    getPayouts,
    createPayoutRequest,
    approvePayout,
    declinePayout,
} from '../controllers/payout.controller';

const router = express.Router();
router.use(protect as RequestHandler);

router.post(
    '/request',
    authorize(ROLE.PARTNER) as RequestHandler,
    createPayoutRequest as RequestHandler,
);

router.get('/', authorize(ROLE.ADMIN) as RequestHandler, getPayouts as RequestHandler);
router.post(
    '/:payoutId/approve',
    authorize(ROLE.ADMIN) as RequestHandler,
    approvePayout as RequestHandler,
);
router.post(
    '/:payoutId/decline',
    authorize(ROLE.ADMIN) as RequestHandler,
    declinePayout as RequestHandler,
);

export default router;