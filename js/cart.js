let arrayArticles = [];
let subtotal = 0;
var total = 0;
var totalEnvio=0;
var subtotalDelBorrado=0;


function calculoSubtotal(count, index) {// devuelve el subtotal del articulo en pesos
    let sub = 0;
    if (arrayArticles[index].currency === "USD") { //si currency = dolares 
        sub = arrayArticles[index].unitCost * count * 40;//multiplica el costo por 40 y por la cantidad
    } else {
        sub = arrayArticles[index].unitCost * count;// sino solo multiplica por la cantidad
    }
    return sub;
}

function addEventCount() { //funcion que contiene el addeventlistener para detectar un cambio y actualizar el subtotal y total
    let subtotalArray = document.getElementsByClassName("subtotalArticle");
    for (let i = 0; i < subtotalArray.length; i++) {
        subtotalArray[i].addEventListener("change", function () {//detecta el cambio con "change"
            document.getElementById("productSubtotal-" + i).innerHTML = arrayArticles[i].currency + " " + subtotalArray[i].value * arrayArticles[i].unitCost;//actualiza el subtotal del articulo
            updateAllSubtotal();//actualiza el subtotal del tablefoot
            clearRadioBtn();
            ocultarBtnModal();
        });
    }
}



function updateAllSubtotal() { //funcion para mostrar y onchange actualizar el subtotal del final de pagina 
    let subtotalArray = document.getElementsByClassName("subtotalArticle");
    for (let i = 0; i < subtotalArray.length; i++) {
        subtotal += calculoSubtotal(subtotalArray[i].value, i);//se llama a la funcion que convierte los dolares a pesos
    }
    document.getElementById("subtotalText").innerHTML = "UYU "+ subtotal;

    total = subtotal;

    document.getElementById("totalText").innerHTML = "UYU " + total; //borrar linea en la siguiente entrega, crear funcion total con datos de envio
    subtotal = 0;

}


function mostrarArticulos(articles) { //Crea una fila de tabla por cada articulo en el JSON y escribe sus datos
    let htmlContentToAppend = "";

    for (let i = 0; i < articles.length; i++) {
        productUnitCost = articles[i].unitCost;
        productCurrency = articles[i].currency;

        htmlContentToAppend += `
        <tr id="articleRow${[i]}">
      <td><img src="`+ articles[i].src + `" width="50px"> </td> 
      <td>`+ articles[i].name + `</td>
      <td>`+ articles[i].currency + " " + articles[i].unitCost + `</td>
      <td><input class="form-control subtotalArticle" style="width: 60px;" type="number" id="productCount-${i}" value="` + articles[i].count + `"min="1"></td>
      
      <td><span id="productSubtotal-${i}" style="font-weight: bold;" value="${articles[i].unitCost * articles[i].count}">${articles[i].currency}${articles[i].unitCost * articles[i].count}</span></td>
      <td style="padding-left: 1.75rem;"><input class="eliminar" id="eliminar${[i]}" type="image" src="png/delete-3x.png" /> </td>
    </tr> `
    
    } 
    document.getElementById("cartProducts").innerHTML = htmlContentToAppend;//escribe en el html
    addEventCount(); //funcion que contiene el addeventlistener
    updateAllSubtotal(); //actualiza el subtotal y el total en el tablefoot
    
  
      

}

function borrarArticulo(){//funcion que se ejecuta al presionar el boton de borrar articulo
    let trash = document.getElementsByClassName("eliminar");
    for (let i=0; i<trash.length; i++){
        trash[i].addEventListener("click",function(){
            var element = document.getElementById("articleRow"+[i]);
            element.classList.add("d-none");//agrega la clase d-none para ocultar la fila del articulo

            restaDeElementoBorrado(i);
            clearRadioBtn();
            ocultarBtnModal();
        });
    }
}


//XXXXXX
function restaDeElementoBorrado(i){//INCOMPLETA    devuelve NaN     deberia escribir el resultado de el total - el articulo borrado
    var resta = 0;
    subtotalDelBorrado = document.getElementById("productSubtotal-"+i).value;
    resta = total - subtotalDelBorrado;
    document.getElementById("subtotalText").innerText ="UYU " + resta;
    document.getElementById("totalText").innerText ="UYU " + resta;
}
//XXXXXXX


function onkeyPress(event) { //funcion de numero de tarjeta de credito en modal
    numTarjeta.value = numTarjeta.value.replace(/[a-zA-Z]/g, '');//reemplaza las letras por nada
}

numTarjeta.addEventListener('keypress', onkeyPress);
numTarjeta.addEventListener('keydown', onkeyPress);
numTarjeta.addEventListener('keyup', onkeyPress);

function sentMethod() { // Funcion que se ejecuta al presionar el primer botón de comprar (fuera del modal)
    const radioBtns = document.querySelectorAll('input[name="payOpt"]');
    let modalTitle = "";
    let selectedValue;
    let modalTotalYEnvio = 0;
    
    for (const rb of radioBtns) {
        if (rb.checked) {
            selectedValue = rb.value;
            break;
        }
    }
    modalTitle += `Envío<b> ${selectedValue}</b> seleccionado.`//custom text del modal
    modalTotalYEnvio = `Total a pagar: UYU${totalEnvio}.`// total reflejado en el modal
    document.getElementById("selectedPaymentTitle").innerHTML = modalTitle;
    document.getElementById("AddressTitle").innerHTML = modalTitle;
    document.getElementById("totalModal").innerHTML = modalTotalYEnvio;

    totalMasEnvio(selectedValue);
    
};

function addEventRadio(){//Cada vez que se clickea en un boton de radio actualiza el total + el costo de envio
    let opciones = document.querySelectorAll('input[name="payOpt"]');
    if( opciones ){
      for( let i = 0; i < opciones.length; i++ ){
        opciones[i].addEventListener("click", function(){
          let item = this.value; // devuelve el value del radio button seleccionado
          
          totalMasEnvio(item);//toma el value del radio como parametro y actualizar el total+ envio
          document.getElementById("totalText").innerHTML= "UYU " + totalEnvio;//escribe el total + envio
          
          
        });
      }
    }
}

function totalMasEnvio(seleccion) {//funcion que calcula el tipo de envio mas el total
    if (seleccion === "premium") {
        totalEnvio = (total * 15) / 100 + total;
    } 

    if (seleccion === "express") {
        totalEnvio = (total * 7) / 100 + total;
    }

    if (seleccion === "standard") {
        totalEnvio = (total * 5) / 100 + total;
    }
}

function clearRadioBtn(){// funcion que se ejecuta al cargar el documento y deselecciona las opciones de radio
    var ele = document.getElementsByClassName("radioevent");
   for(var i=0;i<ele.length;i++)
      ele[i].checked = false;
}

function mostrarBtnModal(){//funcion que se ejecuta al presionar un boton de radio y muestra el boton para continuar con la compra
    var element = document.getElementById("buyBtn");
  element.classList.remove("d-none");//elimina la clase que oculta al boton
}
function ocultarBtnModal(){//funcion que oculta el boton de compra
    var element = document.getElementById("buyBtn");
    element.classList.add("d-none");//agrega la clase que oculta al boton
}

function paymentMethod(){//se ejecuta al presionar el boton de comprar final (en el modal). Elige que funcion ejecutar dependiendo de la eleccion del boton de radio

    if(document.getElementById("cardCheck").checked){//Si el usuario elige pagar con tarjeta   
        return validarTarjeta();
    }if(document.getElementById("depositCheck").checked){//Si elige pagar con deposito
       return validarDeposito();
    }
}

function validarDeposito(){
    var elemento = document.getElementById("numDeposito").value

    if (elemento ==""){//Si el input esta vacio pide que ingrese los datos del deposito
        let dangerAlert = `<div class="alert alert-danger" role="alert">
        ¡Debes ingresar el número de cuenta!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="width: min-content">
         <span aria-hidden="true">&times;</span>
       </button>
      </div>`
        document.getElementById("modalAlertRow").innerHTML+= dangerAlert;
         return false
       }else {//si se ingresaron los datos avisa que se ha realizado la compra
           let succedAlert = `<div class="alert alert-success" role="alert">
           Compra realizada con éxito :)
           <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="width: min-content">
            <span aria-hidden="true">&times;</span>
          </button>
         </div>`
         document.getElementById("modalAlertRow").innerHTML+= succedAlert;
         return false
    }
}

function validarTarjeta() {//funcion que verifica si cada input de la tarjeta está escrito
    var elemento1 = document.getElementById("numTarjeta").value
    var elemento2 = document.getElementById("mesVenc").value
    var elemento3 = document.getElementById("anioVenc").value
    var elemento4 = document.getElementById("cvv").value
    
  if (elemento1 == "" || elemento2 == "" || elemento3 == "" || elemento4 == ""){//si un imput esta vacio pide que se ingresen los datos
   let dangerAlert = `<div class="alert alert-danger" role="alert">
   ¡Debes completar todos los campos!
   <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="width: min-content">
    <span aria-hidden="true">&times;</span>
  </button>
 </div>`
   document.getElementById("modalAlertRow").innerHTML+= dangerAlert;
    
  }else {// Si se ingresaron los datos muestra que se ha realizado la compra
      let succedAlert = `<div class="alert alert-success" role="alert">
      Compra realizada con éxito :)
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="width: min-content">
       <span aria-hidden="true">&times;</span>
     </button>
    </div>`
    document.getElementById("modalAlertRow").innerHTML+= succedAlert;
    
  }
}

function validarDireccion(){//verifica que esten escrito todos los datos de la direccion
    var elemento1 = document.getElementById("calleInput").value
    var elemento2 = document.getElementById("esquinaInput").value
    var elemento3 = document.getElementById("numInput").value
    var botonSiguiente = document.getElementById("nextModal");
    if (elemento1 == "" || elemento2 == "" || elemento3 == ""){
        botonSiguiente.disabled = true;//si estan vacios deja el boton de siguiente sin poder presionarlo
       }else {
        botonSiguiente.disabled = false;//si estan todos escritos deja presionar el boton de siguiente
       }
}

function addEventEnvioEnModal(){//cada vez que detecta un cambio en el imput de address llama a la funcion validarDireccion
    document.querySelectorAll('.addressInput').forEach(item => {
        item.addEventListener('change', event => {
          validarDireccion();
        })
      })
}


document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData("https://japdevdep.github.io/ecommerce-api/cart/654.json").then(function (resultObj) {//link de JSON con dos articulos
        if (resultObj.status === "ok") {
            arrayArticles = resultObj.data.articles
            mostrarArticulos(arrayArticles);
            addEventRadio();
            clearRadioBtn();
            addEventEnvioEnModal()
            validarDireccion();
            borrarArticulo()
        }
    })
});