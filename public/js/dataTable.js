/* Código para la tabla */

let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    responsive: true,
    dom: 'Bfrtilp',
    buttons: [
        {
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel"></i>',
            titleAttr: 'Exportar a Excel',
            className: 'btn btn-success',
            customize: function(xlsx) {
                const sheet = xlsx.xl.worksheets['sheet1.xml'];
                $('row c[r^="G"]', sheet).each(function () {
                    $(this).remove();
                });
            }
        },
        {
            extend: 'pdfHtml5',
            text: '<i class="fas fa-file-pdf"></i>',
            titleAttr: 'Exportar a PDF',
            className: 'btn btn-danger',
            customize: function(doc) {
                doc.content[1].table.body.forEach(row => row.pop());
            }
        },
        {
            extend: 'print',
            text: '<i class="fas fa-print"></i>',
            titleAttr: 'Imprimir',
            className: 'btn btn-info',
            customize: function(win) {
                $(win.document.body).find('div.dt-print-view:first').remove();
                $(win.document.body).find('table').find('th:last-child, td:last-child').remove();
            }
        },
    ],
    lengthMenu: [5, 10, 15, 20, 100],
    columnDefs: [
        { className: "centered", targets: [0, 2, 3, 4, 5, 7, 8, 9] },
        { orderable: false, targets: [5, 6, 7, 8, 9, 10] },
        { searchable: false, targets: [1] }
    ],
    destroy: true,
    language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json",
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ninguna sesión encontrada",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ninguna sesión encontrada",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        },
    }
};

const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    }

    await listUsers();

    dataTable = $("#example").DataTable(dataTableOptions);

    dataTableIsInitialized = true;
};

async function obtenerClientes() {
    try {
        const response = await fetch("/obtener/clients");
        const jsonArray = await response.json();
        const jsonData = JSON.parse(jsonArray);
        return Array.isArray(jsonData) ? jsonData : [];
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        return [];
    }
}

const listUsers = async () => {
    try {
        const response = await fetch("/obtener/sessions");
        const jsonArray = await response.json();
        const jsonData = JSON.parse(jsonArray);

        const clients = await obtenerClientes();

        if (Array.isArray(jsonData)) {
            let content = ``;
            jsonData.forEach((session, index) => {

                // Formatear la fecha
                const fechaOriginal = session.date.date;
                const fecha = new Date(fechaOriginal);
                const dia = fecha.getDate();
                const mes = fecha.getMonth() + 1;
                const anio = fecha.getFullYear();
                const hora = fecha.getHours();
                const minutos = fecha.getMinutes();
                const fechaFormateada = `${anio}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia} (${hora}:${minutos < 10 ? '0' + minutos : minutos})`;

                const sessionClientNames = session.clients.split(',').map(name => name.trim());

                const admins = sessionClientNames
                    .map(clientName => clients.find(client => `${client.name} ${client.surnames}` === clientName && client.rol[0] === '%ROLE_ADMIN_USER%'))
                    .filter(client => client)
                    .map(client => `${client.name} ${client.surnames}`)
                    .join(', ');

                const users = sessionClientNames
                    .map(clientName => clients.find(client => `${client.name} ${client.surnames}` === clientName && client.rol[0] === '%ROLE_USER%'))
                    .filter(client => client)
                    .map(client => `${client.name} ${client.surnames}`)
                    .join(', ');

                content += `
            <tr>
                <td>${index+1}</td>
                <td><a href="/albums/${session.id}" class="album">${session.name}</a></td>
                <td>${session.service}</td>
                <td>${session.extras}</td>
                <td>${fechaFormateada}</td>
                <td>${session.price}€</td>
                <td>${session.description}</td>
                <td>${admins}</td>
                <td>${users}</td>
                <td class="bloque">
                    <div>
                        <button class="btn btn-sm btn-primary verTicket" data-id="${session.id}"><i class="fa-solid fa-eye"></i></button>
                        <!-- <button class="btn btn-sm btn-primary crearTicket" data-row="${session.id}"><i class="fa-solid fa-pencil"></i></button> -->
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary editarSesion" data-id="${session.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="btn btn-sm btn-danger" data-id="${session.id}"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            </tr>`;
            });

            example.innerHTML = content;
        } else {
            console.error("El objeto recibido no es un array:", jsonData);
        }

        $(document).ready(function() {

            /* Modal Editar Sesion */
            $('.editarSesion').click(function(event) {

                const idSession = $(this).data('id');
                $('#guardarEditarSesion').data('idSession', idSession);

                const userServiceValue = $('#formSessionUpdate select[name="session[service]"]').val();

                const select = $('#formSessionUpdate select[name="session[service]"]');
                select.empty();

                fetch('/obtener/services')
                    .then(response => response.json())
                    .then(data => {
                        // Vuelve a llenar el select con las nuevas opciones
                        const select = $('#formSessionUpdate select[name="session[service]"]');
                        data.forEach(servicio => {
                            const option = $('<option>').val(servicio.id).text(servicio.name);
                            select.append(option);
                        });

                        // Encuentra la opción correspondiente al userService y selecciónala
                        select.find('option').each(function() {
                            if ($(this).text().trim().toLowerCase() === userService.trim().toLowerCase()) {
                                select.val($(this).val());
                                return false;
                            }
                        });
                    })
                    .catch(error => console.error('Error:', error));

                // Restaura el valor seleccionado originalmente después de llenar el select
                $('#formSessionUpdate select[name="session[service]"]').val(userServiceValue);

                event.preventDefault();
                const userId = $(this).closest('tr').find('td:first').text();
                const userSession = $(this).closest('tr').find('td:eq(1)').text();
                const userService = $(this).closest('tr').find('td:eq(2)').text();
                //const userExtras = $(this).closest('tr').find('td:eq(3)').text().split(',').map(item => item.trim());
                const userDateText = $(this).closest('tr').find('td:eq(4)').text();
                const userPrice = $(this).closest('tr').find('td:eq(5)').text().slice(0, -1);
                const userDescription = $(this).closest('tr').find('td:eq(6)').text();

                const match = userDateText.match(/\((\d{1,2}):(\d{1,2})\)$/);
                const hours = match ? String(match[1]).padStart(2, '0') : '00';
                const minutes = match ? String(match[2]).padStart(2, '0') : '00';
                const datePart = userDateText.split(' ')[0];
                const userDate = new Date(datePart);
                const year = userDate.getFullYear();
                const month = ('0' + (userDate.getMonth() + 1)).slice(-2);
                const day = ('0' + userDate.getDate()).slice(-2);
                const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

                $('#modalEditarSesion input[name="id"]').val(userId);
                $('#modalEditarSesion input[name="session[name]"]').val(userSession);
                //$('#modalEditarSesion select[name="session[service]"]').val(userService);
                //const select = $('#formSessionUpdate select[name="session[service]"]');

                /*
                $('#modalEditarSesion input[id="session_extras_update"]').each(function() {
                    const extraValue = $(this).val();
                    if (userExtras.includes(extraValue)) {
                        $(this).prop('checked', true);
                    } else {
                        $(this).prop('checked', false);
                    }
                });
                */
                $('#modalEditarSesion input[name="session[date]"]').val(formattedDate);
                $('#modalEditarSesion input[name="session[priceSession]"]').val(userPrice);
                $('#modalEditarSesion input[name="session[descriptionSession]"]').val(userDescription);
                $('#modalEditarSesion').css('display', 'grid');
            });


            $('#guardarEditarSesion').click(function (event) {

                const idSession = $(this).data('idSession');
                console.log(idSession);

                event.preventDefault();

                let formData = new FormData($('#formSessionUpdate')[0]);
                formData.append('idSession', idSession);

                fetch('/update/session', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log('Sesión actualizada exitosamente');
                        } else {
                            console.error('Error al actualizar la sesión');
                        }
                    })
                    .catch(error => {
                        console.error('Error en la petición:', error);
                    });
            });

            $('#cerrarEditarSesion').click(function (event) {
                event.preventDefault();
                $('#modalEditarSesion').css('display', 'none');
            });

            /* Modal Ver Ticket */
            $(document).on('click', '.verTicket', function(event) {
                const idSession = $(this).data('id');
                event.preventDefault();

                $.getJSON("/obtener/sessions", function (jsonData) {

                    const data = JSON.parse(jsonData);

                    const fecha = new Date();
                    const sessionData = data.find(session => session.id === idSession);

                    if (sessionData) {

                        const sessionDate = new Date(sessionData.date.date);
                        const year = sessionDate.getFullYear();
                        const month = ('0' + (sessionDate.getMonth() + 1)).slice(-2);
                        const day = ('0' + sessionDate.getDate()).slice(-2);
                        const hours = ('0' + sessionDate.getHours()).slice(-2);
                        const minutes = ('0' + sessionDate.getMinutes()).slice(-2);
                        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

                        const fechaTicket = `${day}-${month}-${year}`;

                        const userServiceValue = $('#modalVerTicket select[name="service"]').val();

                        const select = $('#modalVerTicket select[name="service"]');
                        select.empty();

                        fetch('/obtener/services')
                            .then(response => response.json())
                            .then(data => {
                                data.forEach(servicio => {
                                    const option = $('<option>').val(servicio.id).text(servicio.name);
                                    select.append(option);
                                });

                                // Encuentra la opción correspondiente al userService y selecciónala
                                select.find('option').each(function() {
                                    if ($(this).text().trim().toLowerCase() === sessionData.service.trim().toLowerCase()) {
                                        select.val($(this).val());
                                        return false;
                                    }
                                });
                            })
                            .catch(error => console.error('Error:', error));

                        $('#modalVerTicket select[name="service"]').val(userServiceValue);

                        // Insertar los datos del ticket en el modal
                        $('#modalVerTicket input[name="session"]').val(sessionData.name);
                        $('#modalVerTicket input[name="date"]').val(formattedDate);
                        //$('#modalVerTicket input[name="service"]').val(sessionData.service);
                        $('#modalVerTicket input[name="precioTotal"]').val(sessionData.price);
                        $('#modalVerTicket textarea[name="descripcion"]').val(sessionData.description);

                        if(sessionData.extras === "") {
                            $('#extrasContainer').css('display', 'none');
                        } else {
                            const arrayExtras = sessionData.extras.split(", ");
                            let arrayExtrasFetch;

                            $('#modalVerTicket input[name="nExtras"]').val(arrayExtras.length);
                            $('#modalVerTicket input[name="extras"]').val(arrayExtras[0]);

                            fetch('/obtener/extras')
                                .then(response => response.json())
                                .then(data => {
                                    arrayExtrasFetch = JSON.parse(data);

                                    const extrasContainer = $('#modalVerTicket #extrasContainer');
                                    extrasContainer.empty();
                                    const titulo = $('<label class="label" style="display: block; padding-bottom: 6px;">').text("Extras");
                                    extrasContainer.append(titulo);
                                    for (let i = 1; i <= arrayExtras.length; i++) {
                                        const extra = arrayExtras[i - 1];
                                        const precio = arrayExtrasFetch.find(e => e.name === extra)?.price || 0;
                                        const label = $('<label>').text(`Extra ${i}: ${extra}`);
                                        const input = $('<input>').attr({
                                            type: 'number',
                                            name: `extra${i}Precio`,
                                            value: precio,
                                            class: "botonesExtras",
                                            style: "margin-top: 10px; margin-bottom: 10px;"
                                        });
                                        extrasContainer.append(label);
                                        extrasContainer.append(input);
                                    }
                                    $('#extrasContainer').css('display', 'block');
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });
                        }

                        // Descargar ticket
                        $("#descargarVerTicket").click(function() {
                            descargarTicket(sessionData, fechaTicket);
                        });

                        // Mostrar el modal
                        $('#modalVerTicket').css('display', 'grid');
                    } else {
                        console.error("No se encontraron datos para el usuario con ID: " + idSession);
                    }
                });
            });

            $('#cerrarVerTicket').click(function (event) {
                event.preventDefault();
                //location.reload();
                $('#modalVerTicket').css('display', 'none');
            });

            $(".btn-danger").click(async function () {

                const idSession = $(this).data("id");
                console.log("ID en el botón: " + idSession);

                if (confirm("¿Estás seguro de que deseas eliminar esta sesión?")) {
                    await deleteSession(idSession);
                    //location.reload();
                }
            });
        });
    } catch (ex) {
        alert(ex);
    }
};

function descargarTicket(sessionData, fechaTicket) {
    var ticketHTML = `
        <div class="container" id="template_invoice">
            <div class="row">
                <div class="col-xs-4">
                    <div class="invoice-title">
                        <h2>Ticket</h2>
                    </div>
                </div>
                <div class="col-xs-4">
                    <p class="lead">Sesión # ${sessionData.id}</p>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-xs-6">
                    <address>
                        <strong>Fotógrafo:</strong><br>
                        ${sessionData.clients}<br>
                    </address>
                </div>
                <div class="col-xs-6 text-right">
                    <address>
                        <strong>Cliente:</strong><br>
                        ${sessionData.clients}<br>
                    </address>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-6 text-right">
                    <address>
                        <strong>Fecha de Sesión:</strong><br>
                        ${fechaTicket}<br><br>
                    </address>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title"><strong>Lista de Servicios</strong></h3>
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-condensed">
                                    <thead>
                                        <tr>
                                            <td><strong>Servicios</strong></td>
                                            <td class="text-center"><strong>Cantidad</strong></td>
                                            <td class="text-center"><strong>Precio</strong></td>
                                            <td class="text-right"><strong>Total</strong></td>
                                        </tr>
                                    </thead>
                                    <tbody id="servicios-body">
                                        <!-- Filas de la tabla -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="panel-heading">
                            <div id="precioCompleto">
                                <!-- Precio Total -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    var filasHTML = "";
    for (var i = 0; i < sessionData.length; i++) {
        filasHTML += "<tr>";
        filasHTML += "<td>" + sessionData[i].name + "</td>";
        filasHTML += "<td class='text-center'>" + sessionData[i].price + " €" + "</td>";
        filasHTML += "<td class='text-right'>" + sessionData[i].id + " €" + "</td>";
        filasHTML += "</tr>";
    }

    ticketHTML = ticketHTML.replace("<!-- Filas de la tabla -->", filasHTML);

    var precioCompleto = 0;
    for (var i = 0; i < sessionData.length; i++) {
        precioCompleto = precioCompleto + sessionData[i].price;
    }

    var precioCompletoHTML = `
                                <h3>Precio Total:  €</h3>
                            `;

    ticketHTML = ticketHTML.replace("<!-- Precio Total -->", precioCompletoHTML);

    var doc = new jsPDF("p", "pt", "letter"),
        source = ticketHTML,
        margins = {
            top: 40,
            bottom: 60,
            left: 40,
            width: 522
        };

    doc.addFont('Arial', 'Arial', 'UTF-8');

    doc.fromHTML(
        source,
        margins.left,
        margins.top,
        {
            width: margins.width
        },
        function(dispose) {
            var nombreArchivo = "Ticket_" + sessionData.id + ".pdf";
            doc.save(nombreArchivo);
        },
        margins
    );
}

function deleteSession(idSession) {
    console.log("ID en la función delete: " + idSession);
    fetch(`/delete/session/${idSession}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || 'Error desconocido al eliminar la sesión');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Sesión eliminada correctamente:', data.message);
            listUsers(); // Actualizar la lista de usuarios
            location.reload();
        })
        .catch(error => console.error('Error al eliminar la sesión:', error));
}


window.addEventListener("load", async () => {
    await initDataTable();
});