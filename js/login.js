let nombreUsuario = "";
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

});

function setName(){
    nombreUsuario = document.getElementById("nombreUsuarioNav").value;
    if(nombreUsuario!=undefined && nombreUsuario!=""){
        localStorage.setItem("usuario",nombreUsuario);
    }
}

