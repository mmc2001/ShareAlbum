// Obtener el ID de la URL
function obtenerId() {
    const sessionId = document.getElementById('session-data').getAttribute('data-id');
    return parseInt(sessionId);
}

let containerImg;
document.addEventListener("DOMContentLoaded", function() {

    // Función para obtener las imágenes según el id y la propiedad elegida
    async function obtenerImagenes(id, elegida) {
        console.log("ID: "+id+" "+"ELEGIDA: "+elegida);
        try {
            const response = await fetch(`/obtener/photo/${id}`);
            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("La respuesta no es un array");
            }

            if (elegida === false) {
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
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al obtener las imágenes",
            });
            console.error("Error al obtener las imágenes:", error);
            return [];
        }
    }
    function generarGaleria(containerId, imagenes) {

        var htmlCode = `<div class="container" id="${containerId}_lightgallery">`;
        if (containerId === 'container3') {
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

                htmlCode += `</a>`;
            }
            htmlCode += '</div>';
        }
        document.getElementById(containerId).innerHTML = htmlCode;

        var imagPop = document.getElementById(`${containerId}_lightgallery`);
        lightGallery(imagPop);
    }

    // Función para manejar la descarga de las imágenes del contenedor especificado


    async function obtenerIdAlbum(album) {
        let idSession = obtenerId(); // Suponiendo que obtenerId() devuelve el ID de sesión

        try {
            const response = await fetch(`/obtener/album/${idSession}`);
            if (!response.ok) {
                throw new Error('Error al obtener los álbumes');
            }

            const data = await response.json();
            const jsonArray = JSON.parse(data);
            const albumEncontrado = jsonArray.find(a => a.name === album);

            if (!albumEncontrado) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Álbum no encontrado",
                });
                console.error('Álbum no encontrado');
                return 0; // Devuelve 0 si el álbum no es encontrado
            }

            return albumEncontrado.id;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al obtener el ID del álbum",
            });
            console.error('Error al obtener el ID del álbum:', error);
            return 0; // Devuelve 0 si ocurre un error
        }
    }

    (async () => {

        let idAlbumContainer3 = await obtenerIdAlbum("FE");
        console.log("ID del álbum FE:", idAlbumContainer3);

        const contenedores = [
            { containerId: 'container3', jsonId: idAlbumContainer3, elegida: false }
        ];

        // Iterar sobre los contenedores y generar las galerías
        contenedores.forEach(({ containerId, jsonId, elegida }) => {
            obtenerImagenes(jsonId, elegida).then(imagenes => {
                console.log("Imagenes: "+imagenes);
                //obtenerImagenes(elegida).then(imagenes => {
                generarGaleria(containerId, imagenes);
                containerImg=containerId;
                //handleDownloadClick();
            });
        });
    }) ();

    document.getElementById("download3").addEventListener("click",  (event)=>{
        event.preventDefault();
        downloadButton();
    });
});
/*
function handleDownloadClick() {
    document.getElementById("download3").addEventListener("click",  (event)=>{
        event.preventDefault();
        downloadButton();
    });
}
*/
async function downloadButton () {
    const imagenes = Array.from(document.querySelectorAll(`#${containerImg} img`)).map(img => img.src); // Obtener las URLs de las imágenes en el contenedor
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
    if (containerImg === "container3") {
        a.download = `fotosEditadas.zip`;
    }
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}