import express, { RequestHandler } from 'express';
import {
    sendReport,
    getReports,
    getMyReports,
    acceptReport,
    resolveReport,
} from '../controllers/report.controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import { ROLE } from '../constants';

const router = express.Router();
router.use(protect as RequestHandler);

// User routes
router.post('/', sendReport as RequestHandler);
router.get('/me', getMyReports as RequestHandler);

// Admin routes
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

export default router;
