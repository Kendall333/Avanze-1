// ==========================================
// CONFIGURACIÓN DE LA API
// ==========================================

const API_CARRERAS = "http://localhost:3000/carreras";


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const formularioCarrera =
    document.getElementById("formCarrera");

const tablaCarreras =
    document.getElementById("tablaCarreras");

const mensajeCarrera =
    document.getElementById("mensajeCarrera");


// ==========================================
// LOCALSTORAGE
// ==========================================

// Guardamos aquí las carreras que el usuario
// elimina localmente.

let carrerasEliminadas =
    JSON.parse(
        localStorage.getItem("carrerasEliminadas")
    ) || [];


// Guardamos aquí las modificaciones locales.

let carrerasEditadas =
    JSON.parse(
        localStorage.getItem("carrerasEditadas")
    ) || {};


// Guarda el ID de la carrera que estamos editando.

let indiceEditar = null;


// ==========================================
// CARGAR CARRERAS AL ABRIR LA PÁGINA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        obtenerCarreras();

    }
);


// ==========================================
// GET - OBTENER CARRERAS
// ==========================================

async function obtenerCarreras() {

    try {

        const respuesta =
            await fetch(API_CARRERAS);


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener las carreras."
            );

        }


        const carreras =
            await respuesta.json();


        console.log(
            "Carreras recibidas:",
            carreras
        );


        mostrarCarreras(carreras);


    } catch (error) {

        console.error(
            "Error en GET carreras:",
            error
        );


        mostrarMensajeCarrera(
            "No fue posible cargar las carreras.",
            "error"
        );

    }

}


// ==========================================
// MOSTRAR CARRERAS EN LA TABLA
// ==========================================

function mostrarCarreras(carreras) {

    tablaCarreras.innerHTML = "";


    // ======================================
    // APLICAR ELIMINACIONES LOCALES
    // ======================================

    const carrerasVisibles =
        carreras.filter(function (carrera) {

            return !carrerasEliminadas.includes(
                carrera._id
            );

        });


    // ======================================
    // APLICAR EDICIONES LOCALES
    // ======================================

    const carrerasFinales =
        carrerasVisibles.map(function (carrera) {

            if (
                carrerasEditadas[carrera._id]
            ) {

                return {
                    ...carrera,
                    ...carrerasEditadas[carrera._id]
                };

            }

            return carrera;

        });


    // ======================================
    // SI NO HAY CARRERAS
    // ======================================

    if (carrerasFinales.length === 0) {

        tablaCarreras.innerHTML = `

            <tr>

                <td colspan="3">
                    No hay carreras registradas.
                </td>

            </tr>

        `;

        return;

    }


    // ======================================
    // MOSTRAR CARRERAS
    // ======================================

    carrerasFinales.forEach(
        function (carrera) {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>
                    ${carrera.nombre || ""}
                </td>

                <td>
                    ${carrera.descripcion || ""}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="verCarrera('${carrera._id}')">

                        Ver

                    </button>


                    <button
                        type="button"
                        onclick="editarCarrera('${carrera._id}')">

                        Editar

                    </button>


                    <button
                        type="button"
                        onclick="eliminarCarrera('${carrera._id}')">

                        Eliminar

                    </button>

                </td>

            `;


            tablaCarreras.appendChild(fila);

        }
    );

}


// ==========================================
// POST - GUARDAR CARRERA
// ==========================================

if (formularioCarrera) {

    formularioCarrera.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            // ==================================
            // OBTENER DATOS
            // ==================================

            const nombre =
                document
                    .getElementById("nombreCarrera")
                    .value
                    .trim();


            const descripcion =
                document
                    .getElementById("descripcionCarrera")
                    .value
                    .trim();


            // ==================================
            // VALIDAR
            // ==================================

            if (
                nombre === "" ||
                descripcion === ""
            ) {

                mostrarMensajeCarrera(
                    "Complete todos los campos.",
                    "error"
                );

                return;

            }


            // ==================================
            // SI ESTAMOS EDITANDO
            // ==================================

            if (indiceEditar !== null) {

                carrerasEditadas[indiceEditar] = {

                    nombre:
                        nombre,

                    descripcion:
                        descripcion

                };


                localStorage.setItem(
                    "carrerasEditadas",
                    JSON.stringify(
                        carrerasEditadas
                    )
                );


                mostrarMensajeCarrera(
                    "Carrera editada correctamente.",
                    "exito"
                );


                formularioCarrera.reset();


                indiceEditar = null;


                await obtenerCarreras();


                return;

            }


            // ==================================
            // NUEVA CARRERA
            // ==================================

            const nuevaCarrera = {

                nombre:
                    nombre,

                descripcion:
                    descripcion

            };


            try {

                // ==================================
                // POST
                // ==================================

                const respuesta =
                    await fetch(
                        API_CARRERAS,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    nuevaCarrera
                                )

                        }
                    );


                if (!respuesta.ok) {

                    throw new Error(
                        "El servidor rechazó la carrera."
                    );

                }


                const resultado =
                    await respuesta.json();


                console.log(
                    "Carrera registrada:",
                    resultado
                );


                // ==================================
                // MENSAJE
                // ==================================

                mostrarMensajeCarrera(
                    "Carrera registrada correctamente.",
                    "exito"
                );


                // ==================================
                // LIMPIAR
                // ==================================

                formularioCarrera.reset();


                // ==================================
                // ACTUALIZAR TABLA
                // ==================================

                await obtenerCarreras();


            } catch (error) {

                console.error(
                    "Error en POST carreras:",
                    error
                );


                mostrarMensajeCarrera(
                    "Ocurrió un error al registrar la carrera.",
                    "error"
                );

            }

        }
    );

}


// ==========================================
// VER CARRERA
// ==========================================

async function verCarrera(id) {

    try {

        const respuesta =
            await fetch(API_CARRERAS);


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener las carreras."
            );

        }


        const carreras =
            await respuesta.json();


        let carrera =
            carreras.find(
                function (item) {

                    return item._id === id;

                }
            );


        if (!carrera) {

            alert(
                "No se encontró la carrera."
            );

            return;

        }


        // ==================================
        // APLICAR CAMBIOS LOCALES
        // ==================================

        if (carrerasEditadas[id]) {

            carrera = {

                ...carrera,

                ...carrerasEditadas[id]

            };

        }


        // ==================================
        // MOSTRAR INFORMACIÓN
        // ==================================

        alert(

            "INFORMACIÓN DE LA CARRERA\n\n" +

            "Nombre: " +
            carrera.nombre +

            "\n\nDescripción: " +
            carrera.descripcion

        );


    } catch (error) {

        console.error(
            "Error al consultar carrera:",
            error
        );


        alert(
            "No fue posible consultar la carrera."
        );

    }

}


// ==========================================
// EDITAR CARRERA
// ==========================================

async function editarCarrera(id) {

    try {

        const respuesta =
            await fetch(API_CARRERAS);


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener las carreras."
            );

        }


        const carreras =
            await respuesta.json();


        let carrera =
            carreras.find(
                function (item) {

                    return item._id === id;

                }
            );


        if (!carrera) {

            alert(
                "No se encontró la carrera."
            );

            return;

        }


        // ==================================
        // APLICAR CAMBIOS LOCALES
        // ==================================

        if (carrerasEditadas[id]) {

            carrera = {

                ...carrera,

                ...carrerasEditadas[id]

            };

        }


        // ==================================
        // CARGAR DATOS EN EL FORMULARIO
        // ==================================

        document.getElementById(
            "nombreCarrera"
        ).value =
            carrera.nombre || "";


        document.getElementById(
            "descripcionCarrera"
        ).value =
            carrera.descripcion || "";


        // ==================================
        // GUARDAR ID EN EDICIÓN
        // ==================================

        indiceEditar = id;


        mostrarMensajeCarrera(
            "Modifique los datos y presione Guardar.",
            "exito"
        );


        // ==================================
        // SUBIR AL FORMULARIO
        // ==================================

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


    } catch (error) {

        console.error(
            "Error al editar carrera:",
            error
        );


        mostrarMensajeCarrera(
            "No fue posible editar la carrera.",
            "error"
        );

    }

}


// ==========================================
// ELIMINAR CARRERA
// ==========================================

async function eliminarCarrera(id) {

    const confirmar =
        confirm(
            "¿Desea eliminar esta carrera?"
        );


    if (!confirmar) {

        return;

    }


    // ======================================
    // GUARDAR ID COMO ELIMINADO
    // ======================================

    if (
        !carrerasEliminadas.includes(id)
    ) {

        carrerasEliminadas.push(id);

    }


    localStorage.setItem(
        "carrerasEliminadas",
        JSON.stringify(
            carrerasEliminadas
        )
    );


    // ======================================
    // SI TENÍA UNA EDICIÓN LOCAL,
    // TAMBIÉN LA QUITAMOS
    // ======================================

    if (carrerasEditadas[id]) {

        delete carrerasEditadas[id];


        localStorage.setItem(
            "carrerasEditadas",
            JSON.stringify(
                carrerasEditadas
            )
        );

    }


    // ======================================
    // ACTUALIZAR TABLA
    // ======================================

    await obtenerCarreras();


    mostrarMensajeCarrera(
        "Carrera eliminada correctamente.",
        "exito"
    );

}


// ==========================================
// MOSTRAR MENSAJES
// ==========================================

function mostrarMensajeCarrera(
    texto,
    tipo
) {

    if (!mensajeCarrera) {

        return;

    }


    mensajeCarrera.textContent =
        texto;


    mensajeCarrera.className =
        "mensaje " + tipo;


    setTimeout(
        function () {

            mensajeCarrera.textContent =
                "";

            mensajeCarrera.className =
                "mensaje";

        },
        5000
    );

}