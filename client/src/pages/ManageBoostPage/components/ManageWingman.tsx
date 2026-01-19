import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import * as Accordion from "@radix-ui/react-accordion";
import { toast } from "react-hot-toast";
import { FiChevronDown, FiRotateCcw, FiSettings } from "react-icons/fi";
import { ErrorDisplay, Input, Spinner } from "~/components/ui";
import { Select } from "~/components/ui/Form";
import { formatMoney } from "~/utils";
import cn from "~/libs/utils";
import {
  IWingmanRatesConfig,
  IWingmanRegionRates,
  IUpdateWingmanConfigPayload,
  IUpdateWingmanRegionPayload,
} from "~/types";
import { Button } from "~/components/ui/Button";
import { FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { rateService } from "~/services/rate.service";
import { HiOutlineCalculator } from "react-icons/hi2";

const GET_WINGMAN_RATES_KEY = "/rates/get-wingman-rates";
const UPDATE_WINGMAN_CONFIG_KEY = "/rates/update-wingman-config";
const UPDATE_WINGMAN_REGION_KEY = "/rates/update-wingman-rates";

const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="h-24 animate-pulse rounded-xl bg-card"></div>
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-card"></div>
      ))}
    </div>
  </div>
);

interface WingmanRegionAccordionItemProps {
  originalRegion: IWingmanRegionRates;
  editedRegion: IWingmanRegionRates;
  unitPrice: number;
  isOpen: boolean;
  isSaving: boolean;
  onRegionChange: (updatedRegion: IWingmanRegionRates) => void;
  onSave: (regionToSave: IWingmanRegionRates) => Promise<void>;
  onReset: () => void;
}

const WingmanRegionAccordionItem = ({
  originalRegion,
  editedRegion,
  unitPrice,
  isOpen,
  isSaving,
  onRegionChange,
  onSave,
  onReset,
}: WingmanRegionAccordionItemProps) => {
  const { t } = useTranslation(["manage_boost_page", "common"]);

  const isDirty = useMemo(
    () => JSON.stringify(originalRegion) !== JSON.stringify(editedRegion),
    [originalRegion, editedRegion],
  );

  const handleRateChange = (rankIndex: number, value: string) => {
    const newRegion = { ...editedRegion, rates: [...editedRegion.rates] };
    newRegion.rates[rankIndex] = {
      ...newRegion.rates[rankIndex],
      rate: parseFloat(value) || 0,
    };
    onRegionChange(newRegion);
  };

  const handleSaveClick = async () => {
    await onSave(editedRegion);
  };

  return (
    <Accordion.Item
      value={editedRegion.value}
      className={cn(
        "overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300",
        isOpen ? "border-primary/50" : "border-border",
      )}
    >
      <Accordion.Header>
        <Accordion.Trigger
          className={cn(
            "group flex w-full items-center justify-between p-4 font-medium transition-colors",
            {
              "bg-primary text-primary-foreground hover:bg-primary/90": isOpen,
              "hover:bg-accent": !isOpen,
            },
          )}
        >
          <div className="flex items-center gap-3">
            <div
              title={isDirty ? t("unsaved_changes") : t("no_changes")}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all",
                isDirty ? (isOpen ? "bg-white" : "bg-primary") : "bg-muted",
              )}
            ></div>
            <span className="text-lg">{editedRegion.name}</span>
            <span
              className={cn(
                "font-normal",
                isOpen ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              ({editedRegion.value})
            </span>
          </div>
          <FiChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="space-y-4 p-4 pt-0">
        <div className="overflow-x-auto pt-4">
          <table className="min-w-full table-fixed text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="w-2/5 px-3 py-3 text-left font-semibold">
                  {t("table.rank")}
                </th>
                <th className="w-1/5 px-3 py-3 text-center font-semibold">
                  {t("table.rate")}
                </th>
                <th className="w-2/5 px-3 py-3 text-right font-semibold">
                  {t("table.cost_for_tier")}
                </th>
              </tr>
            </thead>
            <tbody>
              {editedRegion.rates.map((rank, rankIndex) => (
                <tr key={rank.code} className="border-t border-border">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3 font-medium text-foreground">
                      <img
                        src={`/assets/games/counter-strike-2/wingman/${rank.image}.png`}
                        alt={rank.name}
                        className="h-7 w-auto"
                      />
                      {rank.name}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-center">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={rank.rate}
                        onChange={(e) =>
                          handleRateChange(rankIndex, e.target.value)
                        }
                        className="h-9 w-20 rounded-md p-2 text-center"
                      />
                    </div>
                  </td>
                  <td className="font-mono px-3 py-2.5 text-right font-semibold tabular-nums text-foreground">
                    {formatMoney(rank.rate * unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            disabled={!isDirty || isSaving}
            className="gap-2"
          >
            <FiRotateCcw size={14} /> {t("common:buttons.reset")}
          </Button>
          <Button
            size="sm"
            onClick={handleSaveClick}
            disabled={!isDirty || isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <Spinner size="sm" />
            ) : (
              <>
                <FaSave size={14} /> {t("common:buttons.save")}
              </>
            )}
          </Button>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

interface WingmanPriceCalculatorProps {
  regions: IWingmanRegionRates[];
  unitPrice: number;
}

const WingmanPriceCalculator = ({
  regions,
  unitPrice,
}: WingmanPriceCalculatorProps) => {
  const { t } = useTranslation(["manage_boost_page"]);
  const [selectedRegion, setSelectedRegion] = useState<string>(
    regions[0]?.value || "",
  );
  const [fromRankIndex, setFromRankIndex] = useState<number>(0);
  const [toRankIndex, setToRankIndex] = useState<number>(3);

  const currentRegion = useMemo(
    () => regions.find((r) => r.value === selectedRegion),
    [regions, selectedRegion],
  );

  const priceBreakdown = useMemo(() => {
    if (!currentRegion || toRankIndex <= fromRankIndex) return [];
    const breakdown: {
      rankName: string;
      rankImage: string;
      rate: number;
      price: number;
    }[] = [];

    for (let i = fromRankIndex; i < toRankIndex; i++) {
      const rank = currentRegion.rates[i];
      if (rank) {
        breakdown.push({
          rankName: rank.name,
          rankImage: rank.image,
          rate: rank.rate,
          price: rank.rate * unitPrice,
        });
      }
    }
    return breakdown;
  }, [currentRegion, fromRankIndex, toRankIndex, unitPrice]);

  const totalPrice = useMemo(() => {
    return priceBreakdown.reduce((sum, row) => sum + row.price, 0);
  }, [priceBreakdown]);

  const ranks = currentRegion?.rates || [];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-purple-500/10 text-muted-foreground text-purple-500">
          <HiOutlineCalculator size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("wingman.calculator_title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("wingman.calculator_subtitle")}
          </p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            {t("wingman.select_region")}
          </label>
          <Select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setFromRankIndex(0);
              setToRankIndex(3);
            }}
          >
            {regions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.name} ({region.value})
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            {t("wingman.from_rank")}
          </label>
          <Select
            value={fromRankIndex}
            onChange={(e) => setFromRankIndex(parseInt(e.target.value))}
          >
            {ranks.slice(0, -1).map((rank, idx) => (
              <option key={rank.code} value={idx}>
                {rank.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            {t("wingman.to_rank")}
          </label>
          <Select
            value={toRankIndex}
            onChange={(e) => setToRankIndex(parseInt(e.target.value))}
          >
            {ranks.slice(fromRankIndex + 1).map((rank, idx) => (
              <option key={rank.code} value={fromRankIndex + 1 + idx}>
                {rank.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/10 p-4">
        <span className="font-medium text-foreground">
          {t("wingman.estimated_price")}
        </span>
        <span className="text-2xl font-bold text-primary">
          {formatMoney(totalPrice)}
        </span>
      </div>

      {priceBreakdown.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
            {t("wingman.price_breakdown")}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">
                    {t("table.rank")}
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">
                    {t("table.rate")}
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">
                    {t("table.cost_for_tier")}
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums">
                {priceBreakdown.map((row, idx) => (
                  <tr key={idx} className="border-t border-border">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3 font-medium text-foreground">
                        <img
                          src={`/assets/games/counter-strike-2/wingman/${row.rankImage}.png`}
                          alt={row.rankName}
                          className="h-6 w-auto"
                        />
                        {row.rankName}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">{row.rate}×</td>
                    <td className="px-3 py-2 text-right font-semibold text-foreground">
                      {formatMoney(row.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const ManageWingman = () => {
  const { t } = useTranslation(["manage_boost_page", "common"]);

  const {
    data: wingmanData,
    isLoading: isLoadingSWR,
    error,
    mutate,
  } = useSWR(GET_WINGMAN_RATES_KEY, rateService.getWingmanRates, {
    revalidateOnFocus: false,
  });

  const { trigger: triggerUpdateGlobal, isMutating: isSavingGlobal } =
    useSWRMutation(
      UPDATE_WINGMAN_CONFIG_KEY,
      (_, { arg }: { arg: IUpdateWingmanConfigPayload }) =>
        rateService.updateWingmanConfig(arg),
    );

  const { trigger: triggerUpdateRegion, isMutating: isSavingRegion } =
    useSWRMutation(
      UPDATE_WINGMAN_REGION_KEY,
      (
        _,
        {
          arg,
        }: {
          arg: { regionValue: string; payload: IUpdateWingmanRegionPayload };
        },
      ) =>
        rateService.updateWingmanRatesForRegion(arg.regionValue, arg.payload),
    );

  const [editedConfig, setEditedConfig] = useState<IWingmanRatesConfig | null>(
    null,
  );
  const [openRegions, setOpenRegions] = useState<string[]>([]);

  const originalConfig = wingmanData;

  useEffect(() => {
    if (originalConfig) {
      setEditedConfig(structuredClone(originalConfig));
      if (originalConfig.regions.length > 0) {
        setOpenRegions((prev) =>
          prev.length === 0 ? [originalConfig.regions[0].value] : prev,
        );
      }
    }
  }, [originalConfig]);

  const handleRegionChange = (updatedRegion: IWingmanRegionRates) => {
    if (!editedConfig) return;
    setEditedConfig((prev) => ({
      ...prev!,
      regions: prev!.regions.map((r) =>
        r.value === updatedRegion.value ? updatedRegion : r,
      ),
    }));
  };

  const handleResetRegion = (regionValue: string) => {
    if (!originalConfig) return;
    const originalRegion = originalConfig.regions.find(
      (r) => r.value === regionValue,
    );
    if (originalRegion) {
      handleRegionChange(structuredClone(originalRegion));
      toast(t("common:toasts.region_reset"), { icon: "🔄" });
    }
  };

  const handleSaveRegion = async (regionToSave: IWingmanRegionRates) => {
    const promise = triggerUpdateRegion({
      regionValue: regionToSave.value,
      payload: { rates: regionToSave.rates },
    });
    await toast.promise(promise, {
      loading: t("common:toasts.saving", {
        item: `rates for ${regionToSave.name}`,
      }),
      success: () => {
        mutate();
        return t("common:toasts.save_success", { item: "Rates" });
      },
      error: (err) =>
        err?.message || t("common:toasts.save_error", { item: "rates" }),
    });
  };

  const handleSaveUnitPrice = async () => {
    if (!editedConfig) return;
    const promise = triggerUpdateGlobal({ unitPrice: editedConfig.unitPrice });
    await toast.promise(promise, {
      loading: t("common:toasts.saving", { item: "global settings" }),
      success: () => {
        mutate();
        return t("common:toasts.save_success", { item: "Global settings" });
      },
      error: (err) =>
        err?.message || t("common:toasts.save_error", { item: "settings" }),
    });
  };

  const isUnitPriceDirty =
    originalConfig?.unitPrice !== editedConfig?.unitPrice;

  if (isLoadingSWR) return <SkeletonLoader />;
  if (error) return <ErrorDisplay message={t("errors.load_data")} />;
  if (!editedConfig) return <ErrorDisplay message={t("errors.no_config")} />;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-muted text-muted-foreground">
              <FiSettings size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {t("base_price_title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("base_price_subtitle")}
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <Input
              type="number"
              value={editedConfig.unitPrice}
              step="1000"
              min="0"
              onChange={(e) =>
                setEditedConfig({
                  ...editedConfig,
                  unitPrice: parseInt(e.target.value) || 0,
                })
              }
              className="w-28 rounded-md p-2 text-right"
            />
            <Button
              size="sm"
              onClick={handleSaveUnitPrice}
              disabled={!isUnitPriceDirty || isSavingGlobal}
              className="gap-2"
            >
              {isSavingGlobal ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <FaSave size={14} /> {t("common:buttons.save")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <WingmanPriceCalculator
        regions={editedConfig.regions}
        unitPrice={editedConfig.unitPrice}
      />
      <Accordion.Root
        type="multiple"
        value={openRegions}
        onValueChange={setOpenRegions}
        className="space-y-3"
      >
        {editedConfig.regions.map((editedRegion) => {
          const originalRegion = originalConfig?.regions.find(
            (r) => r.value === editedRegion.value,
          );
          if (!originalRegion) return null;
          return (
            <WingmanRegionAccordionItem
              key={editedRegion.value}
              originalRegion={originalRegion}
              editedRegion={editedRegion}
              isOpen={openRegions.includes(editedRegion.value)}
              unitPrice={editedConfig.unitPrice}
              isSaving={isSavingRegion}
              onRegionChange={handleRegionChange}
              onSave={handleSaveRegion}
              onReset={() => handleResetRegion(editedRegion.value)}
            />
          );
        })}
      </Accordion.Root>
    </div>
  );
};

export default ManageWingman;