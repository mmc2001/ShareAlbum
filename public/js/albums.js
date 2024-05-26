document.addEventListener("DOMContentLoaded", function() {
    // Función para obtener las imágenes según el id y la propiedad elegida
    async function obtenerImagenes(id, elegida) {
        try {
            const response = await fetch("/datos.json");
            const data = await response.json();
            const registro = data.find(item => item.id === id);
            if (!registro) return [];
            const imagenes = elegida ? registro.imagenes.filter(img => img.elegida) : registro.imagenes;
            return imagenes.map(img => img.url);
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
            if (containerId == "container1") {
                a.download = `albumCompleto.zip`;
            } else if (containerId == "container2") {
                a.download = `albumParcial.zip`;
            } else if (containerId == "container3") {
                a.download = `albumTerminado.zip`;
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
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('id'));
    }

    // IDs y contenedores correspondientes
    const contenedores = [
        { containerId: 'container1', jsonId: obtenerIdDeURL(), elegida: false },
        { containerId: 'container2', jsonId: obtenerIdDeURL(), elegida: true },
        { containerId: 'container3', jsonId: obtenerIdDeURL(), elegida: false }
    ];

    // Iterar sobre los contenedores y generar las galerías
    contenedores.forEach(({ containerId, jsonId, elegida }) => {
        obtenerImagenes(jsonId, elegida).then(imagenes => {
            generarGaleria(containerId, imagenes);
            handleDownloadClick(containerId);
        });
    });

    function inicializarModal(id, elegida) {
        const galleryModal = document.getElementById("galleryModal");
        const trashIcon = document.querySelector("h1 i.fas.fa-trash-alt");
        const fileInput = document.getElementById("uploadedimage");

        async function obtenerImagenesModal(id, elegida) {
            try {
                const response = await fetch("/datos.json");
                const data = await response.json();
                const registro = data.find(item => item.id === id);
                if (!registro) return [];
                const imagenes = elegida ? registro.imagenes.filter(img => img.elegida) : registro.imagenes;
                return imagenes.map(img => img.url);
            } catch (error) {
                console.error("Error al obtener las imágenes:", error);
                return [];
            }
        }

        let imagenes = [];

        trashIcon.addEventListener("click", function() {
            imagenes.length = 0;
            actualizarGaleria();
        });

        // Mostrar la galería de imágenes
        function mostrarGaleria() {
            galleryModal.innerHTML = "";
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

        obtenerImagenesModal(id, elegida).then(imgs => {
            imagenes = imgs;
            mostrarGaleria();
        });
    }

    document.getElementById("editar1").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modalEditarAlbum").style.display = "grid";
        inicializarModal(obtenerIdDeURL(), false);
    });

    document.getElementById("editar2").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modalEditarAlbum").style.display = "grid";
        inicializarModal(obtenerIdDeURL(), true);
    });

    document.getElementById("editar3").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modalEditarAlbum").style.display = "grid";
        inicializarModal(obtenerIdDeURL(), false);
    });

    document.getElementById("CerrarModal").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modalEditarAlbum").style.display = "none";
    });

    const addButton = document.getElementById('Añadir');
    const fileInput = document.getElementById('uploadedimage');

    function openFileInput() {
        fileInput.click();
    }

    // Eliminamos cualquier evento click previo y añadimos solo uno
    addButton.removeEventListener('click', openFileInput);
    addButton.addEventListener('click', openFileInput);

    fileInput.addEventListener('change', function(event) {
        const files = event.target.files;
        console.log(files);
    });

    document.getElementById("GuardarModal").addEventListener("click", function(event) {
        event.preventDefault();
        console.log("GUARDADO");
    });


    //PRUEBA


});

