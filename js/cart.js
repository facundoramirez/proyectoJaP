let arrayArticles = [];
let subtotal = 0;
var total = 0;
var totalEnvio=0;


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
        <tr>
      <td><img src="`+ articles[i].src + `" width="50px"> </td> 
      <td>`+ articles[i].name + `</td>
      <td>`+ articles[i].currency + " " + articles[i].unitCost + `</td>
      <td><input class="form-control subtotalArticle" style="width: 60px;" type="number" id="productCount-${i}" value="` + articles[i].count + `"min="1"></td>
      
      <td><span id="productSubtotal-${i}" style="font-weight: bold;">${articles[i].currency}${articles[i].unitCost * articles[i].count}</span></td>
    </tr> `

    }
    document.getElementById("cartProducts").innerHTML = htmlContentToAppend;//escribe en el html
    addEventCount(); //funcion que contiene el addeventlistener
    updateAllSubtotal(); //actualiza el subtotal y el total en el tablefoot
}


function onkeyPress(event) { //funcion de numero de tarjeta de credito en modal
    numTarjeta.value = numTarjeta.value.replace(/[a-zA-Z]/g, '');
}

numTarjeta.addEventListener('keypress', onkeyPress);
numTarjeta.addEventListener('keydown', onkeyPress);
numTarjeta.addEventListener('keyup', onkeyPress);

function paymentMethod() {
    const rbs = document.querySelectorAll('input[name="payOpt"]');
    let modalTitle = "";
    let selectedValue;
    let modalTotalYEnvio = 0;
    
    for (const rb of rbs) {
        if (rb.checked) {
            selectedValue = rb.value;
            break;
        }
    }
    modalTitle += `Pago<b> ${selectedValue}</b> seleccionado.`
    modalTotalYEnvio = `Total a pagar: UYU${totalEnvio}.`
    document.getElementById("selectedPaymentTitle").innerHTML = modalTitle;
    document.getElementById("totalModal").innerHTML = modalTotalYEnvio;
    totalMasEnvio(selectedValue);
    
};

function addEventRadio(){
    let contact = document.querySelectorAll('input[name="payOpt"]');
    if( contact ){
      for( let i = 0; i < contact.length; i++ ){
        contact[i].addEventListener("click", function(){
          let item = this.value; // this == the clicked radio, which launched the function
          
          totalMasEnvio(item);
          document.getElementById("totalText").innerHTML= "UYU " + totalEnvio;
          
          
        });
      }
    }
}

function totalMasEnvio(rbs) {
    if (rbs === "premium") {
        totalEnvio = (total * 15) / 100 + total;
    } 

    if (rbs === "express") {
        totalEnvio = (total * 7) / 100 + total;
    }

    if (rbs === "standard") {
        totalEnvio = (total * 5) / 100 + total;
    }
}

function clearRadioBtn(){
    var ele = document.getElementsByClassName("radioevent");
   for(var i=0;i<ele.length;i++)
      ele[i].checked = false;
}

function mostrarBtnModal(){
    var element = document.getElementById("buyBtn");
  element.classList.remove("d-none");
}

function validar() {
    var elemento1 = document.getElementById("numTarjeta").value
    var elemento2 = document.getElementById("mesVenc").value
    var elemento3 = document.getElementById("anioVenc").value
    var elemento4 = document.getElementById("cvv").value
    
  if (elemento1 == "" || elemento2 == "" || elemento3 == "" || elemento4 == ""){
   let dangerAlert = `<div class="alert alert-danger" role="alert">
   ¡Debes completar todos los campos!
   <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="width: min-content">
    <span aria-hidden="true">&times;</span>
  </button>
 </div>`
   document.getElementById("modalAlertRow").innerHTML+= dangerAlert;
    return false
  }else {
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


document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData("https://japdevdep.github.io/ecommerce-api/cart/654.json").then(function (resultObj) {//link de JSON con dos articulos
        if (resultObj.status === "ok") {
            arrayArticles = resultObj.data.articles
            mostrarArticulos(arrayArticles);
            addEventRadio();
            clearRadioBtn();
        }
    })
});