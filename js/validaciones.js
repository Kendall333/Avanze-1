// ==========================================
// CONFIGURACIÓN DE LA API
// ==========================================

const API_URL = "http://localhost:3000/egresados";


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const formulario = document.getElementById("formEgresado");
const tablaEgresados = document.getElementById("tablaEgresados");
const mensaje = document.getElementById("mensaje");


// ==========================================
// LOCALSTORAGE
// ==========================================

let egresadosEliminados =
    JSON.parse(localStorage.getItem("egresadosEliminados")) || [];

let egresadosEditados =
    JSON.parse(localStorage.getItem("egresadosEditados")) || [];

let indiceEditar = null;


// ==========================================
// CARGAR EGRESADOS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    obtenerEgresados();
});


// ==========================================
// GET - OBTENER EGRESADOS
// ==========================================

async function obtenerEgresados() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los egresados.");
        }

        const egresados = await respuesta.json();

        mostrarEgresados(egresados);

    } catch (error) {

        console.error("Error en GET:", error);

        mostrarMensaje(
            "No fue posible cargar los egresados.",
            "error"
        );
    }
}


// ==========================================
// MOSTRAR EGRESADOS
// ==========================================

function mostrarEgresados(egresados) {

    tablaEgresados.innerHTML = "";


    const egresadosVisibles = egresados
        .filter(function (egresado) {

            return !egresadosEliminados.includes(
                egresado._id
            );

        })
        .map(function (egresado) {

            if (egresadosEditados[egresado._id]) {

                return Object.assign(
                    {},
                    egresado,
                    egresadosEditados[egresado._id]
                );
            }

            return egresado;
        });


    if (egresadosVisibles.length === 0) {

        tablaEgresados.innerHTML =
            "<tr>" +
            "<td colspan=\"7\">" +
            "No hay egresados registrados." +
            "</td>" +
            "</tr>";

        return;
    }


    egresadosVisibles.forEach(function (egresado) {

        const fila = document.createElement("tr");


        fila.innerHTML =
            "<td>" +
                (egresado.identificacion || "") +
            "</td>" +

            "<td>" +
                (egresado.nombreCompleto || "") +
            "</td>" +

            "<td>" +
                (egresado.correoElectronico || "") +
            "</td>" +

            "<td>" +
                (egresado.telefono || "") +
            "</td>" +

            "<td>" +
                (egresado.empresaActual || "No registrada") +
            "</td>" +

            "<td>" +
                (egresado.puestoActual || "No registrado") +
            "</td>" +

            "<td>" +

                "<button " +
                "type=\"button\" " +
                "onclick=\"verEgresado('" +
                egresado._id +
                "')\">" +
                "Ver" +
                "</button> " +

                "<button " +
                "type=\"button\" " +
                "onclick=\"editarEgresado('" +
                egresado._id +
                "')\">" +
                "Editar" +
                "</button> " +

                "<button " +
                "type=\"button\" " +
                "onclick=\"eliminarEgresado('" +
                egresado._id +
                "')\">" +
                "Eliminar" +
                "</button>" +

            "</td>";


        tablaEgresados.appendChild(fila);

    });
}


// ==========================================
// FORMULARIO
// ==========================================

if (formulario) {

    formulario.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            // ==================================
            // OBTENER DATOS
            // ==================================

            const identificacion =
                document.getElementById("cedula").value.trim();

            const nombreCompleto =
                document.getElementById("nombre").value.trim();

            const correoElectronico =
                document.getElementById("correo").value.trim();

            const telefono =
                document.getElementById("telefono").value.trim();

            const fechaRegistro =
                document.getElementById("fecha").value;

            const empresaActual =
                document.getElementById("empresa").value.trim();

            const puestoActual =
                document.getElementById("puesto").value.trim();

            const areaProfesional =
                document.getElementById("areaProfesional").value.trim();

            const linkedin =
                document.getElementById("linkedin").value.trim();

            const portafolio =
                document.getElementById("portafolio").value.trim();


            // ==================================
            // VALIDACIONES
            // ==================================

            if (
                identificacion === "" ||
                nombreCompleto === "" ||
                correoElectronico === "" ||
                telefono === "" ||
                fechaRegistro === ""
            ) {

                mostrarMensaje(
                    "Por favor complete todos los campos obligatorios.",
                    "error"
                );

                return;
            }


            // ==================================
            // IDENTIFICACIÓN
            // ==================================

            const patronIdentificacion =
                /^[0-9]+$/;


            if (
                !patronIdentificacion.test(
                    identificacion
                )
            ) {

                mostrarMensaje(
                    "La identificación solo debe contener números.",
                    "error"
                );

                return;
            }


            // ==================================
            // NOMBRE
            // ==================================

            const patronNombre =
                /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;


            if (
                !patronNombre.test(
                    nombreCompleto
                )
            ) {

                mostrarMensaje(
                    "El nombre solo debe contener letras.",
                    "error"
                );

                return;
            }


            // ==================================
            // CORREO
            // ==================================

            const patronCorreo =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !patronCorreo.test(
                    correoElectronico
                )
            ) {

                mostrarMensaje(
                    "Ingrese un correo electrónico válido.",
                    "error"
                );

                return;
            }


            // ==================================
            // TELÉFONO
            // ==================================

            const patronTelefono =
                /^[0-9]{4}-?[0-9]{4}$/;


            if (
                !patronTelefono.test(
                    telefono
                )
            ) {

                mostrarMensaje(
                    "El teléfono debe tener 8 números.",
                    "error"
                );

                return;
            }


            // ==================================
            // CREAR OBJETO
            // ==================================

            const nuevoEgresado = {

                identificacion:
                    identificacion,

                nombreCompleto:
                    nombreCompleto,

                correoElectronico:
                    correoElectronico,

                telefono:
                    telefono,

                fechaRegistro:
                    fechaRegistro
            };


            if (empresaActual !== "") {

                nuevoEgresado.empresaActual =
                    empresaActual;
            }


            if (puestoActual !== "") {

                nuevoEgresado.puestoActual =
                    puestoActual;
            }


            if (areaProfesional !== "") {

                nuevoEgresado.areaProfesional =
                    areaProfesional;
            }


            if (linkedin !== "") {

                nuevoEgresado.linkedin =
                    linkedin;
            }


            if (portafolio !== "") {

                nuevoEgresado.portafolio =
                    portafolio;
            }


            // ==================================
            // EDITAR
            // ==================================

            if (indiceEditar !== null) {

                egresadosEditados[indiceEditar] =
                    nuevoEgresado;


                localStorage.setItem(
                    "egresadosEditados",
                    JSON.stringify(
                        egresadosEditados
                    )
                );


                formulario.reset();

                indiceEditar = null;


                mostrarMensaje(
                    "Egresado editado correctamente.",
                    "exito"
                );


                await obtenerEgresados();

                return;
            }


            // ==================================
            // POST - REGISTRAR
            // ==================================

            try {

                const respuesta =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    nuevoEgresado
                                )
                        }
                    );


                if (!respuesta.ok) {

                    throw new Error(
                        "El servidor rechazó el registro."
                    );
                }


                await respuesta.json();


                formulario.reset();


                mostrarMensaje(
                    "Egresado registrado correctamente.",
                    "exito"
                );


                await obtenerEgresados();


            } catch (error) {

                console.error(
                    "Error en POST:",
                    error
                );


                mostrarMensaje(
                    "Ocurrió un error al registrar el egresado.",
                    "error"
                );
            }

        }
    );
}


// ==========================================
// VER EGRESADO
// ==========================================

async function verEgresado(id) {

    try {

        const respuesta =
            await fetch(API_URL);


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los datos."
            );
        }


        const egresados =
            await respuesta.json();


        let egresado =
            egresados.find(
                function (item) {

                    return item._id === id;
                }
            );


        if (!egresado) {

            mostrarMensaje(
                "No se encontró el egresado.",
                "error"
            );

            return;
        }


        if (egresadosEditados[id]) {

            egresado =
                Object.assign(
                    {},
                    egresado,
                    egresadosEditados[id]
                );
        }


        alert(
            "Identificación: " +
            (egresado.identificacion || "") +

            "\n\nNombre: " +
            (egresado.nombreCompleto || "") +

            "\n\nCorreo: " +
            (egresado.correoElectronico || "") +

            "\n\nTeléfono: " +
            (egresado.telefono || "") +

            "\n\nFecha de registro: " +
            (egresado.fechaRegistro || "") +

            "\n\nEmpresa actual: " +
            (egresado.empresaActual || "No registrada") +

            "\n\nPuesto actual: " +
            (egresado.puestoActual || "No registrado") +

            "\n\nÁrea profesional: " +
            (egresado.areaProfesional || "No registrada") +

            "\n\nLinkedIn: " +
            (egresado.linkedin || "No registrado") +

            "\n\nPortafolio: " +
            (egresado.portafolio || "No registrado")
        );


    } catch (error) {

        console.error(
            "Error al consultar egresado:",
            error
        );


        mostrarMensaje(
            "No fue posible consultar el egresado.",
            "error"
        );
    }
}


// ==========================================
// EDITAR EGRESADO
// ==========================================

async function editarEgresado(id) {

    try {

        const respuesta =
            await fetch(API_URL);


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los egresados."
            );
        }


        const egresados =
            await respuesta.json();


        let egresado =
            egresados.find(
                function (item) {

                    return item._id === id;
                }
            );


        if (!egresado) {

            mostrarMensaje(
                "No se encontró el egresado.",
                "error"
            );

            return;
        }


        if (egresadosEditados[id]) {

            egresado =
                Object.assign(
                    {},
                    egresado,
                    egresadosEditados[id]
                );
        }


        document.getElementById("cedula").value =
            egresado.identificacion || "";

        document.getElementById("nombre").value =
            egresado.nombreCompleto || "";

        document.getElementById("correo").value =
            egresado.correoElectronico || "";

        document.getElementById("telefono").value =
            egresado.telefono || "";

        document.getElementById("fecha").value =
            egresado.fechaRegistro || "";

        document.getElementById("empresa").value =
            egresado.empresaActual || "";

        document.getElementById("puesto").value =
            egresado.puestoActual || "";

        document.getElementById("areaProfesional").value =
            egresado.areaProfesional || "";

        document.getElementById("linkedin").value =
            egresado.linkedin || "";

        document.getElementById("portafolio").value =
            egresado.portafolio || "";


        indiceEditar = id;


        mostrarMensaje(
            "Modifique los datos y presione Guardar.",
            "exito"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Error al editar egresado:",
            error
        );


        mostrarMensaje(
            "No fue posible editar el egresado.",
            "error"
        );
    }
}


// ==========================================
// ELIMINAR EGRESADO
// ==========================================

async function eliminarEgresado(id) {

    const confirmar =
        confirm(
            "¿Desea eliminar este egresado?"
        );


    if (!confirmar) {
        return;
    }


    if (
        !egresadosEliminados.includes(id)
    ) {

        egresadosEliminados.push(id);
    }


    localStorage.setItem(
        "egresadosEliminados",
        JSON.stringify(
            egresadosEliminados
        )
    );


    if (egresadosEditados[id]) {

        delete egresadosEditados[id];


        localStorage.setItem(
            "egresadosEditados",
            JSON.stringify(
                egresadosEditados
            )
        );
    }


    await obtenerEgresados();


    mostrarMensaje(
        "Egresado eliminado correctamente.",
        "exito"
    );
}


// ==========================================
// MOSTRAR MENSAJES
// ==========================================

function mostrarMensaje(
    texto,
    tipo
) {

    if (!mensaje) {
        return;
    }


    mensaje.textContent = texto;


    mensaje.className =
        "mensaje " + tipo;


    setTimeout(
        function () {

            mensaje.textContent = "";

            mensaje.className =
                "mensaje";

        },
        5000
    );
}