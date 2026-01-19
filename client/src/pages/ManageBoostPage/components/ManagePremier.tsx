import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import * as Accordion from "@radix-ui/react-accordion";
import { toast } from "react-hot-toast";
import { FiChevronDown, FiRotateCcw, FiSettings } from "react-icons/fi";
import { ErrorDisplay, Input, Spinner } from "~/components/ui";
import { Select } from "~/components/ui/Form";
import { formatMoney } from "~/utils";
import {
  IPremierRatesConfig,
  IPremierRegionRates,
  IUpdateRegionRatesPayload,
  IUpdateUnitPricePayload,
} from "~/types";
import cn from "~/libs/utils";
import { Button } from "~/components/ui/Button";
import { FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { rateService } from "~/services/rate.service";
import calculatePremierCost from "~/utils/calculatePremierCost";
import { HiOutlineCalculator } from "react-icons/hi2";
const GET_PREMIER_RATES_KEY = "/rates/get-premier-rates";
const UPDATE_PREMIER_CONFIG_KEY = "/rates/update-premier-config";
const UPDATE_PREMIER_REGION_KEY = "/rates/update-premier-rates";
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
interface RegionAccordionItemProps {
  originalRegion: IPremierRegionRates;
  editedRegion: IPremierRegionRates;
  unitPrice: number;
  isOpen: boolean;
  isSaving: boolean;
  onRegionChange: (updatedRegion: IPremierRegionRates) => void;
  onSave: (regionToSave: IPremierRegionRates) => Promise<void>;
  onReset: () => void;
}
const RegionAccordionItem = ({
  originalRegion,
  editedRegion,
  unitPrice,
  isOpen,
  isSaving,
  onRegionChange,
  onSave,
  onReset,
}: RegionAccordionItemProps) => {
  const { t } = useTranslation(["manage_boost_page", "common"]);
  const isDirty = useMemo(
    () => JSON.stringify(originalRegion) !== JSON.stringify(editedRegion),
    [originalRegion, editedRegion],
  );
  const handleRateChange = (rateIndex: number, value: string) => {
    const newRegion = { ...editedRegion, rates: [...editedRegion.rates] };
    newRegion.rates[rateIndex] = {
      ...newRegion.rates[rateIndex],
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
                <th className="w-1/4 px-3 py-3 text-left font-semibold">
                  {t("table.start")}
                </th>
                <th className="w-1/4 px-3 py-3 text-left font-semibold">
                  {t("table.end")}
                </th>
                <th className="w-1/4 px-3 py-3 text-left font-semibold">
                  {t("table.rate")}
                </th>
                <th className="w-1/4 px-3 py-3 text-right font-semibold">
                  {t("table.cost_for_tier")}
                </th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {editedRegion.rates.map((range, rateIndex) => (
                <tr key={rateIndex} className="border-t border-border">
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {range.start.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {range.end.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5">
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={range.rate}
                      onChange={(e) =>
                        handleRateChange(rateIndex, e.target.value)
                      }
                      className="h-9 w-24 rounded-md p-2 text-right"
                    />
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-foreground">
                    {formatMoney(
                      (range.end - range.start) * range.rate * unitPrice,
                    )}
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
interface PriceCalculatorProps {
  regions: IPremierRegionRates[];
  unitPrice: number;
}
const PriceCalculator = ({ regions, unitPrice }: PriceCalculatorProps) => {
  const { t } = useTranslation(["manage_boost_page"]);
  const [selectedRegion, setSelectedRegion] = useState<string>(
    regions[0]?.value || "",
  );
  const [fromRating, setFromRating] = useState<number>(5000);
  const [toRating, setToRating] = useState<number>(10000);
  const currentRegion = useMemo(
    () => regions.find((r) => r.value === selectedRegion),
    [regions, selectedRegion],
  );
  const totalPrice = useMemo(() => {
    if (!currentRegion || toRating <= fromRating) return 0;
    return calculatePremierCost(
      fromRating,
      toRating,
      unitPrice,
      currentRegion.rates,
    );
  }, [currentRegion, fromRating, toRating, unitPrice]);
  const priceBreakdown = useMemo(() => {
    if (!currentRegion || toRating <= fromRating) return [];
    const breakdown: {
      start: number;
      end: number;
      points: number;
      rate: number;
      price: number;
    }[] = [];
    const sortedRates = [...currentRegion.rates].sort(
      (a, b) => a.start - b.start,
    );
    for (const tier of sortedRates) {
      const effectiveStart = Math.max(fromRating, tier.start);
      const effectiveEnd = Math.min(toRating, tier.end);
      if (effectiveEnd > effectiveStart) {
        const points = effectiveEnd - effectiveStart;
        breakdown.push({
          start: effectiveStart,
          end: effectiveEnd,
          points,
          rate: tier.rate,
          price: points * tier.rate * unitPrice,
        });
      }
    }
    return breakdown;
  }, [currentRegion, fromRating, toRating, unitPrice]);
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-purple-500/10 text-muted-foreground text-purple-500">
          <HiOutlineCalculator size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("premier.calculator_title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("premier.calculator_subtitle")}
          </p>
        </div>
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            {t("premier.select_region")}
          </label>
          <Select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
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
            {t("premier.from_rating")}
          </label>
          <Input
            type="number"
            value={fromRating}
            min={1000}
            max={31999}
            onChange={(e) => setFromRating(parseInt(e.target.value) || 0)}
            className="h-10"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            {t("premier.to_rating")}
          </label>
          <Input
            type="number"
            value={toRating}
            min={1001}
            max={32000}
            onChange={(e) => setToRating(parseInt(e.target.value) || 0)}
            className="h-10"
          />
        </div>
      </div>
      <div className="mb-5 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/10 p-4">
        <span className="font-medium text-foreground">
          {t("premier.estimated_price")}
        </span>
        <span className="text-2xl font-bold text-primary">
          {formatMoney(totalPrice)}
        </span>
      </div>
      {priceBreakdown.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
            {t("premier.price_breakdown")}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">
                    {t("table.start")}
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    {t("table.end")}
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">
                    {t("premier.points")}
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">
                    {t("table.rate")}
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">
                    {t("premier.price_per_point")}
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">
                    {t("table.cost_for_tier")}
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums">
                {priceBreakdown.map((row, idx) => (
                  <tr key={idx} className="border-t border-border">
                    <td className="px-3 py-2 text-muted-foreground">
                      {row.start.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {row.end.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row.points.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right">{row.rate}×</td>
                    <td className="px-3 py-2 text-right">
                      {formatMoney(row.rate * unitPrice)}
                    </td>
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
const ManagePremier = () => {
  const { t } = useTranslation(["manage_boost_page", "common"]);
  const {
    data: premierData,
    isLoading: isLoadingSWR,
    error,
    mutate,
  } = useSWR(GET_PREMIER_RATES_KEY, rateService.getPremierRates, {
    revalidateOnFocus: false,
  });
  const { trigger: triggerUpdateGlobal, isMutating: isSavingGlobal } =
    useSWRMutation(
      UPDATE_PREMIER_CONFIG_KEY,
      (_, { arg }: { arg: IUpdateUnitPricePayload }) =>
        rateService.updatePremierConfig(arg),
    );
  const { trigger: triggerUpdateRegion, isMutating: isSavingRegion } =
    useSWRMutation(
      UPDATE_PREMIER_REGION_KEY,
      (
        _,
        {
          arg,
        }: { arg: { regionValue: string; payload: IUpdateRegionRatesPayload } },
      ) =>
        rateService.updatePremierRatesForRegion(arg.regionValue, arg.payload),
    );
  const [editedConfig, setEditedConfig] = useState<IPremierRatesConfig | null>(
    null,
  );
  const [openRegions, setOpenRegions] = useState<string[]>([]);
  const originalConfig = premierData;
  useEffect(() => {
    if (originalConfig) {
      setEditedConfig(structuredClone(originalConfig));
      if (originalConfig.regions.length > 0 && openRegions.length === 0) {
        setOpenRegions([originalConfig.regions[0].value]);
      }
    }
  }, [originalConfig]);
  const handleRegionChange = (updatedRegion: IPremierRegionRates) => {
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
  const handleSaveRegion = async (regionToSave: IPremierRegionRates) => {
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
              step="0.1"
              min="0"
              onChange={(e) =>
                setEditedConfig({
                  ...editedConfig,
                  unitPrice: parseFloat(e.target.value) || 0,
                })
              }
              className="w-24 rounded-md p-2 text-right"
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
      <PriceCalculator
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
            <RegionAccordionItem
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
export default ManagePremier;