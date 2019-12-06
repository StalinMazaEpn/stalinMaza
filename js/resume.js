//console.log('BEFORE COLLAPSE SETUP');
$('.sm-item-collapse').click(function () {
     //console.log('click setup jquery collapse');
     $('.navbar-collapse').collapse('hide');
});
// Activate scrollspy to add active class to navbar items on scroll
$('body').scrollspy({
    target: '#sideNav'
});

// PRELOADER
const preloader = document.getElementById("preloader_pagina");
const contenido_pagina = document.getElementById("main_content");

function load_page() {
    preloader.classList.add("ocultar");
    contenido_pagina.classList.remove("ocultar");
    document.body.classList.remove("preload_activate");
}

document.addEventListener('DOMContentLoaded', function(e){
    load_page();
        if (document.getElementById('default_link')) {
            document.getElementById('default_link').classList.add('active'); 
        }
});

const registerSW = true;
//Registrar Service Worker
if ("serviceWorker" in navigator && registerSW) {
  if (navigator.serviceWorker.controller) {
    //console.log("[PWA Builder] active service worker found, no need to register");
  } else {
    // Register the service worker
    navigator.serviceWorker
      .register("./sw.js", {
        scope: "/"
      })
      .then(function (reg) {
        //console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
      })
      .catch(err => {
      	//console.warn('Error al tratar de registrar el sw', err);
      });
  }
}
