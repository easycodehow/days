// service-worker.js
// 오프라인 캐싱 — 앱 셸(app shell) 프리캐싱 후 캐시 우선 응답

// 앱 셸 파일이 바뀔 때마다 버전을 올려야 한다 — service-worker.js 자체 바이트가 그대로면
// 브라우저가 "변경 없음"으로 보고 재설치를 건너뛰어 캐시가 갱신되지 않는다.
const CACHE_NAME = 'days-cache-v18';

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/css/variables.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/components.css',
  '/js/main.js',
  '/js/memo.js',
  '/js/store.js',
  '/js/ui/calendarBar.js',
  '/js/ui/drag.js',
  '/js/views/mainView.js',
  '/js/views/detailView.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 캐시 우선, 없으면 네트워크 요청 후 캐시에 저장
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => cached);
    })
  );
});
