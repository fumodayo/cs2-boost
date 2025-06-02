import express, { RequestHandler } from 'express';
import { verifyToken } from '../utils/verifyToken';
import {
    acceptOrder,
    addAccount,
    cancelOrder,
    completedOrder,
    createOrder,
    deleteOrder,
    editAccount,
    getOrderById,
    getOrders,
    getPendingOrders,
    getProgressOrders,
    paymentOrder,
    recoveryOrder,
    refuseOrder,
    renewOrder,
} from '../controllers/order.controller';

const router = express.Router();

// USER
router.get('/get-orders', verifyToken, getOrders as RequestHandler);
router.get('/get-order-by-id/:id', verifyToken, getOrderById);
router.post('/create-order/:id', verifyToken, createOrder as RequestHandler);
router.post('/payment-order/:customer_id/:order_id', verifyToken, paymentOrder as RequestHandler);
router.post('/refuse-order/:id', verifyToken, refuseOrder as RequestHandler);
router.post('/renew-order/:id', verifyToken, renewOrder as RequestHandler);
router.post('/recovery-order/:id', verifyToken, recoveryOrder as RequestHandler);
router.delete('/delete-order/:id', verifyToken, deleteOrder as RequestHandler);
router.post('/add-account/:id', verifyToken, addAccount as RequestHandler);
router.post('/edit-account/:id', verifyToken, editAccount as RequestHandler);

// PARTNER
router.get('/get-pending-orders', verifyToken, getPendingOrders as RequestHandler);
router.get('/get-progress-orders', verifyToken, getProgressOrders as RequestHandler);
router.post('/accept-order/:id', verifyToken, acceptOrder as RequestHandler);
router.post('/completed-order/:id', verifyToken, completedOrder as RequestHandler);
router.post('/cancel-order/:id', verifyToken, cancelOrder as RequestHandler);

export default router;
