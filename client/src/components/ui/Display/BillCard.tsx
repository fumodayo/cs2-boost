import { useContext, useMemo, useState } from "react";
import { GoClockFill } from "react-icons/go";
import { FiGlobe } from "react-icons/fi";
import { IconType } from "react-icons";

import Switch from "~/components/@radix-ui/Switch";
import { Chip } from "~/components/ui/Display";
import { formatMoney } from "~/utils";
import { IExtraOption } from "~/types";
import { AppContext } from "~/components/context/AppContext";
import cn from "~/libs/utils";
import { Spinner } from "~/components/ui/Feedback";
import { Button } from "~/components/ui/Button";
import useExchangeRate from "~/hooks/useExchangeRate";
import { useTranslation } from "react-i18next";

interface DisplayItem {
  labelKey: string;
  value: string | number;
  imageUrl?: string;
}

interface IBillCardProps {
  modeIcon: IconType;
  modeLabelKey: string;
  serverLabelKey?: string;
  serverIcon?: IconType;
  displayItems: {
    begin: DisplayItem;
    end: DisplayItem;
  };
  baseCost: number;
  totalTime?: number;
  extraOptions: IExtraOption[];
  isCheckoutDisabled: boolean;
  onCheckout: (selectedOptions: IExtraOption[], finalCost: number) => void;
  isLoading?: boolean;
}

const Option = ({
  name,
  label,
  isChecked,
  onToggle,
}: IExtraOption & { isChecked: boolean; onToggle: () => void }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <label className="font-medium text-foreground">{name}</label>
        <Chip>+ {label}</Chip>
      </div>
      <Switch checked={isChecked} onCheckedChange={onToggle} />
    </div>
  );
};

const BillCard: React.FC<IBillCardProps> = ({
  baseCost,
  totalTime,
  displayItems,
  modeIcon: ModeIcon,
  modeLabelKey,
  serverIcon: ServerIcon,
  serverLabelKey,
  extraOptions,
  isCheckoutDisabled,
  onCheckout,
  isLoading,
}) => {
  const { t } = useTranslation(["common", "level_farming"]);
  const { currency } = useContext(AppContext);
  const [selectedOptions, setSelectedOptions] = useState<IExtraOption[]>([]);
  const vndToUsdRate = useExchangeRate("vnd", "usd");

  const handleToggle = (option: IExtraOption) => {
    setSelectedOptions((prev) =>
      prev.some((item) => item.name === option.name)
        ? prev.filter((item) => item.name !== option.name)
        : [...prev, option],
    );
  };
  const finalCostInVND = useMemo(() => {
    const optionsCost = selectedOptions.reduce(
      (acc, option) => acc + baseCost * option.value,
      0,
    );
    return Math.round((baseCost + optionsCost) / 1000) * 1000;
  }, [baseCost, selectedOptions]);

  const convertedTotalCostForDisplay = useMemo(() => {
    if (currency === "usd" && vndToUsdRate) {
      return finalCostInVND * vndToUsdRate;
    }
    return finalCostInVND;
  }, [finalCostInVND, currency, vndToUsdRate]);

  const handleCheckoutClick = () => {
    onCheckout(selectedOptions, finalCostInVND);
  };

  const hasSelectedServer = !!serverLabelKey;

  return (
    <aside className="lg:col-span-2 xl:col-span-2">
      <div className="sticky top-24 w-full max-w-[540px] rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-center text-xl font-bold text-foreground">
          {t("bill_card.header")}
        </h3>

        {!hasSelectedServer ? (
          <div className="mt-4 flex flex-col items-center justify-center text-center">
            <p className="my-8 font-semibold text-yellow-500">
              {t("bill_card.title_prompt")}
            </p>
            <div className="w-full border-t border-border pt-4">
              <p className="text-lg font-semibold text-foreground">
                {t("bill_card.total_price")}:
              </p>
              <span className="text-4xl font-bold tracking-tight text-muted-foreground">
                {formatMoney(0, currency)}
              </span>
            </div>
            <Button
              disabled={true}
              size="lg"
              className="text-md mt-4 w-full font-semibold"
            >
              {t("buttons.checkout")} →
            </Button>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "-mx-6 my-4 rounded-lg bg-accent p-4 transition-opacity duration-300",
                isCheckoutDisabled ? "opacity-50" : "opacity-100",
              )}
            >
              <div className="flex items-center justify-around text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {t(`labels.${displayItems.begin.labelKey}`)}
                  </span>
                  {displayItems.begin.imageUrl ? (
                    <img
                      className="h-10 w-auto"
                      src={displayItems.begin.imageUrl}
                      alt={String(displayItems.begin.value)}
                    />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {displayItems.begin.value}
                    </p>
                  )}
                </div>
                <span className="text-xl font-light text-muted-foreground">
                  →
                </span>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {t(`labels.${displayItems.end.labelKey}`)}
                  </span>
                  {displayItems.end.imageUrl ? (
                    <img
                      className="h-10 w-auto"
                      src={String(displayItems.end.imageUrl)}
                      alt={String(displayItems.end.value)}
                    />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {displayItems.end.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="my-4 rounded-lg border-y border-border py-2">
              <h4 className="mb-2 text-center text-sm font-semibold text-muted-foreground">
                {t("bill_card.extra_options_heading")}
              </h4>
              {extraOptions.map((option) => (
                <Option
                  key={option.name}
                  {...option}
                  name={t(
                    `bill_card.options.${option.name.toLowerCase().replace(/ /g, "_")}`,
                  )}
                  isChecked={selectedOptions.some(
                    (item) => item.name === option.name,
                  )}
                  onToggle={() => handleToggle(option)}
                />
              ))}
            </div>
            {totalTime && totalTime > 0 && (
              <div className="mb-4 flex items-center justify-center rounded-md bg-accent p-2 text-center text-sm font-semibold text-muted-foreground">
                <GoClockFill className="mr-2" /> {t("bill_card.estimated_time")}
                :
                <span className="ml-1 text-foreground">
                  ~ {totalTime <= 60 ? 1 : Math.floor(totalTime / 60)}{" "}
                  {t("bill_card.hours")}
                </span>
              </div>
            )}
            <div className="my-4 flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-muted-foreground">
                <ModeIcon className="text-primary" />{" "}
                <span>{t(modeLabelKey)}</span>
              </div>
              {ServerIcon && serverLabelKey && (
                <div className="flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-muted-foreground">
                  <ServerIcon className="text-primary" />{" "}
                  <span>{t(serverLabelKey)}</span>
                </div>
              )}
            </div>
            <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
              <p className="text-lg font-semibold text-foreground">
                {t("bill_card.total_price")}:
              </p>
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {currency === "usd" && vndToUsdRate === undefined ? (
                  <Spinner size="sm" />
                ) : (
                  formatMoney(convertedTotalCostForDisplay, currency)
                )}
              </span>
            </div>
            <Button
              disabled={isCheckoutDisabled || isLoading}
              size="lg"
              className="text-md mt-4 w-full font-semibold"
              onClick={handleCheckoutClick}
            >
              {isLoading ? (
                <Spinner color="white" />
              ) : (
                `${t("buttons.checkout")} →`
              )}
            </Button>
          </>
        )}
        <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-semibold text-muted-foreground">
          <FiGlobe />
          {t("bill_card.vpn_warning")}
        </div>
      </div>
    </aside>
  );
};

export default BillCard;