import express, { RequestHandler } from 'express';
import {
    authWithGmail,
    authWithOtp,
    forgotPassword,
    login,
    refreshToken,
    register,
    resetPassword,
    signout,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/refresh-token', refreshToken);
router.post('/register', register);
router.post('/login', login);
router.post('/auth-with-gmail', authWithGmail as RequestHandler);
router.post('/forgot-password', forgotPassword);
router.post('/auth-with-otp', authWithOtp as RequestHandler);
router.post('/reset-password', resetPassword);
router.post('/signout', signout);
// router.post("/admin/register", registerWithAdmin as RequestHandler);
// router.post("/admin/login", loginWithAdmin as RequestHandler);

export default router;
