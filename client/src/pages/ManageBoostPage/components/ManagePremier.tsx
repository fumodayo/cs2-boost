import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import * as Accordion from "@radix-ui/react-accordion";
import { toast } from "react-hot-toast";
import { FiChevronDown, FiRotateCcw, FiSettings } from "react-icons/fi";
import { ErrorDisplay, Input, Spinner } from "~/components/shared";
import { formatMoney } from "~/utils";
import {
  IPremierRatesConfig,
  IPremierRegionRates,
  IUpdateRegionRatesPayload,
  IUpdateUnitPricePayload,
} from "~/types";
import cn from "~/libs/utils";
import { Button } from "~/components/shared/Button";
import { FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { rateService } from "~/services/rate.service";

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
  const { t } = useTranslation();
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
              title={isDirty ? "Unsaved changes" : "No changes"}
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
                  {t("ManageBoostPage.Table.start")}
                </th>
                <th className="w-1/4 px-3 py-3 text-left font-semibold">
                  {t("ManageBoostPage.Table.end")}
                </th>
                <th className="w-1/4 px-3 py-3 text-left font-semibold">
                  {t("ManageBoostPage.Table.rate")}
                </th>
                <th className="w-1/4 px-3 py-3 text-right font-semibold">
                  {t("ManageBoostPage.Table.costForTier")}
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
            <FiRotateCcw size={14} /> Reset
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
                <FaSave size={14} /> Save
              </>
            )}
          </Button>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

const ManagePremier = () => {
  const { t } = useTranslation();
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

  const originalConfig = useMemo(() => premierData, [premierData]);

  useEffect(() => {
    if (originalConfig) {
      setEditedConfig(structuredClone(originalConfig));
      if (originalConfig.regions.length > 0 && openRegions.length === 0) {
        setOpenRegions([originalConfig.regions[0].value]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast("Region has been reset.", { icon: "🔄" });
    }
  };

  const handleSaveRegion = async (regionToSave: IPremierRegionRates) => {
    const promise = triggerUpdateRegion({
      regionValue: regionToSave.value,
      payload: { rates: regionToSave.rates },
    });
    await toast.promise(promise, {
      loading: `Saving rates for ${regionToSave.name}...`,
      success: () => {
        mutate();
        return `Successfully saved!`;
      },
      error: (err) => err?.message || "Failed to save rates.",
    });
  };

  const handleSaveUnitPrice = async () => {
    if (!editedConfig) return;
    const promise = triggerUpdateGlobal({ unitPrice: editedConfig.unitPrice });
    await toast.promise(promise, {
      loading: "Saving global settings...",
      success: () => {
        mutate();
        return "Global settings updated!";
      },
      error: (err) => err?.message || "Failed to update settings.",
    });
  };

  const isUnitPriceDirty =
    originalConfig?.unitPrice !== editedConfig?.unitPrice;

  if (isLoadingSWR) return <SkeletonLoader />;
  if (error)
    return (
      <ErrorDisplay message="Error loading data. Please refresh the page." />
    );
  if (!editedConfig)
    return <ErrorDisplay message="No configuration data found." />;

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
                {t("ManageBoostPage.basePriceTitle")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("ManageBoostPage.basePriceSubtitle")}
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
                  <FaSave size={14} /> Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

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
