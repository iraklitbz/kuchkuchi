<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4 lg:px-6">

      <!-- Breadcrumb -->
      <nav class="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <NuxtLink to="/" class="hover:text-brand">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/shop" class="hover:text-brand">Shop</NuxtLink>
        <span>/</span>
        <span class="text-zinc-700">{{ category?.name ?? slug }}</span>
      </nav>

      <!-- Header -->
      <div class="mb-8">
        <div v-if="category?.image?.url" class="mb-6 h-32 overflow-hidden rounded-2xl bg-zinc-100 lg:h-48">
          <NuxtImg
            :src="category.image.url"
            :alt="category.name"
            class="size-full object-cover"
            width="1200"
            height="300"
          />
        </div>
        <h1 class="font-display text-3xl font-bold text-zinc-900">{{ category?.name ?? slug }}</h1>
        <p v-if="category?.description" class="mt-2 text-sm text-zinc-500">{{ category.description }}</p>
        <p v-if="meta?.pagination?.total" class="mt-1 text-sm text-zinc-400">
          {{ meta.pagination.total }} products
        </p>
      </div>

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
})

const { data, pending } = await useAsyncData(
  () => `category-products-${slug.value}-${page.value}`,
  () => getProductsByCategory(slug.value, { page: page.value }),
  { watch: [slug, page] },
)

const products = computed(() => (data.value?.data ?? []) as Product[])
const meta = computed(() => data.value?.meta as { pagination?: StrapiMeta['pagination'] } | undefined)
</script>
