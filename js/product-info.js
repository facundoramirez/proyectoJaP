var product = {};
var titles = [];
var date = new Date();
var titleInput = document.getElementById("title");
var messageBox = document.getElementById("display");
function showImagesGallery(array){

    let htmlContentToAppend = "";

    for(let i = 0; i < array.length; i++){
        let imageSrc = array[i];

        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>
        `

        document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
}


function showRaiting(){
    let score = videogame.rating;
    let stars ="";
    let html = "";
    for(let i = 1; i<=maxRanking;i++){
     if (i<=score) {
           stars+='<i class="fa fa-star checked"></i>';
    } else {
        stars += '<i class="fa fa-star"></i>'
    }
}

    html = `<span>  ${stars}</span>`

    document.getElementById("rating").innerHTML = html;

}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            product = resultObj.data;

            let productNameHTML  = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCostHTML = document.getElementById("productCost");
            let productSoldCountHTML = document.getElementById("productSoldCount");
            let productCategoryHTML = document.getElementById("productCategory");

        
            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productCostHTML.innerHTML = product.currency + " " + product.cost;
            productSoldCountHTML.innerHTML = product.soldCount;
            productCategoryHTML.innerHTML = product.category;
            

            //Muestro las imagenes en forma de galería
            showImagesGallery(product.images);
            
        }
    });
});

//Caja de comentarios
function insert () {
titles.push(titleInput.value);
clearAndShow();
}

function clearAndShow (){
    var personalScore = document.getElementById("score").value;
   
    
titleInput.value = "";
messageBox.innerHTML = "";
messageBox.innerHTML +=`
<div class="col-lg-3 col-md-4 col-6">
    <div class="d-block mb-4 h-100">
        <p class="nombreUsuarioComentario">`+localStorage.getItem("usuario")+`</p>
        <p>`+ titles.join("<br/> ") +`</p>
        <p class="text-muted">`+ date.toDateString() +`  -   Puntuación:  `+personalScore+` </p>
        <hr class="my-3">
    </div>
</div>
`
}

//mostrar comentarios de json

function comentariosJson(commentArray){

    let htmlContentToAppend = "";

    for(let i = 0; i < commentArray.length; i++){
        let comentario = commentArray[i];

        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <p style="color:lightseagreen">`+ comentario.user+`</p>
                <p>`+ comentario.description+`</p>
                <p class="text-muted">`+ comentario.dateTime+`  -   Puntuación:  `+comentario.score+` </p>
                <hr class="my-3">
            </div>
        </div>
        `

        document.getElementById("comentariosJson").innerHTML = htmlContentToAppend;
    }
}
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            productComments=resultObj.data;
            comentariosJson(productComments);
            showRaiting();
        
        }
    });
});