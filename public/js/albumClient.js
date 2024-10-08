// Obtener el ID de la URL
function obtenerIdDeURL() {
    const path = window.location.pathname;
    const pathSegments = path.split('/');
    const id = pathSegments[pathSegments.length - 1];
    return parseInt(id);
}
let executed = false;
document.addEventListener("DOMContentLoaded", function() {
    if (executed) return;
    executed = true;
    // Función para obtener las imágenes según el id y la propiedad elegida
    async function obtenerImagenes(id, elegida) {
        //async function obtenerImagenes(elegida) {
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
                    id: img.id,
                    comment: img.comment
                }));
            } else {
                const imagenes = data.filter(img => img.has_been_selected === elegida);
                return imagenes.map(img => ({
                    url: img.photo_url,
                    has_been_selected: img.has_been_selected,
                    id: img.id,
                    comment: img.comment
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
                    htmlCode += ' class="vertical"';
                } else if (i % 5 === 0) {
                    htmlCode += ' class="vertical"';
                } else {
                    htmlCode += ' class="vertical"';
                }
                htmlCode += `><img src="${imagenes[i].url}" />`;

                htmlCode += `
                  <div class="overlay">
                    <div class="icon-container">
                      <i class="${imagenes[i].comment ? 'fa-solid fa-comment icon-blue' : 'fa-regular fa-comment'} fa-comment" data-id="${imagenes[i].id}" data-comment="${imagenes[i].comment}"></i>
                      <i class="${imagenes[i].has_been_selected ? 'fa-solid heart-icon2' : 'fa-regular heart-icon'} fa-heart" data-id="${imagenes[i].id}"></i>
                    </div>
                  </div>
                `;

                htmlCode += `</a>`;
            }
            htmlCode += '</div>';
        } else if(containerId === 'container2') {
            for (let i = 0; i < imagenes.length; i++) {
                htmlCode += `<a href="${imagenes[i].url}"`;
                if (i % 2 === 0) {
                    htmlCode += ' class="vertical"';
                } else if (i % 3 === 0) {
                    htmlCode += ' class="vertical"';
                } else if (i % 5 === 0) {
                    htmlCode += ' class="vertical"';
                } else {
                    htmlCode += ' class="vertical"';
                }
                htmlCode += `><img src="${imagenes[i].url}" />`;

                htmlCode += `
                  <div class="overlay">
                    <div class="icon-container">
                      <i class="${imagenes[i].comment ? 'fa-solid fa-comment icon-blue' : 'fa-regular fa-comment'} fa-comment" data-id="${imagenes[i].id}" data-comment="${imagenes[i].comment}"></i>
                      <i class="${imagenes[i].has_been_selected ? 'fa-solid heart-icon2' : 'fa-regular heart-icon'} fa-heart" data-id="${imagenes[i].id}"></i>
                    </div>
                  </div>
                `;

                htmlCode += `</a>`;
            }
            htmlCode += '</div>';
        } else {
            for (var i = 0; i < imagenes.length; i++) {
                htmlCode += `<a href="${imagenes[i].url}"`;
                if (i % 2 === 0) {
                    htmlCode += ' class="vertical"';
                } else if (i % 3 === 0) {
                    htmlCode += ' class="vertical"';
                } else if (i % 5 === 0) {
                    htmlCode += ' class="vertical"';
                } else {
                    htmlCode += ' class="vertical"';
                }
                htmlCode += `><img src="${imagenes[i].url}" /></a>`;
            }
            htmlCode += '</div>';
        }
        document.getElementById(containerId).innerHTML = htmlCode;

        // Obtener todos los <i> dentro del contenedor y adjuntar el event listener

        var commentIcons = document.querySelectorAll(`#${containerId}_lightgallery i.fa-comment`);
        commentIcons.forEach(icon => {
            icon.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const id = event.target.dataset.id;
                const comment = event.target.dataset.comment;
                saveComment(id, comment, event.target);
            });
        });

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

    // APLICANDO LAZY LOADING AL GENERAR LA GALERÍA
    // function generarGaleria(containerId, imagenes) {
    //     var htmlCode = `<div class="container" id="${containerId}_lightgallery">`;
    //     if (containerId === 'container1') {
    //         for (let i = 0; i < imagenes.length; i++) {
    //             htmlCode += `<a href="${imagenes[i].url}"`;
    //             if (i % 2 === 0) {
    //                 htmlCode += ' class="vertical"';
    //             } else if (i % 3 === 0) {
    //                 htmlCode += ' class="vertical"';
    //             } else if (i % 5 === 0) {
    //                 htmlCode += ' class="vertical"';
    //             } else {
    //                 htmlCode += ' class="vertical"';
    //             }
    //             htmlCode += `><img data-src="${imagenes[i].url}" src="placeholder.jpg" />`; // Agregamos data-src y src="placeholder.jpg"
    //
    //             const heartIconClass = imagenes[i].has_been_selected ? 'fa-solid heart-icon2' : 'fa-regular heart-icon';
    //             htmlCode += `<i class="${heartIconClass} fa-heart" data-id="${imagenes[i].id}"></i>`;
    //
    //             htmlCode += `</a>`;
    //         }
    //         htmlCode += '</div>';
    //     } else if (containerId === 'container2') {
    //         for (let i = 0; i < imagenes.length; i++) {
    //             htmlCode += `<a href="${imagenes[i].url}"`;
    //             if (i % 2 === 0) {
    //                 htmlCode += ' class="vertical"';
    //             } else if (i % 3 === 0) {
    //                 htmlCode += ' class="vertical"';
    //             } else if (i % 5 === 0) {
    //                 htmlCode += ' class="vertical"';
    //             } else {
    //                 htmlCode += ' class="vertical"';
    //             }
    //             htmlCode += `><img data-src="${imagenes[i].url}" src="placeholder.jpg" />`; // Agregamos data-src y src="placeholder.jpg"
    //
    //             const heartIconClass = imagenes[i].has_been_selected ? 'fa-solid heart-icon2' : 'fa-regular heart-icon';
    //             htmlCode += `<i class="${heartIconClass} fa-heart" data-id="${imagenes[i].id}"></i>`;
    //
    //             htmlCode += `</a>`;
    //         }
    //         htmlCode += '</div>';
    //     } else {
    //         for (var i = 0; i < imagenes.length; i++) {
    //             htmlCode += `<a href="${imagenes[i].url}"`;
    //             if (i % 2 === 0) {
    //                 htmlCode += ' class="vertical"';
    //             } else if (i % 3 === 0) {
    //                 htmlCode += ' class="vertical"';
    //             } else if (i % 5 === 0) {
    //                 htmlCode += ' class="vertical"';
    //             } else {
    //                 htmlCode += ' class="vertical"';
    //             }
    //             htmlCode += `><img data-src="${imagenes[i].url}" src="placeholder.jpg" /></a>`; // Agregamos data-src y src="placeholder.jpg"
    //         }
    //         htmlCode += '</div>';
    //     }
    //     document.getElementById(containerId).innerHTML = htmlCode;
    //
    //     // Obtener todos los <img> dentro del contenedor y aplicar lazy loading
    //     var lazyImages = document.querySelectorAll(`#${containerId}_lightgallery img[data-src]`);
    //     lazyImages.forEach((image) => {
    //         const observer = new IntersectionObserver((entries) => {
    //             if (entries[0].isIntersecting) {
    //                 image.src = image.dataset.src;
    //                 observer.unobserve(image);
    //             }
    //         }, { threshold: 1.0 });
    //
    //         observer.observe(image);
    //     });
    //
    //     // Obtener todos los <i> dentro del contenedor y adjuntar el event listener
    //     var heartIcons = document.querySelectorAll(`#${containerId}_lightgallery i.fa-heart`);
    //     heartIcons.forEach((icon) => {
    //         icon.addEventListener('click', (event) => {
    //             event.preventDefault();
    //             event.stopPropagation();
    //             const id = event.target.dataset.id;
    //             selectPhoto(id, event.target);
    //         });
    //     });
    //
    //     var imagPop = document.getElementById(`${containerId}_lightgallery`);
    //     lightGallery(imagPop);
    // }

    async function saveComment(id, comment, element) {
        // Mostrar el modal con el textarea
        const modalComentario = document.getElementById("modalComentario");
        modalComentario.style.display = "grid";

        const textarea = document.getElementById("textComment");
        const submitButton = document.getElementById("GuardarComentario");

        if(comment){
            textarea.value = comment;
        }

        submitButton.addEventListener("click", () => guardarComentario(id, textarea));
        async function guardarComentario(id, textarea) {
            const comentario = textarea.value.trim();
            if (comentario !== "") {
                try {
                    const data = { id, comentario };
                    const response = await fetch(`/save/comment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok){

                        // Alternar el icono de corazón
                        // if (element.classList.contains("fa-regular")) {
                        //     element.classList.remove("fa-regular");
                        //     element.classList.remove("comment-icon");
                        //     element.classList.add("fa-solid");
                        //     element.classList.add("fa-comment");
                        // } else {
                        //     element.classList.remove("fa-solid");
                        //     element.classList.remove("fa-comment");
                        //     element.classList.add("fa-regular");
                        //     element.classList.add("fa-comment");
                        // }

                        modalComentario.style.display = "none";

                        Swal.fire({
                            icon: "success",
                            title: "Éxito",
                            text: "Comentario guardado correctamente",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    }
                    else if (!response.ok) {
                        modalComentario.style.display = "none";
                        throw new Error('Error al guardar el comentario: ' + response.status);
                    }

                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Error al guardar el comentario",
                    });
                    console.error('Error al guardar el comentario:', error);
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Debes introducir un comentario",
                });
            }
        }

        // Agregar evento para cerrar el modal cuando se pulse el botón de cerrar
        document.getElementById("CerrarModalComentario").addEventListener("click", () => {
            modalComentario.style.display = "none";
        });

        document.getElementById("CerrarComentario").addEventListener("click", () => {
            modalComentario.style.display = "none";
        });
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
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al actualizar el estado de la imagen",
            });
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

    async function obtenerIdAlbum(album) {
        let idSession = obtenerIdDeURL(); // Suponiendo que obtenerIdDeURL() devuelve el ID de sesión

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
        let idAlbumContainer1 = await obtenerIdAlbum("FSS");
        console.log("ID del álbum FSS:", idAlbumContainer1);

        let idAlbumContainer3 = await obtenerIdAlbum("FE");
        console.log("ID del álbum FE:", idAlbumContainer3);

        // IDs y contenedores correspondientes
        const contenedores = [
            { containerId: 'container1', jsonId: idAlbumContainer1, elegida: false },
            { containerId: 'container2', jsonId: idAlbumContainer1, elegida: true },
            { containerId: 'container3', jsonId: idAlbumContainer3, elegida: false }
        ];

        // Iterar sobre los contenedores y generar las galerías
        contenedores.forEach(({ containerId, jsonId, elegida }) => {
            obtenerImagenes(jsonId, elegida).then(imagenes => {
                console.log("Imagenes: " + imagenes);
                if (imagenes.length === 0) {
                    const noImagesMessage = document.createElement("p");
                    noImagesMessage.textContent = "No hay imágenes disponibles.";
                    document.getElementById(containerId).appendChild(noImagesMessage);
                } else {
                    generarGaleria(containerId, imagenes);
                    handleDownloadClick(containerId);
                }
            });
        });
    }) ();
});

async function obtenerIdAlbum(album) {
    let idSession = obtenerIdDeURL(); // Suponiendo que obtenerIdDeURL() devuelve el ID de sesión
    try {
        const response = await fetch(`/obtener/album/${idSession}`);
        if (!response.ok) {
            throw new Error('Error al obtener los álbumes');
        }

        const data = await response.json();
        const jsonArray = JSON.parse(data);
        const albumEncontrado = jsonArray.find(a => a.name === album);

        if (!albumEncontrado) {
            console.error('Álbum no encontrado');
            return 0; // Devuelve 0 si el álbum no es encontrado
        }

        return albumEncontrado.id;
    } catch (error) {
        console.error('Error al obtener el ID del álbum:', error);
        return 0; // Devuelve 0 si ocurre un error
    }
}

let executed2 = false;
document.addEventListener("DOMContentLoaded", function() {
    if (executed2) return;
    executed2 = true;

    async function generateToken() {
        const albumId = await obtenerIdAlbum("FE");
        const album = {id: albumId};

        try {
            const response = await fetch('/generate/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({album})
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.success) {
                const token = result.token;
                const url = `${window.location.origin}/public/album?token=${token}`;
                await navigator.clipboard.writeText(url);
                Swal.fire({
                    title: "Éxito",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                    text: "Enlace copiado en el portapapeles",
                });
                // alert('URL copiada al portapapeles: ' + url);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error al generar el token",
                });
                // alert('Error al generar el token: ' + result.message);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al generar el token",
            });
            console.error('Error:', error);
            // alert('Error al generar el token');
        }
    }

    document.getElementById('generateToken').addEventListener('click', () => {
        generateToken();
    });
});