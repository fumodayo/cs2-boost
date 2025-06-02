import express from 'express';
import { verifyToken } from '../utils/verifyToken';
import { getStatisticsById } from '../controllers/statistics.controller';

const router = express.Router();

router.get('/:id', verifyToken, getStatisticsById);

export default router;
