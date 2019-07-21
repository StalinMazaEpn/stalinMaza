importScripts('./js/serviceworker-cache-polyfill.js');

console.log('WORKER: executing.');
//Asignar un nombre y la versión de Cache
const CACHE_VERSION = 2;
const CACHE_NAME = 'stalin_maza_offline-v' + CACHE_VERSION;
const urlsToCache = [
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

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener("install", function(event) {
    console.log('WORKER: install event in progress.');
    /* Using event.waitUntil(p) blocks the installation process on the provided
       promise. If the promise is rejected, the service worker won't be installed.
    */
    event.waitUntil(
      /* The caches built-in is a promise-based API that helps you cache responses,
         as well as finding and deleting them.
      */
      caches
        /* You can open a cache by name, and this method returns a promise. We use
           a versioned cache name here so that we can remove old cache entries in
           one fell swoop later, when phasing out an older service worker.
        */
        .open(CACHE_NAME)
        .then(function(cache) {
          /* After the cache is opened, we can fill it with the offline fundamentals.
             The method below will add all resources in `offlineFundamentals` to the
             cache, after making requests for them.
          */
          return cache.addAll(urlsToCache);
        })
        .then(function() {
          console.log('WORKER: install completed');
        })
    );
  });

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
});
  
self.addEventListener("activate", function(event) {
    /* Just like with the install event, event.waitUntil blocks activate on a promise.
       Activation will fail unless the promise is fulfilled.
    */
    console.log('WORKER: activate event in progress.');
  
    event.waitUntil(
      caches
        /* This method returns a promise which will resolve to an array of available
           cache keys.
        */
        .keys()
        .then(function (keys) {
          // We return a promise that settles when all outdated caches are deleted.
          return Promise.all(
            keys
              .filter(function (key) {
                // Filter by keys that don't start with the latest version prefix.
                return !key.startsWith(CACHE_NAME);
              })
              .map(function (key) {
                /* Return a promise that's fulfilled
                   when each outdated cache is deleted.
                */
                return caches.delete(key);
              })
          );
        })
        .then(function() {
          console.log('WORKER: activate completed.');
        })
    );
  });


//cuando el navegador recupera una url se ejecuta este evento
/*self.addEventListener('fetch', e => {
    let requestURL = new URL(e.request.url);
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
    e.respondWith(
      

        
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperando del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})*/


self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') {
        /* If we don't block the event as shown below, then the request will go to
           the network as usual.
        */
        console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
        return;
    }
    // let requestURL = new URL(event.request.url);
    event.respondWith(
        caches
          /* This method returns a promise that resolves to a cache entry matching
             the request. Once the promise is settled, we can then provide a response
             to the fetch request.
          */
          .match(event.request)
          .then(function(cached) {
            /* Even if the response is in our cache, we go to the network as well.
               This pattern is known for producing "eventually fresh" responses,
               where we return cached responses immediately, and meanwhile pull
               a network response and store that in the cache.
               Read more:
               https://ponyfoo.com/articles/progressive-networking-serviceworker
            */
            var networked = fetch(event.request)
              // We handle the network request with success and failure scenarios.
              .then(fetchedFromNetwork, unableToResolve)
              // We should catch errors on the fetchedFromNetwork handler as well.
              .catch(unableToResolve);
    
            /* We return the cached response immediately if there is one, and fall
               back to waiting on the network as usual.
            */
            console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
            return cached || networked;
    
            function fetchedFromNetwork(response) {
              /* We copy the response before replying to the network request.
                 This is the response that will be stored on the ServiceWorker cache.
              */
              var cacheCopy = response.clone();
    
              console.log('WORKER: fetch response from network.', event.request.url);
    
              caches
                // We open a cache to store the response for this request.
                .open(CACHE_NAME)
                .then(function add(cache) {
                  /* We store the response for this request. It'll later become
                     available to caches.match(event.request) calls, when looking
                     for cached responses.
                  */
                  return cache.put(event.request, cacheCopy);
                })
                .then(function() {
                  console.log('WORKER: fetch response stored in cache.', event.request.url);
                });
    
              // Return the response so that the promise is settled in fulfillment.
              return response;
            }
    
            /* When this method is called, it means we were unable to produce a response
               from either the cache or the network. This is our opportunity to produce
               a meaningful response even when all else fails. It's the last chance, so
               you probably want to display a "Service Unavailable" view or a generic
               error response.
            */
            function unableToResolve () {
              /* There's a couple of things we can do here.
                 - Test the Accept header and then return one of the `offlineFundamentals`
                   e.g: `return caches.match('/some/cached/image.png')`
                 - You should also consider the origin. It's easier to decide what
                   "unavailable" means for requests against your origins than for requests
                   against a third party, such as an ad provider.
                 - Generate a Response programmaticaly, as shown below, and return that.
              */
    
              console.log('WORKER: fetch request failed in both cache and network.');
    
              /* Here we're creating a response programmatically. The first parameter is the
                 response body, and the second one defines the options for the response.
              */
              return new Response('<h1>Service Unavailable</h1>', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/html'
                })
              });
            }
          })
      );
});
