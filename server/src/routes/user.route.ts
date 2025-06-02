import express, { RequestHandler } from 'express';
import {
    changePassword,
    followPartnerById,
    getPartnerByUsername,
    getPartners,
    getUser,
    unFollowPartnerById,
    updateUser,
    verifyUser,
} from '../controllers/user.controller';
import { verifyToken } from '../utils/verifyToken';

const router = express.Router();

router.get('/get-user/:id', verifyToken, getUser);
router.post('/get-partners', getPartners);
router.get('/get-partner/:username', getPartnerByUsername);
router.post('/update/:id', verifyToken, updateUser as RequestHandler);
router.post('/change-password/:id', verifyToken, changePassword as RequestHandler);
router.post('/verify-user/:id', verifyToken, verifyUser as RequestHandler);
router.post('/follow/:partner_id', verifyToken, followPartnerById as RequestHandler);
router.post('/unfollow/:partner_id', verifyToken, unFollowPartnerById as RequestHandler);

export default router;
