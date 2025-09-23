import { Helmet, Spinner } from "~/components/shared";
import { FaBell, FaBellSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import getErrorMessage from "~/utils/errorHandler";
import { Button } from "~/components/shared/Button";
import Switch from "~/components/@radix-ui/Switch";
import { usePushNotifications } from "~/hooks/usePushNotifications";
import { pushService } from "~/services/push.service";

const notificationsConfig = [
  {
    key: "updated_order",
    label: "My boost is updated",
    description:
      "Get notified when a partner accepts, completes, or cancels your order.",
  },
  {
    key: "new_order",
    label: "New Boost Created (for Partners)",
    description:
      "Partners get notified when a new order is available on the platform.",
  },
];

const PushSettingsPage = () => {
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
      toast.success("Successfully subscribed to notifications!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribe();
      toast.success("Successfully unsubscribed from notifications.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSettingToggle = (key: string, value: boolean) => {
    updateSettings({ ...settings, [key]: value });
  };

  const handleSendTest = async () => {
    await toast.promise(pushService.sendTestNotification(), {
      loading: "Sending test notification...",
      success: "Test notification sent! Check your device.",
      error: (err) => `Failed to send: ${getErrorMessage(err)}`,
    });
  };

  return (
    <>
      <Helmet title="Notifications Settings" />

      <main className="mx-auto max-w-4xl space-y-8">
        {/* Card chính */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Desktop Push Notifications
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isSubscribed
                  ? "You are currently receiving notifications on this device."
                  : "Enable notifications to stay updated."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
              variant={isSubscribed ? "outline" : "primary"}
            >
              {isSubscribed ? (
                <>
                  <FaBellSlash className="mr-2" /> Unsubscribe
                </>
              ) : (
                <>
                  <FaBell className="mr-2" /> Subscribe
                </>
              )}
            </Button>
          </div>

          {isSubscribed && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">
                    Test Notifications
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Send a test notification to this device to confirm it's
                    working.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleSendTest}
                  disabled={!isSubscribed}
                >
                  Send Test
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bảng cài đặt chi tiết */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center">
                <Spinner />
              </div>
            ) : (
              notificationsConfig.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-6"
                >
                  <div>
                    <h4 className="font-medium text-foreground">
                      {item.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    disabled={!isSubscribed}
                    checked={settings[item.key] || false}
                    onCheckedChange={(checked) =>
                      handleSettingToggle(item.key, checked)
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
