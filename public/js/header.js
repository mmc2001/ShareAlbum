/* PERFIL */
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('a[href="#modalPerfil"]').addEventListener("click", function (event) {
        event.preventDefault();

        const modalPerfil = document.getElementById("modalPerfil");
        modalPerfil.style.display = "grid";
    });

    document.getElementById("CerrarPerfil").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modalPerfil").style.display = "none";
    });
});
    function logout() {
        fetch('/logout', {
            method: 'POST',
            credentials: 'include',
        })
            .then(response => {
                if (response.ok) {
                    // Redirect to the login page or any other page after successful logout
                    window.location.href = '/login';
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
    }

    document.addEventListener('DOMContentLoaded', function() {

        const currentUrl = window.location.href;
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(link => {
            if (link.href === currentUrl) {
                link.classList.add('active');
            }
        });
    });

    document.querySelector('.menu-icon').addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
        document.querySelector('.dropdown-content').classList.toggle('active');
        document.querySelector('.menu-icon').classList.toggle('active');
    });


    document.addEventListener('DOMContentLoaded', () => {
        const inicioLink = document.getElementById('inicio-link');
        const clientesLink = document.getElementById('clientes-link');
        const sesionesLink = document.getElementById('sesiones-link');
        const logoLink = document.getElementById('logo-link');


        // Comprobar la ruta actual y establecer la clase activa en el enlace de inicio si estamos en la página de dashboard
        const rutaActual = window.location.pathname;
        if (rutaActual === '/dashboard') {
            setActiveLink(inicioLink);
        }
        function setActiveLink(link) {
            inicioLink.classList.remove('active');
            clientesLink.classList.remove('active');
            sesionesLink.classList.remove('active');
            link.classList.add('active');
        }
    });

/* Datos del usuario logueado */

document.addEventListener("DOMContentLoaded", function() {
    // Obtener el div de campos y el botón para mostrarlo
    const camposDiv = document.querySelector('.camposPassword');
    const mostrar = document.querySelector('#mostrar');
    const formPassword = document.getElementById('formPassword');

    // Estado inicial: ocultar el div de campos
    let mostrando = false;

    // Función para alternar entre mostrar y ocultar el div de campos
    const alternarMostrar = function() {
        mostrando = !mostrando;
        if (mostrando) {
            camposDiv.style.display = 'block';
        } else {
            camposDiv.style.display = 'none';
        }
    };

    // Mostrar u ocultar el div de campos al hacer clic en el botón
    mostrar.addEventListener('click', function(event) {
        event.preventDefault();
        alternarMostrar();
    });

    formPassword.addEventListener('submit', function(event) {
        /*if (!confirm('¿Seguro que quieres actualizar la contraseña?')) {
            //event.preventDefault();
        }*/
    });
});

