import express, { RequestHandler } from 'express';
import { getNotify, readNotify } from '../controllers/notify.controller';
import { verifyToken } from '../utils/verifyToken';

const router = express.Router();

router.get('/', verifyToken, getNotify as RequestHandler);
router.post('/:id', verifyToken, readNotify as RequestHandler);

export default router;
