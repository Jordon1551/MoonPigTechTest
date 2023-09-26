const CardTemplate = document.querySelector("[product-template]")
const CardsContainer = document.querySelector("[products-container]")

const cardDetailContainer = document.querySelector("[product-details-container]")
const cardDetailTemplate = document.querySelector("[product-details-template]")


if (document.URL.includes("index")){
    //gets general information for all products
    fetch("https://moonpig.github.io/tech-test-frontend/search.json")
    .then(res => res.json())
    .then(data => {

        data.Products.forEach(product => {
            //Filter products based on category id - 0 means no filter
            if(localStorage.getItem('ActiveFilter')!="0" && localStorage.getItem('ActiveFilter')!=product.ProductCategory.ProductCategoryId){
                return;
            }
            // creates document fragment from the template and adds image details
            const card = CardTemplate.content.cloneNode(true)
            const image = card.querySelector("[product-image]")
            image.src = product.ProductImage.Link.Href;
            image.alt = product.Description;
            image.id = product.ProductId;
            //add document fragment to container
            CardsContainer.append(card)
        })      
    })
    
} else if (document.URL.includes("details")){
    //gets general information of products
    fetch("https://moonpig.github.io/tech-test-frontend/search.json")
    .then(res => res.json())
    .then(data => {
        //find the product we're looking for
        data.Products.forEach(product => {
            //if this is our product
            if (product.ProductId == localStorage.getItem('SingleProductID')){
                fetch(product.ProductLink.Href)
                .then(res => res.json())
                .then(ProductData => {
                    //create document fragment based off the template and populate it
                    const card = cardDetailTemplate.content.cloneNode(true)
                    const image1 = card.querySelector("[gallery-image1]")
                    const image2 = card.querySelector("[gallery-image2]")
                    const image3 = card.querySelector("[gallery-image3]")
                    const image4 = card.querySelector("[gallery-image4]")
                    const title = card.querySelector("[title]")
                    const details = card.querySelector("[details]")
                    const PriceInformation = card.querySelector("[price]")

                    title.innerHTML = "<strong>".concat(ProductData.Title,"</strong>");

                    //Account for varying levels of detail
                    if(ProductData.Description.includes(ProductData.Title)){
                        var DescriptionSplit = ProductData.Description.split(ProductData.Title);
                        var Description = DescriptionSplit[1];
                    }else{
                        var Description = ProductData.Description;
                    }
                    details.innerHTML = Description.concat("<strong><br><br>Size: </strong>", ProductData.SizeName);

                    //Account for varying image sizes and numbers
                    if(ProductData.Size.Category.Id == 11){
                        image1.src = ProductData.ImageUrls[0].ImageUrl;
                        image2.src = ProductData.ImageUrls[1].ImageUrl;
                        image3.src = ProductData.ImageUrls[2].ImageUrl;
                        image4.src = ProductData.ImageUrls[3].ImageUrl;  
                    }else if(ProductData.Size.Category.Id == 12){
                        image1.src = ProductData.ImageUrls[1].ImageUrl;
                        image2.src = ProductData.ImageUrls[2].ImageUrl;
                        image3.src = ProductData.ImageUrls[0].ImageUrl;
                        image4.src = ProductData.ImageUrls[3].ImageUrl;
                    }else if(ProductData.Size.Category.Id == 19){
                        image1.src = ProductData.ImageUrls[0].ImageUrl;
                        image1.style.height = "400px";
                    }else{
                        image1.src = ProductData.ImageUrls[0].ImageUrl;
                        image2.src = ProductData.ImageUrls[1].ImageUrl;
                        image3.src = ProductData.ImageUrls[2].ImageUrl;
                        image4.src = ProductData.ImageUrls[3].ImageUrl;
                        image1.style.height = "400px";
                        image2.style.height = "400px";
                        image3.style.height = "400px";
                        image4.style.height = "400px";
                    }
                    
                    let Price = "<strong>Price:</strong> ";
                    let PriceConcat = Price.concat(ProductData.Size.Currency, ProductData.Size.Price);
                    PriceInformation.innerHTML = PriceConcat;
                    cardDetailContainer.append(card)
                })
        }
    })
    })
}

function ProductDetails(ImageID){
    localStorage.setItem('SingleProductID', document.getElementById(ImageID).id)
    location.href = "details.html";
    
}

function Purchased(){
    alert("Thank you for your purchase")
}

function ReturnHome(){
    location.href="index.html"
}

function Filter(Filter){
    if(localStorage.getItem('ActiveFilter')==Filter){
        localStorage.setItem('ActiveFilter', "0")
    }else{
        localStorage.setItem('ActiveFilter', Filter)
    }
    location.href = "index.html"
}