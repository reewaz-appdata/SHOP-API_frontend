//Grab the grid container
const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search");

// Render products function (reusable)
function renderProducts(products) {
    //Clear the grid
    grid.innerHTML = "";
    
    //Handle the empty case
    if (products.length === 0) {
        grid.innerHTML = "<p>No games found</p>";
        return;
    }
    
    //Loop the products
    products.forEach(product => {
        const badgeText = product.stockQuantity > 0 ? "In stock" : "Out of stock";
        const badgeClass = product.stockQuantity > 0 ? "in-stock" : "out-of-stock";
        
        const card = `
            <article class="product-card">
                <h3>${product.name}</h3>
                <p>${product.categoryName}</p>
                <p>$${product.price.toFixed(2)}</p>
                <span class="badge ${badgeClass}">${badgeText}</span>
            </article>
        `;
        
        grid.insertAdjacentHTML("beforeend", card);
    });
}

// Fetch products with optional search parameter
function fetchProducts(searchTerm = "") {
    const url = searchTerm 
        ? `http://localhost:8080/api/v1/products?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:8080/api/v1/products";
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            renderProducts(data.content);
        })
        .catch(error => {
            console.error(error);
            grid.innerHTML = "<p>The store is unavailable right now — please try again later.</p>";
        });
}

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Search handler
const handleSearch = debounce((searchTerm) => {
    fetchProducts(searchTerm);
}, 300);

// Event listener for search
searchInput.addEventListener("input", (e) => {
    handleSearch(e.target.value);
});

// Initial load
fetchProducts();