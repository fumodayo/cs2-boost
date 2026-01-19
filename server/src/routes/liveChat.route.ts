import express, { RequestHandler } from 'express';
import {
    createLiveChat,
    createGuestLiveChat,
    getMyLiveChat,
    getGuestLiveChat,
    getAllLiveChats,
    assignLiveChat,
    closeLiveChat,
    getLiveChatMessages,
    sendLiveChatMessage,
    sendGuestLiveChatMessage,
    mergeGuestChats,
} from '../controllers/liveChat.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { ROLE } from '../constants';

const router = express.Router();

router.post('/guest', createGuestLiveChat as RequestHandler);
router.get('/guest/:guestId', getGuestLiveChat as RequestHandler);
router.post('/guest/:guestId/messages', sendGuestLiveChatMessage as RequestHandler);

router.use(protect as RequestHandler);

router.post('/', createLiveChat as RequestHandler);
router.get('/', getMyLiveChat as RequestHandler);
router.post('/merge', mergeGuestChats as RequestHandler);
router.get('/:id/messages', getLiveChatMessages as RequestHandler);
router.post('/:id/messages', sendLiveChatMessage as RequestHandler);
router.post('/:id/close', closeLiveChat as RequestHandler);

router.get('/admin', authorize(ROLE.ADMIN) as RequestHandler, getAllLiveChats as RequestHandler);
router.post(
    '/:id/assign',
    authorize(ROLE.ADMIN) as RequestHandler,
    assignLiveChat as RequestHandler,
);

export default router;