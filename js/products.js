var currentProductArray = [];

function showProdList(currentProductArray){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductArray.length; i++){
        let prod = currentProductArray[i];

       

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
        }

        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
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
            showProdList(productArray);
        } 
    });
    
});