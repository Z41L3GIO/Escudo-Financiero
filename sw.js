// Service Worker - Escudo Financiero Pro (PWA Offline Support)
const CACHE_NAME = 'escudo-pro-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './sipres_db.js',
  './apps_prestamo_db.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => {
        console.warn('[SW] Error en precaché de algunos recursos:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;
      return fetch(e.request).catch((err) => {
        // Solo retornar index.html en navegaciones de página, nunca en scripts o estilos
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return Promise.reject(err);
      });
    })
  );
});
