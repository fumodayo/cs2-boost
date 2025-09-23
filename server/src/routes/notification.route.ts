import express, { RequestHandler } from 'express';
import { protect } from '../middlewares/auth.middleware';
import {
    getNotifications,
    readAllNotifications,
    readNotification,
} from '../controllers/notification.controller';

const router = express.Router();
router.use(protect as RequestHandler);

router.get('/', getNotifications as RequestHandler);
router.patch('/:notifyId/read', readNotification as RequestHandler);
router.patch('/read-all', readAllNotifications as RequestHandler);

export default router;
