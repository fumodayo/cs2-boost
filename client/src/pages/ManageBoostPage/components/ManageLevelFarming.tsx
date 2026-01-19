import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { toast } from "react-hot-toast";
import { FiSettings, FiInfo, FiZap } from "react-icons/fi";
import { HiOutlineCalculator } from "react-icons/hi";
import { ErrorDisplay, Input, Spinner } from "~/components/ui";
import { ILevelFarmingConfig, IUpdateLevelFarmingConfigPayload } from "~/types";
import { Button } from "~/components/ui/Button";
import { FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { rateService } from "~/services/rate.service";
import { formatMoney } from "~/utils";

const SkeletonLoader = () => (
  <div className="space-y-5">
    <div className="h-24 animate-pulse rounded-xl bg-card"></div>
    <div className="h-48 animate-pulse rounded-xl bg-card"></div>
  </div>
);

const QUICK_REFERENCE_LEVELS = [10, 50, 100, 200, 500, 1000];

const ManageLevelFarming = () => {
  const { t } = useTranslation(["manage_boost_page", "common"]);

  const {
    data: levelFarmingData,
    isLoading: isLoadingSWR,
    error,
    mutate,
  } = useSWR(
    "/rates/get-level-farming-config",
    rateService.getLevelFarmingConfig,
    {
      revalidateOnFocus: false,
    },
  );

  const { trigger: updateTrigger, isMutating: isSaving } = useSWRMutation(
    "/rates/update-level-farming-config",
    (_, { arg }: { arg: IUpdateLevelFarmingConfigPayload }) =>
      rateService.updateLevelFarmingConfig(arg),
  );

  const [editedConfig, setEditedConfig] = useState<ILevelFarmingConfig | null>(
    null,
  );
  const [calculatorLevels, setCalculatorLevels] = useState<number>(100);

  const originalConfig = levelFarmingData;

  useEffect(() => {
    if (originalConfig) {
      setEditedConfig(structuredClone(originalConfig));
    }
  }, [originalConfig]);

  const handleSaveConfig = async () => {
    if (!editedConfig) return;

    const promise = updateTrigger({ unitPrice: editedConfig.unitPrice });

    await toast.promise(promise, {
      loading: t("common:toasts.saving", { item: "settings" }),
      success: () => {
        mutate();
        return t("common:toasts.save_success", { item: "Settings" });
      },
      error: (err) =>
        err?.message || t("common:toasts.save_error", { item: "settings" }),
    });
  };

  const isDirty = useMemo(() => {
    if (!originalConfig || !editedConfig) return false;
    return originalConfig.unitPrice !== editedConfig.unitPrice;
  }, [originalConfig, editedConfig]);

  const calculatedPrice = useMemo(() => {
    if (!editedConfig) return 0;
    return calculatorLevels * editedConfig.unitPrice;
  }, [calculatorLevels, editedConfig]);

  if (isLoadingSWR) return <SkeletonLoader />;
  if (error) return <ErrorDisplay message={t("errors.load_data")} />;
  if (!editedConfig) return <ErrorDisplay message={t("errors.no_config")} />;

  return (
    <div className="space-y-5">
      {/* Base Price Setting */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-muted text-muted-foreground">
              <FiSettings size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {t("level_farming.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("level_farming.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <Input
              type="number"
              value={editedConfig.unitPrice}
              step="10"
              min="0"
              onChange={(e) =>
                setEditedConfig((prev) =>
                  prev
                    ? { ...prev, unitPrice: parseFloat(e.target.value) || 0 }
                    : null,
                )
              }
              className="w-28 rounded-md p-2 text-right"
            />
            <Button
              size="sm"
              onClick={handleSaveConfig}
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
        </div>
      </div>

      {/* Pricing Formula Card */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
            <FiInfo size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {t("level_farming.formula_title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("level_farming.formula_subtitle")}
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-lg bg-muted/50 p-4">
          <div className="font-mono flex flex-wrap items-center justify-center gap-2 text-lg">
            <span className="rounded bg-primary/10 px-3 py-1.5 font-semibold text-primary">
              {t("level_farming.num_levels")}
            </span>
            <span className="text-muted-foreground">×</span>
            <span className="rounded bg-green-500/10 px-3 py-1.5 font-semibold text-green-600 dark:text-green-400">
              {formatMoney(editedConfig.unitPrice)}
            </span>
            <span className="text-muted-foreground">=</span>
            <span className="rounded bg-orange-500/10 px-3 py-1.5 font-semibold text-orange-600 dark:text-orange-400">
              {t("level_farming.total_price")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
          <FiZap className="shrink-0 text-yellow-500" size={16} />
          <span>
            {t("level_farming.example")}: 100 levels ×{" "}
            {formatMoney(editedConfig.unitPrice)} ={" "}
            <strong className="text-foreground">
              {formatMoney(100 * editedConfig.unitPrice)}
            </strong>
          </span>
        </div>
      </div>

      {/* Interactive Calculator */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-purple-500/10 text-purple-500">
            <HiOutlineCalculator size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {t("level_farming.calculator_title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("level_farming.calculator_subtitle")}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              {t("level_farming.input_levels")}
            </label>
            <Input
              type="number"
              value={calculatorLevels}
              min="1"
              onChange={(e) =>
                setCalculatorLevels(parseInt(e.target.value) || 0)
              }
              className="w-full text-lg"
              placeholder="100"
            />
          </div>
          <div className="hidden items-center justify-center pt-6 text-2xl text-muted-foreground sm:flex">
            =
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              {t("level_farming.calculated_price")}
            </label>
            <div className="flex items-center justify-center rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 text-xl font-bold text-green-600 dark:text-green-400">
              {formatMoney(calculatedPrice)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference Table */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-foreground">
          {t("level_farming.quick_reference")}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  {t("level_farming.table_levels")}
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  {t("level_farming.table_formula")}
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  {t("level_farming.table_price")}
                </th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {QUICK_REFERENCE_LEVELS.map((levels) => (
                <tr
                  key={levels}
                  className="border-b border-border/50 transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {levels.toLocaleString()} levels
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {levels.toLocaleString()} ×{" "}
                    {formatMoney(editedConfig.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    {formatMoney(levels * editedConfig.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageLevelFarming;