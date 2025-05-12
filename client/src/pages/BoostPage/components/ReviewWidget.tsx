import { useState } from "react";
import { Button, StarRating, TextArea, Widget } from "~/components/shared";
import { IOrderProps, IReviewProps } from "~/types";
import { IoSend, IoTrash } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { axiosAuth } from "~/axiosAuth";
import toast from "react-hot-toast";
import formatDate from "~/utils/formatDate";

const SendReviewWidget = (order: IOrderProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const ratingLabels = [
    "Terrible",
    "Dissatisfied",
    "Average",
    "Good",
    "Excellent",
  ];

  const handleSendReview = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(`/review/send`, {
        customer_id: currentUser?._id,
        partner_id: order.partner?._id,
        order_id: order._id,
        content: review,
        rating,
      });
      if (data.success) {
        toast.success("Reviewed");
        location.reload();
      }
    } catch (e) {
      console.error(e);
      toast.error("Fail Review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Widget>
      <div className="px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-center space-y-1">
          Boost package completed.
          <h2 className="text-base font-medium leading-6 text-foreground">
            How was your experience?
          </h2>
          <p className="text-sm text-muted-foreground">
            Please send us your review.
          </p>
          <div className="xl:wrap flex flex-col items-center justify-center pb-2">
            <StarRating rating={rating} setRating={setRating} />
            {rating > 0 && (
              <p className="text-sm font-medium text-muted-foreground">
                (Satisfaction level: {ratingLabels[rating - 1]})
              </p>
            )}
          </div>
          <TextArea
            placeholder="Your review..."
            onChange={(e) => setReview(e.target.value.trim())}
          />
        </div>
      </div>
      <Widget.Footer>
        <Button
          disabled={review.length <= 0 || loading}
          variant="transparent"
          className="rounded-md px-2 py-1.5 text-xs"
          onClick={handleSendReview}
        >
          <IoSend className="mr-2" />
          Submit review
        </Button>
      </Widget.Footer>
    </Widget>
  );
};

const ReviewedWidget = (review: IReviewProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);

  console.log({ review });
  const handleDeleteReview = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(`/review/delete/${review._id}`, {
        customer_id: currentUser?._id,
      });
      if (data.success) {
        toast.success("Delete Review");
        location.reload();
      }
    } catch (e) {
      console.error(e);
      toast.error("Fail Delete Review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Widget>
      <Widget.BigHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
            You have reviewed
          </h3>
          <Button
            onClick={handleDeleteReview}
            disabled={loading}
            className="rounded-md px-3 py-1.5"
            variant="light"
          >
            <IoTrash />
          </Button>
        </div>
      </Widget.BigHeader>
      <div className="flex items-start space-x-3 px-4 py-4 hover:bg-muted/90">
        <img
          className="h-[50px] w-[50px] rounded-full border border-border"
          src={review.sender.profile_picture}
          alt="avatar"
        />

        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between space-y-2">
            <p className="font-semibold text-danger-hover">
              {review.sender.username}
            </p>
            <StarRating type="readonly" rating={review.rating} />
          </div>
          <p className="text-xs text-foreground/30">
            {formatDate(review.createdAt)}
          </p>
          <p className="text-sm">{review.content}</p>
        </div>
      </div>
    </Widget>
  );
};

const ReviewWidget = (order: IOrderProps) => {
  const { review } = order;
  return review ? (
    <ReviewedWidget {...review} />
  ) : (
    <SendReviewWidget {...order} />
  );
};

export default ReviewWidget;
