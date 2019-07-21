// Toggle NavBar
$('.navbar-nav>li>a').click(function () {
    console.log('click setup jquery collapse');
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

document.addEventListener('DOMContentLoaded', function (e) {
    load_page();
});



let newWorker;



function showUpdateBar() {
    let toastUpdateNotification = document.getElementById('app_update_avalaible');
}

showUpdateBar();

// The click event on the pop up notification
document.getElementById('reload_page').addEventListener('click', function () {
    newWorker.postMessage({
        action: 'skipWaiting'
    });
});
// The event listener that is fired when the service worker updates
// Here we reload the page


//Registrar Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', {
        scope: '.' // <--- THIS BIT IS REQUIRED
    })
        .then(reg => {
            console.log('Registro de SW exitoso', reg);
            reg.addEventListener('updatefound', () => {
                // An updated service worker has appeared in reg.installing!
                newWorker = reg.installing;
                // Has service worker state changed?
                switch (newWorker.state) {
                    case 'installed':

                        // There is a new service worker available, show the notification
                        if (navigator.serviceWorker.controller) {
                            showUpdateBar();
                        }

                        break;
                }
            });
        })
        .catch(err => console.warn('Error al tratar de registrar el sw', err));
    
        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
          });
}