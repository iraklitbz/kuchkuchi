<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
      <div
        v-for="i in skeletonCount"
        :key="i"
        class="animate-pulse rounded-2xl border border-zinc-100 bg-white"
      >
        <div class="aspect-square rounded-t-2xl bg-zinc-100" />
        <div class="p-4">
          <div class="h-2.5 w-1/3 rounded bg-zinc-100" />
          <div class="mt-2 h-3.5 rounded bg-zinc-200" />
          <div class="mt-1.5 h-3.5 w-2/3 rounded bg-zinc-200" />
          <div class="mt-4 h-4 w-1/4 rounded bg-zinc-300" />
          <div class="mt-3 h-8 rounded-xl bg-zinc-100" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!products.length" class="py-16 text-center">
      <p class="text-sm text-zinc-500">{{ emptyMessage }}</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

withDefaults(defineProps<{
  products: Product[]
  loading?: boolean
  skeletonCount?: number
  emptyMessage?: string
}>(), {
  loading: false,
  skeletonCount: 8,
  emptyMessage: 'No products found.',
})
</script>
