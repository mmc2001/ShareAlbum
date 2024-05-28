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

            //const registro = data.find(item => item.id === id);
            //console.log(registro);
            //if (!registro) return [];

            const imagenes = data.filter(img => img.has_been_selected === elegida);
            return imagenes.map(img => img.photo_url);
        } catch (error) {
            console.error("Error al obtener las imágenes:", error);
            return [];
        }
    }

    // Función para generar la galería de imágenes en el contenedor dado
    function generarGaleria(containerId, imagenes) {
        var htmlCode = `<div class="container" id="${containerId}_lightgallery">`;
        for (var i = 0; i < imagenes.length; i++) {
            htmlCode += `<a href="${imagenes[i]}"`;
            if (i % 2 === 0) {
                htmlCode += ' class="vertical"';
            } else if (i % 3 === 0) {
                htmlCode += ' class="horizontal"';
            } else if (i % 5 === 0) {
                htmlCode += ' class="big"';
            } else {
                htmlCode += ' class=""';
            }
            htmlCode += `><img src="${imagenes[i]}" /></a>`;
        }
        htmlCode += '</div>';
        document.getElementById(containerId).innerHTML = htmlCode;
        var imagPop = document.getElementById(`${containerId}_lightgallery`);
        lightGallery(imagPop);
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

                imagenes = data.filter(img => img.has_been_selected === elegida);
                return imagenes.map(img => img.photo_url);
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
            console.log(imagenes);
            imagenes.forEach((imagen, index) => {
                const img = document.createElement("img");
                img.src = imagen;
                img.alt = "Imagen";

                const closeButton = document.createElement("button");
                closeButton.textContent = "x";
                closeButton.classList.add("close-button");
                closeButton.addEventListener("click", () => {
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
        inicializarModal(obtenerIdDeURL(), true);
        inicializarModal(true);
    });

    document.getElementById("editar3").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modalEditarAlbum").style.display = "grid";
        inicializarModal(obtenerIdDeURL(), false);
        inicializarModal(false);
    });

    document.getElementById("CerrarModal").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modalEditarAlbum").style.display = "none";
    });

    const addButton = document.getElementById('Añadir');
    const fileInput = document.getElementById('uploadedimage');

    document.getElementById("comprobar-button").addEventListener("click", widgetCloudinary);
});

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

}

