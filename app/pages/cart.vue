<template>
  <div class="min-h-screen bg-zinc-50 py-10">
    <div class="container mx-auto px-4 lg:px-6">

      <h1 class="font-display mb-8 text-2xl font-bold text-zinc-900">
        ჩემი კალათა
        <ClientOnly>
          <span v-if="cartStore.count" class="ml-2 text-lg font-normal text-zinc-400">({{ cartStore.count }})</span>
        </ClientOnly>
      </h1>

      <!-- Empty -->
      <div v-if="cartStore.isEmpty" class="rounded-2xl border border-dashed border-zinc-200 bg-white py-20 text-center">
        <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-zinc-100">
          <Icon :icon="CartIcon" class="text-2xl text-zinc-300" />
        </div>
        <h2 class="font-semibold text-zinc-900">კალათა ცარიელია</h2>
        <p class="mt-1 text-sm text-zinc-500">დაამატეთ პროდუქტები შესაძენად</p>
        <NuxtLink
          to="/shop"
          class="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          შოპინგის გაგრძელება
        </NuxtLink>
      </div>

      <!-- Cart content -->
      <div v-else class="grid gap-6 lg:grid-cols-3 lg:items-start">

        <!-- Items list -->
        <div class="lg:col-span-2">
          <div class="overflow-hidden rounded-2xl border border-zinc-100 bg-white">
            <ul class="divide-y divide-zinc-100">
              <li v-for="item in cartStore.items" :key="item.product.id" class="flex gap-4 p-4 sm:p-5">
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

                <div class="flex flex-1 flex-col gap-1 min-w-0">
                  <NuxtLink
                    :to="`/product/${item.product.slug}`"
                    class="line-clamp-2 text-sm font-semibold text-zinc-800 hover:text-brand"
                  >
                    {{ item.product.title }}
                  </NuxtLink>
                  <p v-if="item.product.brand" class="text-xs text-zinc-400">{{ item.product.brand.name }}</p>

                  <div class="mt-1 flex items-center gap-2">
                    <span class="text-sm font-medium text-zinc-700">
                      {{ formatPrice(item.product.discountPrice ?? item.product.price) }}
                    </span>
                    <span v-if="item.product.discountPrice" class="text-xs text-zinc-400 line-through">
                      {{ formatPrice(item.product.price) }}
                    </span>
                  </div>

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

            <div class="flex items-center justify-between border-t border-zinc-100 px-5 py-4">
              <NuxtLink to="/shop" class="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-brand">
                <Icon :icon="ArrowLeftIcon" class="text-xs" />
                შოპინგის გაგრძელება
              </NuxtLink>
              <button class="text-xs text-zinc-400 hover:text-red-500" @click="cartStore.clear()">
                კალათის გასუფთავება
              </button>
            </div>
          </div>
        </div>

        <!-- Order summary -->
        <div class="rounded-2xl border border-zinc-100 bg-white p-5">
          <h2 class="mb-4 font-display font-semibold text-zinc-900">შეკვეთის შეჯამება</h2>

          <!-- Coupon -->
          <div class="mb-5">
            <p class="mb-2 text-xs font-medium text-zinc-500">ფასდაკლების კოდი</p>

            <div v-if="cartStore.appliedCoupon" class="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3 py-2.5">
              <div>
                <span class="text-sm font-semibold text-green-700">{{ cartStore.appliedCoupon.code }}</span>
                <p class="text-xs text-green-600">
                  {{ cartStore.appliedCoupon.discountType === 'percentage'
                    ? `${cartStore.appliedCoupon.value}% ფასდაკლება`
                    : `${cartStore.appliedCoupon.value} ₾ ფასდაკლება` }}
                </p>
              </div>
              <button class="text-xs text-green-600 hover:text-red-500" @click="cartStore.removeCoupon()">
                წაშლა
              </button>
            </div>

            <form v-else class="flex gap-2" @submit.prevent="submitCoupon">
              <input
                v-model="couponInput"
                type="text"
                placeholder="კოდის შეყვანა"
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
                <span v-else>გამოყენება</span>
              </button>
            </form>
            <p v-if="cartStore.couponError" class="mt-1.5 text-xs text-red-500">{{ cartStore.couponError }}</p>
          </div>

          <!-- Totals -->
          <dl class="space-y-2.5 border-t border-zinc-100 pt-4">
            <div class="flex justify-between text-sm">
              <dt class="text-zinc-500">ჯამი</dt>
              <dd class="font-medium text-zinc-800">{{ formatPrice(cartStore.subtotal) }}</dd>
            </div>
            <div v-if="cartStore.discount > 0" class="flex justify-between text-sm">
              <dt class="text-green-600">ფასდაკლება</dt>
              <dd class="font-medium text-green-600">-{{ formatPrice(cartStore.discount) }}</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-zinc-500">მიტანა</dt>
              <dd class="text-xs font-medium text-zinc-400">გადახდისას</dd>
            </div>
          </dl>

          <div class="mt-4 flex justify-between border-t border-zinc-100 pt-4">
            <span class="font-semibold text-zinc-900">სულ</span>
            <span class="text-xl font-bold text-zinc-900">{{ formatPrice(cartStore.total) }}</span>
          </div>

          <NuxtLink
            to="/checkout"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            გადახდაზე გადასვლა
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
useSeoMeta({ title: 'კალათა — Kuchkucha' })

const cartStore = useCartStore()
const couponInput = ref('')
const formatPrice = usePriceFormatter()

async function submitCoupon() {
  await cartStore.applyCoupon(couponInput.value)
  if (cartStore.appliedCoupon) couponInput.value = ''
}
</script>
