import { Helmet, Spinner } from "~/components/ui";
import { FaBell, FaBellSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import getErrorMessage from "~/utils/errorHandler";
import { Button } from "~/components/ui/Button";
import Switch from "~/components/@radix-ui/Switch";
import { usePushNotifications } from "~/hooks/usePushNotifications";
import { useTranslation } from "react-i18next";

const notificationKeys = ["updated_order", "new_order"];

const PushSettingsPage = () => {
  const { t } = useTranslation(["settings_page", "common"]);

  const {
    isSubscribed,
    settings,
    subscribe,
    unsubscribe,
    updateSettings,
    isLoading,
  } = usePushNotifications();

  const handleSubscribe = async () => {
    try {
      await subscribe();
      toast.success(t("common:toasts.notifications_subscribed"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribe();
      toast.success(t("common:toasts.notifications_unsubscribed"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSettingToggle = (key: string, value: boolean) => {
    updateSettings({ ...settings, [key]: value });
  };

  return (
    <>
      <Helmet title={t("push_settings_page")} />

      <main className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {t("notifications_page.title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isSubscribed
                  ? t("notifications_page.subscribed_subtitle")
                  : t("notifications_page.unsubscribed_subtitle")}
              </p>
            </div>
            <Button
              size="sm"
              onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
              variant={isSubscribed ? "outline" : "primary"}
            >
              {isSubscribed ? (
                <>
                  <FaBellSlash className="mr-2" />{" "}
                  {t("notifications_page.unsubscribe_btn")}
                </>
              ) : (
                <>
                  <FaBell className="mr-2" />{" "}
                  {t("notifications_page.subscribe_btn")}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center">
                <Spinner />
              </div>
            ) : (
              notificationKeys.map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-6"
                >
                  <div>
                    <h4 className="font-medium text-foreground">
                      {t(`notifications_page.settings.${key}.label`)}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t(`notifications_page.settings.${key}.description`)}
                    </p>
                  </div>
                  <Switch
                    disabled={!isSubscribed}
                    checked={settings[key] || false}
                    onCheckedChange={(checked) =>
                      handleSettingToggle(key, checked)
                    }
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default PushSettingsPage;