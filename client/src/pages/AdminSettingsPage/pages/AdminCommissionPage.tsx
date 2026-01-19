import { useEffect, useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { FaPercent, FaSave, FaExclamationTriangle } from "react-icons/fa";
import { Helmet, Heading, Input, Spinner } from "~/components/ui";
import { Button } from "~/components/ui/Button";
import { adminService, ISystemSettings } from "~/services/admin.service";
import { formatMoney } from "~/utils";

const AdminCommissionPage = () => {
  const { t } = useTranslation(["admin_settings_page", "common"]);
  const [settings, setSettings] = useState<ISystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partnerRate, setPartnerRate] = useState(80);
  const [penaltyRate, setPenaltyRate] = useState(5);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminService.getSystemSettings();
        setSettings(data);
        setPartnerRate(Math.round(data.partnerCommissionRate * 100));
        setPenaltyRate(Math.round(data.cancellationPenaltyRate * 100));
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await adminService.updateSystemSettings({
        partnerCommissionRate: partnerRate / 100,
        cancellationPenaltyRate: penaltyRate / 100,
      });
      setSettings(data);
      toast.success(t("commission_card.saved"));
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const websiteRate = 100 - partnerRate;
  const examplePrice = 100000;
  const partnerEarning = examplePrice * (partnerRate / 100);
  const websiteEarning = examplePrice * (websiteRate / 100);
  const penaltyAmount = examplePrice * (penaltyRate / 100);

  const hasChanges =
    settings &&
    (Math.round(settings.partnerCommissionRate * 100) !== partnerRate ||
      Math.round(settings.cancellationPenaltyRate * 100) !== penaltyRate);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet title="commission_page" />
      <div className="space-y-8 p-4 md:p-8">
        <Heading
          icon={FaPercent}
          title="commission_page_title"
          subtitle="commission_page_subtitle"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Commission Rate Card */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FaPercent className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {t("commission_card.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("commission_card.subtitle")}
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Partner Rate Section */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-base font-medium">
                      {t("commission_card.partner_rate")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={partnerRate}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const val = Number(e.target.value);
                          if (val >= 50 && val <= 95) setPartnerRate(val);
                        }}
                        className="w-20 text-center"
                        min={50}
                        max={95}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    value={partnerRate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPartnerRate(Number(e.target.value))
                    }
                    min={50}
                    max={95}
                    step={1}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50%</span>
                    <span>95%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <span className="text-sm font-medium">
                    {t("commission_card.website_rate")}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {websiteRate}%
                  </span>
                </div>

                {/* Penalty Rate */}
                <div className="space-y-4 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-base font-medium">
                      {t("commission_card.penalty_rate")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={penaltyRate}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const val = Number(e.target.value);
                          if (val >= 1 && val <= 20) setPenaltyRate(val);
                        }}
                        className="w-20 text-center"
                        min={1}
                        max={20}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    value={penaltyRate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPenaltyRate(Number(e.target.value))
                    }
                    min={1}
                    max={20}
                    step={1}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-4 font-medium">
                    {t("commission_card.preview")}
                  </h4>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {t("commission_card.example", {
                      amount: formatMoney(examplePrice, "vnd"),
                    })}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-md bg-green-500/10 p-3">
                      <span className="text-sm">Partner</span>
                      <span className="font-semibold text-green-600">
                        +{formatMoney(partnerEarning, "vnd")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-blue-500/10 p-3">
                      <span className="text-sm">Website</span>
                      <span className="font-semibold text-blue-600">
                        +{formatMoney(websiteEarning, "vnd")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-red-500/10 p-3">
                      <span className="text-sm">
                        {t("commission_card.penalty_if_cancel")}
                      </span>
                      <span className="font-semibold text-red-600">
                        -{formatMoney(penaltyAmount, "vnd")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3">
                  <FaExclamationTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    {t("commission_card.warning")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-border pt-6">
              <Button
                className="px-3 py-1.5"
                onClick={handleSave}
                disabled={saving || !hasChanges}
              >
                {saving ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    {t("commission_card.save_btn")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCommissionPage;