import express, { RequestHandler } from 'express';
import {
    changePassword,
    followPartner,
    getPartnerByUsername,
    getPartners,
    getUserById,
    searchUsers,
    unfollowPartner,
    updateUser,
    verifyUser,
} from '../controllers/user.controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import { ROLE } from '../constants';

const router = express.Router();

router.get('/partners', getPartners as RequestHandler);
router.get(
    '/search',
    protect as RequestHandler,
    authorize(ROLE.ADMIN) as RequestHandler,
    searchUsers as RequestHandler,
);

router.get('/partner/:username', getPartnerByUsername as RequestHandler);
router.get('/:id', getUserById as RequestHandler);

router.use(protect as RequestHandler);

router.patch('/me', updateUser as RequestHandler);
router.post('/me/change-password', changePassword as RequestHandler);
router.post('/me/verify', verifyUser as RequestHandler);

router.post('/:partnerId/follow', followPartner as RequestHandler);
router.post('/:partnerId/unfollow', unfollowPartner as RequestHandler);

export default router;
