/* =========================================================
   EL ARTE DE OBSERVAR
   Control de acceso y sesión del portal
   ========================================================= */


/* -------------------------
   CONFIGURACIÓN
   ------------------------- */

const CLAVE_PORTAL = "3107";

const SESION_PORTAL = "portalAutorizado";
const NAVEGACION_INTERNA = "navegacionInterna";
const PORTAL_OCULTO = "portalOculto";
const SELECTOR_FOTO = "selectorFotoActivo";


/* -------------------------
   ELEMENTOS DEL INDEX
   ------------------------- */

const botonVerificar = document.getElementById("verificar");
const inputCodigo = document.getElementById("codigo");
const acceso = document.getElementById("acceso");
const contenido = document.getElementById("contenido");
const error = document.getElementById("error");


/* =========================================================
   FUNCIONES GENERALES
   ========================================================= */


/* Mostrar el contenido después de ingresar correctamente */

function mostrarPortal() {

    if (acceso) {
        acceso.style.display = "none";
    }

    if (contenido) {
        contenido.style.display = "block";
    }

}


/* Mostrar nuevamente la pantalla de acceso */

function mostrarAcceso() {

    if (contenido) {
        contenido.style.display = "none";
    }

    if (acceso) {
        acceso.style.display = "block";
    }

    if (inputCodigo) {
        inputCodigo.value = "";
    }

}


/* Cerrar completamente la sesión */

function cerrarSesionPortal() {

    sessionStorage.removeItem(SESION_PORTAL);
    sessionStorage.removeItem(NAVEGACION_INTERNA);
    sessionStorage.removeItem(PORTAL_OCULTO);
    sessionStorage.removeItem(SELECTOR_FOTO);

}


/* Marcar que vamos hacia otra página DEL MISMO portal */

function marcarNavegacionInterna() {

    sessionStorage.setItem(NAVEGACION_INTERNA, "si");

}


/* =========================================================
   COMPROBAR SESIÓN AL CARGAR UNA PÁGINA
   ========================================================= */


/*
   Si venimos navegando desde otra sección del portal,
   mantenemos la sesión.
*/

if (sessionStorage.getItem(NAVEGACION_INTERNA) === "si") {

    sessionStorage.removeItem(NAVEGACION_INTERNA);
    sessionStorage.removeItem(PORTAL_OCULTO);

}


/*
   Si ya se autenticó durante esta sesión,
   no volvemos a pedir 3107.
*/

if (sessionStorage.getItem(SESION_PORTAL) === "si") {

    mostrarPortal();

}


/* =========================================================
   VALIDAR LA CLAVE 3107
   ========================================================= */

if (botonVerificar && inputCodigo) {

    botonVerificar.addEventListener("click", function () {

        if (inputCodigo.value === CLAVE_PORTAL) {

            sessionStorage.setItem(SESION_PORTAL, "si");

            sessionStorage.removeItem(PORTAL_OCULTO);
            sessionStorage.removeItem(NAVEGACION_INTERNA);

            if (error) {
                error.textContent = "";
            }

            mostrarPortal();

        } else {

            if (error) {
                error.textContent = "Esa no parece ser la clave.";
            }

            inputCodigo.value = "";
            inputCodigo.focus();

        }

    });


    /* Permitir ingresar la clave con Enter */

    inputCodigo.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            botonVerificar.click();

        }

    });

}


/* =========================================================
   BOTÓN ORIGINAL "PARA FINALIZAR..."
   ========================================================= */


/*
   POR AHORA conserva la navegación original hacia carta.html.
   Más adelante index.html será el menú 31/07 - 03/09 -
   Atardeceres y modificaremos esta parte.
*/

const botonContinuar = document.getElementById("continuar");

if (botonContinuar) {

    botonContinuar.addEventListener("click", function () {

        marcarNavegacionInterna();

        window.location.href = "carta.html";

    });

}


/* =========================================================
   DETECTAR ENLACES INTERNOS AUTOMÁTICAMENTE
   ========================================================= */


/*
   Cualquier enlace HTML que lleve hacia otra página
   del propio portal conserva la sesión.
*/

document.addEventListener("click", function (e) {

    const enlace = e.target.closest("a");

    if (!enlace) {
        return;
    }

    const destino = enlace.getAttribute("href");

    if (!destino) {
        return;
    }

    /*
       No consideramos navegación interna:
       enlaces externos, teléfono, correo o anclas.
    */

    if (
        destino.startsWith("http://") ||
        destino.startsWith("https://") ||
        destino.startsWith("mailto:") ||
        destino.startsWith("tel:") ||
        destino.startsWith("#")
    ) {
        return;
    }

    marcarNavegacionInterna();

});


/* =========================================================
   SEGURIDAD CUANDO SALE DEL PORTAL
   ========================================================= */


/*
   COMPORTAMIENTO:

   3107
       ↓
   sesión abierta
       ↓
   puede navegar libremente dentro del portal

   PERO:

   Portal → WhatsApp
   Portal → Instagram
   Portal → otra pestaña
   Portal → minimizar navegador
   Portal → bloquear celular

       ↓

   al regresar se cierra la sesión.
*/


document.addEventListener("visibilitychange", function () {


    /* ---------------------------------------------
       EL PORTAL DEJÓ DE ESTAR VISIBLE
       --------------------------------------------- */

    if (document.hidden) {

        /*
           EXCEPCIÓN:

           Si estamos abriendo el selector de fotografías,
           NO cerramos la sesión.

           Esto será utilizado posteriormente por
           atardeceres.html.
        */

        if (sessionStorage.getItem(SELECTOR_FOTO) === "si") {

            return;

        }


        /*
           Si estamos haciendo navegación interna,
           tampoco cerramos la sesión.
        */

        if (sessionStorage.getItem(NAVEGACION_INTERNA) === "si") {

            return;

        }


        /*
           En cualquier otro caso marcamos que
           realmente salió del portal.
        */

        if (sessionStorage.getItem(SESION_PORTAL) === "si") {

            sessionStorage.setItem(PORTAL_OCULTO, "si");

        }

        return;

    }


    /* ---------------------------------------------
       EL PORTAL VOLVIÓ A ESTAR VISIBLE
       --------------------------------------------- */


    /*
       Si estaba escogiendo una foto,
       regresó legítimamente desde Galería/Fotos/Archivos.
       La sesión continúa.
    */

    if (sessionStorage.getItem(SELECTOR_FOTO) === "si") {

        sessionStorage.removeItem(SELECTOR_FOTO);
        sessionStorage.removeItem(PORTAL_OCULTO);

        return;

    }


    /*
       Si había salido realmente del portal,
       cerramos la sesión.
    */

    if (
        sessionStorage.getItem(PORTAL_OCULTO) === "si" &&
        sessionStorage.getItem(SESION_PORTAL) === "si"
    ) {

        cerrarSesionPortal();


        /*
           Si ya estamos en index,
           simplemente mostramos la contraseña.
        */

        const paginaActual =
            window.location.pathname.split("/").pop();


        if (
            paginaActual === "index.html" ||
            paginaActual === ""
        ) {

            mostrarAcceso();

        } else {

            /*
               Si estaba en 31/07, 03/09 o Atardeceres,
               lo devolvemos al acceso.
            */

            window.location.replace("index.html");

        }

    }

});


/* =========================================================
   FUNCIÓN PARA EL FUTURO SELECTOR DE FOTOS
   ========================================================= */


/*
   atardeceres.html utilizará esta función JUSTO antes
   de abrir Fotos / Galería / Archivos.

   Así el sistema sabe que cambiar de aplicación
   en ese momento es legítimo y NO debe cerrar sesión.
*/

function prepararSelectorDeFoto() {

    sessionStorage.setItem(SELECTOR_FOTO, "si");

}


/* =========================================================
   BOTÓN DE SALIR
   ========================================================= */


/*
   Más adelante podremos poner en el menú:

   <button id="salir-portal">Salir</button>

   y este código cerrará inmediatamente la sesión.
*/

const botonSalir = document.getElementById("salir-portal");

if (botonSalir) {

    botonSalir.addEventListener("click", function () {

        cerrarSesionPortal();

        window.location.replace("index.html");

    });

}
