const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

// Already logged in? No reason to be on this page.
if (isLoggedIn()) {
    window.location.href = "index.html";
}

loginForm.addEventListener("submit", async (e) => {
    // Prevent the form's default submit — otherwise the page reloads
    // and the fetch below never gets a chance to run.
    e.preventDefault();

    loginError.hidden = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: loginForm.email.value,
                password: loginForm.password.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("jwt_token", data.token);
            window.location.href = "index.html";
        } else if (response.status === 401) {
            // The backend's message is deliberately generic — show it as-is.
            loginError.textContent = data.message || "Invalid email or password";
            loginError.hidden = false;
        } else {
            loginError.textContent = data.message || "Login failed — please try again.";
            loginError.hidden = false;
        }
    } catch (error) {
        console.error(error);
        loginError.textContent = "The store is unavailable right now — please try again later.";
        loginError.hidden = false;
    }
});
