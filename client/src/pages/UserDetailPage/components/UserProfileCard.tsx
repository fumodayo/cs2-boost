import React from "react";
import { format } from "date-fns";
import { IUser } from "~/types";
import { ROLE } from "~/types/constants";
import { useTranslation } from "react-i18next";

const StatItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between text-sm">
    <p className="text-muted-foreground">{label}</p>
    <p className="font-semibold text-foreground">{value}</p>
  </div>
);

const UserProfileCard: React.FC<{ user: IUser }> = ({ user }) => {
  const { t } = useTranslation();
  const isPartner = user.role.includes(ROLE.PARTNER);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.profile_picture}
          alt={user.username}
          className="h-28 w-28 rounded-full border-4 border-background object-cover shadow-lg"
        />
        <h2 className="mt-4 text-xl font-bold text-foreground">
          {user.username}
        </h2>
        <p className="text-muted-foreground">{user.email_address}</p>
        <div className="mt-2 flex gap-2">
          {user.role.map((r) => (
            <span
              key={r}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary"
            >
              {r.toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="my-6 space-y-3 border-y border-border py-4">
        <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
          {t("UserDetailsPage.ProfileCard.userInfoTitle")}
        </h3>
        <StatItem
          label={t("UserDetailsPage.ProfileCard.fullName")}
          value={user.full_name || "N/A"}
        />
        <StatItem
          label={t("UserDetailsPage.ProfileCard.status")}
          value={
            user.is_banned
              ? t("UserDetailsPage.ProfileCard.banned")
              : t("UserDetailsPage.ProfileCard.active")
          }
        />
        <StatItem
          label={t("UserDetailsPage.ProfileCard.joined")}
          value={format(new Date(user.createdAt), "dd MMM, yyyy")}
        />
      </div>

      {isPartner && (
        <div className="space-y-3">
          <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
            {t("UserDetailsPage.ProfileCard.partnerStatsTitle")}
          </h3>
          <StatItem
            label={t("UserDetailsPage.ProfileCard.rating")}
            value={`${user.total_rating.toFixed(1)} (${t("UserDetailsPage.ProfileCard.reviews", { count: user.total_reviews })})`}
          />
          <StatItem
            label={t("UserDetailsPage.ProfileCard.completion")}
            value={`${user.total_completion_rate}%`}
          />
          <StatItem
            label={t("UserDetailsPage.ProfileCard.followers")}
            value={user.followers_count}
          />
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;
