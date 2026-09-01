const SESION_PORTAL = "portalAutorizado";
const NAVEGACION_INTERNA = "navegacionInterna";
const PORTAL_OCULTO = "portalOculto";
const SELECTOR_FOTO = "selectorFotoActivo";


/* =========================================================
   BLOQUEAR ACCESO DIRECTO
   ========================================================= */

if (sessionStorage.getItem(SESION_PORTAL) !== "si") {

    window.location.replace("index.html");

}


/* =========================================================
   MARCAR NAVEGACIÓN INTERNA
   ========================================================= */

function marcarNavegacionInterna() {

    sessionStorage.setItem(NAVEGACION_INTERNA, "si");

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

        /*
           Si está seleccionando una fotografía,
           no cerramos la sesión.
        */

        if (sessionStorage.getItem(SELECTOR_FOTO) === "si") {
            return;
        }


        /*
           Si simplemente está navegando dentro del portal,
           tampoco cerramos la sesión.
        */

        if (sessionStorage.getItem(NAVEGACION_INTERNA) === "si") {
            return;
        }


        sessionStorage.setItem(PORTAL_OCULTO, "si");

        return;
    }


    /*
       Regresó desde selector de fotografías.
    */

    if (sessionStorage.getItem(SELECTOR_FOTO) === "si") {

        sessionStorage.removeItem(SELECTOR_FOTO);
        sessionStorage.removeItem(PORTAL_OCULTO);

        return;
    }


    /*
       Regresó después de abandonar el portal.
    */

    if (sessionStorage.getItem(PORTAL_OCULTO) === "si") {

        sessionStorage.removeItem(SESION_PORTAL);
        sessionStorage.removeItem(PORTAL_OCULTO);
        sessionStorage.removeItem(NAVEGACION_INTERNA);

        window.location.replace("index.html");

    }

});


/* =========================================================
   PREPARAR SELECTOR DE FOTO
   ========================================================= */

function prepararSelectorDeFoto() {

    sessionStorage.setItem(SELECTOR_FOTO, "si");

}


/* =========================================================
   SALIR MANUALMENTE
   ========================================================= */

const botonSalir = document.getElementById("salir-portal");

if (botonSalir) {

    botonSalir.addEventListener("click", function () {

        sessionStorage.clear();

        window.location.replace("index.html");

    });

}
