
document.addEventListener('DOMContentLoaded', function(){//Ejecuta función al cargar el html.
    iniciarApp();
});

function iniciarApp() {
    navegacionFija();
    crearGaleria();
    scrollNav();
}

function navegacionFija() {
    const barra = document.querySelector('.header');
    const sobreFestival = document.querySelector('.sobre-festival');
    const body = document.querySelector('body');


    window.addEventListener('scroll', function() { //Ecuchando por el evento scroll.
        if( sobreFestival.getBoundingClientRect().top < 0  ) { //Escuchando por la ubicación del elemento "sobreFestival".
            barra.classList.add('fijo');
            body.classList.add('body-scroll');
        } else {
            barra.classList.remove('fijo');
            body.classList.remove('body-scroll');
        }
    });
}


function scrollNav() {
    const enlaces = document.querySelectorAll('.navegacion-principal a');// querySelectorAll => 3 enlaces.

    enlaces.forEach( enlace => { //forEach para hacer efectivo addEventListener
        enlace.addEventListener('click', function(e) { 
            e.preventDefault(); //Previniendo el comportamiento natural de la velocidad del click en los enlaces.

            const seccionScroll = e.target.attributes.href.value; //Ingresando al valor del elemento al cual se está haciendo click => target.
            const seccion = document.querySelector(seccionScroll);
            seccion.scrollIntoView({ behavior: "smooth"}); //Configurando el comportamiento natural de la velocidad de traslado al hacer click en los enlaces.
        });
    });
}

function crearGaleria() {
    const galeria = document.querySelector('.galeria-imagenes');

    for(let i = 1; i <= 12; i++ ) {
        const imagen = document.createElement('picture');
        imagen.innerHTML = `
            <source srcset="build/img/thumb/${i}.avif" type="image/avif">
            <source srcset="build/img/thumb/${i}.webp" type="image/webp">
            <img loading="lazy" width="200" height="300" src="build/img/thumb/${i}.jpg" alt="imagen galeria">
        `;
        imagen.onclick = function() { //Crea elemento y asigna un evento
            mostrarImagen(i);         //Elemento i se muestra al hacer click
        }

        galeria.appendChild(imagen); //Agrega imagen al contenedor-elemento galería.
    }
}  


function mostrarImagen(id) {
    const imagen = document.createElement('picture');
    imagen.innerHTML = `
        <source srcset="build/img/grande/${id}.avif" type="image/avif">
        <source srcset="build/img/grande/${id}.webp" type="image/webp">
        <img loading="lazy" width="200" height="300" src="build/img/grande/${id}.jpg" alt="imagen galeria">
    `;

    // Crea el Overlay con la imagen
    const overlay = document.createElement('DIV');
    overlay.appendChild(imagen);
    overlay.classList.add('overlay');
    overlay.onclick = function() {
        const body = document.querySelector('body');
        body.classList.remove('fijar-body');
        overlay.remove();
    }

    // Boton para cerrar el Modal
    const cerrarModal = document.createElement('P');
    cerrarModal.textContent = 'X';
    cerrarModal.classList.add('btn-cerrar');
    cerrarModal.onclick = function() {
        const body = document.querySelector('body');
        body.classList.remove('fijar-body');
        overlay.remove();
    }
    overlay.appendChild(cerrarModal);

    // Añadirlo al HTML
    const body = document.querySelector('body');
    body.appendChild(overlay); //Agrega overlay al body
    body.classList.add('fijar-body');
}