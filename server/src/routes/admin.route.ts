import express, { RequestHandler } from 'express';
import {
    banUser,
    broadcastAnnouncement,
    createUser,
    getAdminOrders,
    getAllTransactions,
    getOrderDetails,
    getRevenueStats,
    getUsers,
    unbanUser,
    updateUserByAdmin,
    getEmailTemplates,
    getEmailTemplateById,
    updateEmailTemplate,
    sendPasswordResetEmail,
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    broadcastAnnouncementById,
    sendAnnouncementEmail,
    getSystemSettings,
    updateSystemSettings,
    getPartnerRequests,
    approvePartnerRequest,
    rejectPartnerRequest,
    getPromoCodes,
    getPromoCodeById,
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
} from '../controllers/admin.controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import { ROLE } from '../constants';

const router = express.Router();
router.use(protect as RequestHandler, authorize(ROLE.ADMIN) as RequestHandler);

router.get('/users', getUsers as RequestHandler);
router.post('/users/create', createUser as RequestHandler);
router.put('/users/:userId', updateUserByAdmin as RequestHandler);
router.post('/users/:userId/ban', banUser as RequestHandler);
router.post('/users/:userId/unban', unbanUser as RequestHandler);

router.get('/orders', getAdminOrders as RequestHandler);
router.get('/orders/:orderId', getOrderDetails as RequestHandler);

router.get('/stats/revenue', getRevenueStats as RequestHandler);
router.get('/transactions', getAllTransactions as RequestHandler);

router.get('/partner-requests', getPartnerRequests as RequestHandler);
router.post('/partner-requests/:id/approve', approvePartnerRequest as RequestHandler);
router.post('/partner-requests/:id/reject', rejectPartnerRequest as RequestHandler);

router.post('/announcements/broadcast-legacy', broadcastAnnouncement as RequestHandler);

router.get('/announcements', getAnnouncements as RequestHandler);
router.post('/announcements', createAnnouncement as RequestHandler);
router.delete('/announcements/:id', deleteAnnouncement as RequestHandler);
router.post('/announcements/:id/broadcast', broadcastAnnouncementById as RequestHandler);

router.get('/email-templates', getEmailTemplates as RequestHandler);
router.get('/email-templates/:id', getEmailTemplateById as RequestHandler);
router.put('/email-templates/:id', updateEmailTemplate as RequestHandler);
router.post('/email-templates/send-password-reset', sendPasswordResetEmail as RequestHandler);
router.post('/email-templates/send-announcement', sendAnnouncementEmail as RequestHandler);

router.get('/settings', getSystemSettings as RequestHandler);
router.put('/settings', updateSystemSettings as RequestHandler);

router.get('/promo-codes', getPromoCodes as RequestHandler);
router.get('/promo-codes/:id', getPromoCodeById as RequestHandler);
router.post('/promo-codes', createPromoCode as RequestHandler);
router.put('/promo-codes/:id', updatePromoCode as RequestHandler);
router.delete('/promo-codes/:id', deletePromoCode as RequestHandler);

export default router;