const CACHE_NAME = "gretaeat-v1";
const urlsToCache = [
    "/index.html",
    "/css/style2.css",
    "/JS/script.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];


self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log(" Mise en cache des fichiers");
            return cache.addAll(urlsToCache);
        })
    );
});


self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});


self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log(" Suppression de l'ancien cache");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
