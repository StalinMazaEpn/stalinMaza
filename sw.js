importScripts('./js/serviceworker-cache-polyfill.js');
//Asignar un nombre y la versión de Cache
const CACHE_VERSION = 1;
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
self.addEventListener('install', e => {
    //Abri la versión del cache
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                    .then(() => {
                        self.skipWaiting();
                        console.log('All resources have been fetched and cached.');
                    })
            })
            .catch(err => {
                console.log('Falló registro de cache', err)
            })
    );
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
});
  
self.addEventListener('activate', function(event) {
    // clients.claim() tells the active service worker to take immediate
    // control of all of the clients under its scope.
    self.clients.claim();  
    // Delete all caches that aren't named in CURRENT_CACHES.
    // While there is only one cache in this example, the same logic will handle the case where
    // there are multiple versioned caches.
    let expectedCacheNames = Object.keys(CACHE_NAME).map(function(key) {
      return CACHE_NAME[key];
    });
  
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
            cacheNames.filter(function(cacheName) {
                return cacheName !== CACHE_NAME;
              }).map(function(cacheName) {
                console.log('Deleting '+ cacheName);
                return caches.delete(cacheName);
              })
        );
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
    let requestURL = new URL(event.request.url);
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function(response) {
              // If there is a cached response return this otherwise grab from network
              return response || fetch(event.request).then(function(response) {  
                // Check if the network request is successful
                // don't update the cache with error pages!!
                // Also check the request domain matches service worker domain
                if (response.ok && requestURL.origin == location.origin) {
                  // All good? Update the cache with the network response
                  cache.put(event.request, response.clone());
                }  
                return response;
              }).catch(function() {  
                // We can't access the network, return an offline page from the cache
                return caches.match('/index.html');
      
              });
      
            });
          })
    )
});
