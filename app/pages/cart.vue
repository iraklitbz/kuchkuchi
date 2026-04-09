<template>
  <div class="min-h-screen bg-zinc-50 py-10">
    <div class="container mx-auto px-4 lg:px-6">

      <h1 class="font-display mb-8 text-2xl font-bold text-zinc-900">
        Your Cart
        <ClientOnly>
          <span v-if="cartStore.count" class="ml-2 text-lg font-normal text-zinc-400">({{ cartStore.count }})</span>
        </ClientOnly>
      </h1>

      <!-- Empty -->
      <div v-if="cartStore.isEmpty" class="rounded-2xl border border-dashed border-zinc-200 bg-white py-20 text-center">
        <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-zinc-100">
          <Icon :icon="CartIcon" class="text-2xl text-zinc-300" />
        </div>
        <h2 class="font-semibold text-zinc-900">Your cart is empty</h2>
        <p class="mt-1 text-sm text-zinc-500">Add some products to get started</p>
        <NuxtLink
          to="/shop"
          class="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Continue Shopping
        </NuxtLink>
      </div>

      <!-- Cart content -->
      <div v-else class="grid gap-6 lg:grid-cols-3 lg:items-start">

        <!-- Items list -->
        <div class="lg:col-span-2">
          <div class="overflow-hidden rounded-2xl border border-zinc-100 bg-white">

            <!-- Item rows -->
            <ul class="divide-y divide-zinc-100">
              <li v-for="item in cartStore.items" :key="item.product.id" class="flex gap-4 p-4 sm:p-5">

                <!-- Thumbnail -->
                <NuxtLink :to="`/product/${item.product.slug}`" class="shrink-0">
                  <div class="size-20 overflow-hidden rounded-xl bg-zinc-100 sm:size-24">
                    <NuxtImg
                      v-if="item.product.mainImage?.url"
                      :src="item.product.mainImage.url"
                      :alt="item.product.title"
                      class="size-full object-cover"
                      width="96"
                      height="96"
                    />
                  </div>
                </NuxtLink>

                <!-- Info -->
                <div class="flex flex-1 flex-col gap-1 min-w-0">
                  <NuxtLink
                    :to="`/product/${item.product.slug}`"
                    class="line-clamp-2 text-sm font-semibold text-zinc-800 hover:text-brand"
                  >
                    {{ item.product.title }}
                  </NuxtLink>
                  <p v-if="item.product.brand" class="text-xs text-zinc-400">{{ item.product.brand.name }}</p>

                  <!-- Unit price -->
                  <div class="mt-1 flex items-center gap-2">
                    <span class="text-sm font-medium text-zinc-700">
                      {{ formatPrice(item.product.discountPrice ?? item.product.price) }}
                    </span>
                    <span v-if="item.product.discountPrice" class="text-xs text-zinc-400 line-through">
                      {{ formatPrice(item.product.price) }}
                    </span>
                  </div>

                  <!-- Qty + remove -->
                  <div class="mt-auto flex items-center justify-between pt-2">
                    <div class="flex items-center rounded-xl border border-zinc-200">
                      <button
                        class="flex size-8 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-700"
                        @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                      >
                        <Icon :icon="MinusIcon" class="text-xs" />
                      </button>
                      <span class="w-9 text-center text-sm font-semibold">{{ item.quantity }}</span>
                      <button
                        class="flex size-8 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-700"
                        :disabled="item.quantity >= item.product.stock"
                        @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                      >
                        <Icon :icon="PlusIcon" class="text-xs" />
                      </button>
                    </div>

                    <div class="flex items-center gap-4">
                      <span class="text-sm font-bold text-zinc-900">
                        {{ formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity) }}
                      </span>
                      <button
                        class="text-zinc-300 transition-colors hover:text-red-500"
                        @click="cartStore.removeItem(item.product.id)"
                      >
                        <Icon :icon="TrashIcon" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <!-- Footer actions -->
            <div class="flex items-center justify-between border-t border-zinc-100 px-5 py-4">
              <NuxtLink to="/shop" class="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-brand">
                <Icon :icon="ArrowLeftIcon" class="text-xs" />
                Continue Shopping
              </NuxtLink>
              <button
                class="text-xs text-zinc-400 hover:text-red-500"
                @click="cartStore.clear()"
              >
                Clear cart
              </button>
            </div>
          </div>
        </div>

        <!-- Order summary -->
        <div class="rounded-2xl border border-zinc-100 bg-white p-5">
          <h2 class="mb-4 font-display font-semibold text-zinc-900">Order Summary</h2>

          <!-- Coupon -->
          <div class="mb-5">
            <p class="mb-2 text-xs font-medium text-zinc-500">Coupon code</p>

            <!-- Applied coupon -->
            <div v-if="cartStore.appliedCoupon" class="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3 py-2.5">
              <div>
                <span class="text-sm font-semibold text-green-700">{{ cartStore.appliedCoupon.code }}</span>
                <p class="text-xs text-green-600">
                  {{ cartStore.appliedCoupon.discountType === 'percentage'
                    ? `${cartStore.appliedCoupon.value}% off`
                    : `${cartStore.appliedCoupon.value} ₾ off` }}
                </p>
              </div>
              <button class="text-xs text-green-600 hover:text-red-500" @click="cartStore.removeCoupon()">
                Remove
              </button>
            </div>

            <!-- Coupon input -->
            <form v-else class="flex gap-2" @submit.prevent="submitCoupon">
              <input
                v-model="couponInput"
                type="text"
                placeholder="Enter code"
                class="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
              <button
                type="submit"
                :disabled="!couponInput.trim() || cartStore.couponLoading"
                class="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                <svg v-if="cartStore.couponLoading" class="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span v-else>Apply</span>
              </button>
            </form>
            <p v-if="cartStore.couponError" class="mt-1.5 text-xs text-red-500">{{ cartStore.couponError }}</p>
          </div>

          <!-- Totals -->
          <dl class="space-y-2.5 border-t border-zinc-100 pt-4">
            <div class="flex justify-between text-sm">
              <dt class="text-zinc-500">Subtotal</dt>
              <dd class="font-medium text-zinc-800">{{ formatPrice(cartStore.subtotal) }}</dd>
            </div>
            <div v-if="cartStore.discount > 0" class="flex justify-between text-sm">
              <dt class="text-green-600">Discount</dt>
              <dd class="font-medium text-green-600">-{{ formatPrice(cartStore.discount) }}</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-zinc-500">Shipping</dt>
              <dd class="text-xs font-medium text-zinc-400">Calculated at checkout</dd>
            </div>
          </dl>

          <div class="mt-4 flex justify-between border-t border-zinc-100 pt-4">
            <span class="font-semibold text-zinc-900">Total</span>
            <span class="text-xl font-bold text-zinc-900">{{ formatPrice(cartStore.total) }}</span>
          </div>

          <NuxtLink
            to="/checkout"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Proceed to Checkout
            <Icon :icon="ArrowRightIcon" class="text-xs" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CartIcon from '~/assets/icons/cart.svg'
import MinusIcon from '~/assets/icons/minus.svg'
import PlusIcon from '~/assets/icons/plus.svg'
import TrashIcon from '~/assets/icons/trash.svg'
import ArrowRightIcon from '~/assets/icons/arrow-right.svg'
import ArrowLeftIcon from '~/assets/icons/chevron-right.svg'

definePageMeta({ layout: 'default' })

useSeoMeta({ title: 'Cart — Kuchkucha' })

const cartStore = useCartStore()
const couponInput = ref('')
const formatPrice = usePriceFormatter()

async function submitCoupon() {
  await cartStore.applyCoupon(couponInput.value)
  if (cartStore.appliedCoupon) couponInput.value = ''
}
</script>
