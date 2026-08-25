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
        const inStock = product.stockQuantity > 0;

        const card = document.createElement("article");
        card.className = "product-card";
        card.dataset.productId = product.id;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const category = document.createElement("p");
        category.textContent = product.categoryName;

        const price = document.createElement("p");
        price.textContent = `$${product.price.toFixed(2)}`;

        const badge = document.createElement("span");
        badge.className = `badge ${inStock ? "in-stock" : "out-of-stock"}`;
        badge.textContent = inStock ? "In stock" : "Out of stock";

        const cartError = document.createElement("p");
        cartError.className = "cart-error";
        cartError.hidden = true;

        const addButton = document.createElement("button");
        addButton.className = "btn add-to-cart";
        addButton.textContent = inStock ? "Add to Cart" : "Out of stock";
        addButton.disabled = !inStock;
        addButton.addEventListener("click", () => handleAddToCart(product.id, addButton, cartError));

        card.append(name, category, price, badge, addButton, cartError);
        grid.appendChild(card);
    });
}

// Add-to-cart click: needs a token, then one POST per click
// (the backend merges repeat clicks into a higher quantity).
async function handleAddToCart(productId, button, errorEl) {
    errorEl.hidden = true;

    if (!isLoggedIn()) {
        window.location.href = "login.html";
        return;
    }

    button.disabled = true;
    try {
        await addToCart(productId, 1);
        button.textContent = "Added ✓";
        setTimeout(() => {
            button.textContent = "Add to Cart";
            button.disabled = false;
        }, 1500);
    } catch (error) {
        // 400 (insufficient stock) and friends: show the server's message
        errorEl.textContent = error.message;
        errorEl.hidden = false;
        button.disabled = false;
    }
}

// Fetch products with optional search parameter
function fetchProducts(searchTerm = "") {
    const url = searchTerm
        ? `${API_BASE_URL}/api/v1/products?search=${encodeURIComponent(searchTerm)}`
        : `${API_BASE_URL}/api/v1/products`;

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
setupAuthLink();
fetchProducts();
