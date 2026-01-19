import express, { RequestHandler } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import { ROLE } from '../constants';
import {
    getDashboardStatistics,
    getRevenueChartData,
    getTransactions,
} from '../controllers/revenue.controller';

const router = express.Router();
router.use(protect as RequestHandler, authorize(ROLE.ADMIN) as RequestHandler);
router.get('/chart-data', getRevenueChartData as RequestHandler);
router.get('/statistics', getDashboardStatistics);
router.get('/transactions', getTransactions);

export default router;