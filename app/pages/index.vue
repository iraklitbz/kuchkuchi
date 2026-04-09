<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-white py-20 lg:py-28">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="mx-auto max-w-2xl text-center">
          <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">ავთენტური ქართული პროდუქტები</p>
          <h1 class="font-display text-4xl font-bold leading-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            საქართველოს გემო,
            <span class="text-brand">თქვენს კართან</span>
          </h1>
          <p class="mx-auto mt-5 max-w-lg text-base text-zinc-500 sm:text-lg">
            სუნელები, ხელნაკეთი საკვები და ტრადიციული ქართული პროდუქტები — ერთ ადგილას.
          </p>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
            <NuxtLink
              to="/shop"
              class="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              ახლავე ყიდვა
              <Icon :icon="ArrowRightIcon" />
            </NuxtLink>
            <NuxtLink
              to="/shop"
              class="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-7 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              ყველას ნახვა
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section v-if="categories.length" class="py-14">
      <div class="container mx-auto px-4 lg:px-6">
        <h2 class="font-display mb-6 text-2xl font-bold text-zinc-900">კატეგორიების მიხედვით</h2>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.id"
            :to="`/category/${cat.slug}`"
            class="group relative overflow-hidden rounded-2xl bg-zinc-100 transition-shadow hover:shadow-card"
          >
            <div class="aspect-[4/3]">
              <NuxtImg
                v-if="cat.image?.url"
                :src="cat.image.url"
                :alt="cat.name"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                width="400"
                height="300"
              />
              <div v-else class="size-full bg-gradient-to-br from-brand-light to-amber-100" />
            </div>
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p class="text-sm font-semibold text-white">{{ cat.name }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="bg-zinc-50 py-14">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="mb-8 flex items-center justify-between">
          <h2 class="font-display text-2xl font-bold text-zinc-900">გამორჩეული პროდუქტები</h2>
          <NuxtLink to="/shop" class="flex items-center gap-1 text-sm font-medium text-brand hover:underline">
            ყველა
            <Icon :icon="ArrowRightIcon" class="text-xs" />
          </NuxtLink>
        </div>
        <ProductGrid
          :products="featuredProducts"
          :loading="pendingFeatured"
          :skeleton-count="8"
          empty-message="გამორჩეული პროდუქტები ჯერ არ არის."
        />
      </div>
    </section>

    <!-- New Arrivals -->
    <section class="py-14">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="mb-8 flex items-center justify-between">
          <h2 class="font-display text-2xl font-bold text-zinc-900">სიახლეები</h2>
          <NuxtLink to="/shop?sort=new" class="flex items-center gap-1 text-sm font-medium text-brand hover:underline">
            ყველა
            <Icon :icon="ArrowRightIcon" class="text-xs" />
          </NuxtLink>
        </div>
        <ProductGrid
          :products="latestProducts"
          :loading="pendingLatest"
          :skeleton-count="8"
          empty-message="პროდუქტები ჯერ არ არის."
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ArrowRightIcon from '~/assets/icons/arrow-right.svg'
import type { Product, Category } from '~/types'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Kuchkucha — ავთენტური ქართული პროდუქტები',
  description: 'სუნელები, ხელნაკეთი საკვები და ტრადიციული ქართული პროდუქტები — ერთ ადგილას.',
})

const { getFeaturedProducts, getProducts, getCategories } = useStrapi()

const { data: catData } = await useAsyncData('home-categories', () => getCategories())
const categories = computed(() => (catData.value?.data ?? []) as Category[])

const { data: featuredData, pending: pendingFeatured } = await useAsyncData(
  'home-featured',
  () => getFeaturedProducts(),
)
const featuredProducts = computed(() => (featuredData.value?.data ?? []) as Product[])

const { data: latestData, pending: pendingLatest } = await useAsyncData(
  'home-latest',
  () => getProducts({ pageSize: 8 }),
)
const latestProducts = computed(() => (latestData.value?.data ?? []) as Product[])
</script>
