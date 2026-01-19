import express, { RequestHandler } from 'express';
import { protect } from '../middlewares/auth.middleware';
import {
    subscribe,
    unsubscribe,
    getSettings,
    updateSettings,
} from '../controllers/push.controller';

const router = express.Router();

router.use(protect as RequestHandler);
router.post('/subscribe', subscribe as RequestHandler);
router.post('/unsubscribe', unsubscribe as RequestHandler);
router.get('/settings', getSettings as RequestHandler);
router.patch('/settings', updateSettings as RequestHandler);

export default router;