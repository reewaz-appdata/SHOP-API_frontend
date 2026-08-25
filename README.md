# Shop Frontend — The Board Game Store

A hand-built storefront UI for the Shop API, an e-commerce backend for an online board game store. Built deliberately with vanilla HTML, CSS, and JavaScript — no frameworks, no libraries, no build step.

<!-- Add a screenshot of the storefront here once styled:
![Storefront screenshot](screenshot.png)
-->

## Overview

This project is the client half of a full-stack e-commerce application. It consumes the Shop API's REST endpoints and renders the live product catalog as a responsive grid of product cards, with real inventory and pricing served from a PostgreSQL database.

The deliberate choice to use no framework is itself the point: the goal was to practice the fundamentals that tools like React abstract away — semantic markup, CSS Grid and Flexbox, responsive design, DOM manipulation, and asynchronous API consumption with the Fetch API.

## Features

- **Live product catalog** — rendered from the API, never hardcoded
- **Responsive product grid** — multi-column on desktop, single column on mobile (CSS Grid + media queries)
- **Product cards** — name, category, formatted price, and stock status badge
- **Stock awareness** — out-of-stock products are visually distinct and can't be added to the cart
- **Graceful failure** — a friendly message when the API is unreachable, never a dead page
- **Login page** — JWT stored in `localStorage`, header link flips between Login and Logout
- **Add to cart** — from product cards, one click = one unit (repeat clicks merge into quantity server-side)
- **Cart page** — per-item rows with subtotals and a server-computed total; read-only until the backend's cart PUT/DELETE endpoints land

### In Progress / Planned

- [x] Client-side search (wired to the API's `?search=` parameter)
- [ ] Category filtering
- [x] Login page (JWT stored in localStorage)
- [x] Shopping cart page
- [ ] Cart quantity edit / item removal (blocked on backend `PUT`/`DELETE /api/v1/cart/items/{productId}`)

## Tech

| Layer | Choice |
|-------|--------|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 — Grid, Flexbox, custom properties, transitions, media queries |
| Logic | Vanilla JavaScript — Fetch API, DOM manipulation, template literals |
| Dev server | VS Code Live Server |
| Backend | Shop API (Spring Boot + PostgreSQL, runs on :8080) |

## Project Structure

```
shop-frontend/
├── index.html        # Storefront page (skeleton; grid is rendered by JS)
├── login.html        # Login page — JWT stored in localStorage
├── cart.html         # Cart page — read-only until cart PUT/DELETE land
├── css/
│   └── style.css     # Palette variables, layout, cards, badges, responsive rules
└── js/
    ├── auth.js       # Shared helpers: auth state, header link, cart API calls
    ├── app.js        # Storefront: fetch + render logic, search, add-to-cart
    ├── login.js      # Login form handling
    └── cart.js       # Cart fetch + render
```

## Getting Started

### Prerequisites

1. The **Shop API** running locally (`http://localhost:8080`) — see the backend repo for setup (Spring Boot + Dockerized PostgreSQL)
2. **VS Code** with the **Live Server** extension (or any static file server)

### Run it

1. Start the backend first — the page renders live data
2. Open this folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. The storefront opens at `http://127.0.0.1:5500` (or `localhost:5500`)

> The backend is configured to allow CORS requests from both Live Server origins. If you serve this frontend from a different port, add that origin to the backend's CORS configuration.

## Design Decisions

- **No frameworks, on purpose.** Everything React would do — rendering lists, updating the DOM, managing fetch state — is done by hand, to understand what frameworks actually abstract.
- **The HTML is a frame; JS paints it.** The product grid is an empty container in the markup, filled at runtime from API data. Placeholder content ("Loading games...") is replaced, never hardcoded.
- **CSS custom properties for the palette.** One place defines every color; the whole theme can be retuned by editing a handful of variables.
- **Defensive rendering.** Missing fields degrade gracefully, API failure shows a message instead of a blank page.
- **The API contract is the backend's, not the client's.** Prices and stock always come from the server response; the frontend never invents data.

## API Used

| Endpoint | Used for |
|----------|----------|
| `GET /api/v1/products` | Product grid (paginated response — reads the `content` array) |
| `GET /api/v1/products?search=` | Search |
| `POST /api/v1/auth/login` | Login page |
| `POST /api/v1/cart/items` | Add to cart from product cards |
| `GET /api/v1/cart` | Cart page |
