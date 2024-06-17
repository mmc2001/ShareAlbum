document.addEventListener("DOMContentLoaded", function() {
    const modalPerfilLink = document.querySelector('a[href="#modalPerfil"]');
    const cerrarPerfilButton = document.getElementById("CerrarPerfil");

    if (modalPerfilLink) {
        modalPerfilLink.addEventListener("click", function (event) {
            event.preventDefault();
            const modalPerfil = document.getElementById("modalPerfil");
            if (modalPerfil) {
                modalPerfil.style.display = "grid";
            }
        });
    }

    if (cerrarPerfilButton) {
        cerrarPerfilButton.addEventListener("click", function (event) {
            event.preventDefault();
            const modalPerfil = document.getElementById("modalPerfil");
            if (modalPerfil) {
                modalPerfil.style.display = "none";
            }
        });
    }
});
function logout() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'include',
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/login';
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
}
document.addEventListener("DOMContentLoaded", function() {
    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.href === currentUrl) {
            link.classList.add('active');
        }
    });
    const menuIcon = document.querySelector('.menu-icon');
    const navLinksContainer = document.querySelector('.nav-links');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            if (navLinksContainer) {
                console.log('Menu icon clicked');
                navLinksContainer.classList.toggle('active');
            }
            if (dropdownContent) {
                dropdownContent.classList.toggle('active');
            }
            menuIcon.classList.toggle('active');
        });
    }

});
document.addEventListener("DOMContentLoaded", function() {
    const inicioLink = document.getElementById('inicio-link');
    const clientesLink = document.getElementById('clientes-link');
    const sesionesLink = document.getElementById('sesiones-link');
    const logoLink = document.getElementById('logo-link');

    const rutaActual = window.location.pathname;
    if (rutaActual === '/dashboard' && inicioLink) {
        setActiveLink(inicioLink);
    }

    function setActiveLink(link) {
        if (inicioLink) inicioLink.classList.remove('active');
        if (clientesLink) clientesLink.classList.remove('active');
        if (sesionesLink) sesionesLink.classList.remove('active');
        if (link) link.classList.add('active');
    }
});

    const camposDiv = document.querySelector('.camposPassword');
    const mostrar = document.querySelector('#mostrar');
    const formPassword = document.getElementById('formPassword');

    if (mostrar) {
        let mostrando = false;

        const alternarMostrar = function() {
            mostrando = !mostrando;
            if (mostrando) {
                camposDiv.style.display = 'block';
            } else {
                camposDiv.style.display = 'none';
            }
        };

        mostrar.addEventListener('click', function(event) {
            event.preventDefault();
            alternarMostrar();
        });
    }

    if (formPassword) {
        formPassword.addEventListener('submit', function(event) {
            // Aquí puedes añadir una confirmación si es necesario
        });
    }

// LOADING

document.addEventListener("DOMContentLoaded", function() {
    const loadingScreen = document.getElementById("loading-screen");

    // Mostrar el loading screen cuando se está cargando la página
    loadingScreen.style.display = "flex";

    // Ocultar el loading screen cuando la página se ha cargado completamente
    window.addEventListener("load", function() {
        loadingScreen.style.display = "none";
    });
});



