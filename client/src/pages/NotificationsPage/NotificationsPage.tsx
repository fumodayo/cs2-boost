import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Switch from "~/components/@radix-ui/Switch";
import { Button, Helmet } from "~/components/shared";

type NotificationKey =
  | "updated_order"
  | "updated_account_balance"
  | "new_messages"
  | "new_order";

const notificationsDesktop: { label: string; value: NotificationKey }[] = [
  {
    label: "My boost is updated",
    value: "updated_order",
  },
  {
    label: "Account balance is updated",
    value: "updated_account_balance",
  },
  {
    label: "New Messages",
    value: "new_messages",
  },
  {
    label: "New Boost Created",
    value: "new_order",
  },
];

const NotificationsPage = () => {
  const { t } = useTranslation();
  const [isAllowed, setIsAllowed] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<
    Record<NotificationKey, boolean>
  >({
    updated_order: false,
    updated_account_balance: false,
    new_messages: false,
    new_order: false,
  });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }
  }, []);

  const subscribeToPush = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Permission for push notifications was denied");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        "BPZ0d3uL9k9FwT06EJ0XDOBuwXl3q3_QLQO45aDWJZI5f-KCz9kgBTGfoQOgWipvyCA96AH0Vk2mW6uLt3mTzxM",
    });

    console.log("Subscribed to push:", subscription);

    // Send the subscription to the backend
    await fetch("http://localhost:5030/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setIsAllowed(true);
    setNotificationStatus({
      updated_order: true,
      updated_account_balance: true,
      new_messages: true,
      new_order: true,
    });
  };

  const toggleNotification = (value: keyof typeof notificationStatus) => {
    setNotificationStatus((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const sendNewOrderNotification = async () => {
    if (notificationStatus.new_order) {
      await fetch("http://localhost:5030/new-order", {
        method: "POST",
      });

      console.log("1");
    } else {
      alert("New order notification is disabled.");
    }
  };

  return (
    <>
      <Helmet title="Notifications" />
      <main>
        <div className="mb-4 flex items-center rounded-lg border border-secondary-ring bg-secondary-light p-4 text-secondary-light-foreground backdrop-blur-xl">
          <div className="flex-1 text-sm">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="flex flex-col justify-center">
                <h3 className="text-base font-semibold leading-6 text-foreground">
                  {t("SettingsPage.Notifications.AllowedWidget.title")}
                </h3>
                <p className="mt-1.5 max-w-xl text-xs text-muted-foreground">
                  {t("SettingsPage.Notifications.AllowedWidget.subtitle")}
                </p>
              </div>
              <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                <Button
                  variant="primary"
                  className="rounded-md px-4 py-2 text-sm font-medium"
                  onClick={subscribeToPush}
                >
                  {t("SettingsPage.Notifications.AllowedWidget.btn")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Button
            variant="secondary"
            className="ml-2 rounded-md px-4 py-2 text-sm font-medium"
          >
            Send Order Update Notification
          </Button>
          <Button
            variant="secondary"
            className="ml-2 rounded-md px-4 py-2 text-sm font-medium"
          >
            Send Account Balance Notification
          </Button>
          <Button
            variant="secondary"
            className="ml-2 rounded-md px-4 py-2 text-sm font-medium"
          >
            Send New Messages Notification
          </Button>
          <Button
            variant="secondary"
            className="ml-2 rounded-md px-4 py-2 text-sm font-medium"
            onClick={sendNewOrderNotification}
          >
            Send New Order Notification
          </Button>
        </div>

        <div className="-mx-4 max-w-xl overflow-clip border border-border bg-card text-card-foreground shadow-sm sm:-mx-6 lg:mx-0 lg:rounded-xl">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="whitespace-nowrap border-b border-border py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:pl-6">
                  {t("SettingsPage.Notifications.label.Notify me when...")}
                </th>
                <th className="whitespace-nowrap border-b border-border py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:pl-6">
                  {t("SettingsPage.Notifications.label.Desktop")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {notificationsDesktop.map(({ label, value }) => (
                <tr draggable={false} className="dark:hover:bg-night-500/10">
                  <td className="whitespace-nowrap border-b border-border py-4 pl-4 pr-3 text-left text-sm font-medium text-foreground sm:pl-6">
                    {t(`SettingsPage.Notifications.label.${label}`)}
                  </td>
                  <td className="whitespace-nowrap border-b border-border py-4 pl-3 pr-4 text-right text-sm text-muted-foreground sm:pr-6">
                    <Switch
                      disabled={!isAllowed}
                      checked={notificationStatus[value]}
                      onCheckedChange={() => toggleNotification(value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default NotificationsPage;
