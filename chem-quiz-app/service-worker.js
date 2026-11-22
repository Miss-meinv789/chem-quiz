// ===== 缓存名字与清单 =====
// 版本号：以后更新内容时，把 v1 改成 v2，用户下次打开就会拉新内容
const CACHE_NAME = 'chem-quiz-v1';

// 需要缓存的文件（相对路径，和你项目结构一一对应）
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// ===== install：首次安装时缓存文件 =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting())   // 新版本立即生效
  );
});

// ===== activate：清理旧版本缓存 =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);   // 删掉不是当前版本的缓存
          }
        })
      );
    }).then(() => self.clients.claim())   // 立即接管页面
  );
});

// ===== fetch：缓存优先，没有再去网络 =====
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;            // 缓存有就用缓存
      }
      return fetch(event.request);        // 缓存没有就走网络
    })
  );
});