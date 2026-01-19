import { useContext, useMemo, useState } from "react";
import { FaHeart, FaRegHeart, FaCircleCheck, FaStar } from "react-icons/fa6";
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiFileText,
  FiMessageSquare,
  FiImage,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import { ErrorDisplay, Footer, Header, Helmet, Spinner } from "~/components/ui";
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
import { Button } from "~/components/ui/Button";
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
        <div className="space-y-6 lg:col-span-1">
          <div className="h-64 rounded-xl bg-card"></div>
        </div>
        <div className="space-y-6 lg:col-span-2">
          <div className="h-32 rounded-xl bg-card"></div>
          <div className="h-64 rounded-xl bg-card"></div>
        </div>
      </div>
    </div>
  </div>
);
const RATING_FILTERS = [
  { value: null, label: "all" },
  { value: 5, stars: 5 },
  { value: 4, stars: 4 },
  { value: 3, stars: 3 },
  { value: 2, stars: 2 },
  { value: 1, stars: 1 },
] as const;
const PartnerPage = () => {
  const { t } = useTranslation(["partner_page", "common"]);
  const { username } = useParams<{ username: string }>();
  const dispatch = useDispatch();
  const { toggleLoginModal } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { onlinePartners } = useSocketContext();
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const {
    data: partner,
    error: partnerError,
    isLoading: isFetchingPartner,
  } = useSWR(username ? `/user/get-partner/${username}` : null, () =>
    userService.getPartnerByUsername(username!),
  );
  const reviewParams = useMemo(() => {
    const params = new URLSearchParams({ page: String(page) });
    if (ratingFilter !== null) {
      params.set("rating", String(ratingFilter));
    }
    return params;
  }, [page, ratingFilter]);
  const { data: reviewsData } = useSWR(
    username
      ? `/review/get-reviews/${username}?${reviewParams.toString()}`
      : null,
    () => reviewService.getReviewsByUsername(username!, reviewParams),
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
  const isOnline = partner?._id ? onlinePartners.includes(partner._id) : false;
  const isLoadingAction = isFollowing || isUnfollowing;
  const handleFollowToggle = async () => {
    if (!currentUser) {
      toggleLoginModal();
      return;
    }
    if (isLoadingAction || !partner) return;
    const successMessage = isFollowed
      ? t("common:toasts.unfollowed", { username: partner.username })
      : t("common:toasts.followed", { username: partner.username });
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
  const handleRatingFilter = (rating: number | null) => {
    setRatingFilter(rating);
    setPage(1); 
  };
  if (isFetchingPartner) return <PartnerPageSkeleton />;
  if (partnerError || !partner)
    return <ErrorDisplay message={t("partner_page:error_not_found")} />;
  const reviewsFromAPI = reviewsData?.data || [];
  const paginationFromAPI = reviewsData?.pagination;
  const ratingCounts = (
    reviewsData as { ratingCounts?: Record<number, number> }
  )?.ratingCounts || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };
  const totalAllReviews = (reviewsData as { totalAll?: number })?.totalAll || 0;
  return (
    <>
      <Helmet title={`${partner.username} · CS2Boost`} />
      <Header />
      <main className="bg-background-alt pb-16">
        {/* Banner */}
        <div>
          <img
            className="h-32 w-full object-cover lg:h-96"
            src={
              partner.banner_picture ||
              "/assets/games/honkai-star-rail/banner.png"
            }
            alt="Banner"
          />
        </div>
        {/* Profile Header */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="relative flex">
              <img
                className="h-24 w-24 rounded-full object-cover ring-4 ring-card sm:h-32 sm:w-32"
                src={partner.profile_picture}
                alt={partner.username}
              />
              {/* Online Indicator */}
              {isOnline && (
                <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-card bg-green-500" />
              )}
            </div>
            <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="min-w-0 flex-1 sm:hidden md:block">
                <h1 className="flex items-center gap-2 truncate text-2xl font-bold text-foreground">
                  {partner.username}
                  <Tooltip content={t("verified_tooltip")}>
                    <FaCircleCheck className="h-5 w-5 text-success" />
                  </Tooltip>
                </h1>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isOnline ? "text-success" : "text-muted-foreground",
                  )}
                >
                  {isOnline ? t("online") : t("offline")}
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
                      <FaHeart className="mr-2" />
                      {t("unfollow_btn")}
                    </>
                  ) : (
                    <>
                      <FaRegHeart className="mr-2" />
                      {t("follow_btn")}
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
          {/* Left Column - Stats & Contact */}
          <div className="space-y-6 lg:col-span-1">
            {/* Stats Card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                {t("stats_title")}
              </h3>
              <div className="space-y-3">
                <Stats
                  icon={FaStar}
                  title={t("rating")}
                  value={partner.total_rating || 0}
                  iconColor="text-yellow-500"
                />
                <Stats
                  icon={FiUsers}
                  title={t("followers")}
                  value={partner.followers_count || 0}
                  iconColor="text-blue-500"
                />
                <Stats
                  icon={FiClock}
                  title={t("hours_boosted")}
                  value={
                    Math.round((partner.total_working_time || 0) * 100) / 100
                  }
                  iconColor="text-purple-500"
                />
                <Stats
                  icon={FiCheckCircle}
                  title={t("completion_rate")}
                  value={`${Math.round(partner.total_completion_rate || 100)}%`}
                  iconColor="text-green-500"
                />
              </div>
            </div>
            {/* Contact Card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                {t("contact_title")}
              </h3>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_MEDIA.map(
                  ({ value, translationKey, icon: Icon, color }) => {
                    const socialLink = partner.social_links?.find(
                      (l) => l.type === value,
                    );
                    if (!socialLink?.link) return null;
                    return (
                      <Tooltip
                        key={value}
                        content={t(`common:socials.${translationKey}`)}
                      >
                        <a
                          href={socialLink.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            className={cn(
                              "rounded-full text-white shadow-lg transition-transform hover:scale-110",
                              color,
                            )}
                            size="icon"
                          >
                            <Icon className="h-5 w-5" />
                          </Button>
                        </a>
                      </Tooltip>
                    );
                  },
                )}
              </div>
            </div>
          </div>
          {/* Right Column - Introduction & Reviews */}
          <div className="space-y-6 lg:col-span-2">
            {/* Introduction Card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <FiFileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {t("introduction_title")}
                </h3>
              </div>
              <Information
                details={partner.details}
                noIntroductionText={t("no_introduction")}
              />
            </div>
            {/* Reviews Card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    {t("reviews_title")}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    ({totalAllReviews})
                  </span>
                </div>
              </div>
              {/* Rating Filter Tabs */}
              <div className="mb-6 flex flex-wrap gap-2">
                {RATING_FILTERS.map((filter) => {
                  const count =
                    filter.value === null
                      ? totalAllReviews
                      : ratingCounts[filter.value] || 0;
                  const isActive = ratingFilter === filter.value;
                  return (
                    <button
                      key={filter.value ?? "all"}
                      onClick={() => handleRatingFilter(filter.value)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-muted-foreground hover:bg-accent/80 hover:text-foreground",
                      )}
                    >
                      {"stars" in filter ? (
                        <>
                          <FaStar className="h-3 w-3 text-yellow-500" />
                          <span>{filter.stars}</span>
                        </>
                      ) : (
                        <span>{t("filter_all")}</span>
                      )}
                      <span className="text-xs opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsFromAPI.length > 0 ? (
                  reviewsFromAPI.map((review: IReview) => (
                    <Comment key={review._id} {...review} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                      <FiImage className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">
                      {t("no_reviews_title")}
                    </h4>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                      {t("no_reviews_subtitle")}
                    </p>
                  </div>
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