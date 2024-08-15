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
        { className: "centered", targets: [0, 3, 4, 5, 6] },
        { orderable: false, targets: [4, 5] },
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
        const response = await fetch("/obtener/clients");
        const jsonArray = await response.json();
        const jsonData = JSON.parse(jsonArray);

// Verificar si jsonData es un array
        if (Array.isArray(jsonData)) {
            let content = ``;
            jsonData.forEach((client, index) => {

                content += `
            <tr>
                <td>${index+1}</td>
                <td class="cliente">${client.name}</td>
                <td>${client.surnames}</td>
                <td>${client.dni}</td>
                <td>${client.telephone}</td>
                <td>${client.email}</td>
                <td>
                    <button class="btn btn-sm btn-primary editarCliente" data-id="${client.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="btn btn-sm btn-danger" data-id="${client.id}"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            </tr>`;
            });

            example.innerHTML = content;
        } else {
            console.error("El objeto recibido no es un array:", jsonData);
        }

        /* Modal Editar Cliente */
        $('.editarCliente').click(function(client) {
            client.preventDefault();

            const idUser = $(this).data('id');
            $('#guardarEditarUsuario').data('idUser', idUser);

            const userName = $(this).closest('tr').find('td:eq(1)').text();
            const userSurnames = $(this).closest('tr').find('td:eq(2)').text();
            const userDni = $(this).closest('tr').find('td:eq(3)').text();
            const userTelephone = $(this).closest('tr').find('td:eq(4)').text();
            const userEmail = $(this).closest('tr').find('td:eq(5)').text();

            $('#modalEditarCliente input[name="userUpdate_name"]').val(userName);
            $('#modalEditarCliente input[name="userUpdate_surnames"]').val(userSurnames);
            $('#modalEditarCliente input[name="userUpdate_dni"]').val(userDni);
            $('#modalEditarCliente input[name="userUpdate_telephone"]').val(userTelephone);
            $('#modalEditarCliente input[name="userUpdate_email"]').val(userEmail);
            $('#modalEditarCliente').css('display', 'grid');
        });

        $('#showPasswordFields').click(function(event) {
            event.preventDefault();
            if ($('#passwordFields').hasClass('show')) {
                $('#passwordFields').removeClass('show').addClass('hidden');
            } else {
                $('#passwordFields').removeClass('hidden').addClass('show');
            }
        });

        $('#guardarEditarUsuario').click(function (event) {
            event.preventDefault();

            const idUser = $(this).data('id-user');
            console.log("ID del usuario: ", idUser);

            let formData = new FormData($('#formClientUpdate')[0]);
            formData.append('idUser', idUser);
            /*
            const password = $('#userUpdate_password').val();
            formData.append('userUpdate_password', password);
            */
            const password1 = $('#userUpdate_password1').val();
            const password2 = $('#userUpdate_password2').val();

            if (password1 !== password2) {
                alert('Las contraseñas no coinciden');
            } else {
                const password = $('#userUpdate_password1').val();
                formData.append('userUpdate_password', password);
            }

            // Validación antes de enviar el formulario usando ID en vez de name
            if (!$('#userUpdate_name').val() || !$('#userUpdate_surnames').val() || !$('#userUpdate_dni').val() || !$('#userUpdate_telephone').val() || !$('#userUpdate_email').val()) {
                console.error('Todos los campos son obligatorios.');
                return;
            }

            // Muestra el contenido de formData en la consola
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            fetch('/update/user', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Cliente actualizado exitosamente');
                        $('#modalEditarCliente').css('display', 'none');
                        location.reload();
                    } else {
                        console.error('Error al actualizar al cliente:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error en la petición:', error);
                });
        });

        $('#cerrarEditarCliente').click(function(client) {
            client.preventDefault();
            $('#modalEditarCliente').css('display', 'none');
        });

        $('#CerrarEditarClienteButton').click(function(client) {
            client.preventDefault();
            $('#modalEditarCliente').css('display', 'none');
        });

        $(".btn-danger").click(async function() {

            const idClient = $(this).data("id");
            console.log("ID en el botón: " + idClient);

            if (confirm("¿Estás seguro de que deseas eliminar esta sesión? Si lo haces se eliminarán todas las sessiones y álbumes asociados a este usuario")) {
                await deleteClient(idClient);
                location.reload();
            }
        });
    } catch (ex) {
        alert(ex);
    }
};

function deleteClient(idClient) {
    console.log("ID en la función delete: " + idClient);
    // Enviar solicitud para eliminar el evento con el ID especificado
    fetch(`/delete/client/${idClient}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || 'Error desconocido al eliminar al usuario');
                });
            }
            return response.json();
        })
        .then(data => {
            // Actualizar la lista de tareas después de eliminar el evento
            listUsers();
            location.reload();
        })
        .catch(error => console.error('Error al eliminar la cliente:', error));
}

window.addEventListener("load", async () => {
    await initDataTable();
});
