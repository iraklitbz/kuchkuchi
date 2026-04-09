# Kuchkucha Shop — Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4 + Vue 3 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | nuxt-svgo (Vue components from SVG) |
| Images | @nuxt/image |
| State | Pinia |
| Backend | Strapi v5 |
| Auth | Strapi Users-Permissions + JWT |
| Deploy (target) | Vercel or Cloudflare Pages |

---

## Project Structure

```
kuchkucha/
├── app/
│   ├── assets/
│   │   ├── css/main.css          # Tailwind 4 + brand theme
│   │   └── icons/                # SVG icon files (nuxt-svgo)
│   ├── components/
│   │   ├── AppHeader.vue         # Sticky header: logo, nav, cart, user
│   │   ├── AppFooter.vue         # Footer: links, social, copyright
│   │   ├── Icon.vue              # SVGO wrapper component
│   │   └── CartDrawer.vue        # [Phase 4] Slide-in cart panel
│   ├── composables/
│   │   └── useStrapi.ts          # Product/category data fetchers
│   ├── layouts/
│   │   └── default.vue           # Header + main + footer
│   ├── middleware/
│   │   └── auth.ts               # Redirects to /login if no token
│   ├── pages/
│   │   ├── index.vue             # Homepage (featured products)
│   │   ├── shop.vue              # [Phase 3] All products + filters
│   │   ├── categories.vue        # [Phase 3] Category grid
│   │   ├── category/[slug].vue   # [Phase 3] Products by category
│   │   ├── product/[slug].vue    # [Phase 3] Product detail
│   │   ├── cart.vue              # [Phase 4] Cart page
│   │   ├── checkout.vue          # [Phase 5] Checkout form
│   │   ├── order-success.vue     # [Phase 5] Order confirmation
│   │   ├── login.vue             # ✅ Auth: sign in
│   │   ├── register.vue          # ✅ Auth: create account
│   │   ├── forgot-password.vue   # ✅ Auth: request reset
│   │   ├── reset-password.vue    # ✅ Auth: set new password
│   │   ├── confirm-email.vue     # ✅ Auth: email confirmation
│   │   ├── auth/
│   │   │   └── callback.vue      # ✅ OAuth (Google) callback
│   │   └── account/
│   │       ├── index.vue         # ✅ User profile
│   │       └── orders.vue        # [Phase 6] Order history
│   ├── plugins/
│   │   └── auth.client.ts        # Restores auth + cart session on init
│   ├── stores/
│   │   ├── auth.ts               # ✅ Pinia: user, token, login/logout
│   │   └── cart.ts               # ✅ Pinia: cart items, localStorage persist
│   ├── types/
│   │   └── index.ts              # TypeScript: User, Product, Category, Order...
│   └── app.vue                   # Root layout wrapper
├── server/
│   └── api/
│       └── strapi/
│           └── [...path].get.ts  # ✅ Strapi proxy (auth-aware caching)
├── nuxt.config.ts                # ✅ Full config
├── .env.example                  # ✅ Env vars template
└── ARCHITECTURE.md               # This file
```

---

## Development Phases

### ✅ Phase 1 — Base Setup (DONE)
- Nuxt 4 + Tailwind 4 + SVGO + @nuxt/image + Pinia
- nuxt.config.ts (no i18n, no GraphQL)
- Brand theme (amber `--color-brand: #d97706`)
- All SVG icons (16 icons total)
- Icon.vue, AppHeader.vue, AppFooter.vue, layouts/default.vue
- Strapi proxy: `/api/strapi/[...path]` (auth-aware cache)
- TypeScript types: User, Product, Category, Brand, Cart, Order
- useStrapi.ts composable (products, categories, brands)

### ✅ Phase 2 — Authentication (DONE)
- `stores/auth.ts` (Pinia): token (cookie 30d), user, login/register/logout
- Google OAuth via Strapi `/api/connect/google`
- `plugins/auth.client.ts`: restores auth + cart on every page load
- `middleware/auth.ts`: protects `/account/**` routes
- Pages: login, register, forgot-password, reset-password, confirm-email, auth/callback
- `account/index.vue`, `account/orders.vue` (placeholder)

### Phase 3 — Product Catalog (TODO)
- [ ] `pages/shop.vue` — all products with pagination + filters
- [ ] `pages/categories.vue` — category grid
- [ ] `pages/category/[slug].vue` — products by category
- [ ] `pages/product/[slug].vue` — product detail (gallery, specs, ingredients, add-to-cart)
- [ ] Fill `index.vue` hero with real featured products

### Phase 4 — Cart (TODO)
- [ ] `components/CartDrawer.vue` — slide-in panel (already has store wired)
- [ ] `pages/cart.vue` — full cart page (quantities, remove, coupon)
- [ ] Apply coupon logic (call Strapi coupon endpoint)

### Phase 5 — Checkout & Orders (TODO)
- [ ] `pages/checkout.vue` — full form (guest or logged-in)
- [ ] Guest checkout (email only, no account required)
- [ ] Order creation in Strapi (need `Order` content type in CMS)
- [ ] `pages/order-success.vue` — confirmation page
- [ ] Add `Order` content type to kuchkuchaCMS

### Phase 6 — User Account (TODO)
- [ ] `pages/account/orders.vue` — real order history from Strapi
- [ ] Order detail view
- [ ] Profile editing (name, phone, default address)

---

## Key Integration Points

### Strapi Proxy
All CMS requests go through `/api/strapi/[path]` (server-side proxy):
- **Anonymous**: cached at CDN edge (300s), uses server `STRAPI_TOKEN`
- **Authenticated**: `private, no-store`, forwards user JWT

### Auth Flow
1. User logs in → Strapi returns JWT
2. JWT stored in `auth_token` cookie (30 days, SameSite=Lax)
3. On every page load, `auth.client.ts` plugin restores session via `fetchUser()`
4. For protected routes, `middleware/auth.ts` checks `token.value`

### Cart Persistence
Cart stored in `localStorage` key `kuchkucha_cart`.
Restored on page load by `auth.client.ts` plugin (`cartStore.restore()`).

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirect to `{STRAPI_URL}/api/connect/google` (configured in Strapi admin)
3. Google redirects back to `{STRAPI_URL}/api/auth/google/callback`
4. Strapi redirects to `{SITE_URL}/auth/callback?access_token=...`
5. `/auth/callback.vue` exchanges token → stores JWT → redirects to `/account`

---

## Environment Variables

```env
STRAPI_URL=http://localhost:1337          # Strapi base URL
STRAPI_TOKEN=...                          # Strapi API token (full access)
NUXT_PUBLIC_SITE_URL=https://kuchkuchi.ge # Frontend URL (for OAuth callback)
REVALIDATE_SECRET=...                     # Cache invalidation webhook secret
```

### Strapi Production
- URL: `https://shop.kuchkuchi.ge/`
- Local: `/Users/iraklitbz/Desktop/apps/webs/kuchkuchaCMS`

### Google OAuth Setup (Strapi Admin)
Go to: Strapi Admin → Settings → Users & Permissions → Providers → Google
- Enable Google
- Client ID / Secret from Google Cloud Console
- Redirect URL: `https://shop.kuchkuchi.ge/api/auth/google/callback`
- Frontend callback: `https://kuchkuchi.ge/auth/callback` (set in `redirectUrl`)

---

## Brand Theme

Tailwind custom properties (in `assets/css/main.css`):
```css
--color-brand: #d97706;       /* amber-600 — use bg-brand, text-brand */
--color-brand-dark: #b45309;  /* amber-700 */
--color-brand-light: #fef3c7; /* amber-50 */
```

To change brand color: update these 3 variables in `main.css`.

---

## Strapi Content Types (kuchkuchaCMS)

| Type | Key Fields |
|------|-----------|
| Product | title, slug, price, discountPrice, stock, isActive, featured, mainImage, gallery, categories, brand, specifications, ingredients |
| Category | name, slug, image, parent, children, isActive |
| Brand | name, slug, logo, isActive |
| Coupon | code, discountType, value, isActive, startsAt, endsAt, minimumSubtotal |
| Order | *(to be created in Phase 5)* |
