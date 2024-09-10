
/* CALENDARIO, TAREAS DIARIAS Y TAREAS MENSUALES */
let executed1 = false;
document.addEventListener('DOMContentLoaded', function() {
    if (executed1) return;
    executed1 = true;
    // Función para aplicar estilos de tachado al hacer clic en los checkboxes
    function aplicarEstilosTachado() {
        const checkboxes = document.querySelectorAll('.listado input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const tareaId = this.id;
                const label = this.parentNode.querySelector('label');

                // Aplicar estilos de tachado
                if (this.checked) {
                    label.classList.add('tachado');
                } else {
                    label.classList.remove('tachado');
                }

                // Buscar y actualizar el checkbox correspondiente en ambas listas
                const otroCheckboxMensual = document.querySelector(`#listadoTareasMensuales input[type="checkbox"][id="${tareaId}"]`);
                const otroCheckboxDiario = document.querySelector(`#listadoTareasDiarias input[type="checkbox"][id="${tareaId}"]`);

                if (otroCheckboxMensual) {
                    otroCheckboxMensual.checked = this.checked;
                    const otroLabelMensual = otroCheckboxMensual.parentNode.querySelector('label');
                    if (this.checked) {
                        otroLabelMensual.classList.add('tachado');
                    } else {
                        otroLabelMensual.classList.remove('tachado');
                    }
                }

                if (otroCheckboxDiario) {
                    otroCheckboxDiario.checked = this.checked;
                    const otroLabelDiario = otroCheckboxDiario.parentNode.querySelector('label');
                    if (this.checked) {
                        otroLabelDiario.classList.add('tachado');
                    } else {
                        otroLabelDiario.classList.remove('tachado');
                    }
                }
            });
        });
    }


    document.querySelector('.menu-icon').addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
        document.querySelector('.dropdown-content').classList.toggle('active');
        document.querySelector('.menu-icon').classList.toggle('active');
    });

    const daysTag = document.querySelector(".days"),
        currentDateElement = document.querySelector(".current-date"),
        prevNextIcon = document.querySelectorAll(".icons span");

    // Referencia al elemento de fecha en el componente de tareas diarias
    const fechaTareas = document.getElementById("fecha");
    // Referencia al elemento de mes en el componente de tareas mensuales
    const fechaTareasMes = document.getElementById("fechaMes");

    // getting new date, current year and month
    let currentDate = new Date(),
        selectedDate = new Date(), // Variable para almacenar la fecha seleccionada
        currYear = currentDate.getFullYear(),
        currMonth = currentDate.getMonth(),
        selectedDay = currentDate.getDate();

    // storing full name of all months in array
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const renderCalendar = () => {
        let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(),
            lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(),
            lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay(),
            lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();
        let liTag = "";

        for (let i = firstDayOfMonth; i > 0; i--) {
            liTag += `<li class="inactive" style="pointer-events: none;">${lastDateOfLastMonth - i + 1}</li>`;
        }

        for (let i = 1; i <= lastDateOfMonth; i++) {
            let isToday = i === currentDate.getDate() && currMonth === currentDate.getMonth()
            && currYear === currentDate.getFullYear() ? "active" : "";
            let isSelected = i === selectedDate.getDate() && currMonth === selectedDate.getMonth()
            && currYear === selectedDate.getFullYear() ? "selected" : "";
            liTag += `<li class="${isToday} ${selectedDate.getDate()}" data-day="${i}">${i}</li>`;
            // liTag += `<li class="${isToday} ${isSelected}" data-day="${i}">${i}</li>`;
        }
        // console.log("Fecha seleccionada teórica:", selectedDate.getDate());

        for (let i = lastDayOfMonth; i < 6; i++) {
            liTag += `<li class="inactive" style="pointer-events: none;">${i - lastDayOfMonth + 1}</li>`
        }
        currentDateElement.innerText = `${months[currMonth]} ${currYear}`;
        daysTag.innerHTML = liTag;
    }
    renderCalendar();

    prevNextIcon.forEach(icon => { // getting prev and next icons
        icon.addEventListener("click", () => {
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

            if (currMonth < 0 || currMonth > 11) {
                currYear += currMonth < 0 ? -1 : 1;
                currMonth = (currMonth + 12) % 12;
            }
            selectedDate.setFullYear(currYear, currMonth);
            renderCalendar();
        });
    });

    // Función para actualizar la fecha en el componente de tareas diarias y mensuales
    function actualizarFechaTareas() {
        let day = selectedDate.getDate().toString().padStart(2, '0');
        let month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        let year = selectedDate.getFullYear();

        let formattedDate = `${day}/${month}/${year}`;
        fechaTareas.textContent = formattedDate;
        fechaTareasMes.textContent = months[selectedDate.getMonth()];
    }

    // Actualizar fecha en el componente de tareas diarias y mensuales
    actualizarFechaTareas();

    // Escuchar clics en los días del calendario
    daysTag.addEventListener("click", (event) => {
        if (event.target.tagName === 'LI') {
            // Obtener el día seleccionado
            selectedDay = parseInt(event.target.textContent);

            // Limpiar la clase 'active' de todos los elementos de día
            daysTag.querySelectorAll('li').forEach(day => {
                day.classList.remove('active');
            });

            // Agregar la clase 'active' al nuevo día seleccionado
            event.target.classList.add('active');

            // Obtener el mes y año actual
            let selectedMonth = selectedDate.getMonth();
            let selectedYear = selectedDate.getFullYear();

            // Actualizar la fecha actual del objeto 'selectedDate' al día seleccionado
            selectedDate = new Date(selectedYear, selectedMonth, selectedDay);

            // Actualizar fecha en el componente de tareas diarias
            actualizarFechaTareas(selectedDay, selectedMonth, selectedYear);
        }
    });

    document.querySelector(".calendar").addEventListener("click", (event) => {
        let selectedDate = new Date(); // Declaración de la variable selectedDate
        if (!event.target.matches("li")) {
            // No se ha seleccionado un día específico, mantener el último día seleccionado
            selectedDate.setDate(selectedDay);
        }
    });

    // Referencia al elemento de fecha en el componente de tareas diarias
    const fechaElement = document.getElementById("fecha");

    // Referencia al elemento donde se listarán las tareas diarias
    const listadoTareasDiarias = document.getElementById("listadoTareasDiarias");

    // Referencia al elemento donde se listarán las tareas mensuales
    const listadoTareasMensuales = document.getElementById("listadoTareasMensuales");

    // Función para cargar y mostrar las tareas diarias

    function formatearFecha(fecha, opcion) {
        // Dividir la fecha en fecha y hora
        const partes = fecha.split(' ');
        const fechaParte = partes[0];
        const horaParte = partes[1];

        // Dividir la hora en horas y minutos
        const horaMinutos = horaParte.split(':')[0] + ':' + horaParte.split(':')[1];

        // Formar la fecha y la hora en el formato deseado
        const fechaFormateada = fechaParte + ' ' + horaMinutos;

        if (opcion === "a") {
            return horaMinutos;
        } else if (opcion === "b") {
            return fechaFormateada;
        }

    }

    function cargarTareasDiarias() {

        fetch('/obtener/events')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las tareas');
                }
                return response.text(); // Convertir la respuesta a texto
            })
            .then(data => {
                const jsonData = JSON.parse(data);
                const jsonArray = JSON.parse(jsonData);

                const tareasDiarias = jsonArray.filter(tarea => {
                    const tareaDate = new Date(tarea.date.date);
                    return tareaDate.getDate() === selectedDate.getDate() &&
                        tareaDate.getMonth() === selectedDate.getMonth() &&
                        tareaDate.getFullYear() === selectedDate.getFullYear();
                });

                if (Array.isArray(tareasDiarias)) {
                    const htmlTareas = tareasDiarias.map(tarea => `
                        <div class="listado ${tarea.hasbeenmade === true ? '' : 'tachado'}">
                            <input type="checkbox" id="checkboxEvent${tarea.id}" data-id="${tarea.id}" name="${tarea.name}" class="ui-checkbox" ${tarea.hasbeenmade === true ? '' : 'checked'}>
                            <label for="${tarea.name}">
                                <div class="checkbox"></div>
                                ${tarea.name} - ${formatearFecha(tarea.date.date, "b")}
                            </label>
                            <img src="/img/trash.svg" class="deleteButton" alt="Eliminar" data-id="${tarea.id}">
                        </div>
                    `).join('');

                    listadoTareasDiarias.innerHTML = htmlTareas;

                    const botonesCheckbox = document.querySelectorAll('.listado input[type="checkbox"]');
                    botonesCheckbox.forEach(boton => {
                        boton.addEventListener('click', function () {
                            const idEvento = this.dataset.id;
                            updateEvento(idEvento);
                        });
                    });

                    // Añadir event listener para los botones de eliminación
                    const botonesEliminar = document.querySelectorAll('.deleteButton');
                    botonesEliminar.forEach(boton => {
                        boton.addEventListener('click', function () {
                            const idEvento = this.dataset.id;
                            deleteEvento(idEvento);
                        });
                    });
                } else {
                    console.error('Error al cargar las tareas disponibles: Los datos recibidos no son un array o están vacíos');
                }

                // Llamar a la función para aplicar estilos de tachado
                aplicarEstilosTachado();
            })
            .catch(error => console.error('Error al cargar las tareas:', error));
    }

    // Función para cargar y mostrar las tareas mensuales

    function cargarTareasMensuales() {
        const today = new Date();
        const mesActual = today.getMonth();

        fetch('/obtener/events')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las tareas');
                }
                return response.text(); // Convertir la respuesta a texto
            })
            .then(data => {
                const jsonData = JSON.parse(data);
                const jsonArray = JSON.parse(jsonData);

                const tareasMensuales = jsonArray.filter(tarea => {
                    const tareaDate = new Date(tarea.date.date);
                    return tareaDate.getMonth() === selectedDate.getMonth();
                });


                // Verificar si tiene elementos
                if (Array.isArray(tareasMensuales)) {
                    const htmlTareas = tareasMensuales.map(tarea => `
                        <div class="listado ${tarea.hasbeenmade === true ? '' : 'tachado'}">
                            <input type="checkbox" id="checkboxEvent${tarea.id}" data-id="${tarea.id}" name="${tarea.name}" class="ui-checkbox" ${tarea.hasbeenmade === true ? '' : 'checked'}>
                            <label for="${tarea.name}">
                                <div class="checkbox"></div>
                                ${tarea.name} - ${formatearFecha(tarea.date.date, "b")}
                            </label>
                            <img src="/img/trash.svg" class="deleteButton" alt="Eliminar" data-id="${tarea.id}">
                        </div>
                    `).join('');

                    listadoTareasMensuales.innerHTML = htmlTareas;

                    const botonesCheckbox = document.querySelectorAll('.listado input[type="checkbox"]');
                    botonesCheckbox.forEach(boton => {
                        boton.addEventListener('click', function () {
                            const idEvento = this.dataset.id;
                            updateEvento(idEvento);
                        });
                    });

                    // Añadir event listener para los botones de eliminación
                    const botonesEliminar = document.querySelectorAll('.deleteButton');
                    botonesEliminar.forEach(boton => {
                        boton.addEventListener('click', function () {
                            const idEvento = this.dataset.id;
                            Swal.fire({
                                title: "¿Estás seguro?",
                                text: "Vas a eliminar un evento de tu agenda",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Sí, eliminar!",
                                cancelButtonText: "No, cancelar!",
                                reverseButtons: false,
                                customClass: {
                                    confirmButton: "btn btn-success",
                                    cancelButton: "btn btn-danger margen-izquierdo"
                                },
                                buttonsStyling: false
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    Swal.fire({
                                        title: "Eliminado!",
                                        text: "El evento ha sido eliminado",
                                        icon: "success",
                                        showConfirmButton: false,
                                        timer: 2000
                                    });
                                    deleteEvento(idEvento);
                                } else if (result.dismiss === Swal.DismissReason.cancel) {
                                    Swal.fire({
                                        title: "Cancelado",
                                        text: "El evento está a salvo :)",
                                        icon: "error"
                                    });
                                }
                            });
                        });
                    });
                } else {
                    console.error('Error al cargar las tareas disponibles: Los datos recibidos no son un array o están vacíos');
                }

                // Llamar a la función para aplicar estilos de tachado
                aplicarEstilosTachado();
            })
            .catch(error => console.error('Error al cargar las tareas:', error));
    }

    function updateEvento(idEvento) {
        fetch(`/update/event/${idEvento}`, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el evento');
                }
                return response.json();
            })
            .then(data => {
                cargarTareasDiarias()
                cargarTareasMensuales();
            })
            .catch(error => console.error('Error al actualizar el evento:', error));
    }

    function deleteEvento(idEvento) {
        // Enviar solicitud para eliminar el evento con el ID especificado
        fetch(`/delete/evento/${idEvento}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el evento');
                }
                return response.json();
            })
            .then(data => {
                // Actualizar la lista de tareas después de eliminar el evento
                cargarTareasDiarias()
                cargarTareasMensuales();
            })
            .catch(error => console.error('Error al eliminar el evento:', error));
    }


    // Escuchar clics en los días del calendario para actualizar las tareas diarias y mensuales
    document.querySelector(".calendar").addEventListener("click", handleCalendarClick);

    // Función para manejar el evento de clic en los días del calendario
    function handleCalendarClick(event) {
        if (event.target.tagName === 'LI') {
            const selectedDay = parseInt(event.target.textContent);
            const selectedMonth = parseInt(fechaElement.textContent.split('/')[1]) - 1;
            const selectedYear = fechaElement.textContent.split('/')[2];

            const nuevaFecha = new Date(selectedYear, selectedMonth, selectedDay);
            const day = nuevaFecha.getDate().toString().padStart(2, '0');
            const month = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0');
            const year = nuevaFecha.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            fechaElement.textContent = formattedDate;

            cargarTareasDiarias();
            cargarTareasMensuales();
        }
    }

    // Cargar las tareas diarias y mensuales inicialmente
    cargarTareasDiarias();
    cargarTareasMensuales();
});


/* SESIONES DISPONIBLES */
let executed2 = false;
document.addEventListener("DOMContentLoaded", function () {
    if (executed2) return;
    executed2 = true;

    const listadoSesionesDisponibles = document.getElementById("listadoSesionesDisponibles");
    function cargarSesionesDisponibles() {
        fetch('/obtener/sessions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las sesiones');
                }
                return response.text(); // Convertir la respuesta a texto
            })
            .then(data => {
                const jsonData = JSON.parse(data);
                const jsonArray = JSON.parse(jsonData);

                // Verificar si tiene elementos
                if (Array.isArray(jsonArray) && jsonArray.length > 0) {
                    const htmlSesiones = jsonArray.map(sesion => {
                        // Formatear la fecha
                        const fechaOriginal = sesion.date.date;
                        const fecha = new Date(fechaOriginal);
                        const dia = fecha.getDate();
                        const mes = fecha.getMonth() + 1;
                        const anio = fecha.getFullYear();
                        const fechaFormateada = `${anio}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;

                        // Construir la estructura HTML para la sesión
                        const sessionIdEncrypted = CryptoJS.AES.encrypt(String(sesion.id), '123456Mn.');

                        return `
                        <a href="/albums?id=${sessionIdEncrypted}" class="no-style-link">
                            <div class="tarjeta">
                                <img src="/img/portadaSession.png" alt="Descripción de la imagen" />
                                <div class="contenido-texto">
                                        <h3 class="tituloTarjeta">${sesion.name}</h3>
                                        <p><span>Fecha:</span> ${fechaFormateada}</p>
                                        <p><span>Cliente:</span> ${sesion.clients}</p>
                                </div>
                            </div>
                        </a>
                    `;
                    }).join('');

                    // Insertar las sesiones en el contenedor HTML
                    listadoSesionesDisponibles.innerHTML = htmlSesiones;
                } else {
                    console.error('Error al cargar las sesiones disponibles: Los datos recibidos no son un array o están vacíos');
                }
            })
            .catch(error => console.error('Error al cargar las sesiones disponibles:', error.message));
    }

    cargarSesionesDisponibles();
});

/* CLIENTES DISPONIBLES */
let executed3 = false;
document.addEventListener("DOMContentLoaded", function() {
    if (executed3) return;
    executed3 = true;

    const listadoClientesDisponibles = document.getElementById("listadoClientesDisponibles");
    function cargarClientesDisponibles() {
        fetch('/obtener/clients')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los clientes');
                }
                return response.text(); // Convertir la respuesta a texto
            })
            .then(data => {
                const jsonData = JSON.parse(data);
                const jsonArray = JSON.parse(jsonData);

                // Verificar si tiene elementos
                if (Array.isArray(jsonArray) && jsonArray.length > 0) {
                    const htmlClientes = jsonArray.map(cliente => {
                        if (cliente.rol[0] === 'ROLE_USER'){
                            // Concatenar el contenido del objeto clientes
                            const nombreCompleto = cliente.name + " " + cliente.surnames;

                            // Construir la estructura HTML para la sesión
                            return `
                            <div class="tarjeta">
                                <img src="/img/usuario.png" alt="Descripción de la imagen" style="padding: 8px;"/>
                                <div class="contenido-texto">
                                    <h3 class="tituloTarjeta">${nombreCompleto}</h3>
                                    <p><span>Teléfono:</span> ${cliente.telephone}</p>
                                    <p><span>Email:</span> ${cliente.email}</p>
                                </div>
                            </div>
                            `;
                        }
                    }).join('');

                    // Insertar las sesiones en el contenedor HTML
                    listadoClientesDisponibles.innerHTML = htmlClientes;
                } else {
                    console.error('Error al cargar los clientes disponibles: Los datos recibidos no son un array o están vacíos');
                }
            })
            .catch(error => console.error('Error al cargar los clientes disponibles:', error.message));
    }

    cargarClientesDisponibles();
});

// PRUEBAS PARA ARREGLAR ADJUNTAR PDF
let executed4 = false;
document.addEventListener("DOMContentLoaded", function() {
    if (executed4) return;
    executed4 = true;

    document.getElementById("fileUrl").addEventListener("change", function () {
        var fileInput = document.querySelector("#fileUrl");
        var filename = fileInput.value;
        var noFileDisplay = document.querySelector("#noFile");

        // Limitar la longitud del nombre del archivo
        var maxLength = 30; // Ajusta el valor según sea necesario
        var displayFileName = filename.replace("C:\\fakepath\\", "");
        if (displayFileName.length > maxLength) {
            displayFileName = displayFileName.substring(0, maxLength) + '...';
        }

        noFileDisplay.textContent = displayFileName;
        document.querySelector(".file-upload").classList.add("active");

    });
});

function cargarClientes() {
    const listadoClientes = document.getElementById("recipient");

    fetch('/obtener/clients')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los clientes');
            }
            return response.json();
        })
        .then(data => {
            jsonArray = JSON.parse(data);
            let clientesFiltrados = [];
            jsonArray.forEach(cliente => {
                if (cliente.rol.includes('ROLE_USER') && !cliente.rol.includes('ROLE_ADMIN_USER')) {
                    clientesFiltrados.push(cliente);
                }
            });

            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecciona un cliente';
            listadoClientes.appendChild(optionDefault);

            if (clientesFiltrados.length > 0) {
                clientesFiltrados.forEach(cliente => {
                    const option = document.createElement('option');
                    option.value = cliente.id;
                    option.textContent = `${cliente.name} ${cliente.surnames}`;
                    listadoClientes.appendChild(option);
                });
            } else {
                console.error('No se encontraron clientes con el rol ROLE_USER');
            }
        })
        .catch(error => console.error('Error al cargar los clientes disponibles:', error.message));
}

/* Modal Confirmar Envio Correo */
let executed5 = false;
document.addEventListener("DOMContentLoaded", function() {
    if (executed5) return;
    executed5 = true;

    document.getElementById("send").addEventListener("click", function(event) {
        event.preventDefault();

        const recipientSelect = document.getElementById("recipient");
        const recipientId = recipientSelect.value;
        const cliente = recipientSelect.options[recipientSelect.selectedIndex].textContent;
        const asunto = document.getElementById("subject").value;
        const fileInput = document.getElementById("fileUrl");
        // const file = fileInput.files[0];
        const mensaje = document.getElementById("textMessage").value;

        if (!recipientId || !asunto || !mensaje) {
            console.error('Hay campos son obligatorios.');
            return;
        }

        // Cargar datos en el modal
        document.getElementById("clienteModal").textContent = cliente;
        document.getElementById("asuntoModal").textContent = asunto;
        // document.getElementById("ficheroModal").textContent = file.name;
        document.getElementById("mensajeModal").textContent = mensaje;

        // Manejar el caso del archivo
        if (fileInput.files.length > 0) {
            document.getElementById("ficheroModal").textContent = fileInput.files[0].name;
        } else {
            document.getElementById("ficheroModal").textContent = "";
        }

        // Mostrar el modal
        document.getElementById("modalEnvio").style.display = "grid";
    });

    document.getElementById("cancel").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modalEnvio").style.display = "none";
    });


    document.getElementById("formModalEnvio").addEventListener("submit", function(event) {
        event.preventDefault();
        document.getElementById("formMessage").submit();
        document.getElementById("modalEnvio").style.display = "none";
    });

    // function sendEmail() {
    //     console.log("Hola 2");
    //     const recipient = document.getElementById("recipient").value;
    //     const subject = document.getElementById("subject").value;
    //     const fileInput = document.getElementById("fileUrl");
    //     const file = fileInput.files[0];
    //     const textMessage = document.getElementById("textMessage").value;
    //
    //     if (!recipient || !subject || !file || !textMessage) {
    //         console.error('Hay campos son obligatorios.');
    //         return;
    //     }
    //     console.log(recipient);
    //     console.log(subject);
    //     console.log(file);
    //     console.log(textMessage);
    //     const formData = new FormData();
    //     formData.append('recipient', recipient);
    //     formData.append('subject', subject);
    //     formData.append('fileUrl', file);
    //     formData.append('textMessage', textMessage);
    //
    //     fetch('/send/message', {
    //         method: 'POST',
    //         body: formData
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.success) {
    //                 Swal.fire("Mensaje enviado exitosamente");
    //                 console.log('Mensaje enviado exitosamente');
    //             } else {
    //                 console.error('Error al enviar el mensaje');
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error en la petición:', error);
    //         });
    // }

});

let executed6 = false;
document.addEventListener("DOMContentLoaded", function() {
    if (executed6) return;
    executed6 = true;

    document.getElementById('sendModal').addEventListener('click', () => {
        const recipient = document.getElementById("recipient").value;
        const subject = document.getElementById("subject").value;
        const fileInput = document.getElementById("fileUrl");
        // const file = fileInput.files[0];
        const textMessage = document.getElementById("textMessage").value;

        if (!recipient || !subject || !textMessage) {
            console.error('Hay campos son obligatorios.');
        }
        const formData = new FormData();
        formData.append('recipient', recipient);
        formData.append('subject', subject);
        // formData.append('fileUrl', file);
        formData.append('textMessage', textMessage);

        // Añadir el archivo solo si se ha seleccionado uno
        if (fileInput.files.length > 0) {
            formData.append('fileUrl', fileInput.files[0]);
        }

        fetch('/send/message', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: "Éxito",
                        text: "Tu mensaje ha sido enviado",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    console.log('Mensaje enviado exitosamente');
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Error al enviar tu mensaje",
                    });
                    console.error('Error al enviar el mensaje');
                }
            })
            .catch(error => {
                console.error('Error en la petición:', error);
            });
    });
});

let executed7 = false;
document.addEventListener('DOMContentLoaded', function() {
    if (executed7) return;
    executed7 = true;

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
    document.getElementById("abrirModalTarea").addEventListener("click", function (event) {
        document.getElementById("modal").style.display = "grid";
    });

    document.getElementById("Cerrar").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modal").style.display = "none";
    });

    document.getElementById("CerrarTarea").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("modal").style.display = "none";
    });
});

/* Datos del usuario logueado */

document.addEventListener("DOMContentLoaded", function() {
    // Obtener el div de campos y el botón para mostrarlo
    const camposDiv = document.querySelector('.camposPassword');
    const mostrar = document.querySelector('#mostrar');
    // const formPassword = document.getElementById('formPassword');

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

    // formPassword.addEventListener('submit', function(event) {
    //     /*if (!confirm('¿Seguro que quieres actualizar la contraseña?')) {
    //         //event.preventDefault();
    //     }*/
    // });
});

