import { useState } from "react";
import { Spinner, StarRating, TextArea, Widget } from "~/components/ui";
import { IOrder, IReview, ISendReviewPayload, IUser } from "~/types";
import { IoSend, IoTrash } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import toast from "react-hot-toast";
import formatDate from "~/utils/formatDate";
import { Button } from "~/components/ui/Button";
import useSWRMutation from "swr/mutation";
import getErrorMessage from "~/utils/errorHandler";
import { useTranslation } from "react-i18next";
import { isUserObject } from "~/utils/typeGuards";
import { reviewService } from "~/services/review.service";

interface SendReviewWidgetProps extends IOrder {
  onUpdate: () => void;
}

const SendReviewWidget: React.FC<SendReviewWidgetProps> = ({
  onUpdate,
  ...order
}) => {
  const { t } = useTranslation(["boost_page", "common"]);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const ratingLabels = t("review_widget.send.ratings", {
    returnObjects: true,
    ns: "boost_page",
  }) as Record<string, string>;
  const { trigger, isMutating } = useSWRMutation(
    `/review/send`,
    (_, { arg }: { arg: ISendReviewPayload }) => reviewService.sendReview(arg),
  );

  const handleSendReview = async () => {
    try {
      await trigger({
        customer_id: currentUser!._id,
        partner_id: (order.partner as IUser)?._id,
        order_id: order._id,
        content: review,
        rating,
      });
      toast.success(t("common:toasts.review_sent"));
      onUpdate();
    } catch (e) {
      toast.error(getErrorMessage(e) || t("common:toasts.review_failed"));
    }
  };

  return (
    <Widget>
      <div className="px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-center space-y-1">
          <p>{t("review_widget.send.completed_message")}</p>
          <h2 className="text-base font-medium leading-6 text-foreground">
            {t("review_widget.send.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("review_widget.send.subtitle")}
          </p>
          <div className="xl:wrap flex flex-col items-center justify-center pb-2">
            <StarRating rating={rating} setRating={setRating} />
            {rating > 0 && (
              <p className="text-sm font-medium text-muted-foreground">
                ({t("review_widget.send.satisfaction_label")}:{" "}
                {ratingLabels[rating - 1]})
              </p>
            )}
          </div>
          <TextArea
            placeholder={t("review_widget.send.placeholder")}
            onChange={(e) => setReview(e.target.value.trim())}
          />
        </div>
      </div>
      <Widget.Footer>
        <Button
          disabled={!review.trim() || rating === 0 || isMutating}
          variant="transparent"
          className="gap-2 rounded-md px-2 py-1.5 text-xs"
          onClick={handleSendReview}
        >
          {isMutating ? <Spinner size="sm" /> : <IoSend />}
          {t("review_widget.send.submit_btn")}
        </Button>
      </Widget.Footer>
    </Widget>
  );
};

interface ReviewedWidgetProps extends IReview {
  onUpdate: () => void;
}

export const ReviewedWidget: React.FC<ReviewedWidgetProps> = ({
  onUpdate,
  ...review
}) => {
  const { t } = useTranslation(["boost_page", "common"]);

  const { trigger, isMutating } = useSWRMutation(
    `/review/delete/${review._id}`,
    () => reviewService.deleteReview(review._id),
  );

  const handleDeleteReview = async () => {
    if (!window.confirm(t("review_widget.reviewed.delete_confirm"))) return;
    try {
      await trigger();
      toast.success(t("common:toasts.review_deleted"));
      onUpdate();
    } catch (e) {
      toast.error(
        getErrorMessage(e) || t("common:toasts.review_delete_failed"),
      );
    }
  };

  if (!isUserObject(review.sender)) return null;
  const sender = review.sender;

  return (
    <Widget>
      <Widget.BigHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
            {t("review_widget.reviewed.title")}
          </h3>
          <Button
            onClick={handleDeleteReview}
            disabled={isMutating}
            className="rounded-md px-3 py-1.5"
            variant="light"
          >
            {isMutating ? <Spinner size="sm" /> : <IoTrash />}
          </Button>
        </div>
      </Widget.BigHeader>
      <div className="flex items-start space-x-3 px-4 py-4 hover:bg-muted/90">
        <img
          className="h-[50px] w-[50px] rounded-full border border-border"
          src={sender.profile_picture}
          alt="avatar"
        />

        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between space-y-2">
            <p className="font-semibold text-danger-hover">{sender.username}</p>
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

interface ReviewWidgetProps extends IOrder {
  onUpdate: () => void;
}

const ReviewWidget: React.FC<ReviewWidgetProps> = ({ onUpdate, ...order }) => {
  const { review } = order;

  return review ? (
    <ReviewedWidget {...(review as IReview)} onUpdate={onUpdate} />
  ) : (
    <SendReviewWidget {...order} onUpdate={onUpdate} />
  );
};

export default ReviewWidget;