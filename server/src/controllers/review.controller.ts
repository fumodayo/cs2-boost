import { Request, Response, NextFunction } from 'express';
import Order from '../models/order.model';
import Review from '../models/review.model';
import User from '../models/user.model';
import { AuthRequest } from '../types';
import { errorHandler } from '../utils/error';

/**
 * @route GET /api/review/:username
 * @access Public
 * @description This endpoint retrieves reviews for a user by their username.
 * It supports pagination with `page` and `perPage` query parameters.
 */
const getReviewByUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params;
        let { page = 1, perPage = 5 } = req.query;

        page = parseInt(page as string);
        perPage = parseInt(perPage as string);

        if (page < 1 || perPage < 1) {
            return next(errorHandler(400, 'Invalid page or perPage value'));
        }

        const user = await User.findOne({ username });
        if (!user) return next(errorHandler(401, 'User not found'));

        const total = await Review.countDocuments({ receiver: user._id });
        const totalPages = Math.ceil(total / perPage);

        const reviews = await Review.find({ receiver: user._id })
            .populate('sender', 'username profile_picture')
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            reviews,
            currentPage: page,
            totalPages,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/review
 * @access Private
 * @description This endpoint allows a user to send a review for a partner after completing an order.
 * It checks if the user is the customer of the order and updates the order with the review.
 */
const sendReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: user_id } = req.user;
        const { customer_id, partner_id, order_id, rating, content } = req.body;

        if (user_id !== customer_id) {
            return next(errorHandler(401, 'You can review only your account'));
        }

        const review = new Review({
            sender: customer_id,
            receiver: partner_id,
            order: order_id,
            content,
            rating,
        });

        const savedReview = await review.save();

        // Cập nhật đơn hàng với review vừa tạo
        const updatedOrder = await Order.findByIdAndUpdate(
            order_id,
            { review: savedReview._id },
            { new: true },
        );

        if (!updatedOrder) {
            return next(errorHandler(401, 'Missing review'));
        }

        res.status(201).json({ success: true, message: 'Review submitted successfully' });
    } catch (e) {
        next(e);
    }
};

/**
 * @route DELETE /api/review/:review_id
 * @access Private
 * @description This endpoint allows a user to delete their own review.
 * It checks if the review exists and if the user is the sender of the review.
 */
const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: user_id } = req.user;
        const { review_id } = req.params;

        const review = await Review.findById(review_id);

        if (!review || !review.sender) {
            return next(errorHandler(404, 'Review not found'));
        }

        if (review.sender.toString() !== user_id) {
            return next(errorHandler(403, 'You can delete only your own review'));
        }

        await Review.findByIdAndDelete(review_id);
        await Order.findByIdAndUpdate(review.order, { review: null });

        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (e) {
        next(e);
    }
};

export { getReviewByUsername, sendReview, deleteReview };
