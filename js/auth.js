// Shared helpers: API base URL, auth state, and authenticated cart calls.
// Loaded before the page-specific script on every page.

const API_BASE_URL = "http://localhost:8080";

function isLoggedIn() {
    return localStorage.getItem("jwt_token") !== null;
}

function logout() {
    localStorage.removeItem("jwt_token");
    window.location.reload();
}

function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
    };
}

// Header Login/Logout link: becomes "Logout" when a token exists.
function setupAuthLink() {
    const authLink = document.getElementById("auth-link");
    if (!authLink) return;

    if (isLoggedIn()) {
        authLink.textContent = "Logout";
        authLink.href = "#";
        authLink.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        authLink.textContent = "Login";
        authLink.href = "login.html";
    }
}

async function addToCart(productId, quantity) {
    const response = await fetch(`${API_BASE_URL}/api/v1/cart/items`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add to cart");
    }

    return await response.json();
}

async function getMyCart() {
    const response = await fetch(`${API_BASE_URL}/api/v1/cart`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch cart");
    }

    return await response.json();
}
