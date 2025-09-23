import React from "react";
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";
import { FaCheckCircle, FaStar, FaUserMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "~/components/shared/Button";
import { updateSuccess } from "~/redux/user/userSlice";
import { IUser } from "~/types";
import getErrorMessage from "~/utils/errorHandler";
import { useSocketContext } from "~/hooks/useSocketContext";
import { Spinner } from "~/components/shared";
import { FaCircle } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { userService } from "~/services/user.service";

const UNFOLLOW_KEY = (partnerId: string) => `/user/unfollow/${partnerId}`;

const Card = (partner: IUser) => {
  const { t } = useTranslation();
  const { _id, username, profile_picture, total_rating, followers_count } =
    partner;
  const { onlinePartners } = useSocketContext();
  const isOnline = onlinePartners.includes(_id as string);
  const dispatch = useDispatch();

  const { trigger, isMutating: isUnfollowing } = useSWRMutation(
    UNFOLLOW_KEY(_id),
    () => userService.unfollowPartner(_id),
  );

  const handleUnFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const { data } = await trigger();
      dispatch(updateSuccess(data));
      toast.success(`Unfollowed ${username}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
      <Link to={`/partner/${username}`} className="block">
        <div className="relative h-24 w-full overflow-hidden">
          <img
            src={profile_picture}
            alt={`${username}'s background`}
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-sm transition-transform duration-300 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" />
        </div>
        <div className="relative -mt-12 px-4">
          <img
            src={profile_picture}
            alt={username}
            className="mx-auto h-24 w-24 rounded-full border-4 border-card object-cover ring-2 ring-border"
          />
        </div>
        <div className="p-4 pt-2 text-center">
          <h3 className="flex items-center justify-center gap-1.5 text-lg font-bold text-foreground">
            {username}
            <FaCheckCircle
              className="text-sm text-blue-500"
              title={t("FollowPartnersPage.Card.verifiedTooltip")}
            />
          </h3>
          <div
            className={`mt-1 flex items-center justify-center text-xs font-semibold ${isOnline ? "text-green-500" : "text-muted-foreground"}`}
          >
            <FaCircle size={8} className="mr-1.5" />
            {isOnline
              ? t("FollowPartnersPage.Card.online")
              : t("FollowPartnersPage.Card.offline")}
          </div>
          <div className="mt-4 flex justify-around border-t border-border pt-3 text-sm">
            <div className="text-center">
              <p className="flex items-center justify-center gap-1 font-bold text-foreground">
                <FaStar className="text-yellow-400" />
                {total_rating?.toFixed(1) || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("FollowPartnersPage.Card.rating")}
              </p>
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground">{followers_count}</p>
              <p className="text-xs text-muted-foreground">
                {t("FollowPartnersPage.Card.followers")}
              </p>
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute inset-x-0 bottom-0 p-4 pt-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button
          variant="danger"
          size="sm"
          className="w-full gap-2"
          onClick={handleUnFollow}
          disabled={isUnfollowing}
        >
          {isUnfollowing ? <Spinner size="sm" /> : <FaUserMinus />}
          {t("FollowPartnersPage.Card.unfollowBtn")}
        </Button>
      </div>
    </div>
  );
};

export default Card;
