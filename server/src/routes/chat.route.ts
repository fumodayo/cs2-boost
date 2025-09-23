import express, { RequestHandler } from 'express';
import { getMessages, sendMessage } from '../controllers/chat.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();
router.use(protect as RequestHandler);

router.get('/:conversationId/messages', getMessages as RequestHandler);
router.post('/:conversationId/messages', sendMessage as RequestHandler);

export default router;
