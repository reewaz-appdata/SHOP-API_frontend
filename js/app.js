//Grab the grid container
const grid = document.getElementById("product-grid");

fetch("http://localhost:8080/api/v1/products")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        
        //Clear the placeholder
        grid.innerHTML = "";
        
        //Handle the empty case
        if (data.content.length === 0) {
            grid.innerHTML = "<p>No games found</p>";
            return;
        }
        
        //Loop the products
        data.content.forEach(product => {
            // Step 5: Decide the badge before building the card
            const badgeText = product.stockQuantity > 0 ? "In stock" : "Out of stock";
            const badgeClass = product.stockQuantity > 0 ? "in-stock" : "out-of-stock";
            
            // Step 6: Build one card's HTML as a string
            const card = `
                <article class="product-card">
                    <h3>${product.name}</h3>
                    <p>${product.categoryName}</p>
                    <p>$${product.price.toFixed(2)}</p>
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </article>
            `;
            
            //Add the card to the page
            grid.insertAdjacentHTML("beforeend", card);
        });
    })
    //The catch block
    .catch(error => {
        grid.innerHTML = "<p>The store is unavailable right now — please try again later.</p>";
    });