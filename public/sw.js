const CACHE = "petsaathi-public-v3";
const PUBLIC_SHELL = ["/offline.html"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isPrivatePath(url.pathname)) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(url.pathname).then((cached) => cached || caches.match("/offline.html"))));
    return;
  }
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/images/")) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => { if (response.ok) void caches.open(CACHE).then((cache) => cache.put(request, response.clone())); return response; })));
  }
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
