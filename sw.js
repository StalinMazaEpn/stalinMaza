//Asignar un nombre y la versión de Cache
const CACHE_NAME = 'v1_cache_stalin_maza_landingpage',
    urlsToCache = [
        './',
        './vendor/bootstrap.css',
        'https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700',
        'https://use.fontawesome.com/releases/v5.5.0/css/all.css',
        './css/animate.css',
        './css/resume.css',
        './vendor/jquery.js',
        './vendor/bootstrap.js',
        './vendor/jquery.easing.min.js',
        './js/resume.js',
        './img_favicon/favicon.png'
    ]



//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
    //Abri la versión del cache
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                    .then(() => self.skipWaiting())
            })
            .catch(err => {
                console.log('Falló registro de cache', err)
            })
    );
});

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
    //Comparar version de Caches
    const cacheWhitelist = [CACHE_NAME]
  
    e.waitUntil(
        //Ver las llaves del cache
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        //Eliminamos lo que ya no se necesita en cache
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                )
            })
            // Le indica al SW activar el cache actual
            .then(() => self.clients.claim())
    );
});



//cuando el navegador recupera una url se ejecuta este evento
self.addEventListener('fetch', e => {
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
})

