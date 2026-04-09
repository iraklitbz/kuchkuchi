<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="cartStore.isOpen"
      class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
      @click="cartStore.closeCart()"
    />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide-right">
    <div
      v-if="cartStore.isOpen"
      class="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
        <h2 class="font-display text-lg font-bold text-zinc-900">
          Cart
          <ClientOnly>
            <span v-if="cartStore.count > 0" class="ml-1.5 text-sm font-normal text-zinc-400">
              ({{ cartStore.count }})
            </span>
          </ClientOnly>
        </h2>
        <button
          class="flex size-8 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          @click="cartStore.closeCart()"
        >
          <Icon :icon="CloseIcon" />
        </button>
      </div>

      <!-- Items -->
      <div class="flex-1 overflow-y-auto">
        <!-- Empty -->
        <div v-if="cartStore.isEmpty" class="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
          <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-zinc-100">
            <Icon :icon="CartIcon" class="text-2xl text-zinc-300" />
          </div>
          <p class="font-semibold text-zinc-800">Your cart is empty</p>
          <p class="mt-1 text-sm text-zinc-500">Add some products to get started</p>
          <button
            class="mt-5 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            @click="cartStore.closeCart()"
          >
            Continue Shopping
          </button>
        </div>

        <!-- Item list -->
        <ul v-else class="divide-y divide-zinc-100 px-5">
          <li v-for="item in cartStore.items" :key="item.product.id" class="flex gap-3 py-4">
            <!-- Thumbnail -->
            <div class="size-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
              <NuxtImg
                v-if="item.product.mainImage?.url"
                :src="item.product.mainImage.url"
                :alt="item.product.title"
                class="size-full object-cover"
                width="64"
                height="64"
              />
            </div>

            <!-- Info -->
            <div class="flex flex-1 flex-col gap-1">
              <p class="line-clamp-2 text-sm font-medium text-zinc-800">{{ item.product.title }}</p>
              <p class="text-sm font-bold text-brand">
                {{ formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity) }}
              </p>

              <!-- Qty controls -->
              <div class="mt-auto flex items-center gap-2">
                <div class="flex items-center rounded-lg border border-zinc-200">
                  <button
                    class="flex size-7 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900"
                    @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                  >
                    <Icon :icon="MinusIcon" class="text-xs" />
                  </button>
                  <span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
                  <button
                    class="flex size-7 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900"
                    @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                  >
                    <Icon :icon="PlusIcon" class="text-xs" />
                  </button>
                </div>

                <button
                  class="ml-auto text-zinc-300 transition-colors hover:text-red-500"
                  @click="cartStore.removeItem(item.product.id)"
                >
                  <Icon :icon="TrashIcon" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Footer -->
      <div v-if="!cartStore.isEmpty" class="border-t border-zinc-100 px-5 py-4">
        <div class="mb-4 flex items-center justify-between">
          <span class="text-sm text-zinc-500">Subtotal</span>
          <span class="text-base font-bold text-zinc-900">{{ formatPrice(cartStore.subtotal) }}</span>
        </div>
        <p class="mb-4 text-xs text-zinc-400">Shipping calculated at checkout</p>
        <NuxtLink
          to="/checkout"
          class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          @click="cartStore.closeCart()"
        >
          Proceed to Checkout
          <Icon :icon="ArrowRightIcon" />
        </NuxtLink>
        <NuxtLink
          to="/cart"
          class="mt-2 flex w-full items-center justify-center rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          @click="cartStore.closeCart()"
        >
          View Cart
        </NuxtLink>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import CloseIcon from '~/assets/icons/close.svg'
import CartIcon from '~/assets/icons/cart.svg'
import MinusIcon from '~/assets/icons/minus.svg'
import PlusIcon from '~/assets/icons/plus.svg'
import TrashIcon from '~/assets/icons/trash.svg'
import ArrowRightIcon from '~/assets/icons/arrow-right.svg'

const cartStore = useCartStore()
const formatPrice = usePriceFormatter()
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
