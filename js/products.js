const PRODUCT_RELEVANCE = "relevancia";
const PRODUCT_ASC_COST = "precioMayor";
const PRODUCT_DESC_COST = "precioMenor";
var currentProductArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;

function showProdList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductArray.length; i++){
        let prod = currentProductArray[i];
        if (((minCount == undefined) || (minCount != undefined && parseInt(prod.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(prod.cost) <= maxCount))){

        htmlContentToAppend += `
        <a href="product-info.html" class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + prod.imgSrc + `" alt="` + prod.description + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ prod.name +`</h4>
                        
                        <small class="text-muted">` + prod.soldCount + ` artículos vendidos</small>
                    </div>
                    <p>` + prod.description + `</p>
                    <small class="text-muted">` + prod.currency + " "+ prod.cost+ `</small>

                </div>
            </div>
        </a>
        `
        }}

        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }


        function sortProducts(criteria, array){ //function general para ordenar
            let result = [];
            if (criteria === PRODUCT_ASC_COST)//compara si el crietrio es igual a "AZ"
            {
                result = array.sort(function(a, b) { //hace un sort de forma ascendente
                    if ( a.cost < b.cost ){ return -1; }//a es menor que b
                    if ( a.cost > b.cost ){ return 1; }//a es mayor que b
                    return 0;//son iguales
                });
            }else if (criteria === PRODUCT_DESC_COST){
                result = array.sort(function(a, b) {//hace un sort de forma descendente
                    if ( a.cost > b.cost ){ return -1; }
                    if ( a.cost < b.cost ){ return 1; }
                    return 0; //a y b son iguales
                });
            }else if (criteria === PRODUCT_RELEVANCE){
                result = array.sort(function(a, b) {
        
                    if ( a.soldCount > b.soldCount ){ return -1; }
                    if ( a.soldCount < b.soldCount ){ return 1; }
                    return 0; //a y b son iguales
                });
            }
        
            return result;
        }

function sortAndShowProducts(sortCriteria, productArray){
    currentSortCriteria = sortCriteria;

    if(productArray != undefined){
        currentProductArray = productArray;
    }

    currentProductArray = sortProducts(currentSortCriteria, currentProductArray);

    //Muestro las categorías ordenadas
    showProdList();
}   

       


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            productArray = resultObj.data;
            //Muestro las categorías ordenadas
           
            sortAndShowProducts(PRODUCT_ASC_COST,resultObj.data);
        } 
    });
});    


document.getElementById("sortAsc").addEventListener("click", function(){
    sortAndShowProducts(PRODUCT_ASC_COST);
});

document.getElementById("sortDesc").addEventListener("click",function(){
    sortAndShowProducts(PRODUCT_DESC_COST);
});

document.getElementById("sortBySold").addEventListener("click", function(){
    sortAndShowProducts(PRODUCT_RELEVANCE);
});

document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProdList();
});

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showProdList();
    });

   