import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import { FaArrowRight } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import {
  BigTooltip,
  BigTooltipContent,
  BigTooltipTrigger,
} from "~/components/@radix-ui/BigTooltip";
import { Button } from "~/components/ui/Button";
import { listOfStatus } from "~/constants/order";
import { IOrder } from "~/types";
import RowTable from "./RowTable";

const RowBoost: React.FC<{ isAdmin?: boolean; boost: IOrder }> = ({
  isAdmin,
  boost,
}) => {
  const { t } = useTranslation(["datatable", "common"]);
  const { game, title, type, status, boost_id } = boost;
  const currentStatus = listOfStatus.filter((item) => item.value === status);

  const directBoost = isAdmin
    ? `/admin/manage-orders/${boost_id}`
    : `/orders/boosts/${boost_id}`;

  const translatedType = t(`game_modes.${type}`, {
    ns: "common",
    defaultValue: type,
  });

  return (
    <RowTable>
      <BigTooltip>
        <BigTooltipTrigger>
          <Link to={directBoost} className="inline-flex">
            <div className="flex max-w-[350px] items-center">
              <div className="relative flex size-10 shrink-0 items-center">
                <div className="absolute flex size-10 items-center justify-center rounded-md bg-secondary p-1 text-secondary-foreground ring-1 ring-border">
                  <HiMiniRocketLaunch size={20} />
                </div>
                <img
                  src={`/assets/games/${game}/logo.png`}
                  className="absolute -bottom-1 -right-1 size-5 object-contain"
                  alt="game logo"
                />
              </div>
              <div className="ml-2.5 truncate">
                <h2 className="truncate text-sm font-medium text-foreground">
                  {title}
                </h2>
                <p className="truncate text-xs capitalize text-muted-foreground">
                  {translatedType} {t("tooltip.boost_suffix")}
                </p>
              </div>
            </div>
          </Link>
        </BigTooltipTrigger>
        <BigTooltipContent>
          <div className="w-lg">
            {/* HEADER */}
            <div className="-mx-3 -mt-1.5 flex items-start gap-x-2 border-b bg-secondary px-3 pb-2 pt-3">
              <img
                className="size-7 shrink-0 object-contain shadow-sm"
                src="/assets/games/counter-strike-2/logo.png"
                alt="logo"
              />
              <div className="flex flex-col">
                <h3 className="text-xs">{title}</h3>
                <p className="text-xs text-muted-foreground">
                  {translatedType} {t("tooltip.boost_suffix")}
                </p>
              </div>
            </div>
            <div className="py-2">
              {/* CONTENT */}
              <div className="flex w-full items-baseline justify-between gap-x-2.5 py-2">
                <dt className="shrink-0 text-xs font-medium text-foreground">
                  {t("headers.id")}:
                </dt>
                <hr className="w-full border-dashed" />
                <div className="shrink-0 text-xs font-medium capitalize text-muted-foreground">
                  #{boost_id}
                </div>
              </div>
              <div className="flex w-full items-baseline justify-between gap-x-2.5 py-2">
                <dt className="shrink-0 text-xs font-medium capitalize text-foreground">
                  {t("headers.type")}:
                </dt>
                <hr className="w-full border-dashed" />
                <div className="shrink-0 text-xs font-medium capitalize text-muted-foreground">
                  {translatedType} {t("tooltip.boost_suffix")}
                </div>
              </div>
              <div className="flex w-full items-baseline justify-between gap-x-2.5 py-2">
                <dt className="shrink-0 text-xs font-medium capitalize text-foreground">
                  {t("headers.status")}:
                </dt>
                <hr className="w-full border-dashed" />
                {currentStatus.map(({ icon: Icon, translationKey }) => (
                  <div
                    key={uuidv4()}
                    className="flex shrink-0 text-xs font-medium capitalize text-secondary-light-foreground"
                  >
                    {Icon && <Icon className="mr-1" />}
                    {t(`order_statuses.${translationKey}`)}
                  </div>
                ))}
              </div>
              {/* FOOTER */}
              <Link to={directBoost}>
                <Button
                  variant="secondary"
                  className="mt-4 w-full rounded-md px-2 py-1.5 text-xs"
                >
                  {t("tooltip.view_boost")}
                  <FaArrowRight className="ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </BigTooltipContent>
      </BigTooltip>
    </RowTable>
  );
};

export default RowBoost;