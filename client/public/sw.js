// public/sw.js

// Lắng nghe sự kiện 'push' được gửi từ server
self.addEventListener("push", (event) => {
  const data = event.data.json(); // Lấy payload dữ liệu từ server

  const title = data.title || "New Notification";
  const options = {
    body: data.body || "You have a new update.",
    icon: data.icon || "/favicon.ico", // Icon hiển thị trên thông báo
    badge: data.badge || "/badge-icon.png", // Icon nhỏ trên thanh trạng thái (Android)
    data: {
      url: data.url || "/", // URL để mở khi người dùng click vào thông báo
    },
  };

  // Hiển thị thông báo trên thiết bị của người dùng
  event.waitUntil(self.registration.showNotification(title, options));
});

// Lắng nghe sự kiện 'notificationclick'
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Đóng thông báo lại

  // Mở cửa sổ/tab mới với URL được đính kèm trong dữ liệu
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
