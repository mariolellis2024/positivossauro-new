// Service Worker for Positivossauro Caça-Palavras PWA
const CACHE_NAME = "positivossauro-v2";

// Install: skip waiting, no pre-caching (works with dev and prod)
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate: clean old caches and take control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first with runtime caching
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests and chrome-extension/ws requests
  if (request.method !== "GET") return;
  if (request.url.startsWith("chrome-extension")) return;
  if (request.url.includes("__vite") || request.url.includes("@vite") || request.url.includes("@react-refresh")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses for same-origin
        if (response.ok && request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || new Response("Offline", { status: 503 })))
  );
});
