
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

                const sessionIdEncrypted = CryptoJS.AES.encrypt(String(session.id), '123456Mn.');
                //Para evitar que construya id encriptados con +
                // const urlSafeEncryptedId = CryptoJS.enc.Base64.stringify(sessionIdEncrypted.ciphertext);
                // console.log("ID encriptado: " + urlSafeEncryptedId);
                content += `
            <tr>
                <td>${index+1}</td>
<!--                <td><a href="/albums/${session.id}" class="album">${session.name}</a></td>-->
                <td><a href="/albums?id=${sessionIdEncrypted}" class="album">${session.name}</a></td>
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
                    <div class="d-flex justify-content-center">
                        <button class="btn btn-sm btn-primary verSession" data-id="${sessionIdEncrypted}"><i class="fa-solid fa-eye"></i></button>
                        <button class="btn btn-sm btn-info editarSesion" style="margin-left: 5px;" data-id="${session.id}"><i class="fa-solid fa-pencil"></i></button>
                        <button class="btn btn-sm btn-danger" style="margin-left: 5px;" data-id="${session.id}"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
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

                let isValid = true;
                let errorMessages = [];

                // Validación de campos
                const name = $('#sessionUpdate_name').val().trim();
                const service = $('#sessionUpdate_service').val();
                const date = $('#sessionUpdate_date').val();
                const price = $('#sessionUpdate_price').val();
                const description = $('#sessionUpdate_description').val().trim();

                if (!name) {
                    isValid = false;
                    errorMessages.push('El nombre de la sesión es obligatorio.');
                }

                if (!service) {
                    isValid = false;
                    errorMessages.push('Debe seleccionar un servicio.');
                }

                if (!date) {
                    isValid = false;
                    errorMessages.push('La fecha es obligatoria.');
                } else {
                    const dateObj = new Date(date);
                    if (isNaN(dateObj.getTime())) {
                        isValid = false;
                        errorMessages.push('El formato de la fecha no es válido.');
                    }
                }

                if (!price) {
                    isValid = false;
                    errorMessages.push('El precio es obligatorio.');
                } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
                    isValid = false;
                    errorMessages.push('El precio debe ser un número positivo.');
                }

                if (!description) {
                    isValid = false;
                    errorMessages.push('La descripción es obligatoria.');
                }

                if (!isValid) {
                    showErrors(errorMessages);
                    return;
                }

                removeErrors();
            });

            function showErrors(messages) {
                const errorContainer = $('#error-messages');
                errorContainer.html(messages.map(msg => `<p>${msg}</p>`).join(''));
            }

            function removeErrors() {
                $('#error-messages').empty();
            }

            $('.verSession').click(function(event) {
                event.preventDefault();
                const idSession = $(this).data('id');
                // const sessionIdEncrypted = CryptoJS.AES.encrypt(String(idSession), '123456Mn.').toString();
                window.location.href = `/albums?id=${idSession}`;
                // window.location.href = `/albums/${idSession}`;
            });

            $('#cerrarEditarSesion').click(function (event) {
                event.preventDefault();
                removeErrors();
                $('#modalEditarSesion').css('display', 'none');
            });

            $('#CerrarEditarSessionButton').click(function (event) {
                event.preventDefault();
                removeErrors();
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
                        let isGeneratingPDF = false;
                        $("#descargarVerTicket").click(function () {

                            const modalData = {
                                session: $('#modalVerTicket input[name="session"]').val(),
                                date: $('#modalVerTicket input[name="date"]').val(),
                                service: $('#modalVerTicket select[name="service"] option:selected').text(),
                                precioTotal: $('#modalVerTicket input[name="precioTotal"]').val(),
                                descripcion: $('#modalVerTicket textarea[name="descripcion"]').val(),
                                extras: []
                            };

                            $('#extrasContainer .divExtras').each(function () {
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

                            if (!isGeneratingPDF) {
                                isGeneratingPDF = true;
                                descargarTicket(sessionData, fechaTicket, modalData).then(() => {
                                    isGeneratingPDF = false;
                                });
                            }
                            //descargarTicket(sessionData, fechaTicket, modalData);
                            //generarPDF(sessionData, fechaTicket, modalData);
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
    async function descargarTicket(sessionData, fechaTicket, modalData) {
        let photographer = {};
        let clients = [];
        let infoSession = {
            name: "",
            description: "",
        };
        try {
            const clientsData = await obtenerClientes();
            if (Array.isArray(clientsData)) {
                const sessionClients = sessionData.clients.split(",").map(client => client.trim());
                infoSession.name = sessionData.name;
                infoSession.description = sessionData.description;
                clientsData.forEach(client => {
                    const clientFullName = `${client.name} ${client.surnames}`;

                    if (sessionClients.includes(clientFullName)) {
                        if (client.rol.includes("ROLE_ADMIN_USER")) {
                            photographer = {
                                name: clientFullName,
                                email: client.email,
                                telephone: client.telephone
                            };
                        }
                        if (client.rol.includes("ROLE_USER") && !client.rol.includes("ROLE_ADMIN_USER")) {
                            clients.push({
                                name: clientFullName,
                                email: client.email,
                                telephone: client.telephone
                            });
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

        if (clients.length === 0) {
            clients = ["No especificado"];
        }

        let totalExtras = modalData.extras.reduce((sum, extra) => sum + (parseFloat(extra.price) * parseInt(extra.cantidad, 10)), 0);
        let totalPrice = (parseFloat(modalData.precioTotal) + totalExtras).toFixed(2);
        // let cadenaTotalPrice = `Precio Total: ${totalPrice}`;
        let cadenaDescuentoPrice = `${totalPrice*0,10}`;
        let cadenaTotalConDescuentoPrice = `${totalPrice - cadenaDescuentoPrice}`;
        let filasHTML = "";

        let cont = 1;

        if (modalData.extras && Array.isArray(modalData.extras) && modalData.extras.length > 0) {
            modalData.extras.forEach(extra => {
                const total = extra.cantidad * extra.price;
                filasHTML += "<tr>";
                filasHTML += `<td>${cont}</td>`;
                filasHTML += `<td>${extra.name}</td>`;
                filasHTML += `<td>${extra.cantidad}</td>`;
                filasHTML += `<td class='text-center'>${extra.price} €</td>`;
                filasHTML += `<td class='text-right'>${total.toFixed(2)} €</td>`;
                filasHTML += "</tr>";
                cont++;
            });
        }

        const priceParagraph = document.getElementById("totalPrice");

        let ticketHTML = `
        <style>
        h2 {
            font-size: 1.75rem;
            font-weight: bold;
        }
        </style>
        <div class="container" id="template_invoice">
            <div class="row">
                <div class="col-xs-4">
                    <div class="invoice-title">
                        <h2>Ticket - Sesión #${sessionData.id}</h2>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-xs-6">
                        <strong>Fecha:</strong><br>
                        ${fechaTicket}<br><br>
                </div>
            </div>
            
            <div class="row">
                <div class="col-xs-6">
                        <strong>Nombre:</strong><br>
                        ${infoSession.name}<br><br>
                </div>
            </div>
            
            <div class="row">
                <div class="col-xs-6">
                        <strong>Descripción:</strong><br>
                        ${infoSession.description}<br><br>
                </div>
            </div>
            
            <div class="row">
                <address class="col-xs-6">
                    <strong>Fotógrafo:</strong><br>
                    ${photographer.name}<br>
                    ${photographer.email}<br>
                    ${photographer.telephone}<br><br>
                </address>
            </div>
            
            <div class="row">
                <address class="col-xs-6">
                    <div class="panel-heading">
                        <strong>Cliente:</strong><br>
                        ${clients.map(client => `${client.name} <br> ${client.email} <br> ${client.telephone}`).join("<br>")}<br>
                    </div>
                </address>
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
                                            <td><strong>Servicio Realizado</strong></td>
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
                        ${modalData.extras && modalData.extras.length > 0 ? `
                          <div class="panel-heading">
                            <h3 class="panel-title"><strong>Listado de Extras</strong></h3>
                          </div>
                          <div class="panel-body">
                            <div class="table-responsive">
                              <table class="table table-condensed">
                                <thead>
                                  <tr>
                                    <td><strong>Nº</strong></td>
                                    <td><strong>Extra</strong></td>
                                    <td class="text-center"><strong>Cantidad</strong></td>
                                    <td class="text-center"><strong>Precio/Ud.</strong></td>
                                    <td class="text-right"><strong>Total</strong></td>
                                  </tr>
                                </thead>
                                <tbody id="servicios-body">
                                  ${filasHTML}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ` : ''}
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-condensed">
                                    <thead>
                                        <tr>
                                            <td><strong>SubTotal</strong></td>
                                            <td class="text-center"><strong>Descuento (10%)</strong></td>
                                            <td class="text-center"><strong>TOTAL</strong></td>
                                        </tr>
                                    </thead>
                                    <tbody id="precioCompleto">
                                        <td>${totalPrice} €</td>
                                        <td>${cadenaDescuentoPrice} €</td>
                                        <td>${cadenaTotalConDescuentoPrice} €</td>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong style="font-size: 1.2rem">Método de pago:</strong><br>
                    <p style="text-align: justify;">El pago por los servicios puede realizarse de diversas maneras, adaptándose a las preferencias del cliente. Las opciones incluyen el pago en efectivo, que permite una transacción inmediata y directa; la transferencia bancaria, que proporciona un método seguro y trazable, ideal para montos más elevados; y el uso de bizum, que permite realizar pagos instantáneos a través del móvil, facilitando así la gestión de pagos sin necesidad de efectivo ni de compartir datos bancarios. Es recomendable que el cliente especifique claramente la opción de pago preferente.</p> 
                </div>
            </div>
        </div>
    `;

        let ticketHTML2 = `
        <div class="container">
              <div class="card">
            <div class="card-header">
            Invoice
            <strong>01/01/01/2018</strong> 
              <span class="float-right"> <strong>Status:</strong> Pending</span>
            
            </div>
            <div class="card-body">
            <div class="row mb-4">
            <div class="col-sm-6">
            <h6 class="mb-3">From:</h6>
            <div>
            <strong>Webz Poland</strong>
            </div>
            <div>Madalinskiego 8</div>
            <div>71-101 Szczecin, Poland</div>
            <div>Email: info@webz.com.pl</div>
            <div>Phone: +48 444 666 3333</div>
            </div>
            
            <div class="col-sm-6">
            <h6 class="mb-3">To:</h6>
            <div>
            <strong>Bob Mart</strong>
            </div>
            <div>Attn: Daniel Marek</div>
            <div>43-190 Mikolow, Poland</div>
            <div>Email: marek@daniel.com</div>
            <div>Phone: +48 123 456 789</div>
            </div>
            
            
            
            </div>
            
            <div class="table-responsive-sm">
            <table class="table table-striped">
            <thead>
            <tr>
            <th class="center">#</th>
            <th>Item</th>
            <th>Description</th>
            
            <th class="right">Unit Cost</th>
              <th class="center">Qty</th>
            <th class="right">Total</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td class="center">1</td>
            <td class="left strong">Origin License</td>
            <td class="left">Extended License</td>
            
            <td class="right">$999,00</td>
              <td class="center">1</td>
            <td class="right">$999,00</td>
            </tr>
            <tr>
            <td class="center">2</td>
            <td class="left">Custom Services</td>
            <td class="left">Instalation and Customization (cost per hour)</td>
            
            <td class="right">$150,00</td>
              <td class="center">20</td>
            <td class="right">$3.000,00</td>
            </tr>
            <tr>
            <td class="center">3</td>
            <td class="left">Hosting</td>
            <td class="left">1 year subcription</td>
            
            <td class="right">$499,00</td>
              <td class="center">1</td>
            <td class="right">$499,00</td>
            </tr>
            <tr>
            <td class="center">4</td>
            <td class="left">Platinum Support</td>
            <td class="left">1 year subcription 24/7</td>
            
            <td class="right">$3.999,00</td>
              <td class="center">1</td>
            <td class="right">$3.999,00</td>
            </tr>
            </tbody>
            </table>
            </div>
            <div class="row">
            <div class="col-lg-4 col-sm-5">
            
            </div>
            
            <div class="col-lg-4 col-sm-5 ml-auto">
            <table class="table table-clear">
            <tbody>
            <tr>
            <td class="left">
            <strong>Subtotal</strong>
            </td>
            <td class="right">$8.497,00</td>
            </tr>
            <tr>
            <td class="left">
            <strong>Discount (20%)</strong>
            </td>
            <td class="right">$1,699,40</td>
            </tr>
            <tr>
            <td class="left">
             <strong>VAT (10%)</strong>
            </td>
            <td class="right">$679,76</td>
            </tr>
            <tr>
            <td class="left">
            <strong>Total</strong>
            </td>
            <td class="right">
            <strong>$7.477,36</strong>
            </td>
            </tr>
            </tbody>
            </table>
            
            </div>
            
            </div>
            
            </div>
            </div>
            </div>
    `;

        let ticketHTML3 = `
        <div class="container" id="template_invoice">
          <div class="row">
            <div class="col-xs-4">
              <div class="invoice-title">
                <h2>Invoice</h2>
              </div>
            </div>
            <div class="col-xs-4">
              <p class="lead">Order # 12345</p>
            </div>
            <div class="col-xs-4">
              <button class="btn btn-info pull-right">Download</button>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-xs-6">
              <address>
                    <strong>Billed To:</strong><br>
                    John Smith<br>
                    1234 Main<br>
                    Apt. 4B<br>
                    Springfield, ST 54321
                </address>
            </div>
            <div class="col-xs-6 text-right">
              <address>
                <strong>Shipped To:</strong><br>
                    Jane Smith<br>
                    1234 Main<br>
                    Apt. 4B<br>
                    Springfield, ST 54321
                </address>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-6">
              <address>
                    <strong>Payment Method:</strong><br>
                    Visa ending **** 4242<br>
                    jsmith@email.com
                </address>
            </div>
            <div class="col-xs-6 text-right">
              <address>
                    <strong>Order Date:</strong><br>
                    March 7, 2014<br><br>
                </address>
            </div>
          </div>
        
          <div class="row">
            <div class="col-md-12">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title"><strong>Order summary</strong></h3>
                </div>
                <div class="panel-body">
                  <div class="table-responsive">
                    <table class="table table-condensed">
                      <thead>
                        <tr>
                          <td><strong>Item</strong></td>
                          <td class="text-center"><strong>Price</strong></td>
                          <td class="text-center"><strong>Quantity</strong></td>
                          <td class="text-right"><strong>Totals</strong></td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>BS-200</td>
                          <td class="text-center">$10.99</td>
                          <td class="text-center">1</td>
                          <td class="text-right">$10.99</td>
                        </tr>
                        <tr>
                          <td>BS-400</td>
                          <td class="text-center">$20.00</td>
                          <td class="text-center">3</td>
                          <td class="text-right">$60.00</td>
                        </tr>
                        <tr>
                          <td>BS-1000</td>
                          <td class="text-center">$600.00</td>
                          <td class="text-center">1</td>
                          <td class="text-right">$600.00</td>
                        </tr>
                        <tr>
                          <td class="thick-line"></td>
                          <td class="thick-line"></td>
                          <td class="thick-line text-center"><strong>Subtotal</strong></td>
                          <td class="thick-line text-right">$670.99</td>
                        </tr>
                        <tr>
                          <td class="no-line"></td>
                          <td class="no-line"></td>
                          <td class="no-line text-center"><strong>Shipping</strong></td>
                          <td class="no-line text-right">$15</td>
                        </tr>
                        <tr>
                          <td class="no-line"></td>
                          <td class="no-line"></td>
                          <td class="no-line text-center"><strong>Total</strong></td>
                          <td class="no-line text-right">$685.99</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    `;

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
                margins
            );
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            ticketHTML = '';
            window.location.reload();
        }
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
};


window.addEventListener("load", async () => {
    await initDataTable();
});


// SEGUNDA FORMA DE GENERAR PDF

 // document.getElementById("prueba").addEventListener("click", function (event) {
 //     generarPDF();
 // });

// function generarPDF() {
//
//     const data = {
//         planTitle: 'John Doe Retirement Plan',
//         retirementAge: 65,
//         socialSecurityAge: 70,
//         salarySavings: '15%',
//         monthlyExpenses: '$2,000',
//         incomeStatementTitle: 'Income Statement at age 65',
//         tableData: [
//             { income: '$1,500', expenses: '$1,000' },
//             { income: '$2,500', expenses: '$2,000' },
//             { income: '$3,500', expenses: '$3,000' }
//         ]
//     };
//
//     htmlToPdf(data);
// }