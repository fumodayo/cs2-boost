import { Response, NextFunction } from 'express';
import Order from '../models/order.model';
import Review from '../models/review.model';
import User from '../models/user.model';
import { errorHandler } from '../utils/error';
import { AuthRequest } from '../interfaces';
import mongoose from 'mongoose';

/**
 * @desc    Lấy danh sách đánh giá của một người dùng theo username.
 *          Hỗ trợ phân trang để không tải quá nhiều dữ liệu cùng lúc.
 * @route   GET /api/reviews/user/:username
 * @access  Public
 */
const getReviewsByUsername = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params;
        let { page = 1, perPage = 5 } = req.query;

        page = parseInt(page as string);
        perPage = parseInt(perPage as string);

        if (isNaN(page) || isNaN(perPage) || page < 1 || perPage < 1) {
            return next(errorHandler(400, 'Invalid page or perPage value'));
        }

        const user = await User.findOne({ username });
        if (!user) return next(errorHandler(401, 'User not found'));

        const total = await Review.countDocuments({ receiver: user._id });
        const totalPages = Math.ceil(total / perPage);

        const reviews = await Review.find({ receiver: user._id })
            .populate('sender')
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            success: true,
            data: reviews,
            pagination: {
                total,
                page,
                perPage,
                totalPages: totalPages,
            },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Gửi một bài đánh giá cho một Partner sau khi hoàn thành đơn hàng.
 *          Hệ thống sẽ cập nhật điểm số trung bình và tổng số đánh giá của Partner đó.
 * @route   POST /api/reviews
 * @access  Private
 */
const sendReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id: user_id } = req.user;
        const { customer_id, partner_id, order_id, rating, content } = req.body;
        if (user_id !== customer_id) {
            return next(errorHandler(401, 'You can review only your account'));
        }

        const existingReview = await Review.findOne({ order: order_id }).session(session);
        if (existingReview) {
            throw errorHandler(409, 'You have already reviewed this order.');
        }

        const newReview = new Review({
            sender: customer_id,
            receiver: partner_id,
            order: order_id,
            content,
            rating,
        });

        const savedReview = await newReview.save({ session });

        await Order.findByIdAndUpdate(
            order_id,
            { review: savedReview._id },
            { new: true, session },
        );

        const partner = await User.findById(partner_id).session(session);
        if (!partner) {
            throw errorHandler(404, 'Partner not found');
        }
        const currentTotalScore = partner.total_rating * partner.total_reviews;
        const newTotalReviews = partner.total_reviews + 1;
        const newAverageRating = (currentTotalScore + rating) / newTotalReviews;
        partner.total_reviews = newTotalReviews;
        partner.total_rating = Math.round(newAverageRating * 100) / 100;

        await partner.save({ session });

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'Review sent successfully.',
            data: newReview,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Xóa một bài đánh giá đã gửi.
 *          Chỉ người gửi mới có quyền xóa. Hệ thống sẽ tính toán lại điểm số trung bình của Partner.
 * @route   DELETE /api/reviews/:reviewId
 * @access  Private
 */
const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id: user_id } = req.user;
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId).session(session);

        if (!review || !review.sender || !review.receiver || !review.rating) {
            return next(errorHandler(404, 'Review not found'));
        }

        if (review.sender.toString() !== user_id) {
            return next(errorHandler(403, 'You can delete only your own review'));
        }

        const partner_id = review.receiver.toString();
        const ratingToDelete = review.rating;
        const partner = await User.findById(partner_id).session(session);
        if (!partner) {
            throw errorHandler(404, 'Partner not found');
        }
        const currentTotalScore = partner.total_rating * partner.total_reviews;
        const newTotalReviews = partner.total_reviews - 1;
        let newAverageRating = 0;
        if (newTotalReviews > 0) {
            newAverageRating = (currentTotalScore - ratingToDelete) / newTotalReviews;
        }
        partner.total_reviews = newTotalReviews;
        partner.total_rating = Math.round(newAverageRating * 100) / 100;

        await partner.save({ session });

        await Review.findByIdAndDelete(reviewId, { session });
        await Order.findByIdAndUpdate(review.order, { $unset: { review: 1 } }, { session });

        await session.commitTransaction();

        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (e) {
        next(e);
    }
};

export { getReviewsByUsername, sendReview, deleteReview };
