
const { src, dest, watch, parallel } = require("gulp"); //Extrayendo la funcionalidad de gulp en el contenedor de tareas gulpfile.js.
                                              //Const {} extrae ciertas funciones que ya incluye gulp.

// CSS
const sass = require("gulp-sass")(require("sass")); //Vincula gulp - sass para poder importar ó extraer la funcionalidad de sass.
const plumber = require('gulp-plumber'); //Llama a plumber para poderlo utilizar en .pipe.
const autoprefixer = require('autoprefixer'); //Optimiza las actualizaciones de css en los diferentes navegadores.
const cssnano = require('cssnano'); //Comprime el código css.
const postcss = require('gulp-postcss');//Hace transformaciones mediante autoprefixer y cssnano.
const sourcemaps = require('gulp-sourcemaps');//Interpreta en el navegador el archivo minificado con postcss para ubicar las referencias del DOM en la consola.

// Imagenes
const cache = require('gulp-cache'); //Extrae funcionalidad de la dependencia gulp-cache.
const imagemin = require('gulp-imagemin'); //Extrae funcionalidad de la dependencia imagemin.
const webp = require('gulp-webp'); //Para extraer la funcionalidad gulp-webp es necesaria la versión 4 de compatibilidad con el proyecto => npm i -D gulp-webp@4 no crea dev en json.
const avif = require('gulp-avif');//Extrae funcionalidad de la dependencia gulp-avif.


//Mejorando código de Javascript
const terser = require('gulp-terser-js'); //Optimiza código JavaScript, no tiene dependencia en .json.


function css(done) {

    //Identifica el archivo de sass = const src
    src('src/scss/**/*.scss') // (**/*) Indica que identifique todos los archivos dentro de la carpeta scss que esta en src. 
    
    .pipe(sourcemaps.init()) //Inicializa el sourcemaps con la hoja de estilo que va a compilar y guarda la referencia.

    .pipe(plumber())//Evita se corte la ejecución del porgrama en caso de algún error presente.                   

     //Compila el archivo de sass = viene de las dependencias
    //Los pipes se ejecutan en cadena después de que se identifica el archivo 
    .pipe(sass()) //Manda llamar la funcionalidad de sass después de importar

    .pipe(postcss( [ autoprefixer(), cssnano() ]) ) //Ejecuta autoprefixer y cssnano mediante postcss.

    .pipe(sourcemaps.write('.'))//Ubicación donde se guarda, el punto indica la misma ubicación => build/css.

    //Almacena en carpera build archivo css = const dest
    .pipe(dest("build/css")); //Manda llamar la funcionalidad dest
    
    done() //Callback función que se llama después de la función tarea, avisa a gulp cuando llega al final
}


function imagenes(done) {

    const opciones = {
        oprimizationLevel: 3
    }

    src('src/img/**/*.{png,jpg}') //Identifica los archivos dentro de la carpeta img dentro de src.
    .pipe(cache(imagemin(opciones))) //Hace más ligeras las imágenes y optimiza en nivel 3 con gulp-imagemin.
    .pipe(dest('build/img')); //Almacena lo complilado en la ruta indicada build/img.

    done();
}


function versionWebp(done) {
    const opciones = {
        quality: 50 //La calidad de las imagenes va de 0 - 100.
    };
    src('src/img/**/*.{png,jpg}') //Identifica los archivos dentro de la carpeta img dentro de src.
    .pipe(webp(opciones))//Convierte las imagenes a .webp y quedan en memoria por algún tiempo.
    .pipe(dest('build/img'));//Almacena lo complilado en la ruta indicada build/img.
    done();
}

function versionAvif(done) {
    const opciones = {
        quality: 50 //La calidad de las imagenes va de 0 - 100.
    };
    src('src/img/**/*.{png,jpg}') //Identifica los archivos dentro de la carpeta img dentro de src.
    .pipe(avif(opciones))//Convierte las imagenes a .webp y quedan en memoria por algún tiempo.
    .pipe(dest('build/img'));//Almacena lo complilado en la ruta indicada build/img.
    done();
}



function javaScript(done) { //No se compila debido a que el programador es quién crea el archivo app.js
    src('src/js/**/*.js') //es decir, no viene del package.json y no se encuentra en los modulos de node
    .pipe(sourcemaps.init()) //Inicializa el sourcemaps con la hoja de estilo que va a compilar y guarda la referencia.
    .pipe( terser() ) //Ejecuta el comprimidor de código javaScript terser.
    .pipe(sourcemaps.write('.'))//Ubicación donde se guarda, el punto indica la misma ubicación => build/css.
    .pipe(dest('build/js'));//básicamente lo transporta solamente.

    done();
}


//Función para agregar watch a gulp
function develop(done) {
    watch('src/scss/**/*.scss' //Archivos observados para cambios
                    , css)     // Función que se manda llamar una vez que cambie algo en el archivo


    watch('src/js/**/*.js' //Archivos observados para cambios
                    , javaScript)   // Función que se manda llamar una vez que cambie algo en el archivo
    done();
}


exports.css = css;
exports.js = javaScript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.develop = parallel(imagenes, versionWebp,versionAvif, javaScript, develop); //Parallel ejecuta las tareas al mismo tiempo.