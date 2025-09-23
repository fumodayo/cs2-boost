import express, { RequestHandler } from 'express';
import {
    banUser,
    createUser,
    getAdminOrders,
    getAllTransactions,
    getOrderDetails,
    getRevenueStats,
    getUsers,
    unbanUser,
} from '../controllers/admin.controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import { ROLE } from '../constants';

const router = express.Router();
router.use(protect as RequestHandler, authorize(ROLE.ADMIN) as RequestHandler);

// User Management
router.get('/users', getUsers as RequestHandler);
router.post('/users/create', createUser as RequestHandler);
router.post('/users/:userId/ban', banUser as RequestHandler);
router.post('/users/:userId/unban', unbanUser as RequestHandler);

// Order Management
router.get('/orders', getAdminOrders as RequestHandler);
router.get('/orders/:orderId', getOrderDetails as RequestHandler);

// Financial & Stats
router.get('/stats/revenue', getRevenueStats as RequestHandler);
router.get('/transactions', getAllTransactions as RequestHandler);

export default router;
