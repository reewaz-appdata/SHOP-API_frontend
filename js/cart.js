const cartContainer = document.getElementById("cart-container");

// The cart belongs to a logged-in user — no token, no page.
if (!isLoggedIn()) {
    window.location.href = "login.html";
}

// Render the cart response from the API (read-only for now:
// the backend's PUT/DELETE cart endpoints are still coming soon).
function renderCart(cart) {
    cartContainer.innerHTML = "";

    if (cart.items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "cart-empty";

        const message = document.createElement("p");
        message.textContent = "Your cart is empty — go find a game";

        const link = document.createElement("a");
        link.href = "index.html";
        link.textContent = "Back to the store";

        empty.append(message, link);
        cartContainer.appendChild(empty);
        return;
    }

    const list = document.createElement("div");
    list.className = "cart-items";

    cart.items.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-row";

        const name = document.createElement("span");
        name.className = "cart-item-name";
        name.textContent = item.productName;

        const unitPrice = document.createElement("span");
        unitPrice.textContent = `$${item.unitPrice.toFixed(2)}`;

        const quantity = document.createElement("span");
        quantity.textContent = `× ${item.quantity}`;

        const subtotal = document.createElement("span");
        subtotal.className = "cart-item-subtotal";
        subtotal.textContent = `$${item.subtotal.toFixed(2)}`;

        row.append(name, unitPrice, quantity, subtotal);
        list.appendChild(row);
    });

    const totalRow = document.createElement("div");
    totalRow.className = "cart-total";

    const totalLabel = document.createElement("span");
    totalLabel.textContent = "Total";

    const totalValue = document.createElement("span");
    totalValue.textContent = `$${cart.total.toFixed(2)}`;

    totalRow.append(totalLabel, totalValue);
    cartContainer.append(list, totalRow);
}

async function loadCart() {
    try {
        const cart = await getMyCart();
        renderCart(cart);
    } catch (error) {
        console.error(error);
        cartContainer.innerHTML = "<p class=\"loading-message\">Couldn't load your cart — please try again later.</p>";
    }
}

setupAuthLink();
loadCart();
