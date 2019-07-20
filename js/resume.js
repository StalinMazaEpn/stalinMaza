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

document.addEventListener('DOMContentLoaded', function(e){
    load_page();
});

//Registrar Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js',{
        scope: './' // <--- THIS BIT IS REQUIRED
    })
      .then(reg => console.log('Registro de SW exitoso', reg))
      .catch(err => console.warn('Error al tratar de registrar el sw', err))
  }