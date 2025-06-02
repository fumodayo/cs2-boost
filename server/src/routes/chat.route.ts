import express, { RequestHandler } from 'express';
import { verifyToken } from '../utils/verifyToken';
import { getMessages, sendMessage } from '../controllers/chat.controller';

const router = express.Router();

router.get('/:id', verifyToken, getMessages);
router.post('/send-message/:id', verifyToken, sendMessage as RequestHandler);

export default router;
