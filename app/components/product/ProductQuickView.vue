<template>
  <Teleport to="body">
    <Transition name="qv-fade">
      <div
        v-if="product"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close" />

        <!-- Card -->
        <div class="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <!-- Close button -->
          <button
            class="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-white/90 text-zinc-500 shadow-sm transition-colors hover:text-zinc-900"
            aria-label="დახურვა"
            @click="close"
          >
            <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />
            </svg>
          </button>

          <div class="grid sm:grid-cols-2">
            <!-- Image -->
            <div class="relative aspect-square bg-zinc-100">
              <NuxtImg
                v-if="product.mainImage?.url"
                :src="product.mainImage.url"
                :alt="product.mainImage.alternativeText ?? product.title"
                class="size-full object-cover"
                width="500"
                height="500"
              />
              <div v-else class="flex size-full items-center justify-center text-zinc-200">
                <svg viewBox="0 0 24 24" class="size-16" fill="none" stroke="currentColor" stroke-width="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div
                v-if="discount"
                class="absolute left-3 top-3 rounded-lg bg-brand px-2 py-0.5 text-sm font-bold text-white"
              >
                -{{ discount }}%
              </div>
            </div>

            <!-- Info -->
            <div class="flex flex-col p-6 sm:p-8">
              <!-- Category + Brand -->
              <div class="mb-2 flex flex-wrap items-center gap-2">
                <span
                  v-if="product.categories?.[0]"
                  class="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand"
                >
                  {{ product.categories[0].name }}
                </span>
                <span v-if="product.brand" class="text-xs text-zinc-400">
                  by {{ product.brand.name }}
                </span>
              </div>

              <h2 class="font-display text-xl font-bold leading-tight text-zinc-900 sm:text-2xl">
                {{ product.title }}
              </h2>

              <!-- Price -->
              <div class="mt-4 flex items-baseline gap-3">
                <span class="text-2xl font-bold text-zinc-900">
                  {{ formatPrice(product.discountPrice ?? product.price) }}
                </span>
                <span v-if="product.discountPrice" class="text-base text-zinc-400 line-through">
                  {{ formatPrice(product.price) }}
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

              <!-- Qty + Add to cart -->
              <div class="mt-6 flex items-center gap-3">
                <div class="flex items-center rounded-xl border border-zinc-200">
                  <button
                    class="flex size-9 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900"
                    @click="qty = Math.max(1, qty - 1)"
                  >
                    <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M5 12h14" stroke-linecap="round" />
                    </svg>
                  </button>
                  <span class="w-9 text-center text-sm font-semibold">{{ qty }}</span>
                  <button
                    class="flex size-9 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900"
                    @click="qty = Math.min(product.stock, qty + 1)"
                  >
                    <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M12 5v14M5 12h14" stroke-linecap="round" />
                    </svg>
                  </button>
                </div>

                <button
                  :disabled="product.stock <= 0"
                  class="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  @click="handleAddToCart"
                >
                  {{ added ? 'დამატებულია!' : 'კალათაში დამატება' }}
                </button>
              </div>

              <!-- Full page link -->
              <NuxtLink
                :to="`/product/${product.slug}`"
                class="mt-4 text-center text-xs font-medium text-zinc-400 transition-colors hover:text-brand"
                @click="close"
              >
                სრული ინფორმაცია →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { product, close } = useQuickView()
const cartStore = useCartStore()
const formatPrice = usePriceFormatter()

const qty = ref(1)
const added = ref(false)

watch(product, () => { qty.value = 1; added.value = false })

const discount = computed(() => {
  if (!product.value?.discountPrice || product.value.discountPrice >= product.value.price) return null
  return Math.round((1 - product.value.discountPrice / product.value.price) * 100)
})

function handleAddToCart() {
  if (!product.value) return
  cartStore.addItem(product.value, qty.value)
  added.value = true
  setTimeout(() => { added.value = false }, 2000)
}

onMounted(() => {
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})
</script>

<style scoped>
.qv-fade-enter-active,
.qv-fade-leave-active { transition: opacity 0.2s ease }
.qv-fade-enter-from,
.qv-fade-leave-to { opacity: 0 }
</style>
