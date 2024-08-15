document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("nuevoCliente").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modalCliente").style.display = "grid";
    });

    document.getElementById("CerrarClienteButton").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modalCliente").style.display = "none";
    });

    document.getElementById("CerrarCliente").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modalCliente").style.display = "none";
    });
});




