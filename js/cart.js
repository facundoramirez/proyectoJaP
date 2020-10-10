let arrayArticles=[];
let subtotal = 0;

function calculoSubtotal(count,index){// devuelve el subtotal del articulo en pesos
    let sub=0;
    if(arrayArticles[index].currency==="USD"){ //si currency = dolares 
        sub = arrayArticles[index].unitCost*count*40;//multiplica el costo por 40 y por la cantidad
    }else{
        sub = arrayArticles[index].unitCost*count;// sino solo multiplica por la cantidad
    }
    return sub; 
}

function addEventCount(){ //funcion que contiene el addeventlistener para detectar un cambio y actualizar el subtotal y total
    let subtotalArray = document.getElementsByClassName("subtotalArticle");
    for (let i=0;i<subtotalArray.length;i++){
        subtotalArray[i].addEventListener("change",function(){//detecta el cambio con "change"
            document.getElementById("productSubtotal-"+i).innerHTML = arrayArticles[i].currency + " " + subtotalArray[i].value * arrayArticles[i].unitCost;//actualiza el subtotal del articulo
            updateAllSubtotal();//actualiza el subtotal del tablefoot
        });
    }
}

function updateAllSubtotal(){ //funcion para mostrar y onchange actualizar el subtotal del tablefoot
    let subtotalArray = document.getElementsByClassName("subtotalArticle");
    for (let i=0; i<subtotalArray.length;i++){
        subtotal += calculoSubtotal(subtotalArray[i].value,i);//se llama a la funcion que convierte los dolares a pesos
    }
    document.getElementById("subtotalText").innerHTML = "UYU " + subtotal;
    document.getElementById("totalText").innerHTML = "UYU " + subtotal; //borrar linea en la siguiente entrega, crear funcion total con datos de envio
    subtotal= 0;
}


function mostrarArticulos(articles){ //Crea una fila de tabla por cada articulo en el JSON y escribe sus datos
    let htmlContentToAppend = "";

    for(let i = 0; i < articles.length; i++){
        productUnitCost = articles[i].unitCost;
        productCurrency = articles[i].currency;

        htmlContentToAppend += `
        <tr>
      <td><img src="`+articles[i].src+`" width="50px"> </td> 
      <td>`+articles[i].name+`</td>
      <td>`+articles[i].currency + " "+ articles[i].unitCost + `</td>
      <td><input class="form-control subtotalArticle" style="width: 60px;" type="number" id="productCount-${i}" value="`+ articles[i].count +`"min="1"></td>
      
      <td><span id="productSubtotal-${i}" style="font-weight: bold;">${articles[i].currency}${articles[i].unitCost * articles[i].count}</span></td>
    </tr> `

    }
    document.getElementById("cartProducts").innerHTML = htmlContentToAppend;//escribe en el html
    addEventCount(); //funcion que contiene el addeventlistener
    updateAllSubtotal(); //actualiza el subtotal y el total en el tablefoot
}


/* function updateSubtotal(){
    let count = parseInt(document.getElementById("productCount").value);
    subtotal = count * productUnitCost;
    document.getElementById("productSubtotal").innerHTML = productCurrency + " " + subtotal;
    document.getElementById("cartBadge").innerHTML = count;
    updateTotalCosts();
}

function updateTotalCosts(){
    total = subtotal;
    document.getElementById("total").innerHTML = productCurrency + " " + total;
} */



document.addEventListener("DOMContentLoaded", function(e){

    getJSONData("https://japdevdep.github.io/ecommerce-api/cart/654.json").then(function(resultObj){//link de JSON con dos articulos
        if (resultObj.status === "ok"){
            arrayArticles=resultObj.data.articles
            mostrarArticulos(arrayArticles);
        }
    })
});