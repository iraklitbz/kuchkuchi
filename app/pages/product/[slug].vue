<template>
  <div v-if="product" class="min-h-screen py-8">
    <div class="container mx-auto px-4 lg:px-6">

      <!-- Breadcrumb -->
      <nav class="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
        <NuxtLink to="/" class="hover:text-brand">მთავარი</NuxtLink>
        <span>/</span>
        <NuxtLink to="/shop" class="hover:text-brand">მაღაზია</NuxtLink>
        <span v-if="product.categories?.[0]">/</span>
        <NuxtLink
          v-if="product.categories?.[0]"
          :to="`/category/${product.categories[0].slug}`"
          class="hover:text-brand"
        >
          {{ product.categories[0].name }}
        </NuxtLink>
        <span>/</span>
        <span class="line-clamp-1 text-zinc-700">{{ product.title }}</span>
      </nav>

      <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">

        <!-- ── Gallery ── -->
        <div>
          <!-- Main image — click to open lightbox -->
          <div
            class="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-zinc-100"
            @click="openLightbox(activeImageIndex)"
          >
            <NuxtImg
              v-if="activeImage?.url"
              :src="activeImage.url"
              :alt="activeImage.alternativeText ?? product.title"
              class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              width="700"
              height="700"
            />
            <div v-else class="flex size-full items-center justify-center text-zinc-200">
              <svg viewBox="0 0 24 24" class="size-16" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <!-- Zoom hint -->
            <div
              v-if="activeImage?.url"
              class="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/80 text-zinc-600 opacity-0 shadow transition-opacity group-hover:opacity-100"
            >
              <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6" stroke-linecap="round"/>
              </svg>
            </div>
            <!-- Discount badge -->
            <div v-if="discount" class="absolute left-3 top-3 rounded-lg bg-brand px-2.5 py-0.5 text-sm font-bold text-white">
              -{{ discount }}%
            </div>
          </div>

          <!-- Thumbnails -->
          <div v-if="gallery.length > 1" class="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="(img, i) in gallery"
              :key="i"
              class="size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all"
              :class="activeImageIndex === i ? 'border-brand shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'"
              @click="activeImageIndex = i"
            >
              <NuxtImg :src="img.url" :alt="img.alternativeText ?? ''" class="size-full object-cover" width="64" height="64" />
            </button>
          </div>
        </div>

        <!-- ── Product info ── -->
        <div>
          <!-- Category + Brand -->
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <NuxtLink
              v-if="product.categories?.[0]"
              :to="`/category/${product.categories[0].slug}`"
              class="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand hover:bg-brand/20"
            >
              {{ product.categories[0].name }}
            </NuxtLink>
            <span v-if="product.brand" class="text-sm text-zinc-400">by {{ product.brand.name }}</span>
          </div>

          <h1 class="font-display text-2xl font-bold text-zinc-900 sm:text-3xl">{{ product.title }}</h1>

          <!-- Price block -->
          <div class="mt-4 flex items-baseline gap-3">
            <span class="text-3xl font-bold text-zinc-900">
              {{ formatPrice(product.discountPrice ?? product.price) }}
            </span>
            <span v-if="product.discountPrice" class="text-xl text-zinc-400 line-through">
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
              {{ product.stock > 0 ? `მარაგშია (${product.stock})` : 'ამოიწურა' }}
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
              {{ added ? 'დამატებულია!' : 'კალათაში დამატება' }}
            </button>
          </div>

          <!-- ── Tabs: Description / Specs / Ingredients ── -->
          <div
            v-if="product.description || product.specifications?.length || product.ingredients?.length"
            class="mt-8 border-t border-zinc-100 pt-6"
          >
            <!-- Tab buttons -->
            <div class="mb-5 flex gap-1 rounded-xl bg-zinc-100 p-1">
              <button
                v-for="tab in visibleTabs"
                :key="tab.id"
                class="flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors"
                :class="activeTab === tab.id
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>

            <!-- Description tab -->
            <div v-if="activeTab === 'description' && product.description">
              <div class="cms-content text-sm leading-relaxed text-zinc-600" v-html="product.description" />
            </div>

            <!-- Specifications tab -->
            <div v-if="activeTab === 'specs' && product.specifications?.length">
              <dl class="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-100">
                <div
                  v-for="spec in product.specifications"
                  :key="spec.label"
                  class="flex items-center justify-between px-4 py-2.5"
                >
                  <dt class="text-sm text-zinc-500">{{ spec.label }}</dt>
                  <dd class="text-sm font-medium text-zinc-800">{{ spec.value }}</dd>
                </div>
              </dl>
            </div>

            <!-- Ingredients tab -->
            <div v-if="activeTab === 'ingredients' && product.ingredients?.length">
              <ul class="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-100">
                <li
                  v-for="ing in product.ingredients"
                  :key="ing.name"
                  class="flex items-center justify-between px-4 py-2.5"
                >
                  <span class="text-sm text-zinc-700">{{ ing.name }}</span>
                  <span v-if="ing.amount" class="text-sm text-zinc-400">
                    {{ ing.amount }}{{ ing.unit && ing.unit !== 'unit' ? ing.unit : '' }}
                    <span v-if="ing.note" class="ml-1 text-xs italic">({{ ing.note }})</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <section v-if="relatedProducts.length" class="mt-16 border-t border-zinc-100 pt-12">
        <h2 class="mb-6 font-display text-xl font-bold text-zinc-900">შეიძლება მოგეწონოს</h2>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          <ProductCard v-for="p in relatedProducts" :key="p.id" :product="p" />
        </div>
      </section>

      <!-- Recently Viewed -->
      <ClientOnly>
        <section v-if="otherRecentlyViewed.length" class="mt-12 border-t border-zinc-100 pt-10">
          <h2 class="mb-5 font-display text-lg font-semibold text-zinc-700">ბოლოს ნანახი</h2>
          <div class="flex gap-3 overflow-x-auto pb-2">
            <div v-for="p in otherRecentlyViewed" :key="p.id" class="w-40 shrink-0 sm:w-48">
              <ProductCard :product="p" />
            </div>
          </div>
        </section>
      </ClientOnly>
    </div>
  </div>

  <!-- 404 -->
  <div v-else-if="!pending" class="flex min-h-[60vh] flex-col items-center justify-center text-center">
    <h1 class="font-display text-2xl font-bold text-zinc-900">პროდუქტი ვერ მოიძებნა</h1>
    <NuxtLink to="/shop" class="mt-4 text-sm font-medium text-brand hover:underline">მაღაზიაში დაბრუნება</NuxtLink>
  </div>

  <!-- Loading skeleton -->
  <div v-else class="min-h-screen py-8">
    <div class="container mx-auto animate-pulse px-4 lg:px-6">
      <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div class="aspect-square rounded-2xl bg-zinc-100" />
        <div class="space-y-4 pt-4">
          <div class="h-4 w-1/3 rounded bg-zinc-100" />
          <div class="h-8 rounded bg-zinc-200" />
          <div class="h-8 w-1/3 rounded bg-zinc-200" />
          <div class="mt-6 h-10 rounded-xl bg-zinc-100" />
        </div>
      </div>
    </div>
  </div>

  <!-- ── Gallery Lightbox ── -->
  <Teleport to="body">
    <Transition name="lb-fade">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-[70] flex flex-col bg-black/95"
        @click.self="closeLightbox"
      >
        <!-- Top bar -->
        <div class="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
          <span class="text-sm font-medium text-white/60">
            {{ lightboxIndex + 1 }} / {{ gallery.length }}
          </span>
          <button
            class="flex size-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="დახურვა"
            @click="closeLightbox"
          >
            <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <!-- Main image area -->
        <div class="relative flex flex-1 items-center justify-center overflow-hidden px-12 sm:px-16">
          <!-- Prev arrow -->
          <button
            v-if="gallery.length > 1"
            class="absolute left-2 flex size-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:left-4"
            aria-label="წინა სურათი"
            @click.stop="lightboxPrev"
          >
            <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <Transition :name="lightboxDir === 'next' ? 'lb-slide-left' : 'lb-slide-right'" mode="out-in">
            <img
              :key="lightboxIndex"
              :src="gallery[lightboxIndex]?.url"
              :alt="gallery[lightboxIndex]?.alternativeText ?? product?.title ?? ''"
              class="max-h-full max-w-full object-contain"
              style="max-height: calc(100vh - 160px)"
            />
          </Transition>

          <!-- Next arrow -->
          <button
            v-if="gallery.length > 1"
            class="absolute right-2 flex size-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-4"
            aria-label="შემდეგი სურათი"
            @click.stop="lightboxNext"
          >
            <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <!-- Thumbnail strip -->
        <div v-if="gallery.length > 1" class="shrink-0 overflow-x-auto py-3">
          <div class="flex justify-center gap-2 px-4">
            <button
              v-for="(img, i) in gallery"
              :key="i"
              class="size-14 shrink-0 overflow-hidden rounded-lg transition-all"
              :class="lightboxIndex === i
                ? 'ring-2 ring-white ring-offset-2 ring-offset-black opacity-100'
                : 'opacity-40 hover:opacity-70'"
              @click.stop="lightboxIndex = i"
            >
              <img :src="img.url" :alt="img.alternativeText ?? ''" class="size-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
const { recentlyViewed, trackProduct } = useRecentlyViewed()

const { data, pending } = await useAsyncData(`product-${slug}`, () => getProductBySlug(slug))
const product = computed(() => (data.value?.data as Product[] | undefined)?.[0] ?? null)

useSeoMeta({
  title: computed(() => product.value ? `${product.value.title} — Kuchkucha` : 'Product — Kuchkucha'),
  description: computed(() => product.value?.description?.replace(/<[^>]*>/g, '').slice(0, 160) ?? ''),
})

onMounted(() => {
  if (product.value) trackProduct(product.value)
})

// ── Gallery ──────────────────────────────────────────────────────────────────
const gallery = computed(() => {
  if (!product.value) return []
  const imgs = []
  if (product.value.mainImage) imgs.push(product.value.mainImage)
  if (product.value.gallery?.length) imgs.push(...product.value.gallery)
  return imgs
})
const activeImageIndex = ref(0)
const activeImage = computed(() => gallery.value[activeImageIndex.value])

// ── Lightbox ──────────────────────────────────────────────────────────────────
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const lightboxDir = ref<'next' | 'prev'>('next')

function openLightbox(index: number) {
  if (!gallery.value.length) return
  lightboxIndex.value = index
  lightboxOpen.value = true
}
function closeLightbox() { lightboxOpen.value = false }
function lightboxNext() {
  lightboxDir.value = 'next'
  lightboxIndex.value = (lightboxIndex.value + 1) % gallery.value.length
}
function lightboxPrev() {
  lightboxDir.value = 'prev'
  lightboxIndex.value = (lightboxIndex.value - 1 + gallery.value.length) % gallery.value.length
}

// Keyboard nav
onMounted(() => {
  function onKey(e: KeyboardEvent) {
    if (!lightboxOpen.value) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') lightboxNext()
    if (e.key === 'ArrowLeft') lightboxPrev()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})

// ── Tabs ─────────────────────────────────────────────────────────────────────
type TabId = 'description' | 'specs' | 'ingredients'
const allTabs: { id: TabId; label: string }[] = [
  { id: 'description', label: 'აღწერა' },
  { id: 'specs', label: 'მახასიათებლები' },
  { id: 'ingredients', label: 'ინგრედიენტები' },
]
const visibleTabs = computed(() =>
  allTabs.filter(t =>
    (t.id === 'description' && product.value?.description) ||
    (t.id === 'specs' && product.value?.specifications?.length) ||
    (t.id === 'ingredients' && product.value?.ingredients?.length),
  ),
)
const activeTab = ref<TabId>('description')
watch(visibleTabs, tabs => {
  if (tabs.length && !tabs.find(t => t.id === activeTab.value)) {
    activeTab.value = tabs[0]!.id
  }
}, { immediate: true })

// ── Price / Cart ──────────────────────────────────────────────────────────────
const qty = ref(1)
const discount = computed(() => {
  if (!product.value?.discountPrice || product.value.discountPrice >= product.value.price) return null
  return Math.round((1 - product.value.discountPrice / product.value.price) * 100)
})
const added = ref(false)
function handleAddToCart() {
  if (!product.value) return
  cartStore.addItem(product.value, qty.value)
  added.value = true
  setTimeout(() => { added.value = false }, 2000)
}

// ── Related / Recently viewed ─────────────────────────────────────────────────
const relatedProducts = computed<Product[]>(() =>
  (product.value?.relatedProducts ?? []).filter(p => p.stock !== undefined),
)
const otherRecentlyViewed = computed(() =>
  recentlyViewed.value.filter(p => p.id !== product.value?.id).slice(0, 6),
)

const formatPrice = usePriceFormatter()
</script>

<style scoped>
.lb-fade-enter-active,
.lb-fade-leave-active { transition: opacity 0.2s ease }
.lb-fade-enter-from,
.lb-fade-leave-to { opacity: 0 }

.lb-slide-left-enter-active,
.lb-slide-left-leave-active,
.lb-slide-right-enter-active,
.lb-slide-right-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.lb-slide-left-enter-from  { opacity: 0; transform: translateX(40px) }
.lb-slide-left-leave-to    { opacity: 0; transform: translateX(-40px) }
.lb-slide-right-enter-from { opacity: 0; transform: translateX(-40px) }
.lb-slide-right-leave-to   { opacity: 0; transform: translateX(40px) }
</style>
