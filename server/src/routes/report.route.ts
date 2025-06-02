import express, { RequestHandler } from 'express';
import { verifyToken } from '../utils/verifyToken';
import { sendReport } from '../controllers/report.controller';

const router = express.Router();

router.post('/send', verifyToken, sendReport as RequestHandler);

export default router;
