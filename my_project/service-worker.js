const CACHE_NAME = 'chrono-agenda-v1';

// Liste des fichiers à stocker dans le cache du téléphone/ordinateur
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Installation : Enregistrement des fichiers dans le cache de l'appareil
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Fichiers mis en cache avec succès !');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activation : Nettoyage des anciens caches si tu mets à jour ton application
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Nettoyage de l\'ancien cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Interception (Fetch) : Sert les fichiers depuis le cache si on est hors-ligne
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si le fichier est dans le cache, on le donne, sinon on va le chercher sur le réseau (GitHub)
      return cachedResponse || fetch(event.request);
    })
  );
});