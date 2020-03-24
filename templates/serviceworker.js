// Base Service Worker implementation.  To use your own Service Worker, set the PWA_SERVICE_WORKER_PATH variable in settings.py

var staticCacheName = "django-pwa-v" + new Date().getTime();
var filesToCache = [
    // '/',
    '/static/css/plugins.css',
    '/static/css/color/yellow-color.css',
    '/static/css/style.css',
    '/static/css/rtl-style.css',
    '/static/css/calculator.css',
    // '/static/js/calculator.js',
    // '/static/js/script.js',
    '/static/js/arshia-rtl.js',
    '/static/js/particles-01.app.js',
    '/static/js/particles-01.min.js',
    '/static/js/plugins.js',
    '/static/js/jquery-3.4.1.min.js',
    'https://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2',
    'https://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2',
    'https://fonts.gstatic.com/s/muli/v20/7Auwp_0qiz-afTLGLQ.woff2',
    '/static/img/hero-02.png',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_HTML',
    '/manifest.json',
    // Default files ...
    '/offline/',
    '/static/css/django-pwa-app.css',
    '/static/images/icons/icon-72x72.png',
    '/static/images/icons/icon-96x96.png',
    '/static/images/icons/icon-128x128.png',
    '/static/images/icons/icon-144x144.png',
    '/static/images/icons/icon-152x152.png',
    '/static/images/icons/icon-192x192.png',
    '/static/images/icons/icon-384x384.png',
    '/static/images/icons/icon-512x512.png',
    '/static/images/icons/splash-640x1136.png',
    '/static/images/icons/splash-750x1334.png',
    '/static/images/icons/splash-1242x2208.png',
    '/static/images/icons/splash-1125x2436.png',
    '/static/images/icons/splash-828x1792.png',
    '/static/images/icons/splash-1242x2688.png',
    '/static/images/icons/splash-1536x2048.png',
    '/static/images/icons/splash-1668x2224.png',
    '/static/images/icons/splash-1668x2388.png',
    '/static/images/icons/splash-2048x2732.png'
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("django-pwa-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('/offline/');
            })
    )
});


// const cacheName = 'Jams';
// const staticAssets = [
//     // '/',
//     '/offline',
//     '/manifest.json',
//     '/static/css/plugins.css',
//     '/static/css/color/yellow-color.css',
//     '/static/css/style.css',
//     '/static/css/rtl-style.css',
//     '/static/css/calculator.css',
//     '/static/js/calculator.js',
//     '/static/js/script.js',
//     '/static/js/arshia-rtl.js',
//     '/static/js/particles-01.app.js',
//     '/static/js/particles-01.min.js',
//     '/static/js/plugins.js',
//     '/static/js/jquery-3.4.1.min.js',
//     'https://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2',
//     'https://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2',
//     'https://fonts.gstatic.com/s/muli/v20/7Auwp_0qiz-afTLGLQ.woff2',
//     '/static/img/hero-02.png',
//     'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_HTML',
// ];
// self.addEventListener('install', async e => {
//     console.log("install");
//     const cache = await caches.open(cacheName);
//     await cache.addAll(staticAssets);
//     return self.skipWaiting()
// });
//
// self.addEventListener('activate', e => {
//     console.log("activate");
//     self.clients.claim();
// });
//
// self.addEventListener('fetch', async e => {
//     console.log("fetch");
//     const req = e.request;
//     const url = new URL(req.url);
//     if (url.origin === location.origin){
//         e.respondWith(cacheFirst(req));
//     } else {
//         e.respondWith(networkAndCache(req));
//     }
// });
//
// async function cacheFirst(req) {
//     const cache = await caches.open(cacheName);
//     const cached = await cache.match(req);
//     return cached || fetch(req)
// }
//
// async function networkAndCache(req) {
//     const cache = await caches.open(cacheName);
//     try {
//         const fresh = await fetch(req);
//         await cache.put(req, fresh.clone());
//         return fresh;
//     } catch (e){
//         return  await cache.match(req)
//         // return cached;
//     }
// }
