
listadoTrabajadores();
getDepartamentos();


//Función que lista los departamentos
async function getDepartamentos() {
    const response = await fetch("/trabajador/ListadoDepartamentos");

    if (response.status === 200) {
        const departamentos = await response.json();

        document.getElementById("cboDepartamento").innerHTML = `
                        <option selected value="">Seleccione</option>`+
            departamentos.map(departamento =>
                `<option value="${departamento.id}">${departamento.nombreDepartamento}</option>`);
    } else {
        console.error("No se pudo obtener los departamentos");
    }
}


//Función que lista las provincias
async function getProvincias() {
    document.getElementById("cboProvincia").innerHTML = "<option value=''>--Cargando--</option>";
    const idDepartamento = document.getElementById("cboDepartamento").value;
    const response = await fetch("/trabajador/ListadoProvincias?idDepartamento=" + idDepartamento);

    if (response.status === 200) {
        const provincias = await response.json();
        document.getElementById("cboProvincia").innerHTML = `<option selected value="">Seleccione</option>` +
            provincias.map(provincia => `<option value="${provincia.id}">${provincia.nombreProvincia}</option>`);

        document.getElementById("cboDistrito").innerHTML = "";

    } else {
        console.error("No se pudo obtener las provincias");
        document.getElementById("cboProvincia").innerHTML = "";

    }
}


//Función que lista los distritos
async function getDistritos() {
    document.getElementById("cboDistrito").innerHTML = "<option value=''>--Cargando--</option>";
    const idProvincia = document.getElementById("cboProvincia").value;
    const response = await fetch("/trabajador/ListadoDistritos?idProvincia=" + idProvincia);

    if (response.status === 200) {
        const distritos = await response.json();
        document.getElementById("cboDistrito").innerHTML = `<option selected value="">Seleccione</option>` +
            distritos.map(distrito => `<option value="${distrito.id}">${distrito.nombreDistrito}</option>`);
    } else {
        console.error("No se pudo obtener los distritos");
        document.getElementById("cboProvincia").innerHTML = "";
    }
}


//Metodo que lista a los trabajadores
async function listadoTrabajadores() {
    sexo = document.getElementById("filtroSexo").value;
    const response = await fetch("/trabajador/ListadoTrabajadores");

    if (response.status === 200) {
        const trabajadores = await response.json();
        let filtro;
        var salida = "";

        if (sexo == "M") {
            filtro = trabajadores.filter(trabajador => trabajador.sexo === "M");
        }
        else if (sexo == "F") {
            filtro = trabajadores.filter(trabajador => trabajador.sexo === "F");
        }
        else {
            filtro = trabajadores;
        }
        console.log(filtro);
        filtro.map(trabajador => {
            salida +=
                `<tr style="background-color:${trabajador.sexo === 'M' ? '#3856B7' : '#FFA240'}; color:white">` +
                `<td>${trabajador.tipoDocumento}</td>
                        <td>${trabajador.numeroDocumento}</td>
                        <td>${trabajador.nombres}</td>
                        <td>${trabajador.sexo}</td>
                        <td>${trabajador.nombreDepartamento}</td>
                        <td>${trabajador.nombreProvincia}</td>
                        <td>${trabajador.nombreDistrito}</td>
                        <td>
                        <button class="btn btn-success" title="Editar" onclick="rellenarFormulario(${trabajador.id})"><i class="bi bi-pencil-fill"></i></button>
                        <button class="btn btn-danger" title="Eliminar" onclick="eliminarTrabajador(${trabajador.id})"><i class="bi bi-trash2-fill"></i></button>
                        </td>
                    </tr>`
        });
        document.getElementById("datos").innerHTML = salida;

    } else {
        console.error("No se pudo obtener los trabajadores");
    }
}


//Metodo que busca y devuelve un trabajador por su id
async function buscarTrabajador(idTrabajador) {
    const response = await fetch("/trabajador/BuscarTrabajador?id=" + idTrabajador);

    if (response.status === 200) {
        const trabajador = await response.json();
        return trabajador;
    }
    else {
        return null;
    }
}


//Metodo que guarda un trabajador
async function guardarTrabajador() {
    var tipoDocumento = document.getElementById("cboTipoDocumento").value;
    var numeroDocumento = document.getElementById("txtNumeroDocumento").value;
    var nombres = document.getElementById("txtNombres").value;
    var sexo = document.querySelector('input[name="checkSexo"]:checked').value;
    var idDepartamento = document.getElementById("cboDepartamento").value;
    var idProvincia = document.getElementById("cboProvincia").value;
    var idDistrito = document.getElementById("cboDistrito").value;

    var trabajador = {
        TipoDocumento: tipoDocumento,
        NumeroDocumento: numeroDocumento,
        Nombres: nombres,
        Sexo: sexo,
        IdDepartamento: idDepartamento,
        IdProvincia: idProvincia,
        IdDistrito: idDistrito
    }

    const response = await fetch("/trabajador/GuardarTrabajador", {
        method: "POST",
        body: JSON.stringify(trabajador),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.status === 200) {
        const salida = await response.json();
        if (salida == 0) {
            Swal.fire({
                title: "Error!",
                text: "Ocurrio un error al guardar al trabajador",
                icon: "error"
            });
        }
        else if (salida == 1) {
            listadoTrabajadores();
            limpiarFormulario();
            cerrarModal();

            Swal.fire({
                title: "Exito!",
                text: "El trabajador fue guardado",
                icon: "success"
            });
        }

    } else {
        Swal.fire({
            title: "Error!",
            text: "Ocurrio un error al guardar al trabajador",
            icon: "error"
        });
    }
}


//Metodo que edita un trabajador
async function editarTrabajador() {
    var idTrabajador = document.getElementById("idTrabajador").value;
    var tipoDocumento = document.getElementById("cboTipoDocumento").value;
    var numeroDocumento = document.getElementById("txtNumeroDocumento").value;
    var nombres = document.getElementById("txtNombres").value;
    var sexo = document.querySelector('input[name="checkSexo"]:checked').value;
    var idDepartamento = document.getElementById("cboDepartamento").value;
    var idProvincia = document.getElementById("cboProvincia").value;
    var idDistrito = document.getElementById("cboDistrito").value;

    var trabajador = {
        Id: idTrabajador,
        TipoDocumento: tipoDocumento,
        NumeroDocumento: numeroDocumento,
        Nombres: nombres,
        Sexo: sexo,
        IdDepartamento: idDepartamento,
        IdProvincia: idProvincia,
        IdDistrito: idDistrito
    }

    const response = await fetch("/trabajador/ActualizarTrabajador", {
        method: "PUT",
        body: JSON.stringify(trabajador),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.status === 200) {
        const salida = await response.json();
        if (salida == 0) {
            Swal.fire({
                title: "Error!",
                text: "El trabajador no fue encontrado en los registros y no se pudo actualizar",
                icon: "error"
            });
        }
        else if (salida == 1) {
            limpiarFormulario();
            cerrarModal();

            Swal.fire({
                title: "Exito!",
                text: "El trabajador fue actualizado",
                icon: "success"
            });
        }
        listadoTrabajadores();

    } else {
        Swal.fire({
            title: "Error!",
            text: "Ocurrio un error al actualizar al trabajador",
            icon: "error"
        });
    }
}


//Metodo que elimina un trabajador por su id
async function eliminarTrabajador(idTrabajador) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success m-1',
            cancelButton: 'btn btn-danger m-1'
        },
        buttonsStyling: false
    });
    try {
        const result = await swalWithBootstrapButtons.fire({
            title: '¿Desea eliminar?',
            text: 'Esta acción es irreversible, ¿Desea continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-danger m-1',
                cancelButton: 'btn btn-success m-1'
            },
            reverseButtons: true
        });

        if (result.isConfirmed) {
            const response = await fetch(`/trabajador/EliminarTrabajador?id=${idTrabajador}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {

                const salida = await response.json();
                if (salida == 0) {
                    swalWithBootstrapButtons.fire(
                        'Error',
                        'El trabajador ya se encuentra eliminado',
                        'error'
                    );
                }
                else if (salida == 1) {
                    swalWithBootstrapButtons.fire(
                        'Eliminado',
                        'El trabajador fue eliminado',
                        'success'
                    );
                }
                listadoTrabajadores();

            } else {
                swalWithBootstrapButtons.fire(
                    'Error',
                    'Ocurrió un error al eliminar al trabajador',
                    'error'
                );
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'Usted canceló la acción',
                'error'
            );
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


//Función que establece si se va a editar o agregar un trabajador
function accionFormulario() {
    var idTrabajador = document.getElementById("idTrabajador").value;
    if (idTrabajador == "") {
        guardarTrabajador();
    }
    if (idTrabajador != "") {
        editarTrabajador();
    }
}


//Función que rellena el formulario para editar con un trabajador buscado por id
async function rellenarFormulario(id) {
    var trabajador = await buscarTrabajador(id);
    if (trabajador != null) {
        document.getElementById("idTrabajador").value = id;
        document.getElementById("cboTipoDocumento").value = trabajador.tipoDocumento;
        document.getElementById("txtNumeroDocumento").value = trabajador.numeroDocumento;
        document.getElementById("txtNombres").value = trabajador.nombres;

        var sexo = document.querySelectorAll('input[name="checkSexo"]');
        sexo.forEach(input => {
            if (input.value === trabajador.sexo) {
                input.checked = true;
            }
        });

        document.getElementById("cboDepartamento").value = trabajador.idDepartamento;
        await getProvincias();
        document.getElementById("cboProvincia").value = trabajador.idProvincia;
        await getDistritos();
        document.getElementById("cboDistrito").value = trabajador.idDistrito;

        var tituloModal = document.getElementById("tituloModal");
        tituloModal.innerHTML = "Editar trabajador: " + id;

        var btnFormulario = document.getElementById("btnFormulario");
        btnFormulario.innerHTML = "Editar";
        btnFormulario.classList.remove("btn-primary");
        btnFormulario.classList.add("btn-warning");

        var modal = new bootstrap.Modal(document.getElementById("modal"), {});
        modal.show();
    }
    else {
        listadoTrabajadores();
        Swal.fire({
            title: "Error!",
            text: "El trabajador no fue encontrado en los registros",
            icon: "error"
        });
    }
}


//Función que limpia el formulario
function limpiarFormulario() {
    document.getElementById("formulario").reset();
    document.getElementById("formulario").classList.remove("was-validated");

    var tituloModal = document.getElementById("tituloModal");
    tituloModal.innerHTML = "Agregar trabajador";

    var btnFormulario = document.getElementById("btnFormulario");
    btnFormulario.innerHTML = "Guardar";
    btnFormulario.classList.remove("btn-warning");
    btnFormulario.classList.add("btn-primary");


}


//Función que cierra el modal
function cerrarModal() {
    var miModal = document.getElementById('modal');
    var modalBootstrap = bootstrap.Modal.getInstance(miModal);
    modalBootstrap.hide();
}


//Función que limpia el formulario cada vez que se cierra
document.getElementById("modal").addEventListener('hidden.bs.modal', function () {
    limpiarFormulario();
});
