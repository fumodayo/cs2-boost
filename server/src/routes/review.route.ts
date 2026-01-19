import express, { RequestHandler } from 'express';
import { deleteReview, getReviewsByUsername, sendReview } from '../controllers/review.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/user/:username', getReviewsByUsername as RequestHandler);
router.post('/', protect as RequestHandler, sendReview as RequestHandler);
router.delete('/:reviewId', protect as RequestHandler, deleteReview as RequestHandler);

export default router;