document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("nuevaSesion").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modalSesion").style.display = "grid";
    });

    document.getElementById("CerrarSesion").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modalSesion").style.display = "none";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("nuevoExtra").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modalExtra").style.display = "grid";
    });

    document.getElementById("CerrarExtra").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modalExtra").style.display = "none";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("nuevoServicio").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modalServicio").style.display = "grid";
    });

    document.getElementById("CerrarServicio").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modalServicio").style.display = "none";
    });
});
