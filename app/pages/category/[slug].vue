<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4 lg:px-6">

      <!-- Breadcrumb -->
      <nav class="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <NuxtLink to="/" class="hover:text-brand">მთავარი</NuxtLink>
        <span>/</span>
        <NuxtLink to="/shop" class="hover:text-brand">მაღაზია</NuxtLink>
        <template v-if="category?.parent">
          <span>/</span>
          <NuxtLink :to="`/category/${category.parent.slug}`" class="hover:text-brand">
            {{ category.parent.name }}
          </NuxtLink>
        </template>
        <span>/</span>
        <span class="text-zinc-700">{{ category?.name ?? slug }}</span>
      </nav>

      <!-- Category hero -->
      <div class="mb-8">
        <div v-if="category?.image?.url" class="mb-6 overflow-hidden rounded-2xl bg-zinc-100">
          <div class="relative h-36 lg:h-56">
            <NuxtImg
              :src="category.image.url"
              :alt="category.name"
              class="size-full object-cover"
              width="1200"
              height="300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div class="absolute bottom-0 left-0 p-6">
              <h1 class="font-display text-3xl font-bold text-white drop-shadow-lg">
                {{ category.name }}
              </h1>
              <p v-if="category.description" class="mt-1 text-sm text-white/80">
                {{ category.description }}
              </p>
            </div>
          </div>
        </div>
        <template v-else>
          <h1 class="font-display text-3xl font-bold text-zinc-900">{{ category?.name ?? slug }}</h1>
          <p v-if="category?.description" class="mt-2 text-sm text-zinc-500">{{ category.description }}</p>
        </template>
        <p v-if="meta?.pagination?.total" class="mt-1 text-sm text-zinc-400">
          {{ meta.pagination.total }} products
        </p>
      </div>

      <!-- Subcategories grid (if this is a parent with children) -->
      <template v-if="category?.children?.length">
        <section class="mb-8">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            ქვეკატეგორიები
          </h2>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="child in category.children"
              :key="child.id"
              :to="`/category/${child.slug}`"
              class="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-brand hover:text-brand"
            >
              {{ child.name }}
            </NuxtLink>
          </div>
        </section>
      </template>

      <!-- Products -->
      <ProductGrid
        :products="products"
        :loading="pending"
        :skeleton-count="12"
        :empty-message="`No products found in ${category?.name ?? slug}.`"
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
</template>

<script setup lang="ts">
import type { Product, Category, StrapiMeta } from '~/types'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { getProductsByCategory, getCategoryBySlug } = useStrapi()

const page = ref(1)
watch(slug, () => { page.value = 1 })

const { data: catData } = await useAsyncData(
  () => `category-${slug.value}`,
  () => getCategoryBySlug(slug.value),
  { watch: [slug] },
)
const category = computed(() => (catData.value?.data as Category[] | undefined)?.[0])

useSeoMeta({
  title: computed(() => `${category.value?.name ?? slug.value} — Kuchkucha`),
  description: computed(() => category.value?.description ?? `Browse ${category.value?.name ?? slug.value} products.`),
})

const { data, pending } = await useAsyncData(
  () => `category-products-${slug.value}-${page.value}`,
  () => getProductsByCategory(slug.value, { page: page.value }),
  { watch: [slug, page] },
)

const products = computed(() => (data.value?.data ?? []) as Product[])
const meta = computed(() => data.value?.meta as { pagination?: StrapiMeta['pagination'] } | undefined)
</script>
