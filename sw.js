const CACHE_NAME = 'police-app-v2';

// Network first strategy - only for GET requests (page, scripts, images)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // Skip Firebase/API requests - don't cache them
  if (event.request.url.includes('firestore') || event.request.url.includes('googleapis')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('install', () => self.skipWaiting());
