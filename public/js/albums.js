document.addEventListener("DOMContentLoaded", function() {
    // Función para obtener las imágenes según el id y la propiedad elegida
    //async function obtenerImagenes(id, elegida) {
    async function obtenerImagenes(elegida) {
        try {
            const response = await fetch("/obtener/photos");
            const jsonData = await response.json();
            const data = JSON.parse(jsonData);

            if (!Array.isArray(data)) {
                throw new Error("La respuesta no es un array");
            }

            if (elegida === false){
                const imagenes = data;
                return imagenes.map(img => ({
                    url: img.photo_url,
                    has_been_selected: img.has_been_selected,
                    id: img.id
                }));
            } else {
                const imagenes = data.filter(img => img.has_been_selected === elegida);
                return imagenes.map(img => ({
                    url: img.photo_url,
                    has_been_selected: img.has_been_selected,
                    id: img.id
                }));
            }

        } catch (error) {
            console.error("Error al obtener las imágenes:", error);
            return [];
        }
    }

    // Función para generar la galería de imágenes en el contenedor dado
    // Define la función generarGaleria en el ámbito global
    function generarGaleria(containerId, imagenes) {

        var htmlCode = `<div class="container" id="${containerId}_lightgallery">`;
        if (containerId === 'container1') {
            for (let i = 0; i < imagenes.length; i++) {
                htmlCode += `<a href="${imagenes[i].url}"`;
                if (i % 2 === 0) {
                    htmlCode += ' class="vertical"';
                } else if (i % 3 === 0) {
                    htmlCode += ' class="horizontal"';
                } else if (i % 5 === 0) {
                    htmlCode += ' class="big"';
                } else {
                    htmlCode += ' class=""';
                }
                htmlCode += `><img src="${imagenes[i].url}" />`;

                const heartIconClass = imagenes[i].has_been_selected ? 'fa-solid heart-icon2' : 'fa-regular heart-icon';
                htmlCode += `<i class="${heartIconClass} fa-heart" data-id="${imagenes[i].id}"></i>`;

                htmlCode += `</a>`;
            }
            htmlCode += '</div>';
        } else if(containerId === 'container2') {
            for (let i = 0; i < imagenes.length; i++) {
                htmlCode += `<a href="${imagenes[i].url}"`;
                if (i % 2 === 0) {
                    htmlCode += ' class="vertical"';
                } else if (i % 3 === 0) {
                    htmlCode += ' class="horizontal"';
                } else if (i % 5 === 0) {
                    htmlCode += ' class="big"';
                } else {
                    htmlCode += ' class=""';
                }
                htmlCode += `><img src="${imagenes[i].url}" />`;

                const heartIconClass = imagenes[i].has_been_selected ? 'fa-solid heart-icon2' : 'fa-regular heart-icon';
                htmlCode += `<i class="${heartIconClass} fa-heart" data-id="${imagenes[i].id}"></i>`;

                htmlCode += `</a>`;
            }
            htmlCode += '</div>';
        } else {
            for (var i = 0; i < imagenes.length; i++) {
                htmlCode += `<a href="${imagenes[i].url}"`;
                if (i % 2 === 0) {
                    htmlCode += ' class="vertical"';
                } else if (i % 3 === 0) {
                    htmlCode += ' class="horizontal"';
                } else if (i % 5 === 0) {
                    htmlCode += ' class="big"';
                } else {
                    htmlCode += ' class=""';
                }
                htmlCode += `><img src="${imagenes[i].url}" /></a>`;
            }
            htmlCode += '</div>';
        }
        document.getElementById(containerId).innerHTML = htmlCode;

        // Obtener todos los <i> dentro del contenedor y adjuntar el event listener
        var heartIcons = document.querySelectorAll(`#${containerId}_lightgallery i.fa-heart`);
        heartIcons.forEach(icon => {
            icon.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const id = event.target.dataset.id;
                selectPhoto(id, event.target);
            });
        });

        var imagPop = document.getElementById(`${containerId}_lightgallery`);
        lightGallery(imagPop);
    }

    // Define la función selectPhoto en el ámbito global
    async function selectPhoto(id, element) {

        // Alternar el icono de corazón
        if (element.classList.contains("fa-regular")) {
            element.classList.remove("fa-regular");
            element.classList.remove("heart-icon");
            element.classList.add("fa-solid");
            element.classList.add("heart-icon2");
        } else {
            element.classList.remove("fa-solid");
            element.classList.remove("heart-icon2");
            element.classList.add("fa-regular");
            element.classList.add("heart-icon");
        }
        // Realizar la petición al servidor para actualizar el estado
        try {
            const response = await fetch(`/update/photo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ has_been_selected: element.classList.contains("fa-solid") })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la imagen: ' + response.status);
            }
        } catch (error) {
            console.error('Error al actualizar el estado de la imagen:', error);
        }
        location.reload();
    }

    // Función para manejar la descarga de las imágenes del contenedor especificado
    function handleDownloadClick(containerId) {
        const downloadButton = document.getElementById(`download${containerId.substr(-1)}`); // Obtener el botón de descarga correspondiente

        downloadButton.addEventListener('click', async () => {
            const imagenes = Array.from(document.querySelectorAll(`#${containerId} img`)).map(img => img.src); // Obtener las URLs de las imágenes en el contenedor
            const zip = new JSZip();
            const folder = zip.folder('imagenes');

            for (let i = 0; i < imagenes.length; i++) {
                const response = await fetch(imagenes[i]);
                const blob = await response.blob();
                folder.file(`imagen-${i}.png`, blob);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            if (containerId === "container1") {
                a.download = `fotosSinSeleccionar.zip`;
            } else if (containerId === "container2") {
                a.download = `fotosSeleccionadas.zip`;
            } else if (containerId === "container3") {
                a.download = `fotosEditadas.zip`;
            }
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    }

    // Obtener el ID de la URL
    function obtenerIdDeURL() {
        const path = window.location.pathname;
        const pathSegments = path.split('/');
        const id = pathSegments[pathSegments.length - 1];
        return parseInt(id);
    }

    // IDs y contenedores correspondientes
    const contenedores = [
        { containerId: 'container1', jsonId: obtenerIdDeURL(), elegida: false },
        { containerId: 'container2', jsonId: obtenerIdDeURL(), elegida: true },
        { containerId: 'container3', jsonId: obtenerIdDeURL(), elegida: false }
    ];

    // Iterar sobre los contenedores y generar las galerías
    contenedores.forEach(({ containerId, jsonId, elegida }) => {
        //obtenerImagenes(jsonId, elegida).then(imagenes => {
        obtenerImagenes(elegida).then(imagenes => {
            generarGaleria(containerId, imagenes);
            handleDownloadClick(containerId);
        });
    });

    let imagenes = [];
    let deletePhotos = [];
    //function inicializarModal(id, elegida) {
    function inicializarModal(elegida) {
        const galleryModal = document.getElementById("galleryModal");
        const trashIcon = document.querySelector("h1 i.fas.fa-trash-alt");
        //const fileInput = document.getElementById("uploadedimage");

        //async function obtenerImagenesModal(id, elegida) {
        async function obtenerImagenesModal(elegida) {
            try {
                const response = await fetch("/obtener/photos");
                const jsonData = await response.json();
                const data = JSON.parse(jsonData);

                if (!Array.isArray(data)) {
                    throw new Error("La respuesta no es un array");
                }

                //const registro = data.find(item => item.id === id);
                //console.log(registro);
                //if (!registro) return [];

                imagenes = data.filter(img => img.has_been_selected === elegida).map(img => ({
                    id: img.id,
                    url: img.photo_url
                }));

                return imagenes;
            } catch (error) {
                console.error("Error al obtener las imágenes:", error);
                return [];
            }
        }

        trashIcon.addEventListener("click", function() {
            imagenes.length = 0;
            actualizarGaleria();
        });

        // Mostrar la galería de imágenes
        function mostrarGaleria() {
            galleryModal.innerHTML = "";
            imagenes.forEach((imagen, index) => {
                const img = document.createElement("img");
                img.src = imagen.url;
                img.alt = "Imagen";

                const closeButton = document.createElement("button");
                closeButton.textContent = "x";
                closeButton.classList.add("close-button");
                closeButton.addEventListener("click", () => {
                    deletePhotos.push(imagen.id);
                    imagenes.splice(index, 1);
                    actualizarGaleria();
                });

                const imageContainer = document.createElement("div");
                const imageId = "imagen-" + index; // Generar un identificador único para cada contenedor de imagen
                imageContainer.id = imageId; // Asignar el identificador al contenedor de imagen
                imageContainer.classList.add("image-container");
                imageContainer.appendChild(img);
                imageContainer.appendChild(closeButton);

                galleryModal.appendChild(imageContainer);
            });
        }

        function actualizarGaleria() {
            mostrarGaleria();
        }
        /*
        function handleFileSelect(event) {
            const files = event.target.files;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.readAsDataURL(file);

                reader.onload = function() {
                    const imageSrc = reader.result;
                    imagenes.push(imageSrc);
                    mostrarGaleria();
                };
            }
        }


        fileInput.removeEventListener("change", handleFileSelect);
        fileInput.addEventListener("change", handleFileSelect);
        */
        //obtenerImagenesModal(id, elegida).then(imgs => {
        obtenerImagenesModal(elegida).then(imgs => {
            imagenes = imgs;
            mostrarGaleria();
        });
    }

    document.getElementById("editar1").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modalEditarAlbum").style.display = "grid";
        //inicializarModal(obtenerIdDeURL(), false);
        inicializarModal(false);
    });

    document.getElementById("editar2").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modalEditarAlbum").style.display = "grid";
        //inicializarModal(obtenerIdDeURL(), true);
        inicializarModal(true);
    });

    document.getElementById("editar3").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modalEditarAlbum").style.display = "grid";
        //inicializarModal(obtenerIdDeURL(), false);
        inicializarModal(false);
    });

    document.getElementById("CerrarModal").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modalEditarAlbum").style.display = "none";
    });

    //const addButton = document.getElementById('Añadir');
    //const fileInput = document.getElementById('uploadedimage');

    //document.getElementById("comprobar-button").addEventListener("click", widgetCloudinary);

    document.getElementById("GuardarModal").addEventListener("click", eliminarImagenes);
    async function eliminarImagenes() {
        console.log(deletePhotos);
        // Enviar imágenes para eliminar al controlador
        if (deletePhotos.length > 0) {
            deletePhotos.map(id => {
                return fetch(`/delete/photos/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('HTTP error ' + response.status);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(`Imagen ${id} eliminada correctamente:`, data);
                    })
                    .catch(error => {
                        console.error(`Error al eliminar la imagen ${id}:`, error);
                    });
            });
            location.reload();
        }
    }

    document.getElementById('generateToken').addEventListener('click',  () => {
        generateToken();
    });

});

    async function generateToken(){
        try {
            const response = await fetch('/generate/token/{id}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ access: 'guest' })
            });

            const result = await response.json();

            if (result.success) {
                console.log('Token generado:', result.token);
                // Aquí puedes mostrar el token al usuario o hacer cualquier otra cosa que necesites
            } else {
                console.error('Error al generar el token:', result.message);
            }
        } catch (error) {
            console.error('Error al generar el token:', error);
        }
    }


/*
function widgetCloudinary() {
    let imagenesSubidas = [];
    //const imagen = document.getElementById('prueba-photo');

    cloudinary.createUploadWidget({
        cloud_name: 'ddaq4my3n',
        upload_preset: 'preset_ShareAlbum'
    }, (err, result) => {
        if (err) {
            console.error('Error al subir la imagen', err);
            return;
        }

        if (result && result.event === 'success') {
            console.log('Imagen subida con éxito', result.info);
            //imagen.src = result.info.secure_url;
            imagenesSubidas.push(result.info.secure_url);

            const datosParaEnviar = {
                imagenes: imagenesSubidas
            };

            fetch('/save/photos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosParaEnviar)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('HTTP error ' + response.status);
                    }
                    return response.text();
                })
                .then(data => {
                    console.log('Respuesta del servidor:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }).open();
    //location.reload();
}
*/

