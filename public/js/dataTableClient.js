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
        { orderable: false, targets: [6] },
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
            $('#modalEditarCliente input[name="userUpdate_email"]').val("");
            $('#modalEditarCliente input[name="userUpdate_email"]').val(userEmail);
            $('#modalEditarCliente input[name="userUpdate_password1"]').val("");
            $('#modalEditarCliente input[name="userUpdate_password2"]').val("");
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

            const formClientUpdate = document.getElementById('formClientUpdate');
            const idUser = $(this).data('id-user');

            const name = document.getElementById('userUpdate_name');
            const surnames = document.getElementById('userUpdate_surnames');
            const dni = document.getElementById('userUpdate_dni');
            const telephone = document.getElementById('userUpdate_telephone');
            const email = document.getElementById('userUpdate_email');
            const password1 = document.getElementById('userUpdate_password1');
            const password2 = document.getElementById('userUpdate_password2');

            let isValid = true;
            let errorMessages = [];

            // Validación de campos obligatorios
            [name, surnames, dni, telephone, email].forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessages.push(`El campo ${field.id.replace('userUpdate_', '')} es obligatorio.`);
                }
            });

            // Validación de DNI español
            const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
            if (dni.value && !dniRegex.test(dni.value)) {
                isValid = false;
                errorMessages.push('El DNI debe tener 8 números seguidos de una letra válida.');
            }

            // Validación de teléfono móvil español
            const phoneRegex = /^[679]{1}[0-9]{8}$/;
            if (telephone.value && !phoneRegex.test(telephone.value)) {
                isValid = false;
                errorMessages.push('El teléfono debe ser un número móvil español válido (9 dígitos empezando por 6, 7 o 9).');
            }

            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value && !emailRegex.test(email.value)) {
                isValid = false;
                errorMessages.push('Por favor, introduce un email válido.');
            }

            // Validación de contraseñas
            if (password1.value || password2.value) {
                if (password1.value !== password2.value) {
                    isValid = false;
                    errorMessages.push('Las contraseñas no coinciden.');
                }

                // Validación de seguridad de la contraseña
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!passwordRegex.test(password1.value)) {
                    isValid = false;
                    errorMessages.push('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');
                }
            }

            if (!isValid) {
                showErrors(errorMessages);
                return;
            }

            removeErrors();

            let formData = new FormData(formClientUpdate);
            formData.append('idUser', idUser);

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
                        Swal.fire({
                            title: "Éxito",
                            text: "Cliente actualizado exitosamente",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 2000
                        }).then(() => {
                            location.reload();
                        });
                        console.log('Cliente actualizado exitosamente');
                        $('#modalEditarCliente').css('display', 'none');
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Error al actualizar el cliente",
                        });
                        console.error('Error al actualizar al cliente:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error en la petición:', error);
                });
        });

        function showErrors(messages) {
            removeErrors();
            const errorContainer = document.createElement('div');
            errorContainer.id = 'error-container';
            errorContainer.className = 'error-container';
            errorContainer.innerHTML = messages.map(msg => `<p class="error-message" style="color: red; margin-top: 10px;">${msg}</p>`).join('');
            const formClientUpdate = document.getElementById('formClientUpdate');
            formClientUpdate.insertBefore(errorContainer, formClientUpdate.querySelector('.botonesEditarCliente'));
        }

        function removeErrors() {
            const errorContainer = document.getElementById('error-container');
            if (errorContainer) {
                errorContainer.remove();
            }
        }


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

            Swal.fire({
                title: "¿Estás seguro?",
                text: "Si lo haces eliminaras también todas las sesiones y álbumes asociadas a este usuario",
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
                        text: "El usuario ha sido eliminado.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    deleteClient(idClient);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        title: "Cancelado",
                        text: "El usuario está a salvo :)",
                        icon: "error"
                    });
                }
            });
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
