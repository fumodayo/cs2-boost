import express, { RequestHandler } from 'express';
import {
    authWithGmail,
    forgotPassword,
    login,
    loginWithAdmin,
    refreshToken,
    register,
    registerWithAdmin,
    resetPassword,
    signout,
    verifyOtp,
} from '../controllers/auth.controller';

const router = express.Router();

// User Authentication
router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
router.post('/google', authWithGmail as RequestHandler);
router.post('/refresh-token', refreshToken as RequestHandler);
router.post('/signout', signout as RequestHandler);

// Password Recovery
router.post('/forgot-password', forgotPassword as RequestHandler);
router.post('/verify-otp', verifyOtp as RequestHandler);
router.post('/reset-password', resetPassword as RequestHandler);

// Admin Authentication
router.post('/admin/register', registerWithAdmin as RequestHandler);
router.post('/admin/login', loginWithAdmin as RequestHandler);

export default router;
