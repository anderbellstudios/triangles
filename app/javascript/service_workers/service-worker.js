const version = '1'

self.addEventListener('install', event => {
  const cacheOffline = caches
    .open(version)
    .then(cache => cache.addAll([
      '/',
    ]))

  event.waitUntil(cacheOffline)
})

self.addEventListener('fetch', event => {
  const path = new URL(event.request.url).pathname

  if (event.request.method !== 'GET' || path.startsWith('/games') || path.startsWith('/cable')) {
    return
  }

  const response = caches.match(event.request)
    .then(cached => {
      return cached || fetch(event.request)
        .then(response => {
          const responseClone = response.clone()

          caches
            .open(version)
            .then(cache => cache.put(event.request, responseClone))

          return response
        })
    })

  event.respondWith(response)
})

self.addEventListener('activate', event => {
  const invalidateCaches = caches
    .keys()
    .then(keys => {
      const deleteOldVersions = keys
        .filter(key => key !== version)
        .map(key => caches.delete(key))

      Promise.all(deleteOldVersions)
    })

  event.waitUntil(invalidateCaches)
})
