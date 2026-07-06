// ===============================
// VALIDACIONES FORMULARIO EGRESADOS
// ===============================

const formulario = document.getElementById("formEgresado");

if (formulario) {

    formulario.addEventListener("submit", function (e) {

        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const cedula = document.getElementById("cedula").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const fecha = document.getElementById("fecha").value;
        const sexo = document.getElementById("sexo").value;
        const carrera = document.getElementById("carrera").value;
        const graduacion = document.getElementById("graduacion").value;
        const estado = document.getElementById("estado").value;
        const empresa = document.getElementById("empresa").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();

        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefonoRegex = /^[0-9]{8}$/;
        const cedulaRegex = /^[0-9]-[0-9]{4}-[0-9]{4}$/;

        if (nombre === "") {
            alert("Debe ingresar el nombre.");
            return;
        }

        if (!cedulaRegex.test(cedula)) {
            alert("La cédula debe tener el formato 1-1111-1111.");
            return;
        }

        if (!correoRegex.test(correo)) {
            alert("Ingrese un correo válido.");
            return;
        }

        if (!telefonoRegex.test(telefono)) {
            alert("El teléfono debe tener 8 dígitos.");
            return;
        }

        if (fecha === "") {
            alert("Seleccione la fecha de nacimiento.");
            return;
        }

        if (sexo === "") {
            alert("Seleccione el sexo.");
            return;
        }

        if (carrera === "") {
            alert("Seleccione una carrera.");
            return;
        }

        if (graduacion === "") {
            alert("Ingrese el año de graduación.");
            return;
        }

        if (estado === "") {
            alert("Seleccione el estado laboral.");
            return;
        }

        if (empresa === "") {
            alert("Ingrese el nombre de la empresa.");
            return;
        }

        if (direccion === "") {
            alert("Ingrese la dirección.");
            return;
        }

        if (descripcion === "") {
            alert("Ingrese una descripción.");
            return;
        }

        alert("✅ Egresado registrado correctamente.");

        formulario.reset();

    });

}