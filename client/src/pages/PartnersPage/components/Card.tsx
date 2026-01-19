import { Link } from "react-router-dom";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { useSocketContext } from "~/hooks/useSocketContext";
import { IUser } from "~/types";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/Button";

const Card = (partner: IUser) => {
  const { t } = useTranslation("partners_page");
  const { onlinePartners } = useSocketContext();
  const isOnline = partner._id ? onlinePartners.includes(partner._id) : false;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
      {/* Banner Image */}
      <div className="relative h-40 bg-gradient-to-br from-muted to-accent">
        <img
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          src={
            partner.banner_picture ||
            "/assets/games/honkai-star-rail/banner.png"
          }
          alt={`${partner.username}'s banner`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badge */}
        {isOnline ? (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            {t("card.online")}
          </div>
        ) : (
          partner.is_verified && (
            <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
              <FiCheckCircle className="h-3 w-3" />
              {t("card.verified")}
            </div>
          )
        )}

        {/* Avatar Badge */}
        <img
          src={partner.profile_picture}
          alt={partner.username}
          className="absolute -bottom-6 left-4 h-14 w-14 rounded-xl border-4 border-card object-cover shadow-lg"
        />
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col px-4 pb-4 pt-10">
        {/* Name & Category */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold text-foreground">
              {partner.full_name || partner.username}
            </h3>
            {partner.is_verified && !isOnline && (
              <FiCheckCircle className="h-4 w-4 shrink-0 text-primary" />
            )}
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {t("card.partner_label")}
          </p>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 flex-grow text-sm text-muted-foreground">
          {partner.details || t("card.no_bio")}
        </p>

        {/* Stats Row */}
        <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">
              {partner.total_rating?.toFixed(1) ?? "0.0"}
            </span>
            <span>★</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div>
            <span className="font-semibold text-foreground">
              {(partner.total_orders_completed ?? 0) === 0
                ? 0
                : partner.total_completion_rate}
              %
            </span>{" "}
            {t("card.completion_short")}
          </div>
          <div className="h-3 w-px bg-border" />
          <div>
            <span className="font-semibold text-foreground">
              {partner.followers_count}
            </span>{" "}
            {t("card.followers_short")}
          </div>
        </div>

        {/* Action Button */}
        <Link to={`/partner/${partner.username}`} className="mt-auto block">
          <Button
            variant="outline"
            className="w-full gap-2 p-2 transition-all group-hover:bg-primary group-hover:text-primary-foreground"
          >
            {t("card.view_profile_btn")}
            <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Card;