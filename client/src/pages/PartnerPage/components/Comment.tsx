import { StarRating } from "~/components/shared";
import { IReviewProps } from "~/types";
import { formatDateTime } from "~/utils";

const Comment = ({ sender, createdAt, content, rating }: IReviewProps) => {
  return (
    <div className="flex space-x-3">
      <div>
        <img
          className="w-[50px] rounded-full border border-border"
          src={sender.profile_picture}
          alt="avatar"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex min-w-[450px] flex-col space-y-1">
          <p className="font-semibold text-danger-hover">{sender.username}</p>
          <p className="text-xs text-foreground/30">
            {formatDateTime(createdAt)}
          </p>
          <p className="text-sm">{content}</p>
        </div>
        <StarRating type="readonly" rating={rating} />
      </div>
    </div>
  );
};

export default Comment;
