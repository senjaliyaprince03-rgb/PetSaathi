const CACHE = "petsaathi-public-v1";
const PUBLIC_SHELL = ["/", "/about", "/services", "/safety", "/offline.html", "/icons/icon-192.svg", "/icons/icon-512.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PUBLIC_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("petsaathi-public-") && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
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

function isPrivatePath(pathname) {
  return pathname.startsWith("/api/") || pathname.startsWith("/dashboard") || pathname.startsWith("/bookings") || pathname.startsWith("/book") || pathname.startsWith("/pets") || pathname.startsWith("/addresses") || pathname.startsWith("/saathi") || pathname.startsWith("/admin") || pathname.startsWith("/notifications") || pathname.startsWith("/login");
}
