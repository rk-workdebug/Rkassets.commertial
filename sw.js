// SW KILL SWITCH
// This service worker replaces the old one to delete caches and force network requests.

self.addEventListener('install', (event) => {
  // Force immediate activation
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Delete all caches associated with this origin
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          console.log('Deleting cache:', name);
          return caches.delete(name);
        })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Bypass cache completely and go to network
  event.respondWith(fetch(event.request));
});