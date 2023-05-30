import {actualizarTabla} from "./tabla.js";
import {Anuncio} from "./anuncio.js";
 


const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

const $seccionTabla = document.getElementById(("tabla"));
const $formulario = document.forms[0];


actualizarTabla($seccionTabla, anuncios);
actualizarBotones(true);

window.addEventListener("load", ()=> {
    const spinner = document.querySelector(".spinner");

    spinner.classList.add("spinner-hidden");

    spinner.addEventListener("transitionend", ()=>{
        document.body.removeChild("spinner");
    })
});

$formulario.addEventListener("submit", (e)=>{
    e.preventDefault();

    const {txtId , txtTitulo , rdoTransaccion , txtDescripcion, txtPrecio, txtBanios, txtAutos, txtDormitorios } = $formulario;

    if(txtId.value === ""){
        let newAnuncio;
        if(rdoTransaccion.value === "Venta"){
            newAnuncio = new Anuncio(Date.now(), txtTitulo.value, rdoTransaccion.value , txtDescripcion.value , "US$" + txtPrecio.value, parseInt(txtBanios.value), parseInt(txtAutos.value), parseInt(txtDormitorios.value));
        }
        else{
            newAnuncio = new Anuncio(Date.now(), txtTitulo.value, rdoTransaccion.value , txtDescripcion.value , "$" + txtPrecio.value, parseInt(txtBanios.value), parseInt(txtAutos.value), parseInt(txtDormitorios.value));
        }
        

        handlerCreate(newAnuncio);
    }
    else{
        const updatedAnuncio = new Anuncio(parseInt(txtId.value), txtTitulo.value, rdoTransaccion.value , txtDescripcion.value , parseInt(txtPrecio.value), parseInt(txtBanios.value), parseInt(txtAutos.value), parseInt(txtDormitorios.value));

        handlerUpdate(updatedAnuncio);
    }

    $formulario.reset();

})

function handlerCreate(nuevoAnuncio){
    anuncios.push(nuevoAnuncio);
    actualizarStorage("anuncios", anuncios);
    actualizarTabla($seccionTabla, anuncios);

}
function handlerUpdate(editAnuncio){
    
    let index = anuncios.findIndex((an)=> an.id == editAnuncio.id);

    anuncios.splice(index, 1, editAnuncio);

    actualizarStorage("anuncios", anuncios);
    actualizarTabla($seccionTabla, anuncios);
}
function handlerDelete(id){
    let index = anuncios.findIndex((an)=> an.id == id);

    anuncios.splice(index, 1);

    actualizarStorage("anuncios", anuncios);
    actualizarTabla($seccionTabla, anuncios);
    $formulario.reset();

}

window.addEventListener("click", handlerClick);

function handlerClick(e){
    if(e.target.matches("td")){
        const id = e.target.parentElement.dataset.id;

        const selectedAnuncio = anuncios.find((an)=>{
            return an.id == id;
        });

        cargarFormAnuncio($formulario, selectedAnuncio);

        actualizarBotones(false);
    }
    else if(e.target.matches("input[value= 'Eliminar']")){
        handlerDelete(parseInt($formulario.txtId));
    }
    else if(e.target.matches("input[value= 'Cancelar']")){
        actualizarBotones(true);
        $formulario.reset();
        $formulario.txtId.value = "";
    }

};

function actualizarStorage(clave, data){
    localStorage.setItem(clave, JSON.stringify(data));
}

function cargarFormAnuncio(formulario, anuncio){
    formulario.txtId.value = anuncio.id;
    formulario.txtTitulo.value = anuncio.titulo;
    formulario.rdoTransaccion.value = anuncio.transaccion;
    formulario.txtDescripcion.value = anuncio.descripcion;
    let precio = anuncio.precio;
    if(formulario.rdoTransaccion.value == "Venta"){
        precio = parseInt(precio.replace("US$", ""));
    }
    else{
        precio = parseInt(precio.replace("$", ""));
    }
    formulario.txtPrecio.value = precio;
    formulario.txtBanios.value = anuncio.banios;
    formulario.txtAutos.value = anuncio.autos;
    formulario.txtDormitorios.value = anuncio.dormitorios;
}

function actualizarBotones(bool){
    let botonGuardar = document.getElementById("btnGuardar");
    let botonEliminar = document.getElementById("btnEliminar");
    let botonCancelar = document.getElementById("btnCancelar");
    botonEliminar.disabled = bool;
    botonCancelar.disabled = bool;
    if(bool){
        botonGuardar.value = "Guardar";
        botonEliminar.style.display = "none";
        botonCancelar.style.display = "none";
    }
    else{
        botonGuardar.value = "Modificar";
        botonEliminar.style.display = "inline";
        botonCancelar.style.display = "inline";
    }

}