//This is the service worker with the Advanced caching
const CACHE_VERSION = 4;
const CACHE_NAME = 'stalin_maza_offline-v' + CACHE_VERSION;
const precacheFiles = [
    '/',
    '/index.html',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700',
    'https://use.fontawesome.com/releases/v5.5.0/css/all.css',
    '/css/animate.css',
    '/css/resume.css',
    'https://code.jquery.com/jquery-3.2.1.slim.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js',
    '/environments/env.json',
    '/img_app/favicon.png',
    "https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js",
    "https://unpkg.com/axios/dist/axios.min.js",
    "/js/leerEnv.js",
    '/js/resume.js',
    '/img_projects/blog_jekyll.png',
    '/img_projects/blog_stalin_master_php.png',
    '/img_projects/codepen_projects.png',
    '/img_projects/formulario_productos_firebase.png',
    '/img_projects/gestor_tareas_master_php.png',
    '/img_projects/gymgalaxy.png',
    '/img_projects/laragram_master_php.png',
    '/img_projects/portafolio_proyectos_nodejs_angular.png',
    '/img_projects/tema_sm_wordpress.png',
    '/img_projects/tienda_productos_paypal.png',
    '/img_projects/tienda_ropa_master_php.png',
    '/img_projects/top_news_master_js.png',
    '/img_projects/venta_producto_stripe_pago.png'
];

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "index.html";

const networkFirstPaths = [
  /* Add an array of regex of paths that should go network first */
  // Example: /\/api\/.*/
];

const avoidCachingPaths = [
  /* Add an array of regex of paths that shouldn't be cached */
  // Example: /\/api\/.*/
];

function pathComparer(requestUrl, pathRegEx) {
  return requestUrl.match(new RegExp(pathRegEx));
}

function comparePaths(requestUrl, pathsArray) {
  if (requestUrl) {
    for (let index = 0; index < pathsArray.length; index++) {
      const pathRegEx = pathsArray[index];
      if (pathComparer(requestUrl, pathRegEx)) {
        return true;
      }
    }
  }

  return false;
}

self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  console.log("[PWA Builder] Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("[PWA Builder] Caching pages during install");

      return cache.addAll(precacheFiles).then(function () {
        if (offlineFallbackPage === "./index.html") {
          return cache.add(new Response("TODO: Update the value of the offlineFallbackPage constant in the serviceworker."));
        }
        return cache.add(offlineFallbackPage);
      });
    })
  );
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  console.log("[PWA Builder] Claiming clients for current page");
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
              cacheNames.map(function(cacheName) {
                if (cacheName.startsWith('pages-cache-') && staticCacheName !== cacheName) {
                  return caches.delete(cacheName);
                }
              })
            );
          })
  );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

    if (comparePaths(event.request.url, networkFirstPaths)) {
        networkFirstFetch(event);
        console.log('networkFirst', event.request.url);
    } else {
        cacheFirstFetch(event);
        console.log('cacheFirst', event.request.url);
  }
});

function cacheFirstFetch(event) {
  event.respondWith(
    fromCache(event.request).then(
      function (response) {
        // The response was found in the cache so we responde with it and update the entry

        // This is where we call the server to get the newest version of the
        // file to use the next time we show view
        event.waitUntil(
          fetch(event.request).then(function (response) {
            return updateCache(event.request, response);
          })
        );

        return response;
      },
      function () {
        // The response was not found in the cache so we look for it on the server
        return fetch(event.request)
          .then(function (response) {
            // If request was success, add or update it in the cache
            event.waitUntil(updateCache(event.request, response.clone()));

            return response;
          })
          .catch(function (error) {
            // The following validates that the request was for a navigation to a new document
            if (event.request.destination !== "document" || event.request.mode !== "navigate") {
              return;
            }

            console.log("[PWA Builder] Network request failed and no cache." + error);
            // Use the precached offline page as fallback
            return caches.open(CACHE_NAME).then(function (cache) {
              cache.match(offlineFallbackPage);
            });
          });
      }
    )
  );
}

function networkFirstFetch(event) {
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // If request was success, add or update it in the cache
        event.waitUntil(updateCache(event.request, response.clone()));
        return response;
      })
      .catch(function (error) {
        console.log("[PWA Builder] Network request Failed. Serving content from cache: " + error);
        return fromCache(event.request);
      })
  );
}

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return error page
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  if (!comparePaths(request.url, avoidCachingPaths)) {
    return caches.open(CACHE_NAME).then(function (cache) {
      return cache.put(request, response);
    });
  }

  return Promise.resolve();
}


console.log('WORKER: executing.');
