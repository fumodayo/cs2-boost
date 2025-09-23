import { useContext, useMemo, useState } from "react";
import { FaHeart, FaRegHeart, FaCircleCheck } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import {
  ErrorDisplay,
  Footer,
  Header,
  Helmet,
  Spinner,
} from "~/components/shared";
import { AppContext } from "~/components/context/AppContext";
import { useSocketContext } from "~/hooks/useSocketContext";
import cn from "~/libs/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { updateSuccess } from "~/redux/user/userSlice";
import toast from "react-hot-toast";
import getErrorMessage from "~/utils/errorHandler";
import { Comment, Information, Pagination, Stats } from "./components";
import Tooltip from "~/components/@radix-ui/Tooltip";
import { SOCIAL_MEDIA } from "~/constants/user";
import { Button } from "~/components/shared/Button";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { reviewService } from "~/services/review.service";
import { userService } from "~/services/user.service";
import { IReview } from "~/types";

const PartnerPageSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-48 bg-card-alt"></div>
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
        <div className="flex">
          <div className="h-24 w-24 rounded-full bg-card-alt ring-4 ring-card sm:h-32 sm:w-32"></div>
        </div>
        <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
          <div className="min-w-0 flex-1 space-y-2 sm:hidden md:block">
            <div className="h-8 w-48 rounded-md bg-card-alt"></div>
            <div className="h-4 w-24 rounded-md bg-card-alt"></div>
          </div>
          <div className="h-10 w-32 rounded-full bg-card-alt"></div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-24 rounded-xl bg-card"></div>
          <div className="h-64 rounded-xl bg-card"></div>
        </div>
        <div className="h-96 rounded-xl bg-card lg:col-span-1"></div>
      </div>
    </div>
  </div>
);

const PartnerPage = () => {
  const { t } = useTranslation();
  const { username } = useParams<{ username: string }>();
  const dispatch = useDispatch();
  const { toggleLoginModal } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { onlinePartners } = useSocketContext();
  const [page, setPage] = useState(1);

  const {
    data: partner,
    error: partnerError,
    isLoading: isFetchingPartner,
  } = useSWR(username ? `/user/get-partner/${username}` : null, () =>
    userService.getPartnerByUsername(username!),
  );

  const { data: reviewsData } = useSWR(
    username ? `/review/get-reviews/${username}?page=${page}` : null,
    () =>
      reviewService.getReviewsByUsername(
        username!,
        new URLSearchParams({ page: String(page) }),
      ),
    { keepPreviousData: true },
  );

  const { trigger: triggerFollow, isMutating: isFollowing } = useSWRMutation(
    partner ? `/user/follow/${partner._id}` : null,
    () => userService.followPartner(partner!._id),
  );
  const { trigger: triggerUnfollow, isMutating: isUnfollowing } =
    useSWRMutation(partner ? `/user/unfollow/${partner._id}` : null, () =>
      userService.unfollowPartner(partner!._id),
    );

  const isFollowed = useMemo(
    () => currentUser?.following?.some((p) => p._id === partner?._id),
    [currentUser, partner],
  );
  const isOnline = partner
    ? onlinePartners.includes(partner._id as string)
    : false;
  const isLoadingAction = isFollowing || isUnfollowing;

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toggleLoginModal();
      return;
    }
    if (isLoadingAction || !partner) return;

    const successMessage = isFollowed
      ? t("Toast.unfollowed", { username: partner.username })
      : t("Toast.followed", { username: partner.username });

    try {
      const { data } = isFollowed
        ? await triggerUnfollow()
        : await triggerFollow();

      dispatch(updateSuccess(data));
      toast.success(successMessage);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isFetchingPartner) return <PartnerPageSkeleton />;
  if (partnerError || !partner)
    return <ErrorDisplay message="Partner not found." />;

  const reviewsFromAPI = reviewsData?.data || [];
  const paginationFromAPI = reviewsData?.pagination;

  return (
    <>
      <Helmet title={`${partner.username} · CS2Boost`} />
      <Header />
      <main className="bg-background-alt pb-16">
        {/* Banner */}
        <div>
          <img
            className="h-32 w-full object-cover lg:h-48"
            src="/assets/games/honkai-star-rail/banner.png"
            alt="Banner"
          />
        </div>

        {/* Profile Header */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <img
                className="h-24 w-24 rounded-full object-cover ring-4 ring-card sm:h-32 sm:w-32"
                src={partner.profile_picture}
                alt={partner.username}
              />
            </div>
            <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="min-w-0 flex-1 sm:hidden md:block">
                <h1 className="flex items-center gap-2 truncate text-2xl font-bold text-foreground">
                  {partner.username}
                  <Tooltip content={t("PartnerPage.verifiedTooltip")}>
                    <FaCircleCheck className="h-5 w-5 text-success" />
                  </Tooltip>
                </h1>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isOnline ? "text-success" : "text-muted-foreground",
                  )}
                >
                  {isOnline
                    ? t("PartnerPage.online")
                    : t("PartnerPage.offline")}
                </p>
              </div>
              <div className="flex flex-col items-stretch justify-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button
                  variant={isFollowed ? "secondary" : "primary"}
                  onClick={handleFollowToggle}
                  disabled={isLoadingAction}
                  className="rounded-full px-5 py-2"
                >
                  {isLoadingAction ? (
                    <Spinner size="sm" />
                  ) : isFollowed ? (
                    <>
                      <FaHeart className="mr-2" />{" "}
                      {t("PartnerPage.unfollowBtn")}
                    </>
                  ) : (
                    <>
                      <FaRegHeart className="mr-2" />{" "}
                      {t("PartnerPage.followBtn")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
            <h1 className="truncate text-2xl font-bold text-foreground">
              {partner.username}
            </h1>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <h3 className="mb-3 font-semibold text-foreground">
                {t("PartnerPage.statsTitle")}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <Stats
                  title={t("PartnerPage.rating")}
                  value={partner.total_rating || 0}
                />
                <Stats
                  title={t("PartnerPage.followers")}
                  value={partner.followers_count || 0}
                />
                <Stats
                  title={t("PartnerPage.hoursBoosted")}
                  value={partner.total_working_time || 0}
                />
                <Stats
                  title={t("PartnerPage.completionRate")}
                  value={`${partner.total_completion_rate || 100}%`}
                />
              </div>
            </div>
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <h3 className="mb-3 font-semibold text-foreground">
                Contact via
              </h3>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_MEDIA.map(({ value, label, icon: Icon, color }) => {
                  const socialLink = partner.social_links?.find(
                    (l) => l.type === value,
                  );
                  if (!socialLink?.link) return null;
                  return (
                    <Tooltip content={label}>
                      <a
                        key={value}
                        href={socialLink.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          className={cn(
                            "rounded-full text-white shadow",
                            color,
                          )}
                          size="icon"
                        >
                          <Icon className="h-5 w-5" />
                        </Button>
                      </a>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <h3 className="mb-2 font-semibold text-foreground">
                {t("PartnerPage.introductionTitle")}
              </h3>
              <Information details={partner.details} />
            </div>
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <h3 className="mb-4 font-semibold text-foreground">
                {t("PartnerPage.reviewsTitle", {
                  count: paginationFromAPI?.total || 0,
                })}
              </h3>
              <div className="space-y-6">
                {reviewsFromAPI.length > 0 ? (
                  reviewsFromAPI.map((review: IReview) => (
                    <Comment key={review._id} {...review} />
                  ))
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    {t("PartnerPage.noReviews")}
                  </p>
                )}
              </div>
              {paginationFromAPI && paginationFromAPI.totalPages > 0 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={paginationFromAPI.totalPages}
                    setPage={setPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PartnerPage;
