const botonVerificar = document.getElementById("verificar");
const inputCodigo = document.getElementById("codigo");
const acceso = document.getElementById("acceso");
const contenido = document.getElementById("contenido");
const error = document.getElementById("error");

botonVerificar.addEventListener("click", function () {

    if (inputCodigo.value === "3107") {

        acceso.style.display = "none";
        contenido.style.display = "block";

    } else {

        error.textContent = "Esa no parece ser la clave.";

        inputCodigo.value = "";
        inputCodigo.focus();

    }

});

inputCodigo.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        botonVerificar.click();

    }

});

document.getElementById("continuar").addEventListener("click", function () {

    window.location.href = "carta.html";

});