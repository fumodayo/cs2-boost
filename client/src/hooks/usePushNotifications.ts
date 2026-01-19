import useSWR from "swr";
import { pushService } from "~/services/push.service";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

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

    const vapidKey = data?.data.vapidPublicKey || VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      throw new Error("Missing VAPID public key.");
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
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

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}