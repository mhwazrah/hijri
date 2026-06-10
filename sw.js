const CACHE_NAME = 'hijri-cal-cache-v16';

// App shell precached on install. Same-origin assets are matched with
// { ignoreSearch: true }, so cache-busting query strings (?v=N) can change
// in index.html without breaking offline lookups.
const ASSETS = [
  './',
  './index.html',
  './styles.css?v=11',
  './app.js?v=14',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png'
];

// Install - precache the app shell. allSettled() keeps install resilient:
// a single missing/renamed asset can't abort the whole install.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(ASSETS.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

// Activate - drop old caches and take control immediately.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))))
      .then(() => self.clients.claim())
  );
});

function putInCache(request, response) {
  // Cache 200 plus cross-origin opaque (no-cors fonts) so Amiri/Outfit survive
  // offline; excludes 'opaqueredirect' so a redirected navigation can't poison the shell.
  if (response && (response.status === 200 || response.type === 'opaque')) {
    const clone = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only GET, only http(s) (ignore chrome-extension:// etc.)
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  const url = new URL(req.url);
  const accept = req.headers.get('accept') || '';
  const isNavigation = req.mode === 'navigate' || accept.includes('text/html');

  // 1. Navigations: network-first so redeploys propagate, fall back to the
  //    cached shell when offline. Keeps a fresh copy of index.html cached.
  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => (res.redirected ? res : putInCache('./index.html', res)))
        .catch(() => caches.match(req, { ignoreSearch: true })
          .then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // 2. Google Fonts (CSS + font files): cache-first, populate on demand.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached || fetch(req).then((res) => putInCache(req, res)).catch(() => cached)
      )
    );
    return;
  }

  // 3. Same-origin assets: stale-while-revalidate (ignore ?v= query strings).
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then((cached) => {
        const network = fetch(req)
          .then((res) => putInCache(req, res))
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // 4. Everything else (cross-origin): network, fall back to cache if present.
  event.respondWith(fetch(req).catch(() => caches.match(req, { ignoreSearch: true })));
});
