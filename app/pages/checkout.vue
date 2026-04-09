<template>
  <div class="min-h-screen bg-zinc-50 py-10">
    <div class="container mx-auto px-4 lg:px-6">

      <h1 class="font-display mb-8 text-2xl font-bold text-zinc-900">Checkout</h1>

      <!-- Empty cart redirect -->
      <div v-if="cartStore.isEmpty" class="rounded-2xl border border-dashed border-zinc-200 bg-white py-20 text-center">
        <p class="text-sm text-zinc-500">Your cart is empty.</p>
        <NuxtLink to="/shop" class="mt-4 inline-block text-sm font-medium text-brand hover:underline">
          Continue Shopping
        </NuxtLink>
      </div>

      <div v-else class="grid gap-6 lg:grid-cols-3 lg:items-start">

        <!-- Form -->
        <div class="lg:col-span-2">
          <form class="space-y-6" @submit.prevent="submitOrder">

            <!-- Contact -->
            <div class="rounded-2xl border border-zinc-100 bg-white p-6">
              <h2 class="mb-4 font-display font-semibold text-zinc-900">Contact Information</h2>
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-zinc-700">First Name <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.firstName"
                    type="text"
                    required
                    autocomplete="given-name"
                    class="input"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-zinc-700">Last Name <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.lastName"
                    type="text"
                    required
                    autocomplete="family-name"
                    class="input"
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-zinc-700">Email <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    autocomplete="email"
                    class="input"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-zinc-700">Phone</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    autocomplete="tel"
                    class="input"
                    placeholder="+995 555 000 000"
                  />
                </div>
              </div>
            </div>

            <!-- Shipping address -->
            <div class="rounded-2xl border border-zinc-100 bg-white p-6">
              <h2 class="mb-4 font-display font-semibold text-zinc-900">Shipping Address</h2>
              <div class="grid gap-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-zinc-700">Address <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.address"
                    type="text"
                    required
                    autocomplete="street-address"
                    class="input"
                    placeholder="Street address, apartment, etc."
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-zinc-700">City <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.city"
                    type="text"
                    required
                    autocomplete="address-level2"
                    class="input"
                    placeholder="Tbilisi"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-zinc-700">Order Notes</label>
                  <textarea
                    v-model="form.notes"
                    rows="3"
                    class="input resize-none"
                    placeholder="Any special instructions or notes for your order..."
                  />
                </div>
              </div>
            </div>

            <!-- Login prompt for guests -->
            <div v-if="!authStore.isAuthenticated" class="rounded-xl border border-brand/20 bg-brand/5 px-5 py-4 text-sm text-zinc-600">
              Have an account?
              <NuxtLink to="/login" class="ml-1 font-medium text-brand hover:underline">Sign in</NuxtLink>
              to track your orders and autofill your details.
            </div>

            <div v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg v-if="loading" class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>{{ loading ? 'Placing Order...' : 'Place Order' }}</span>
            </button>
          </form>
        </div>

        <!-- Order summary sidebar -->
        <div class="rounded-2xl border border-zinc-100 bg-white p-5">
          <h2 class="mb-4 font-display font-semibold text-zinc-900">Order Summary</h2>

          <!-- Items -->
          <ul class="divide-y divide-zinc-100">
            <li v-for="item in cartStore.items" :key="item.product.id" class="flex items-center gap-3 py-3">
              <div class="relative shrink-0">
                <div class="size-14 overflow-hidden rounded-lg bg-zinc-100">
                  <NuxtImg
                    v-if="item.product.mainImage?.url"
                    :src="item.product.mainImage.url"
                    :alt="item.product.title"
                    class="size-full object-cover"
                    width="56"
                    height="56"
                  />
                </div>
                <span class="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-zinc-700 text-[10px] font-bold text-white">
                  {{ item.quantity }}
                </span>
              </div>
              <div class="flex flex-1 items-center justify-between gap-2 min-w-0">
                <p class="truncate text-sm text-zinc-700">{{ item.product.title }}</p>
                <p class="shrink-0 text-sm font-semibold text-zinc-900">
                  {{ formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity) }}
                </p>
              </div>
            </li>
          </ul>

          <!-- Applied coupon -->
          <div v-if="cartStore.appliedCoupon" class="mt-3 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3 py-2">
            <span class="text-xs font-semibold text-green-700">{{ cartStore.appliedCoupon.code }}</span>
            <span class="text-xs text-green-600">
              {{ cartStore.appliedCoupon.discountType === 'percentage'
                ? `${cartStore.appliedCoupon.value}% off`
                : `${cartStore.appliedCoupon.value} ₾ off` }}
            </span>
          </div>

          <!-- Totals -->
          <dl class="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-sm">
            <div class="flex justify-between">
              <dt class="text-zinc-500">Subtotal</dt>
              <dd class="font-medium text-zinc-800">{{ formatPrice(cartStore.subtotal) }}</dd>
            </div>
            <div v-if="cartStore.discount > 0" class="flex justify-between">
              <dt class="text-green-600">Discount</dt>
              <dd class="font-medium text-green-600">-{{ formatPrice(cartStore.discount) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-zinc-500">Shipping</dt>
              <dd class="text-xs font-medium text-zinc-400">Calculated later</dd>
            </div>
          </dl>

          <div class="mt-4 flex justify-between border-t border-zinc-100 pt-4">
            <span class="font-semibold text-zinc-900">Total</span>
            <span class="text-xl font-bold text-zinc-900">{{ formatPrice(cartStore.total) }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({ title: 'Checkout — Kuchkucha' })

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const formatPrice = usePriceFormatter()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  notes: '',
})

// Pre-fill if logged in
onMounted(() => {
  if (authStore.user) {
    const nameParts = authStore.user.username?.split(' ') ?? []
    form.firstName = nameParts[0] ?? ''
    form.lastName = nameParts.slice(1).join(' ') ?? ''
    form.email = authStore.user.email ?? ''
  }
})

async function submitOrder() {
  error.value = ''
  loading.value = true

  try {
    const headers: Record<string, string> = {}
    const token = authStore.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const orderItems = cartStore.items.map(item => ({
      productId: item.product.id,
      title: item.product.title,
      price: item.product.discountPrice ?? item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.mainImage?.url,
    }))

    const result = await $fetch<{ data: { id: number; orderNumber?: string } }>('/api/orders', {
      method: 'POST',
      headers,
      body: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        notes: form.notes,
        items: orderItems,
        subtotal: cartStore.subtotal,
        discount: cartStore.discount,
        total: cartStore.total,
        couponCode: cartStore.appliedCoupon?.code ?? '',
      },
    })

    const orderNumber = result?.data?.orderNumber ?? String(result?.data?.id ?? '')
    cartStore.clear()
    await router.push(`/order-success?order=${orderNumber}`)
  }
  catch (err: unknown) {
    const e = err as { data?: { error?: { message?: string } } }
    error.value = e?.data?.error?.message ?? 'Failed to place order. Please try again.'
  }
  finally {
    loading.value = false
  }
}

</script>

<style scoped>
@reference "~/assets/css/main.css";

.input {
  @apply w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-brand focus:ring-2 focus:ring-brand/10;
}
</style>
