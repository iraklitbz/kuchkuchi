# Search Strategy

## Goal

Add product search from the header search icon without breaking SSR/hydration or overcomplicating the current Nuxt + Strapi setup.

## Recommended approach

Use a search input in the header that opens an overlay or popover, then sends the user to a dedicated `/shop?q=...` result view.

Why this approach:

- Keeps the header light and predictable.
- Reuses the existing product grid and product card components.
- Preserves SSR, because the search state lives in the URL.
- Avoids introducing GraphQL just for one feature.

## Why not GraphQL first

The app already talks to Strapi through REST endpoints proxied by Nuxt.

GraphQL would add:

- extra schema/configuration in Strapi,
- a second data access pattern in the app,
- more work for no real gain at this stage.

REST filters are enough for:

- title search,
- slug/category/brand filtering,
- featured-only filters,
- pagination.

## Phase 1

Implement a search experience with:

- Header button opens a modal or popover.
- Input uses debounced navigation to `/shop?q=term`.
- Shop page reads `route.query.q`.
- Strapi query adds `filters[$or]` across searchable fields.
- Show empty state and preserve pagination.

Suggested searchable fields:

- `title`
- `sku`
- `brand.name`
- `categories.name`

## Phase 2

If search becomes important or the catalog grows:

- Add a dedicated Nuxt server endpoint like `/api/search`.
- Centralize ranking, trimming, and query sanitization there.
- Return a compact response for header suggestions.

## Phase 3

If the catalog becomes large enough that Strapi filtering feels slow:

- Move to a proper search index such as Meilisearch or Algolia.
- Keep Nuxt as the UI layer and Strapi as the source of truth.

## UX recommendation

Use two search modes:

- Header quick search: opens input and redirects to results.
- Shop page search: full results page with filters and pagination.

## Notes

- Keep the search term in the URL.
- Do not rely on local component state alone.
- Keep SSR output stable.
- Avoid direct DOM queries in the header search flow.

