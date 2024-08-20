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
        { className: "centered", targets: [0, 2, 3, 4, 5, 7, 8, 9, 10] },
        { orderable: false, targets: [ 6, 9, 10] },
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
                    .map(clientName => clients.find(client => `${client.name} ${client.surnames}` === clientName && client.rol[0] === 'ROLE_ADMIN_USER'))
                    .filter(client => client)
                    .map(client => `${client.name} ${client.surnames}`)
                    .join(', ');

                const users = sessionClientNames
                    .map(clientName => clients.find(client => `${client.name} ${client.surnames}` === clientName && client.rol[0] === 'ROLE_USER'))
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
                        <button class="btn btn-sm btn-primary verTicket" data-id="${session.id}"><i class="fa-solid fa-file"></i></button>
                        <!-- <button class="btn btn-sm btn-primary crearTicket" data-row="${session.id}"><i class="fa-solid fa-pencil"></i></button> -->
                    </div>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-primary verSession" data-id="${session.id}"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn btn-sm btn-info editarSesion" data-id="${session.id}"><i class="fa-solid fa-pencil"></i></button>
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
                        const select = $('#formSessionUpdate select[name="sessionUpdate_service"]');
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
                $('#formSessionUpdate select[name="sessionUpdate_service"]').val(userServiceValue);

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
                $('#modalEditarSesion input[name="sessionUpdate_name"]').val(userSession);
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
                $('#modalEditarSesion input[name="sessionUpdate_date"]').val(formattedDate);
                $('#modalEditarSesion input[name="sessionUpdate_price"]').val(userPrice);
                $('#modalEditarSesion input[name="sessionUpdate_description"]').val(userDescription);
                $('#modalEditarSesion').css('display', 'grid');
            });


            $('#guardarEditarSesion').click(function (event) {
                event.preventDefault();

                const idSession = $(this).data('id-session');
                console.log("ID de la sesión: ", idSession);

                let formData = new FormData($('#formSessionUpdate')[0]);
                formData.append('idSession', idSession);

                // Validación antes de enviar el formulario usando ID en vez de name
                if (!$('#sessionUpdate_name').val() || !$('#sessionUpdate_date').val() || !$('#sessionUpdate_price').val() || !$('#sessionUpdate_description').val() || !$('#sessionUpdate_service').val()) {
                    console.error('Todos los campos son obligatorios.');
                    return;
                }

                // Muestra el contenido de formData en la consola
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }

                fetch('/update/session', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            $('#modalEditarSesion').css('display', 'none');
                            Swal.fire({
                                title: "Éxito",
                                text: "Sesión actualizada exitosamente",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 2000
                            }).then(() => {
                                location.reload();
                            });
                            console.log('Sesión actualizada exitosamente');
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Error al actualizar la sesión",
                            });
                            console.error('Error al actualizar la sesión:', data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error en la petición:', error);
                    });
            });

            $('.verSession').click(function(event) {
                event.preventDefault();
                const idSession = $(this).data('id');
                window.location.href = `/albums/${idSession}`;
            });

            $('#cerrarEditarSesion').click(function (event) {
                event.preventDefault();
                $('#modalEditarSesion').css('display', 'none');
            });

            $('#CerrarEditarSessionButton').click(function (event) {
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
                                    const titulo = $('<label class="label" style="display: block; margin: 20px 0 20px; 0">').text("Extras");
                                    extrasContainer.append(titulo);
                                    for (let i = 1; i <= arrayExtras.length; i++) {
                                        const extra = arrayExtras[i - 1];
                                        const precio = arrayExtrasFetch.find(e => e.name === extra)?.price || 0;
                                        const divExtras = $('<div>').addClass('divExtras');
                                        const divAdicionalExtra = $('<div>');
                                        const divAdicionalCantidad = $('<div>');
                                        const labelPrice = $('<label>').text(`Extra ${i}: ${extra}`);
                                        const inputPrice = $('<input>').attr({
                                            type: 'number',
                                            name: `extra${i}Precio`,
                                            value: precio,
                                            class: "botonesExtras",
                                            'data-index': i,
                                            style: "margin-top: 10px; margin-bottom: 10px;"
                                        });
                                        const labelCantidad = $('<label>').text("Cantidad");
                                        const inputCantidad = $('<input>').attr({
                                            type: 'number',
                                            name: `cantidad${i}`,
                                            'data-index': i,
                                            style: "margin-top: 10px; margin-bottom: 10px;"
                                        });
                                        divAdicionalExtra.append(labelPrice, inputPrice);
                                        divAdicionalCantidad.append(labelCantidad, inputCantidad);
                                        divExtras.append(divAdicionalExtra, divAdicionalCantidad);
                                        extrasContainer.append(divExtras);
                                    }
                                    $('#extrasContainer').css('display', 'block');
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });
                        }

                        // Descargar ticket
                        $("#descargarVerTicket").click(function() {

                            const modalData = {
                                session: $('#modalVerTicket input[name="session"]').val(),
                                date: $('#modalVerTicket input[name="date"]').val(),
                                service: $('#modalVerTicket select[name="service"] option:selected').text(),
                                precioTotal: $('#modalVerTicket input[name="precioTotal"]').val(),
                                descripcion: $('#modalVerTicket textarea[name="descripcion"]').val(),
                                extras: []
                            };

                            $('#extrasContainer .divExtras').each(function() {
                                const index = $(this).find('input[type="number"][name^="extra"]').data('index');
                                const extraName = $(this).find('label').first().text().replace(`Extra ${index}: `, '').trim();
                                const extraPrice = $(this).find(`input[name="extra${index}Precio"]`).val();
                                const extraCantidad = $(this).find(`input[name="cantidad${index}"]`).val();

                                modalData.extras.push({
                                    name: extraName,
                                    price: extraPrice,
                                    cantidad: extraCantidad
                                });
                            });


                            descargarTicket(sessionData, fechaTicket, modalData);
                        });+

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

            $('#CerrarVerTicketButton').click(function (event) {
                event.preventDefault();
                //location.reload();
                $('#modalVerTicket').css('display', 'none');
            });

            $(".btn-danger").click(async function () {

                const idSession = $(this).data("id");
                console.log("ID en el botón: " + idSession);

                Swal.fire({
                    title: "¿Estás seguro?",
                    text: "Vas a eliminar esta sesión para siempre",
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
                            text: "La sesión ha sido eliminada.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 2000
                        });
                        deleteSession(idSession);
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal.fire({
                            title: "Cancelado",
                            text: "La sesión está a salvo :)",
                            icon: "error"
                        });
                    }
                });

                // if (confirm("¿Estás seguro de que deseas eliminar esta sesión?")) {
                //     await deleteSession(idSession);
                //     location.reload();
                // }
            });
        });
    } catch (ex) {
        alert(ex);
    }
};

async function descargarTicket(sessionData, fechaTicket, modalData) {
    let photographer = "Prueba";
    let clients = [];

    try {
        const clientsData = await obtenerClientes();
        if (Array.isArray(clientsData)) {
            const sessionClients = sessionData.clients.split(",").map(client => client.trim());

            clientsData.forEach(client => {
                const clientFullName = `${client.name} ${client.surnames}`;

                if (sessionClients.includes(clientFullName)) {
                    if (client.rol.includes("ROLE_ADMIN_USER")) {
                        photographer = clientFullName;
                    }
                    if (client.rol.includes("ROLE_USER") && !client.rol.includes("ROLE_ADMIN_USER")) {
                        clients.push(clientFullName);
                    }
                }
            });
        } else {
            console.error('Unexpected response format:', clientsData);
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        return;
    }

    //console.log(photographer);
    //console.log(clients);

    if (clients.length === 0) {
        clients = ["No especificado"];
    }

    let totalExtras = modalData.extras.reduce((sum, extra) => sum + (parseFloat(extra.price) * parseInt(extra.cantidad, 10)), 0);
    let totalPrice = (parseFloat(modalData.precioTotal) + totalExtras).toFixed(2);
    let cadenaTotalPrice = `Precio Total: ${totalPrice}`;
    let filasHTML = "";
    //console.log(modalData);

    if (modalData.extras && Array.isArray(modalData.extras) && modalData.extras.length > 0) {
        modalData.extras.forEach(extra => {
            const total = extra.cantidad * extra.price;
            filasHTML += "<tr>";
            filasHTML += `<td>${extra.name}</td>`;
            filasHTML += `<td>${extra.cantidad}</td>`;
            filasHTML += `<td class='text-center'>${extra.price} €</td>`;
            filasHTML += `<td class='text-right'>${total.toFixed(2)} €</td>`;
            filasHTML += "</tr>";
        });
    }

    const priceParagraph = document.getElementById("totalPrice");

    let ticketHTML = `
        <div class="container" id="template_invoice">
            <div class="row">
                <div class="col-xs-4">
                    <div class="invoice-title">
                        <h2>Ticket</h2>
                    </div>
                </div>
                <div class="col-xs-4">
                    <p class="lead">Sesión #${sessionData.id}</p>
                </div>
            </div>
            <hr>
            
            <div class="row">
                <div class="col-xs-6">
                    <strong>Fotógrafo:</strong><br><br>
                    <p>${photographer}</p><br>
                </div>
                <div class="col-xs-6 text-right">
                    <strong>Cliente:</strong><br><br>
                    <p>${clients.join(", ")}</p><br>
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
                            <h3 class="panel-title"><strong>Servicio</strong></h3>
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-condensed">
                                    <thead>
                                        <tr>
                                            <td><strong>Lista de Servicios</strong></td>
                                            <td class="text-center"><strong>Precio</strong></td>
                                        </tr>
                                    </thead>
                                    <tbody id="servicios-body">
                                        <td>${modalData.service}</td>
                                        <td>${modalData.precioTotal} €</td>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="panel-heading">
                            <h3 class="panel-title"><strong>Lista de Extras</strong></h3>
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-condensed">
                                    <thead>
                                        <tr>
                                            <td><strong>Extras</strong></td>
                                            <td class="text-center"><strong>Cantidad</strong></td>
                                            <td class="text-center"><strong>Precio</strong></td>
                                            <td class="text-right"><strong>Total</strong></td>
                                        </tr>
                                    </thead>
                                    <tbody id="servicios-body">
                                        ${filasHTML}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="panel-heading">
                            <div id="precioCompleto">
                                <p>${cadenaTotalPrice}</p>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    //console.log(ticketHTML);

    let css = `body{ background: #E0E0E0;}`;

    const doc = new jsPDF("p", "pt", "letter");
    const margins = {
        top: 40,
        bottom: 60,
        left: 40,
        width: 522
    };

    //const html = ticketHTML;

    try {
        doc.fromHTML(
            ticketHTML,
            margins.left,
            margins.top,
            {
                width: margins.width,
                elementHandlers: {
                    '#ignorePDF': function (element, renderer) {
                        return true;
                    }
                }
            },
            function(dispose) {
                const nombreArchivo = `Ticket_${sessionData.id}.pdf`;
                doc.save(nombreArchivo);
            },
            margins,
            css
        );
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
    /*
    const doc = new jsPDF("p", "pt", "letter");
    const margins = {
        top: 40,
        bottom: 60,
        left: 40,
        width: 522
    };

    try {
        doc.fromHTML(
            ticketHTML,
            margins.left,
            margins.top,
            {
                width: margins.width,
                elementHandlers: {
                    '#ignorePDF': function (element, renderer) {
                        return true;
                    }
                }
            },
            function(dispose) {
                const nombreArchivo = `Ticket_${sessionData.id}.pdf`;
                doc.save(nombreArchivo);
            },
            margins
        );
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
     */
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