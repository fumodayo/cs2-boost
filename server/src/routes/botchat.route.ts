import express, { RequestHandler } from 'express';
import { getHistory, sendMessage } from '../controllers/botchat.controller';

const router = express.Router();

router.post('/history', getHistory as RequestHandler);
router.post('/send', sendMessage as RequestHandler);

export default router;
