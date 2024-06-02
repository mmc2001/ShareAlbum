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
        { className: "centered", targets: [0, 2, 3, 4, 6, 7, 8, 9] },
        { orderable: false, targets: [4, 7, 8] },
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

const listUsers = async () => {
    try {
        const response = await fetch("/obtener/sessions");
        const jsonArray = await response.json();
        const jsonData = JSON.parse(jsonArray);

// Verificar si jsonData es un array
        if (Array.isArray(jsonData)) {
            let content = ``;
            jsonData.forEach((session, index) => {

                // Formatear la fecha
                const fechaOriginal = session.date.date;
                const fecha = new Date(fechaOriginal);
                const dia = fecha.getDate();
                const mes = fecha.getMonth() + 1;
                const anio = fecha.getFullYear();
                const fechaFormateada = `${anio}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;

                content += `
            <tr>
                <td>${index+1}</td>
                <td><a href="/albums/${session.id}" class="album">${session.name}</a></td>
                <td>${session.service}</td>
                <td>${fechaFormateada}</td>
                <td>${session.price}€</td>
                <td>${session.description}</td>
                <td>Moisés Moyano Cejudo</td>
                <td>Juan Pérez González</td>
                <td class="bloque">
                    <div style="display: none;">
                        ${session.name}
                    </div>
                    <div">
                        <button class="btn btn-sm btn-primary verTicket" id="verTicket"><i class="fa-solid fa-eye"></i></button>
                        <!-- <button class="btn btn-sm btn-primary crearTicket" data-row="${session.id}"><i class="fa-solid fa-pencil"></i></button> -->
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary editarSesion" data-row="${session.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="btn btn-sm btn-danger" data-id="${session.id}"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            </tr>`;
            });

            example.innerHTML = content;
        } else {
            console.error("El objeto recibido no es un array:", jsonData);
        }

        /* Modal Editar Sesion */
        $('.editarSesion').click(function(event) {
            event.preventDefault();
            const userId = $(this).closest('tr').find('td:first').text();
            const userSession = $(this).closest('tr').find('td:eq(1)').text();
            const userService = $(this).closest('tr').find('td:eq(2)').text();
            const userDate = $(this).closest('tr').find('td:eq(3)').text();
            const userPrice = $(this).closest('tr').find('td:eq(4)').text();
            const userDescription = $(this).closest('tr').find('td:eq(5)').text();
            const userPhotographer = $(this).closest('tr').find('td:eq(6)').text();
            const userClient = $(this).closest('tr').find('td:eq(7)').text();

            $('#modalEditarSesion input[name="id"]').val(userId);
            $('#modalEditarSesion input[name="session"]').val(userSession);
            $('#modalEditarSesion input[name="service"]').val(userService);
            $('#modalEditarSesion input[name="date"]').val(userDate);
            $('#modalEditarSesion input[name="price"]').val(userPrice);
            $('#modalEditarSesion input[name="description"]').val(userDescription);
            $('#modalEditarSesion input[name="photographer"]').val(userPhotographer);
            $('#modalEditarSesion input[name="client"]').val(userClient);

            $('#modalEditarSesion').css('display', 'grid');
        });

        $('#cerrarEditarSesion').click(function(event) {
            event.preventDefault();
            $('#modalEditarSesion').css('display', 'none');
        });

        /* Modal Ver Ticket */
        $("#verTicket").click(function(event) {
            event.preventDefault();

            // Obtener el ID del usuario de la fila
            const userId = $(this).closest('tr').find('td:eq(0)').text().trim();

            // Realizar una solicitud AJAX para obtener los datos del usuario del archivo JSON
            $.getJSON("/obtener/sessions", function(jsonData) {

                const data = JSON.parse(jsonData);

                const fecha = new Date();
                // Buscar el usuario en los datos cargados del JSON
                const userData = data.find(user => user.id == userId);

                if (userData) {
                    // Rellenar los campos del modal con los datos del usuario
                    $('#modalVerTicket input[name="album"]').val(userData.álbum);

                    // Acceder a los datos del ticket del usuario
                    const userTicket = userData.ticket;

                    // Insertar los datos del ticket en el modal
                    $('#modalVerTicket input[name="nombre"]').val(userTicket.nombre);
                    $('#modalVerTicket input[name="precioTotal"]').val(userTicket.precioTotal);
                    $('#modalVerTicket textarea[name="descripcion"]').val(userTicket.descripcion);
                    $('#modalVerTicket input[name="nExtras"]').val(userTicket.nExtras);

                    // Insertar campos para cada extra
                    const extrasContainer = $('#modalVerTicket #extrasContainer');
                    extrasContainer.empty(); // Limpiar contenedor antes de agregar nuevos campos

                    for (let i = 1; i <= userTicket.nExtras; i++) {
                        const extra = userTicket.extras[`extra${i}`];
                        const label = $('<label>').text(`Extra ${i}: ${extra.nombre}`);
                        const input = $('<input>').attr({
                            type: 'text',
                            name: `extra${i}Precio`,
                            value: extra.precio,
                            class: "botonesExtras",
                            style: "margin-top: 10px; margin-bottom: 10px;"
                        });
                        extrasContainer.append(label);
                        extrasContainer.append(input);
                    }

                    // Descargar ticket
                    $("#descargarVerTicket").click(function(event) {
                        var ticketHTML = `
                            <div class="container" id="template_invoice">
                                <div class="row">
                                    <div class="col-xs-4">
                                        <div class="invoice-title">
                                            <h2>Ticket</h2>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <p class="lead">Sesión # ${userData.id}</p>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-xs-6">
                                        <address>
                                            <strong>Fotógrafo:</strong><br>
                                            ${userData.fotógrafo}<br>
                                        </address>
                                    </div>
                                    <div class="col-xs-6 text-right">
                                        <address>
                                            <strong>Cliente:</strong><br>
                                            ${userData.cliente}<br>
                                        </address>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-6 text-right">
                                        <address>
                                            <strong>Fecha de Sesión:</strong><br>
                                            ${fecha}<br><br>
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
                        for (var i = 0; i < userTicket.length; i++) {
                            filasHTML += "<tr>";
                            filasHTML += "<td>" + userTicket[i].nombre + "</td>";
                            filasHTML += "<td class='text-center'>" + userTicket[i].precioTotal + " €" + "</td>";
                            filasHTML += "<td class='text-right'>" + userTicket[i].nExtras + " €" + "</td>";
                            filasHTML += "</tr>";
                        }

                        ticketHTML = ticketHTML.replace("<!-- Filas de la tabla -->", filasHTML);

                        var precioCompleto = 0;
                        for (var i = 0; i < userTicket.length; i++) {
                            precioCompleto = precioCompleto + userTicket[i].precioTotal;
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
                                var nombreArchivo = "Ticket_" + userData.id + ".pdf";
                                doc.save(nombreArchivo);
                            },
                            margins
                        );
                    });

                    // Mostrar el modal
                    $('#modalVerTicket').css('display', 'grid');
                } else {
                    console.error("No se encontraron datos para el usuario con ID: " + userId);
                }
            });
        });

        $('#cerrarVerTicket').click(function(event) {
            event.preventDefault();
            $('#modalVerTicket').css('display', 'none');
        });

        $(".btn-danger").click(async function() {

            const idSession = $(this).data("id");
            console.log("ID en el botón: " + idSession);

            if (confirm("¿Estás seguro de que deseas eliminar esta sesión?")) {
                await deleteSession(idSession);
                location.reload();
            }
        });
    } catch (ex) {
        alert(ex);
    }
};

function deleteSession(idSession) {
    console.log("ID en la función delete: " + idSession);
    // Enviar solicitud para eliminar el evento con el ID especificado
    fetch(`/delete/session/${idSession}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la sesión');
            }
            return response.json();
        })
        .then(data => {
            // Actualizar la lista de tareas después de eliminar el evento
            listUsers();
        })
        .catch(error => console.error('Error al eliminar la sesión:', error));
}

window.addEventListener("load", async () => {
    await initDataTable();
});