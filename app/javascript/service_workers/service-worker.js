const version = '2'

self.addEventListener('install', event => {
  const cacheOffline = caches
    .open(version)
    .then(cache => cache.addAll([
      '/',
    ]))

  event.waitUntil(cacheOffline)
})

const fetchAndCache = request => {
  return fetch(request)
    .then(response => {
      const responseClone = response.clone()

      caches
        .open(version)
        .then(cache => cache.put(request, responseClone))

      return response
    })
}

self.addEventListener('fetch', event => {
  const path = new URL(event.request.url).pathname

  if (event.request.method !== 'GET' || path.startsWith('/games') || path.startsWith('/cable')) {
    return
  }

  if (path.endsWith('.js') || path.endsWith('.css') || path.endsWith('.svg')) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetchAndCache(event.request))
    )
  } else {
    event.respondWith(
      fetchAndCache(event.request).catch(() => cache.match(event.request))
    )
  }
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
