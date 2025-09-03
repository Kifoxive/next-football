self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon-192x192.png",
      badge: data.icon || "/icon-192x192.png",
      data: { url: data.url || "/" },
    };
    event.waitUntil(
      self.registration.showNotification(data.title || "Notification", options)
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clients) => {
        for (const client of clients) {
          if (client.url === event.notification.data.url && "focus" in client)
            return client.focus();
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(event.notification.data.url);
        }
      })
    )
  );
});
