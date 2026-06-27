const CACHE_NAME = 'vila-da-barra-v3';

const ARQUIVOS_CACHE = [
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// INSTALAÇÃO
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARQUIVOS_CACHE);
    })
  );
  self.skipWaiting();
});

// ATIVAÇÃO
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((chaves) => {
      return Promise.all(
        chaves
          .filter((c) => c !== CACHE_NAME)
          .map((c) => caches.delete(c))
      );
    }).then(() => self.clients.claim())
  );
});

// FETCH (CORRIGIDO)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => response)
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || caches.match('/index.html');
        });
      })
  );
});
