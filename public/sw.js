// Purge all caches and self-unregister to ensure live site always reflects latest code
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Always fetch fresh from network
  event.respondWith(fetch(event.request));
});

// Push notification handler
self.addEventListener("push", function (event) {
  if (!event.data) return;

  const data = event.data.json();

  // Show notification with PetSaathi branding
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/petsaathi-icon-192.png",
      badge: "/icons/badge-72.png",
      data: { url: data.url ?? "/" },
      actions: data.actions ?? [],
      vibrate: [100, 50, 100], // haptic pattern for mobile
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  // Navigate to the relevant page on notification click
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

function isPrivatePath(pathname) {
  return pathname.startsWith("/api/") || pathname.startsWith("/dashboard") || pathname.startsWith("/bookings") || pathname.startsWith("/book") || pathname.startsWith("/pets") || pathname.startsWith("/addresses") || pathname.startsWith("/saathi") || pathname.startsWith("/admin") || pathname.startsWith("/notifications") || pathname.startsWith("/login");
}
