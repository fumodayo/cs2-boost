self.addEventListener("push", (event) => {
  const data = event.data.json();

  const title = data.title || "New Notification";
  const options = {
    body: data.body || "You have a new update.",
    icon: data.icon || "/favicon.ico",
    badge: data.badge || "/badge-icon.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url));
});