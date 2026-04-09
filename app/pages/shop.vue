<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4 lg:px-6">

      <!-- Header -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="font-display text-3xl font-bold text-zinc-900">
            {{ searchQuery ? `Search results for “${searchQuery}”` : (activeCategory ? activeCategory.name : 'All Products') }}
          </h1>
          <p v-if="meta?.pagination?.total" class="mt-1 text-sm text-zinc-500">
            {{ meta.pagination.total }} products
          </p>
          <p v-else-if="searchQuery" class="mt-1 text-sm text-zinc-500">
            Searching in titles, SKUs, brands and categories.
          </p>
        </div>

        <!-- Sort -->
        <select
          v-model="sortBy"
          class="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
        >
          <option value="sortOrder:asc">Featured</option>
          <option value="createdAt:desc">Newest</option>
          <option value="price:asc">Price: Low to High</option>
          <option value="price:desc">Price: High to Low</option>
        </select>
      </div>

      <div class="flex gap-6">
        <!-- Sidebar filters -->
        <aside class="hidden w-52 shrink-0 lg:block">
          <div class="sticky top-20">
            <!-- Categories -->
            <div class="mb-6">
              <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Categories</h3>
              <ul class="space-y-1">
                <li>
                  <NuxtLink
                    to="/shop"
                    class="block rounded-lg px-3 py-1.5 text-sm transition-colors"
                    :class="!route.query.category ? 'bg-brand/10 font-medium text-brand' : 'text-zinc-600 hover:bg-zinc-50'"
                  >
                    All Products
                  </NuxtLink>
                </li>
                <li v-for="cat in categories" :key="cat.id">
                  <NuxtLink
                    :to="`/shop?category=${cat.slug}`"
                    class="block rounded-lg px-3 py-1.5 text-sm transition-colors"
                    :class="route.query.category === cat.slug ? 'bg-brand/10 font-medium text-brand' : 'text-zinc-600 hover:bg-zinc-50'"
                  >
                    {{ cat.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Featured only -->
            <div>
              <label class="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700">
                <input
                  v-model="featuredOnly"
                  type="checkbox"
                  class="size-4 rounded border-zinc-300 text-brand accent-brand"
                />
                Featured only
              </label>
            </div>
          </div>
        </aside>

        <!-- Products -->
        <div class="flex-1">
          <ProductGrid
            :products="products"
            :loading="pending"
            :skeleton-count="12"
            empty-message="No products found. Try a different category or filter."
          />

          <!-- Pagination -->
          <div v-if="meta?.pagination && meta.pagination.pageCount > 1" class="mt-10 flex items-center justify-center gap-2">
            <button
              v-for="p in meta.pagination.pageCount"
              :key="p"
              class="flex size-9 items-center justify-center rounded-xl text-sm font-medium transition-colors"
              :class="p === page ? 'bg-brand text-white' : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50'"
              @click="page = p"
            >
              {{ p }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, Category, StrapiMeta } from '~/types'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Shop — Kuchkucha',
  description: 'Browse our full collection of authentic Georgian products.',
})

const route = useRoute()
const { getProducts, getProductsByCategory, getCategories } = useStrapi()

const page = ref(1)
const sortBy = ref('sortOrder:asc')
const featuredOnly = ref(false)
const searchQuery = computed(() => {
  const q = route.query.q
  return typeof q === 'string' ? q.trim() : ''
})

// Reset page when filters change
watch([() => route.query.category, sortBy, featuredOnly, searchQuery], () => { page.value = 1 })

// Load categories for sidebar
const { data: categoriesData } = await useAsyncData('shop-categories', () => getCategories())
const categories = computed(() => (categoriesData.value?.data ?? []) as Category[])
const activeCategory = computed(() =>
  categories.value.find(c => c.slug === route.query.category),
)

// Load products
const { data, pending, refresh } = await useAsyncData(
  () => `shop-products-${route.query.category ?? 'all'}-${page.value}-${sortBy.value}-${featuredOnly.value}`,
  async () => {
    const categorySlug = route.query.category as string | undefined
    if (categorySlug) {
      return getProductsByCategory(categorySlug, { page: page.value, query: searchQuery.value })
    }
    return getProducts({ page: page.value, pageSize: 24, query: searchQuery.value })
  },
  { watch: [page, sortBy, featuredOnly, () => route.query.category] },
)

const products = computed(() => {
  let list = (data.value?.data ?? []) as Product[]
  if (featuredOnly.value) list = list.filter(p => p.featured)
  return list
})

const meta = computed(() => data.value?.meta as { pagination?: StrapiMeta['pagination'] } | undefined)
</script>
