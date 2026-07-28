// ===============================
// GESTIÓN DE EGRESADOS
// ===============================

const formulario = document.querySelector("#formEgresado");
const mensaje = document.getElementById("mensaje");
const tabla = document.getElementById("tablaEgresados");

let listaEgresados = JSON.parse(localStorage.getItem("egresados")) || [];
let indiceEditar = -1;

// ===============================
// MOSTRAR TABLA
// ===============================

function mostrarEgresados() {

    if (!tabla) return;

    tabla.innerHTML = "";

    listaEgresados.forEach((egresado, index) => {

        tabla.innerHTML += `
        <tr>
            <td>${egresado.nombre}</td>
            <td>${egresado.carrera}</td>
            <td>${egresado.correo}</td>
            <td>${egresado.estado}</td>
            <td>
                <button type="button" onclick="editarEgresado(${index})">Editar</button>
                <button type="button" onclick="eliminarEgresado(${index})">Eliminar</button>
            </td>
        </tr>
        `;

    });

}

// Mostrar al abrir la página
mostrarEgresados();


// ===============================
// GUARDAR EGRESADO
// ===============================

if (formulario) {

formulario.addEventListener("submit", function(e){

e.preventDefault();

mensaje.textContent = "";
mensaje.className = "";

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

if(nombre===""){
mensaje.textContent="Debe ingresar el nombre.";
mensaje.className="error";
return;
}

if(!cedulaRegex.test(cedula)){
mensaje.textContent="La cédula debe tener el formato 1-1111-1111.";
mensaje.className="error";
return;
}

if(!correoRegex.test(correo)){
mensaje.textContent="Ingrese un correo válido.";
mensaje.className="error";
return;
}

if(!telefonoRegex.test(telefono)){
mensaje.textContent="El teléfono debe tener 8 dígitos.";
mensaje.className="error";
return;
}

if(fecha===""){
mensaje.textContent="Seleccione la fecha de nacimiento.";
mensaje.className="error";
return;
}

if(sexo===""){
mensaje.textContent="Seleccione el sexo.";
mensaje.className="error";
return;
}

if(carrera===""){
mensaje.textContent="Seleccione una carrera.";
mensaje.className="error";
return;
}

if(graduacion===""){
mensaje.textContent="Ingrese el año de graduación.";
mensaje.className="error";
return;
}

if(estado===""){
mensaje.textContent="Seleccione el estado laboral.";
mensaje.className="error";
return;
}

if(empresa===""){
mensaje.textContent="Ingrese el nombre de la empresa.";
mensaje.className="error";
return;
}

if(direccion===""){
mensaje.textContent="Ingrese la dirección.";
mensaje.className="error";
return;
}

if(descripcion===""){
mensaje.textContent="Ingrese una descripción.";
mensaje.className="error";
return;
}

const egresado = {
nombre,
cedula,
correo,
telefono,
fecha,
sexo,
carrera,
graduacion,
estado,
empresa,
direccion,
descripcion
};

// ===============================
// GUARDAR O EDITAR
// ===============================

if (indiceEditar === -1) {

    listaEgresados.push(egresado);

} else {

    listaEgresados[indiceEditar] = egresado;
    indiceEditar = -1;

}

localStorage.setItem("egresados", JSON.stringify(listaEgresados));

mensaje.textContent = "✅ Registro guardado correctamente.";
mensaje.className = "exito";

formulario.reset();

mostrarEgresados();

});

} // Fin del if(formulario)


// ===============================
// EDITAR
// ===============================

function editarEgresado(index){

const egresado = listaEgresados[index];

document.getElementById("nombre").value = egresado.nombre;
document.getElementById("cedula").value = egresado.cedula;
document.getElementById("correo").value = egresado.correo;
document.getElementById("telefono").value = egresado.telefono;
document.getElementById("fecha").value = egresado.fecha;
document.getElementById("sexo").value = egresado.sexo;
document.getElementById("carrera").value = egresado.carrera;
document.getElementById("graduacion").value = egresado.graduacion;
document.getElementById("estado").value = egresado.estado;
document.getElementById("empresa").value = egresado.empresa;
document.getElementById("direccion").value = egresado.direccion;
document.getElementById("descripcion").value = egresado.descripcion;

indiceEditar = index;

window.scrollTo({
    top: 0,
    behavior: "smooth"
});

}


// ===============================
// ELIMINAR
// ===============================

function eliminarEgresado(index){

if(confirm("¿Desea eliminar este registro?")){

listaEgresados.splice(index,1);

localStorage.setItem(
    "egresados",
    JSON.stringify(listaEgresados)
);

mostrarEgresados();

}

}