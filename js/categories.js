const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
var currentCategoriesArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;

function sortCategories(criteria, array){ //function general para ordenar
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)//compara si el crietrio es igual a "AZ"
    {
        result = array.sort(function(a, b) { //hace un sort de forma ascendente
            if ( a.name < b.name ){ return -1; }//a es menor que b
            if ( a.name > b.name ){ return 1; }//a es mayor que b
            return 0;//son iguales
        });
    }else if (criteria === ORDER_DESC_BY_NAME){//compara si el criterio es igual a "ZA"
        result = array.sort(function(a, b) {//hace un sort de forma descendente
            if ( a.name > b.name ){ return -1; }//a es mayor que b (AB)
            if ( a.name < b.name ){ return 1; }//a es menor que b (BA)
            return 0; //a y b son iguales
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){//compara si el criterio es igual a "Cant." Es una lista numerica en forma descendente
        result = array.sort(function(a, b) {//pasa el string a numero con parseInt para que ordene bien y los guarda en una variable
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);
            //orden descendente

            if ( aCount > bCount ){ return -1; }//a es mayor que b (AB)
            if ( aCount < bCount ){ return 1; }//a es menor que b (BA)
            return 0; //a y b son iguales
        });
    }

    return result;
}

function showCategoriesList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){//(linea 48)en lugar de category-info poner product-info en product.js para redireccionar en click

            htmlContentToAppend += `
             <a href="category-info.html" class="list-group-item list-group-item-action"> 
                <div class="row">
                    <div class="col-3">
                        <img src="` + category.imgSrc + `" alt="` + category.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ category.name +`</h4>
                            <small class="text-muted">` + category.productCount + ` artículos</small>
                        </div>
                        <p class="mb-1">` + category.description + `</p>
                    </div>
                </div>
            </a>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
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

        showCategoriesList();
    });
});