//Asignar un nombre y la versión de Cache
const CACHE_NAME = 'v2_cache_stalin_maza_landingpage',
    urlsToCache = [
        './',
        './index.html',
        'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        'https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700',
        'https://use.fontawesome.com/releases/v5.5.0/css/all.css',
        './css/animate.css',
        './css/resume.css',
        'https://code.jquery.com/jquery-3.2.1.slim.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
        'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js',
        './vendor/jquery.easing.min.js',        
        './environments/env.json',
        './img_app/favicon.png',
        "https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js",
        "https://unpkg.com/axios/dist/axios.min.js",
        "./js/leerEnv.js",
        './js/resume.js',
        './img_projects/blog_jekyll.png',
        './img_projects/blog_stalin_master_php.png',
        './img_projects/codepen_projects.png',
        './img_projects/formulario_productos_firebase.png',
        './img_projects/gestor_tareas_master.png',
        './img_projects/gymgalaxy.png',
        './img_projects/laragram_master.png',
        './img_projects/portafolio_proyectos_nodejs_angular.png',
        './img_projects/tema_sm_wordpress.png',
        './img_projects/tienda_productos_paypal.png',
        './img_projects/tienda_ropa_master_php.png',
        './img_projects/top_news_master.png',
        './img_projects/venta_producto_stripe_pago.png'
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

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
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

