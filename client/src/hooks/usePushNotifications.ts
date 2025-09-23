import useSWR from "swr";
import { pushService } from "~/services/push.service";

const VAPID_PUBLIC_KEY = import.meta.env.VAPID_PUBLIC_KEY;

export const usePushNotifications = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/push/settings",
    pushService.getSettings,
  );

  const isSubscribed = data?.data.isSubscribed || false;
  const settings = data?.data.settings || {};

  const subscribe = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error("Push notifications are not supported by this browser.");
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Permission for push notifications was denied.");
    }
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY,
    });
    await pushService.subscribe(subscription);
    mutate();
  };

  const unsubscribe = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      await pushService.unsubscribe();
      mutate();
    }
  };

  const updateSettings = async (newSettings: Record<string, boolean>) => {
    await pushService.updateSettings(newSettings);
    mutate();
  };

  return {
    isSubscribed,
    settings,
    subscribe,
    unsubscribe,
    updateSettings,
    isLoading,
    error,
  };
};
