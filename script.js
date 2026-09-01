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

function mostrarPortal() {

    if (acceso) {
        acceso.style.display = "none";
    }

    if (contenido) {
        contenido.style.display = "block";
    }

}


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


function cerrarSesionPortal() {

    sessionStorage.removeItem(SESION_PORTAL);
    sessionStorage.removeItem(NAVEGACION_INTERNA);
    sessionStorage.removeItem(PORTAL_OCULTO);
    sessionStorage.removeItem(SELECTOR_FOTO);

}


function marcarNavegacionInterna() {

    sessionStorage.setItem(NAVEGACION_INTERNA, "si");

}


/* =========================================================
   COMPROBAR SESIÓN
   ========================================================= */

if (sessionStorage.getItem(NAVEGACION_INTERNA) === "si") {

    sessionStorage.removeItem(NAVEGACION_INTERNA);
    sessionStorage.removeItem(PORTAL_OCULTO);

}


if (sessionStorage.getItem(SESION_PORTAL) === "si") {

    mostrarPortal();

}


/* =========================================================
   VALIDAR CLAVE
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


    inputCodigo.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
            botonVerificar.click();
        }

    });

}


/* =========================================================
   ENTRAR AL MENÚ
   ========================================================= */

const botonContinuar = document.getElementById("continuar");

if (botonContinuar) {

    botonContinuar.addEventListener("click", function () {

        marcarNavegacionInterna();

        window.location.href = "menu.html";

    });

}


/* =========================================================
   DETECTAR ENLACES INTERNOS
   ========================================================= */

document.addEventListener("click", function (e) {

    const enlace = e.target.closest("a");

    if (!enlace) {
        return;
    }

    const destino = enlace.getAttribute("href");

    if (!destino) {
        return;
    }

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

document.addEventListener("visibilitychange", function () {

    if (document.hidden) {

        if (sessionStorage.getItem(SELECTOR_FOTO) === "si") {
            return;
        }

        if (sessionStorage.getItem(NAVEGACION_INTERNA) === "si") {
            return;
        }

        if (sessionStorage.getItem(SESION_PORTAL) === "si") {

            sessionStorage.setItem(PORTAL_OCULTO, "si");

        }

        return;

    }


    if (sessionStorage.getItem(SELECTOR_FOTO) === "si") {

        sessionStorage.removeItem(SELECTOR_FOTO);
        sessionStorage.removeItem(PORTAL_OCULTO);

        return;

    }


    if (
        sessionStorage.getItem(PORTAL_OCULTO) === "si" &&
        sessionStorage.getItem(SESION_PORTAL) === "si"
    ) {

        cerrarSesionPortal();

        const paginaActual =
            window.location.pathname.split("/").pop();

        if (
            paginaActual === "index.html" ||
            paginaActual === ""
        ) {

            mostrarAcceso();

        } else {

            window.location.replace("index.html");

        }

    }

});


/* =========================================================
   FUNCIÓN PREPARADA PARA FUTUROS SELECTORES
   ========================================================= */

function prepararSelectorDeFoto() {

    sessionStorage.setItem(SELECTOR_FOTO, "si");

}


/* =========================================================
   BOTÓN DE SALIR
   ========================================================= */

const botonSalir = document.getElementById("salir-portal");

if (botonSalir) {

    botonSalir.addEventListener("click", function () {

        cerrarSesionPortal();

        window.location.replace("index.html");

    });

}
