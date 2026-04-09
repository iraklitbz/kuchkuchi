<template>
  <NuxtLink
    :to="`/product/${product.slug}`"
    class="group flex flex-col rounded-2xl border border-zinc-100 bg-white transition-shadow hover:shadow-card-hover"
  >
    <!-- Image -->
    <div class="relative aspect-square overflow-hidden rounded-t-2xl bg-zinc-100">
      <NuxtImg
        v-if="product.mainImage?.url"
        :src="product.mainImage.url"
        :alt="product.mainImage.alternativeText ?? product.title"
        class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        width="400"
        height="400"
        loading="lazy"
      />
      <div v-else class="flex size-full items-center justify-center text-zinc-300">
        <svg viewBox="0 0 24 24" class="size-12" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>

      <!-- Discount badge -->
      <div
        v-if="discount"
        class="absolute left-2 top-2 rounded-lg bg-brand px-2 py-0.5 text-xs font-bold text-white"
      >
        -{{ discount }}%
      </div>

      <!-- Out of stock overlay -->
      <div
        v-if="product.stock <= 0"
        class="absolute inset-0 flex items-center justify-center bg-white/70"
      >
        <span class="rounded-lg bg-zinc-800 px-3 py-1 text-xs font-semibold text-white">Out of stock</span>
      </div>
    </div>

    <!-- Info -->
    <div class="flex flex-1 flex-col p-3 sm:p-4">
      <!-- Category -->
      <p v-if="product.categories?.[0]" class="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
        {{ product.categories[0].name }}
      </p>

      <!-- Title -->
      <h3 class="line-clamp-2 text-sm font-semibold text-zinc-800 group-hover:text-brand">
        {{ product.title }}
      </h3>

      <!-- Brand -->
      <p v-if="product.brand" class="mt-1 text-xs text-zinc-400">{{ product.brand.name }}</p>

      <!-- Price -->
      <div class="mt-auto flex items-center gap-2 pt-3">
        <span class="text-base font-bold text-zinc-900">
          {{ formatPrice(product.discountPrice ?? product.price) }}
        </span>
        <span v-if="product.discountPrice" class="text-xs text-zinc-400 line-through">
          {{ formatPrice(product.price) }}
        </span>
      </div>

      <!-- Add to cart -->
      <button
        class="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="product.stock <= 0"
        @click.prevent="handleAddToCart"
      >
        <Icon :icon="CartIcon" class="text-sm" />
        Add to Cart
      </button>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import CartIcon from '~/assets/icons/cart.svg'
import type { Product } from '~/types'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()

const discount = computed(() => {
  if (!props.product.discountPrice || props.product.discountPrice >= props.product.price) return null
  return Math.round((1 - props.product.discountPrice / props.product.price) * 100)
})

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ka-GE', {
    style: 'currency',
    currency: 'GEL',
    minimumFractionDigits: 2,
  }).format(amount)
}

function handleAddToCart() {
  cartStore.addItem(props.product, 1)
}
</script>
