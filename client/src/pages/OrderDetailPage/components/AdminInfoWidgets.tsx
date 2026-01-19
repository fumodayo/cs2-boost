import { Link } from "react-router-dom";
import { FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Widget, Button } from "~/components/ui";
import { IUser, IAccount, IReview } from "~/types";
import {
  isUserObject,
  isAccountObject,
  isReviewObject,
} from "~/utils/typeGuards";
import { ReviewedWidget } from "~/pages/BoostPage/components/ReviewWidget";

export const AdminUserWidget = ({ user }: { user?: IUser | string | null }) => {
  if (!user || !isUserObject(user)) return null;

  return (
    <Widget>
      <Widget.BigHeader>
        <h3 className="font-display font-semibold">Client Information</h3>
      </Widget.BigHeader>
      <div className="flex items-center space-x-4 p-4">
        <img
          src={user.profile_picture}
          alt={user.username}
          className="h-12 w-12 rounded-full"
        />
        <div>
          <p className="font-semibold text-foreground">{user.username}</p>
          <p className="text-xs text-muted-foreground">Client</p>
        </div>
      </div>
      <Widget.Footer>
        <Link to={`/admin/manage-users/${user?._id}`}>
          <Button variant="transparent" className="text-xs">
            View Profile
          </Button>
        </Link>
      </Widget.Footer>
    </Widget>
  );
};

export const AdminBoosterWidget = ({
  partner,
  assign_partner,
}: {
  partner?: IUser | string | null;
  assign_partner?: IUser | string | null;
  orderId: string;
  onUpdate: () => void;
}) => {
  const partnerUser = isUserObject(partner) ? partner : undefined;
  const assignUser = isUserObject(assign_partner) ? assign_partner : undefined;
  const booster = partnerUser || assignUser;

  return (
    <Widget>
      <Widget.BigHeader>
        <h3 className="font-display font-semibold">Booster Information</h3>
      </Widget.BigHeader>
      {booster ? (
        <div className="flex items-center space-x-4 p-4">
          <img
            src={booster.profile_picture}
            alt={booster.username}
            className="h-12 w-12 rounded-full"
          />
          <div>
            <p className="font-semibold text-foreground">{booster.username}</p>
            <p className="text-xs text-muted-foreground">
              {partner ? "Currently Boosting" : "Assigned"}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center">
          <FaUsers className="mx-auto mb-2 text-muted-foreground" size={24} />
          <p className="text-sm font-medium">No booster assigned</p>
          <p className="text-xs text-muted-foreground">
            Assign a booster to start this order.
          </p>
        </div>
      )}
      <Widget.Footer>
        <Link to={`/admin/manage-users/${booster?._id}`}>
          <Button variant="transparent" className="text-xs">
            View Profile
          </Button>
        </Link>
      </Widget.Footer>
    </Widget>
  );
};

export const AdminAccountWidget = ({
  account,
}: {
  account?: IAccount | string | null;
}) => {
  const accountData = isAccountObject(account) ? account : undefined;
  const isAccountProvided = accountData && Object.keys(accountData).length > 0;

  return (
    <Widget>
      <Widget.BigHeader>
        <h3 className="font-display font-semibold">Game Account Status</h3>
      </Widget.BigHeader>
      <div className="flex items-center space-x-3 p-4">
        {isAccountProvided ? (
          <>
            <FaCheckCircle className="text-green-500" />
            <p className="text-sm text-foreground">
              Account credentials provided.
            </p>
          </>
        ) : (
          <>
            <FaTimesCircle className="text-red-500" />
            <p className="text-sm text-foreground">
              Account credentials not provided yet.
            </p>
          </>
        )}
      </div>
    </Widget>
  );
};

export const AdminReviewWidget = ({
  review,
}: {
  review?: IReview | string | null;
}) => {
  const reviewData = isReviewObject(review) ? review : undefined;

  if (!reviewData) {
    return (
      <Widget>
        <Widget.BigHeader>
          <h3 className="font-display font-semibold">Review</h3>
        </Widget.BigHeader>
        <div className="p-4 text-center text-sm text-muted-foreground">
          No review has been submitted for this order yet.
        </div>
      </Widget>
    );
  }
  return <ReviewedWidget {...reviewData} onUpdate={() => {}} />;
};