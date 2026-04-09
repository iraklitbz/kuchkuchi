<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4 lg:px-6">

      <!-- Page header -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="font-display text-3xl font-bold text-zinc-900">
            {{ searchQuery
              ? `ძიების შედეგი: "${searchQuery}"`
              : (activeCategory ? activeCategory.name : 'ყველა პროდუქტი') }}
          </h1>
          <p v-if="meta?.pagination?.total" class="mt-1 text-sm text-zinc-500">
            {{ meta.pagination.total }} პროდუქტი
          </p>
          <p v-else-if="searchQuery" class="mt-1 text-sm text-zinc-500">
            ძიება სათაურებში, SKU-ში, ბრენდებსა და კატეგორიებში.
          </p>
          <!-- Breadcrumb for subcategory -->
          <nav v-if="activeCategoryParent" class="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-400">
            <NuxtLink to="/shop" class="hover:text-brand">ყველა</NuxtLink>
            <span>/</span>
            <NuxtLink :to="`/category/${activeCategoryParent.slug}`" class="hover:text-brand">
              {{ activeCategoryParent.name }}
            </NuxtLink>
            <span>/</span>
            <span class="text-zinc-600">{{ activeCategory?.name }}</span>
          </nav>
        </div>

        <!-- Sort -->
        <select
          v-model="sortBy"
          class="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
        >
          <option value="sortOrder:asc">გამორჩეული</option>
          <option value="createdAt:desc">ახალი</option>
          <option value="price:asc">ფასი: იაფიდან ძვირამდე</option>
          <option value="price:desc">ფასი: ძვირიდან იაფამდე</option>
        </select>
      </div>

      <!-- Category showcase -->
      <template v-if="!route.query.category && !searchQuery && categories.length">
        <section class="mb-10">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            კატეგორიების მიხედვით
          </h2>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <NuxtLink
              v-for="(cat, i) in categories"
              :key="cat.id"
              :to="`/category/${cat.slug}`"
              class="group relative overflow-hidden rounded-2xl"
              style="aspect-ratio: 4/3"
            >
              <img
                v-if="cat.image?.url"
                :src="cat.image.url"
                :alt="cat.name"
                class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                v-else
                class="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                :class="categoryGradients[i % categoryGradients.length]"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
              <div class="absolute bottom-0 left-0 right-0 p-3">
                <p class="font-display text-sm font-semibold leading-tight text-white drop-shadow">
                  {{ cat.name }}
                </p>
                <p v-if="cat.children?.length" class="mt-0.5 text-[11px] text-white/65">
                  {{ cat.children.length }} ქვეკატეგორია
                </p>
              </div>
            </NuxtLink>
          </div>
        </section>
        <div class="mb-8 border-t border-zinc-100" />
      </template>

      <div class="flex gap-6">
        <!-- Sidebar -->
        <aside class="hidden w-52 shrink-0 lg:block">
          <div class="sticky top-20">
            <div class="mb-6">
              <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">კატეგორიები</h3>
              <ul class="space-y-0.5">
                <li>
                  <NuxtLink
                    to="/shop"
                    class="block rounded-lg px-3 py-1.5 text-sm transition-colors"
                    :class="!route.query.category ? 'bg-brand/10 font-medium text-brand' : 'text-zinc-600 hover:bg-zinc-50 hover:text-brand'"
                  >
                    ყველა პროდუქტი
                  </NuxtLink>
                </li>
                <template v-for="cat in categories" :key="cat.id">
                  <li>
                    <NuxtLink
                      :to="`/shop?category=${cat.slug}`"
                      class="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                      :class="route.query.category === cat.slug
                        ? 'bg-brand/10 text-brand'
                        : 'text-zinc-700 hover:bg-zinc-50 hover:text-brand'"
                    >
                      {{ cat.name }}
                      <span v-if="cat.children?.length" class="text-[10px] text-zinc-400">
                        {{ cat.children.length }}
                      </span>
                    </NuxtLink>
                  </li>
                  <li v-for="child in cat.children" :key="child.id">
                    <NuxtLink
                      :to="`/shop?category=${child.slug}`"
                      class="ml-3 block rounded-r-lg border-l py-1 pl-3 pr-2 text-xs transition-colors"
                      :class="route.query.category === child.slug
                        ? 'border-brand font-medium text-brand'
                        : 'border-zinc-200 text-zinc-500 hover:border-brand/50 hover:text-brand'"
                    >
                      {{ child.name }}
                    </NuxtLink>
                  </li>
                </template>
              </ul>
            </div>

            <div>
              <label class="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700">
                <input
                  v-model="featuredOnly"
                  type="checkbox"
                  class="size-4 rounded border-zinc-300 text-brand accent-brand"
                />
                მხოლოდ გამორჩეული
              </label>
            </div>
          </div>
        </aside>

        <!-- Products -->
        <div class="min-w-0 flex-1">
          <!-- Mobile pills -->
          <div class="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <NuxtLink
              to="/shop"
              class="shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
              :class="!route.query.category ? 'border-brand bg-brand/10 text-brand' : 'border-zinc-200 text-zinc-600 hover:border-brand/50'"
            >
              ყველა
            </NuxtLink>
            <template v-for="cat in categories" :key="cat.id">
              <NuxtLink
                :to="`/shop?category=${cat.slug}`"
                class="shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                :class="route.query.category === cat.slug ? 'border-brand bg-brand/10 text-brand' : 'border-zinc-200 text-zinc-600 hover:border-brand/50'"
              >
                {{ cat.name }}
              </NuxtLink>
              <NuxtLink
                v-for="child in cat.children"
                :key="child.id"
                :to="`/shop?category=${child.slug}`"
                class="shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                :class="route.query.category === child.slug ? 'border-brand bg-brand/10 text-brand' : 'border-zinc-200 text-zinc-500 hover:border-brand/50'"
              >
                {{ child.name }}
              </NuxtLink>
            </template>
          </div>

          <ProductGrid
            :products="products"
            :loading="pending"
            :skeleton-count="12"
            empty-message="პროდუქტი ვერ მოიძებნა. სცადეთ სხვა კატეგორია ან ფილტრი."
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
  title: 'მაღაზია — Kuchkucha',
  description: 'დაათვალიერეთ ჩვენი სრული კოლექცია — ავთენტური ქართული პროდუქტები.',
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

const categoryGradients = [
  'bg-gradient-to-br from-amber-400 to-orange-500',
  'bg-gradient-to-br from-emerald-400 to-teal-600',
  'bg-gradient-to-br from-sky-400 to-blue-600',
  'bg-gradient-to-br from-violet-400 to-purple-600',
  'bg-gradient-to-br from-rose-400 to-pink-600',
  'bg-gradient-to-br from-yellow-400 to-amber-600',
  'bg-gradient-to-br from-cyan-400 to-sky-600',
  'bg-gradient-to-br from-lime-400 to-green-600',
]

watch([() => route.query.category, sortBy, featuredOnly, searchQuery], () => { page.value = 1 })

const { data: categoriesData } = await useAsyncData('shop-categories', () => getCategories())
const categories = computed(() => (categoriesData.value?.data ?? []) as Category[])

const activeCategory = computed(() => {
  const slug = route.query.category as string | undefined
  if (!slug) return null
  for (const cat of categories.value) {
    if (cat.slug === slug) return cat
    for (const child of cat.children ?? []) {
      if (child.slug === slug) return child
    }
  }
  return null
})

const activeCategoryParent = computed(() => {
  const slug = route.query.category as string | undefined
  if (!slug) return null
  for (const cat of categories.value) {
    if ((cat.children ?? []).some(c => c.slug === slug)) return cat
  }
  return null
})

const { data, pending } = await useAsyncData(
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
