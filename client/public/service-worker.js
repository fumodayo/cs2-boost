self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : "No payload";
  console.log("Push event received:", data); // Check if this logs
  const options = {
    body: data.body || "Default body",
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Default title", options),
  );
});
