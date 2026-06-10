const CACHE_NAME = 'multi-outils-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/chrono.html',
  '/travel.html',
  '/style.css',
  '/src/config.js',
  '/src/auth.js',
  '/src/main.js',
  '/src/chrono.js',
  '/src/travel.js',
  '/icon-192.png'
];

// 1. Installation : Mise en cache des fichiers critiques
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activation : Nettoyage des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. Stratégie de Cache : Cache First (Idéal pour les performances et le hors-ligne)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});