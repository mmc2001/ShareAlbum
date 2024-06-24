document.addEventListener('DOMContentLoaded', function() {
    const horaActual = new Date().getHours();
    let saludo;
    if (horaActual >= 6 && horaActual <= 12) {
        saludo = "Buenos días";
    } else if (horaActual > 12 && horaActual < 20) {
        saludo = "Buenas tardes";
    } else {
        saludo = "Buenas noches";
    }
    let mensaje = document.getElementById("mensaje");
    mensaje.textContent = saludo + ' ';
});

document.addEventListener("DOMContentLoaded", function() {

    const url = `/obtener/sessions/user`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener las sesiones.");
            }
            return response.json();
        })
        .then(sessions => {
            const sesionesDiv = document.getElementById("sesiones");

            sesionesDiv.innerHTML = "";

            sessions.forEach(session => {
                const sessionCard = document.createElement("div");
                sessionCard.classList.add("session-card");

                const sessionName = document.createElement("h3");
                sessionName.textContent = session.name;
                sessionCard.appendChild(sessionName);

                const sessionDate = document.createElement("p");
                const dateString = session.date;
                const date = new Date(dateString);
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                sessionDate.textContent = formattedDate;
                sessionCard.appendChild(sessionDate);

                const sessionServiceContainer = document.createElement("div");
                sessionServiceContainer.classList.add("campos");
                sessionServiceContainer.classList.add("session-service-container");

                const sessionService = document.createElement("p");
                sessionService.textContent = session.service;
                sessionService.classList.add("sombreado");
                sessionServiceContainer.appendChild(sessionService);

                const serviceButton = document.createElement("button");
                serviceButton.textContent = "Ver álbum";
                serviceButton.classList.add("buttonCard");
                serviceButton.addEventListener("click", () => {
                    // Lógica para el botón
                    alert(`Acción para ${session.service}`);
                });
                sessionServiceContainer.appendChild(serviceButton);

                sessionCard.appendChild(sessionServiceContainer);

                sesionesDiv.appendChild(sessionCard);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("emailButton").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("emailForm").style.display = "grid";
    });

    document.getElementById("closeBtn").addEventListener("click", function (event) {
        event.preventDefault();
        const form = document.getElementById("form");
        form.reset();
        document.getElementById("emailForm").style.display = "none";
    });
});

document.addEventListener('click', sendEmail());

function sendEmail() {
    const emailForm = document.getElementById("emailForm");
    const form = document.getElementById("form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;

        console.log("Subject:", subject);
        console.log("Message:", message);

        fetch('/send/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subject, message })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Correo enviado correctamente');
                } else {
                    alert('Error al enviar el correo: ' + data.message);
                }

                emailForm.style.display = "none";
                form.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al enviar el correo');
            });
    });
}

