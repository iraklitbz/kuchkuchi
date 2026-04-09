<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
    <div class="w-full max-w-md text-center">

      <!-- Success icon -->
      <div class="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-100">
        <svg class="size-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>

      <h1 class="font-display text-2xl font-bold text-zinc-900">Order Placed!</h1>
      <p class="mt-2 text-sm text-zinc-500">
        Thank you for your order. We'll confirm it shortly and send you an email.
      </p>

      <div v-if="orderNumber" class="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50 px-6 py-4">
        <p class="text-xs font-medium uppercase tracking-wider text-zinc-400">Order Number</p>
        <p class="mt-1 font-display text-lg font-bold text-zinc-900">{{ orderNumber }}</p>
      </div>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Continue Shopping
        </NuxtLink>
        <NuxtLink
          v-if="authStore.isAuthenticated"
          to="/account/orders"
          class="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          View My Orders
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const authStore = useAuthStore()

const orderNumber = computed(() => route.query.order as string | undefined)

useSeoMeta({ title: 'Order Confirmed — Kuchkucha' })
</script>
