const CACHE_NAME = 'dogphotos-cache-v1';

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.destination === 'image' && request.url.includes('/dogphotos/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});
