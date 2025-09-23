import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation"; // Dùng useSWRMutation cho việc update
import { toast } from "react-hot-toast";
import { FiSettings } from "react-icons/fi";
import { ErrorDisplay, Input, Spinner } from "~/components/shared";
import { ILevelFarmingConfig, IUpdateLevelFarmingConfigPayload } from "~/types";
import { Button } from "~/components/shared/Button";
import { FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { rateService } from "~/services/rate.service";

const SkeletonLoader = () => (
  <div className="h-24 animate-pulse rounded-xl bg-card"></div>
);

const ManageLevelFarming = () => {
  const { t } = useTranslation();
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

  const originalConfig = useMemo(() => levelFarmingData, [levelFarmingData]);

  useEffect(() => {
    if (originalConfig) {
      setEditedConfig(structuredClone(originalConfig));
    }
  }, [originalConfig]);

  const handleSaveConfig = async () => {
    if (!editedConfig) return;

    const promise = updateTrigger({ unitPrice: editedConfig.unitPrice });

    await toast.promise(promise, {
      loading: "Saving settings...",
      success: () => {
        mutate();
        return "Settings updated successfully!";
      },
      error: (err) => err?.message || "Failed to update settings.",
    });
  };

  const isDirty = useMemo(() => {
    if (!originalConfig || !editedConfig) return false;
    return originalConfig.unitPrice !== editedConfig.unitPrice;
  }, [originalConfig, editedConfig]);

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
                {t("ManageBoostPage.LevelFarming.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("ManageBoostPage.LevelFarming.subtitle")}
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
                  <FaSave size={14} /> Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageLevelFarming;
