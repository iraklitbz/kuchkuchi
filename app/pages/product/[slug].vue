<template>
  <div v-if="product" class="min-h-screen py-8">
    <div class="container mx-auto px-4 lg:px-6">

      <!-- Breadcrumb -->
      <nav class="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
        <NuxtLink to="/" class="hover:text-brand">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/shop" class="hover:text-brand">Shop</NuxtLink>
        <span v-if="product.categories?.[0]">/</span>
        <NuxtLink
          v-if="product.categories?.[0]"
          :to="`/category/${product.categories[0].slug}`"
          class="hover:text-brand"
        >
          {{ product.categories[0].name }}
        </NuxtLink>
        <span>/</span>
        <span class="text-zinc-700 line-clamp-1">{{ product.title }}</span>
      </nav>

      <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">

        <!-- Gallery -->
        <div>
          <div class="aspect-square overflow-hidden rounded-2xl bg-zinc-100">
            <NuxtImg
              v-if="activeImage?.url"
              :src="activeImage.url"
              :alt="activeImage.alternativeText ?? product.title"
              class="size-full object-cover"
              width="700"
              height="700"
            />
            <div v-else class="flex size-full items-center justify-center text-zinc-200">
              <svg viewBox="0 0 24 24" class="size-16" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          </div>

          <!-- Thumbnails -->
          <div v-if="gallery.length > 1" class="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="(img, i) in gallery"
              :key="i"
              class="size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors"
              :class="activeImageIndex === i ? 'border-brand' : 'border-transparent'"
              @click="activeImageIndex = i"
            >
              <NuxtImg :src="img.url" :alt="img.alternativeText ?? ''" class="size-full object-cover" width="64" height="64" />
            </button>
          </div>
        </div>

        <!-- Product info -->
        <div>
          <!-- Category + Brand -->
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <span v-if="product.categories?.[0]" class="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
              {{ product.categories[0].name }}
            </span>
            <span v-if="product.brand" class="text-sm text-zinc-400">by {{ product.brand.name }}</span>
          </div>

          <h1 class="font-display text-2xl font-bold text-zinc-900 sm:text-3xl">{{ product.title }}</h1>

          <!-- Price -->
          <div class="mt-4 flex items-baseline gap-3">
            <span class="text-3xl font-bold text-zinc-900">
              {{ formatPrice(product.discountPrice ?? product.price) }}
            </span>
            <span v-if="product.discountPrice" class="text-lg text-zinc-400 line-through">
              {{ formatPrice(product.price) }}
            </span>
            <span v-if="discount" class="rounded-lg bg-brand px-2 py-0.5 text-sm font-bold text-white">
              -{{ discount }}%
            </span>
          </div>

          <!-- Stock -->
          <div class="mt-3">
            <span
              class="inline-flex items-center gap-1.5 text-sm font-medium"
              :class="product.stock > 0 ? 'text-green-600' : 'text-red-500'"
            >
              <span class="size-2 rounded-full" :class="product.stock > 0 ? 'bg-green-500' : 'bg-red-400'" />
              {{ product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock' }}
            </span>
          </div>

          <!-- Quantity + Add to cart -->
          <div class="mt-6 flex items-center gap-3">
            <div class="flex items-center rounded-xl border border-zinc-200">
              <button
                class="flex size-10 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900"
                @click="qty = Math.max(1, qty - 1)"
              >
                <Icon :icon="MinusIcon" />
              </button>
              <span class="w-10 text-center text-sm font-semibold">{{ qty }}</span>
              <button
                class="flex size-10 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900"
                @click="qty = Math.min(product.stock, qty + 1)"
              >
                <Icon :icon="PlusIcon" />
              </button>
            </div>

            <button
              :disabled="product.stock <= 0"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              @click="handleAddToCart"
            >
              <Icon :icon="CartIcon" />
              {{ added ? 'Added!' : 'Add to Cart' }}
            </button>
          </div>

          <!-- Description -->
          <div v-if="product.description" class="mt-8 border-t border-zinc-100 pt-6">
            <h2 class="mb-3 font-semibold text-zinc-900">Description</h2>
            <div class="cms-content text-sm leading-relaxed text-zinc-600" v-html="product.description" />
          </div>

          <!-- Specifications -->
          <div v-if="product.specifications?.length" class="mt-6 border-t border-zinc-100 pt-6">
            <h2 class="mb-3 font-semibold text-zinc-900">Specifications</h2>
            <dl class="space-y-2">
              <div v-for="spec in product.specifications" :key="spec.label" class="flex justify-between text-sm">
                <dt class="text-zinc-500">{{ spec.label }}</dt>
                <dd class="font-medium text-zinc-800">{{ spec.value }}</dd>
              </div>
            </dl>
          </div>

          <!-- Ingredients -->
          <div v-if="product.ingredients?.length" class="mt-6 border-t border-zinc-100 pt-6">
            <h2 class="mb-3 font-semibold text-zinc-900">Ingredients</h2>
            <ul class="space-y-1 text-sm text-zinc-600">
              <li v-for="ing in product.ingredients" :key="ing.name" class="flex justify-between">
                <span>{{ ing.name }}</span>
                <span v-if="ing.amount" class="text-zinc-400">{{ ing.amount }}{{ ing.unit }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 404 state -->
  <div v-else-if="!pending" class="flex min-h-[60vh] flex-col items-center justify-center text-center">
    <h1 class="font-display text-2xl font-bold text-zinc-900">Product not found</h1>
    <NuxtLink to="/shop" class="mt-4 text-sm font-medium text-brand hover:underline">Back to shop</NuxtLink>
  </div>

  <!-- Loading -->
  <div v-else class="min-h-screen py-8">
    <div class="container mx-auto animate-pulse px-4 lg:px-6">
      <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div class="aspect-square rounded-2xl bg-zinc-100" />
        <div class="space-y-4 pt-4">
          <div class="h-4 w-1/3 rounded bg-zinc-100" />
          <div class="h-8 rounded bg-zinc-200" />
          <div class="h-8 w-1/3 rounded bg-zinc-200" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CartIcon from '~/assets/icons/cart.svg'
import PlusIcon from '~/assets/icons/plus.svg'
import MinusIcon from '~/assets/icons/minus.svg'
import type { Product } from '~/types'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = route.params.slug as string
const { getProductBySlug } = useStrapi()
const cartStore = useCartStore()

const { data, pending } = await useAsyncData(`product-${slug}`, () => getProductBySlug(slug))
const product = computed(() => (data.value?.data as Product[] | undefined)?.[0] ?? null)

useSeoMeta({
  title: computed(() => product.value ? `${product.value.title} — Kuchkucha` : 'Product — Kuchkucha'),
  description: computed(() => product.value?.description?.replace(/<[^>]*>/g, '').slice(0, 160) ?? ''),
})

// Gallery
const gallery = computed(() => {
  if (!product.value) return []
  const imgs = []
  if (product.value.mainImage) imgs.push(product.value.mainImage)
  if (product.value.gallery?.length) imgs.push(...product.value.gallery)
  return imgs
})
const activeImageIndex = ref(0)
const activeImage = computed(() => gallery.value[activeImageIndex.value])

// Quantity
const qty = ref(1)

// Discount
const discount = computed(() => {
  if (!product.value?.discountPrice || product.value.discountPrice >= product.value.price) return null
  return Math.round((1 - product.value.discountPrice / product.value.price) * 100)
})

// Add to cart
const added = ref(false)
function handleAddToCart() {
  if (!product.value) return
  cartStore.addItem(product.value, qty.value)
  added.value = true
  setTimeout(() => { added.value = false }, 2000)
}

const formatPrice = usePriceFormatter()
</script>
