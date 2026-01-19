import React from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCheckCircle,
  FaStar,
  FaTasks,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import { format } from "date-fns";
import {
  BigTooltip,
  BigTooltipContent,
  BigTooltipTrigger,
} from "~/components/@radix-ui/BigTooltip";
import { Button } from "~/components/ui/Button";
import { IUser } from "~/types";
import { ROLE } from "~/types/constants";
import { useTranslation } from "react-i18next";

const StatItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center text-xs">
    <div className="mr-2 text-muted-foreground">{icon}</div>
    <span className="font-medium text-muted-foreground">{label}:</span>
    <span className="ml-auto font-semibold text-foreground">{value}</span>
  </div>
);

interface UserTooltipProps {
  user: IUser;
  children: React.ReactNode;
}

const UserTooltip: React.FC<UserTooltipProps> = ({ user, children }) => {
  const { t } = useTranslation("profile");

  const isAdmin = window.location.href.includes("/admin");
  const directUrl = isAdmin
    ? `/admin/manage-users/${user._id}`
    : `/partner/${user.username}`;

  return (
    <BigTooltip>
      <BigTooltipTrigger>{children}</BigTooltipTrigger>
      <BigTooltipContent>
        <div className="relative h-24 w-full overflow-hidden">
          <img
            src={user.profile_picture}
            alt={`${user.username}'s background`}
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-sm transition-transform duration-300 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" />
        </div>
        <div className="relative -mt-10 px-4">
          <img
            src={user.profile_picture}
            alt={user.username}
            className="h-20 w-20 rounded-full border-4 border-card object-cover ring-2 ring-border"
          />
        </div>

        <div className="p-4 pt-2">
          <h3 className="text-lg font-bold">{user.username}</h3>
          <p className="text-sm text-muted-foreground">{user.email_address}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("user_tooltip.joined")}:{" "}
            {format(new Date(user.createdAt), "dd MMM yyyy")}
          </p>

          <div className="my-4 space-y-2 border-y border-border py-3">
            {user.role.includes(ROLE.PARTNER) ? (
              <>
                <StatItem
                  icon={<FaCheckCircle />}
                  label={t("user_tooltip.partner_stats.verified")}
                  value={
                    user.is_verified
                      ? t("user_tooltip.partner_stats.yes")
                      : t("user_tooltip.partner_stats.no")
                  }
                />
                <StatItem
                  icon={<FaStar />}
                  label={t("user_tooltip.partner_stats.rating")}
                  value={`${user.total_rating.toFixed(1)} (${user.total_reviews} ${t("user_tooltip.partner_stats.reviews")})`}
                />
                <StatItem
                  icon={<FaTasks />}
                  label={t("user_tooltip.partner_stats.completion_rate")}
                  value={`${user.total_completion_rate}%`}
                />
                <StatItem
                  icon={<FaUsers />}
                  label={t("user_tooltip.partner_stats.followers")}
                  value={user.followers_count}
                />
              </>
            ) : (
              <StatItem
                icon={<FaUser />}
                label={t("user_tooltip.role")}
                value={
                  user.role.includes(ROLE.ADMIN)
                    ? t("user_tooltip.admin_role")
                    : t("user_tooltip.client_role")
                }
              />
            )}
          </div>

          <Link to={directUrl}>
            <Button variant="secondary" size="sm" className="w-full gap-2">
              {t("user_tooltip.view_profile")} <FaArrowRight />
            </Button>
          </Link>
        </div>
      </BigTooltipContent>
    </BigTooltip>
  );
};

export default UserTooltip;