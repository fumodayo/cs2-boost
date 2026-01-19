import express, { RequestHandler } from 'express';
import {
    acceptOrder,
    addAccountToOrder,
    assignPartner,
    cancelOrder,
    completedOrder,
    createOrder,
    deleteOrder,
    editAccountOnOrder,
    getMyOrders,
    getOrderById,
    getPendingOrders,
    getProgressOrders,
    recoveryOrder,
    refuseOrder,
    renewOrder,
    validatePromoCode,
    completeFreeOrder,
} from '../controllers/order.controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import { ROLE } from '../constants';

const router = express.Router();
router.use(protect as RequestHandler);

router.get('/my-orders', getMyOrders as RequestHandler);
router.get('/pending', getPendingOrders as RequestHandler);
router.get(
    '/in-progress',
    authorize(ROLE.PARTNER) as RequestHandler,
    getProgressOrders as RequestHandler,
);

router.post('/validate-promo', validatePromoCode as RequestHandler);

router.post('/', createOrder as RequestHandler);

router.get('/:boostId', getOrderById as RequestHandler);
router.delete('/:boostId', deleteOrder as RequestHandler);

router.post('/:boostId/account', addAccountToOrder as RequestHandler);
router.patch('/accounts/:accountId', editAccountOnOrder as RequestHandler);

router.post('/:boostId/assign', assignPartner as RequestHandler);
router.post('/:boostId/refuse', refuseOrder as RequestHandler);
router.post('/:boostId/renew', renewOrder as RequestHandler);
router.post('/:boostId/recover', recoveryOrder as RequestHandler);
router.post(
    '/:boostId/accept',
    authorize(ROLE.PARTNER) as RequestHandler,
    acceptOrder as RequestHandler,
);
router.post(
    '/:boostId/complete',
    authorize(ROLE.PARTNER) as RequestHandler,
    completedOrder as RequestHandler,
);
router.post(
    '/:boostId/cancel',
    authorize(ROLE.PARTNER) as RequestHandler,
    cancelOrder as RequestHandler,
);

router.post('/:boostId/complete-free', completeFreeOrder as RequestHandler);

export default router;