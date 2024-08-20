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

                // const notiglow = document.createElement("div");
                // notiglow.classList.add("notiglow");
                // sessionCard.appendChild(notiglow);
                //
                // const notiborderglow = document.createElement("div");
                // notiborderglow.classList.add("notiborderglow");
                // sessionCard.appendChild(notiborderglow);

                const sessionName = document.createElement("h3");
                sessionName.textContent = session.name;
                sessionCard.appendChild(sessionName);

                // const sessionServiceContainer = document.createElement("div");
                // sessionServiceContainer.classList.add("campos");
                // sessionServiceContainer.classList.add("session-service-container");

                const sessionDate = document.createElement("p");
                const dateString = session.date;
                const date = new Date(dateString);
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                sessionDate.textContent = formattedDate;
                sessionCard.appendChild(sessionDate);

                const sessionCardFooter = document.createElement("div");
                sessionCardFooter.classList.add("sessionCardFooter");
                sessionCard.appendChild(sessionCardFooter);

                const sessionService = document.createElement("p");
                sessionService.textContent = session.service;
                sessionService.classList.add("sombreado");
                sessionCardFooter.appendChild(sessionService);

                const sessionIcon = document.createElement("i");
                sessionIcon.classList.add("fa-solid", "fa-circle-chevron-right", "icono");
                sessionCardFooter.appendChild(sessionIcon);

                // sessionCard.appendChild(sessionServiceContainer);

                const sessionLink = document.createElement("a");
                sessionLink.href = `/album/client/${session.id}`;
                sessionLink.appendChild(sessionCard);

                sesionesDiv.appendChild(sessionLink);
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
                    Swal.fire({
                        title: "Éxito",
                        text: "Tu mensaje ha sido enviado",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    // alert('Correo enviado correctamente');
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Error al enviar el mensaje",

                    });
                    // alert('Error al enviar el correo: ' + data.message);
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

