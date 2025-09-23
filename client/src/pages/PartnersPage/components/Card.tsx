import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import {
  FiCheckCircle,
  FiPercent,
  FiMessageSquare,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { useSocketContext } from "~/hooks/useSocketContext";
import { IUser } from "~/types";
import { useTranslation } from "react-i18next";

const StatItem = ({
  icon: Icon,
  value,
  label,
}: {
  icon: IconType;
  value: string | number;
  label: string;
}) => (
  <div className="flex flex-col items-center rounded-lg bg-accent p-2 text-center">
    <div className="flex items-center gap-1.5 font-bold text-foreground">
      <Icon className="h-4 w-4 text-primary" />
      <span>{value}</span>
    </div>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

const Card = (partner: IUser) => {
  const { t } = useTranslation();
  const { onlinePartners } = useSocketContext();
  const isOnline = onlinePartners.includes(partner._id as string);

  return (
    <Link
      to={`/partner/${partner.username}`}
      className="group block outline-none"
      title={`${t("PartnersPage.Card.viewProfileTooltip")}`}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 ease-in-out group-hover:-translate-y-1.5 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
        <div className="relative h-28 bg-gradient-to-br from-muted to-accent">
          <img
            className="h-full w-full object-cover"
            src={partner.profile_picture}
          />
          {isOnline && (
            <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-400 ring-1 ring-green-500/30">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              {t("PartnersPage.Card.online")}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="absolute left-4 top-[88px] flex h-20 w-20 items-center justify-center rounded-full border-4 border-card bg-card p-1">
          <img
            className="h-full w-full rounded-full object-cover"
            src={partner.profile_picture}
            alt={`${partner.username}'s avatar`}
          />
        </div>
        <div className="flex flex-grow flex-col px-4 pb-4 pt-12">
          <div className="min-h-[80px]">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-lg font-bold text-foreground">
                {partner.full_name || partner.username}
              </h3>
              {partner.is_verified && (
                <FiCheckCircle
                  className="h-5 w-5 shrink-0 text-primary"
                  title={t("PartnersPage.Card.verifiedTooltip")}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{partner.username}</p>
            <div className="relative mt-2 h-12">
              <p className="text-sm text-foreground">
                {partner.details || t("PartnersPage.Card.noBio")}
              </p>
            </div>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
            <StatItem
              icon={FaStar}
              value={partner.total_rating?.toFixed(1) ?? "0.0"}
              label={t("PartnersPage.Card.rating")}
            />
            <StatItem
              icon={FiPercent}
              value={`${partner.total_completion_rate}%`}
              label={t("PartnersPage.Card.completion")}
            />
            <StatItem
              icon={FiMessageSquare}
              value={String(partner.total_reviews)}
              label={t("PartnersPage.Card.reviews")}
            />
            <StatItem
              icon={FiUsers}
              value={partner.followers_count}
              label={t("PartnersPage.Card.followers")}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-border bg-accent/30 px-4 py-3 text-center text-sm font-semibold text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {t("PartnersPage.Card.viewProfileBtn")}{" "}
          <FiArrowRight className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default Card;
