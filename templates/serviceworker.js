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
    '/static/fonts/BYekan/Yekan.eot',
    '/static/fonts/BYekan/Yekan.svg',
    '/static/fonts/BYekan/Yekan.ttf',
    '/static/fonts/BYekan/Yekan.woff',
    // 'https://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2',
    // 'https://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2',
    // 'https://fonts.gstatic.com/s/muli/v20/7Auwp_0qiz-afTLGLQ.woff2',
    '/static/img/hero-02.png',
    '/static/img/about-02.png',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_HTML',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/config/TeX-AMS_HTML.js?V=2.7.1',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/localization/bcc/bcc.js?V=2.7.1',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/jax/output/HTML-CSS/jax.js?V=2.7.1',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/jax/output/HTML-CSS/fonts/TeX/fontdata.js?V=2.7.1',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/fonts/HTML-CSS/TeX/woff/MathJax_Main-Regular.woff?V=2.7.1',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/fonts/HTML-CSS/TeX/woff/MathJax_Math-Italic.woff?V=2.7.1',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/fonts/HTML-CSS/TeX/woff/MathJax_Size1-Regular.woff?V=2.7.1',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/localization/bcc/HTML-CSS.js?V=2.7.1',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/localization/bcc/MathMenu.js?V=2.7.1',
    '/manifest.json',
    // Default files ...
    '/offline/',
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
