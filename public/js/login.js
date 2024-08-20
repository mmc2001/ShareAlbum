document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton && signInButton && container) {
        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se encontrados todos los elementos necesarios en el documento",
        });
        console.error('Error: No se encontraron todos los elementos necesarios en el documento.');
    }
});