document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById('passwordInput');
    const generatePasswordButton = document.getElementById('generatePasswordButton');

    if (passwordInput && generatePasswordButton) {
        generatePasswordButton.addEventListener('click', function() {
            const newPassword = generateRandomPassword();
            passwordInput.value = newPassword;
        });
    }

    function generateRandomPassword() {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const limpiarCamposButton = document.getElementById('limpiarCampos');

    limpiarCamposButton.addEventListener('click', function() {
        const form = document.querySelector('form');
        const inputs = form.querySelectorAll('input');
        const selects = form.querySelectorAll('select');

        inputs.forEach(input => {
            input.value = '';
        });

        selects.forEach(select => {
            select.selectedIndex = 0;
        });
    });
});

/*
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el formulario por su ID
    var form = document.getElementById('modalCliente');

    // Agregar un controlador de eventos para el evento submit del formulario
    form.addEventListener('submit', function(event) {
        // Detener el envío del formulario por defecto
        event.preventDefault();

        // Aquí puedes realizar la validación del formulario con JavaScript
        // Por ejemplo, verificar si los campos obligatorios están completos

        // Si el formulario es válido, puedes enviarlo utilizando AJAX o permitir que se envíe por defecto
        // Ejemplo de validación:
        if (validateForm()) {
            alert("Todo correcto");
        } else {
            // Si el formulario no es válido, puedes mostrar un mensaje de error o realizar alguna otra acción
            alert('Por favor, complete todos los campos obligatorios.');
        }
    });

    // Función para validar el formulario
    function validateForm() {
        // Implementa la lógica de validación del formulario aquí
        // Por ejemplo, verifica si los campos obligatorios están completos

        // Retorna true si el formulario es válido, de lo contrario retorna false
        // Ejemplo de validación:
        var name = document.getElementById('registration_form_name').value;
        var surnames = document.getElementById('registration_form_surnames').value;
        var dni = document.getElementById('registration_form_dni').value;
        var telephone = document.getElementById('registration_form_telephone').value;
        var email = document.getElementById('registration_form_email').value;
        var password = document.getElementById('registration_form_plainPassword').value;
        var termsChecked = document.getElementById('registration_form_agreeTerms').checked;

        console.log(name, surnames, dni, telephone, email, password, termsChecked);

        if (name && surnames && dni && telephone && email && password && termsChecked) {
            return true; // El formulario es válido
        } else {
            return false; // El formulario no es válido
        }
    }
});
*/

