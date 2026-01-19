import express, { RequestHandler } from 'express';
import {
    sendReport,
    getReports,
    getMyReports,
    acceptReport,
    resolveReport,
    rejectReport,
    checkOrderReport,
    markReportAsRead,
} from '../controllers/report.controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import { ROLE } from '../constants';

const router = express.Router();
router.use(protect as RequestHandler);

router.post('/', sendReport as RequestHandler);
router.get('/me', getMyReports as RequestHandler);
router.get('/check-order/:orderId', checkOrderReport as RequestHandler);

router.get('/', authorize(ROLE.ADMIN) as RequestHandler, getReports as RequestHandler);
router.patch(
    '/:reportId/accept',
    authorize(ROLE.ADMIN) as RequestHandler,
    acceptReport as RequestHandler,
);
router.patch(
    '/:reportId/resolve',
    authorize(ROLE.ADMIN) as RequestHandler,
    resolveReport as RequestHandler,
);
router.patch(
    '/:reportId/reject',
    authorize(ROLE.ADMIN) as RequestHandler,
    rejectReport as RequestHandler,
);
router.patch(
    '/:reportId/mark-read',
    authorize(ROLE.ADMIN) as RequestHandler,
    markReportAsRead as RequestHandler,
);

export default router;