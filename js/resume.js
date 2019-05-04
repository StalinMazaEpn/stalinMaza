(function ($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: (target.offset().top)
                }, 1000, "easeInOutExpo");
                return false;
            }
        }

        // Closes responsive menu when a scroll trigger link is clicked
        $('.js-scroll-trigger').click(function () {
            $('.navbar-collapse').collapse('hide');
        });

        // Activate scrollspy to add active class to navbar items on scroll
        $('body').scrollspy({
            target: '#sideNav'
        });

    })(jQuery); // End of use strict

});

//PRELOADER
const preloader = document.getElementById("preloader_pagina");
const contenido_pagina = document.getElementById("main_content");

function load_page() {
    preloader.classList.add("ocultar");
    contenido_pagina.classList.remove("ocultar");

}
window.onload = load_page;


//Registrar Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./sw.js")
        .then(reg => {
            console.log("Registro de Service Worker Exitoso", reg);
        })
        .catch(err => {
            console.warn("Error al registrar el Service Worker", err);
        });
}