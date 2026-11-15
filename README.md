# The Ledger — E-Commerce Frontend

A React + TypeScript + Vite scaffold wired to the E-Commerce API described in
`ecommerce-swagger.json`: signup/login, a browsable product catalog with
search, a persistent cart, and an admin panel for categories, tags,
products, and saved filters.

## Stack

- **React 19 + TypeScript + Vite**
- **React Router v6** — routing, with `ProtectedRoute` (any logged-in user)
  and `AdminRoute` (role === "admin") guards
- **TanStack Query** — server state for products, cart, and admin lists
- **Zustand** (+ `persist`) — auth state (token, role, user), persisted to
  localStorage so refreshes don't log the user out
- **React Hook Form + Zod** — login/signup validation
- **Axios** — API client with a request interceptor that attaches
  `Authorization: Bearer <token>` and a response interceptor that logs the
  user out on 401
- **Tailwind CSS v4** — styling, with a small custom token system in
  `src/index.css` (the "ledger" visual direction: ticket-stub cards,
  monospace prices, a muted-gold accent)

## Getting started

```bash
npm install
cp .env.example .env      # point VITE_API_BASE_URL at your backend
npm run dev
```

## Project structure

```
src/
├── api/            axios client + one module per resource group
│   ├── client.ts    axios instance, auth interceptor, error helper
│   ├── auth.ts       /signup /login /users/logout
│   ├── products.ts   /user/products*
│   ├── cart.ts        /cart*
│   └── admin.ts       /admin/{category,tag,product,filter}/*
├── types/api.ts     TypeScript interfaces mirrored from the swagger
│                     `definitions` block — keep in sync with the backend
├── store/authStore.ts  Zustand store: token, role, login()/logout()
├── routes/          ProtectedRoute, AdminRoute
├── components/      StorefrontLayout (header/nav/search/cart badge), ui.tsx
│                     (Button, Field, Input, Alert, Spinner, PageHeader)
└── features/
    ├── auth/         LoginPage, SignupPage
    ├── storefront/   ProductListPage, ProductDetailPage, SearchPage
    ├── cart/          useCart hooks, CartPage
    └── admin/         AdminLayout, AdminDashboard,
                        CategoriesPage, TagsPage, ProductsPage, FiltersPage
```

## Known gaps to close against the real backend

The swagger doc leaves a few response shapes loose
(`additionalProperties: true`), so these spots use a raw JSON dump as a
placeholder and are flagged with inline comments — tighten them once you've
inspected real responses:

- **`/login` response** — assumed to contain a `token` field; the auth
  store falls back to the first string value returned. Confirm the actual
  key name.
- **User role** — the swagger has no explicit role field. `authStore`
  currently decodes the JWT and looks for `role` / `isAdmin` / `admin`
  claims. Adjust `deriveRole()` in `src/store/authStore.ts` to match your
  token's real claims (or read role from the login response body instead).
- **Search endpoints** (`/user/product/search/{searchInput}`,
  `/admin/*/read/{name}`) — rendered as raw JSON in `SearchPage`,
  `CategoriesPage`, `TagsPage`, `ProductsPage`. Replace with proper
  list rows once you know the real shape.
- **Money formatting** — `price`/`unitPrice`/`totalPrice` are integers with
  no currency/minor-unit hint in the swagger. `src/lib/money.ts` currently
  treats them as whole USD dollars; adjust if your backend stores cents.
