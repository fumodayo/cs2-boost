import { StarRating } from "~/components/shared";
import { IReview, IUser } from "~/types";
import { formatDateTime } from "~/utils";

const Comment = ({ sender, createdAt, content, rating }: IReview) => {
  const { profile_picture, username } = sender as IUser;

  return (
    <div className="flex items-start space-x-4">
      <img
        src={profile_picture}
        alt={username}
        className="h-10 w-10 rounded-full border border-border object-cover"
      />
      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-2">
          <p className="text-sm font-semibold text-foreground">{username}</p>
          <StarRating type="readonly" rating={rating} />
        </div>
        <p className="mb-2 text-xs text-muted-foreground">
          {formatDateTime(createdAt)}
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Comment;
