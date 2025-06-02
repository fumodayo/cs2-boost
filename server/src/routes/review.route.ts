import express, { RequestHandler } from 'express';
import { verifyToken } from '../utils/verifyToken';
import { deleteReview, getReviewByUsername, sendReview } from '../controllers/review.controller';

const router = express.Router();

router.get('/get-reviews/:username', getReviewByUsername);
router.post('/send', verifyToken, sendReview as RequestHandler);
router.post('/delete/:review_id', verifyToken, deleteReview as RequestHandler);

export default router;
