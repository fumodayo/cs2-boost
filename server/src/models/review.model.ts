import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        content: { type: String },
        rating: { type: Number },
    },
    { timestamps: true },
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;