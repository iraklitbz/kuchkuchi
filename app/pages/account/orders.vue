<template>
  <div class="min-h-[calc(100vh-4rem)] py-12">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="mx-auto max-w-2xl">

        <div class="mb-8 flex items-center gap-3">
          <NuxtLink to="/account" class="text-sm text-zinc-500 hover:text-brand">
            ჩემი ანგარიში
          </NuxtLink>
          <span class="text-zinc-300">/</span>
          <h1 class="font-display text-2xl font-bold text-zinc-900">ჩემი შეკვეთები</h1>
        </div>

        <!-- Loading -->
        <div v-if="pending" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-28 animate-pulse rounded-2xl bg-zinc-100" />
        </div>

        <!-- Error -->
        <div v-else-if="error" class="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          შეკვეთების ჩატვირთვა ვერ მოხერხდა. განაახლეთ გვერდი.
        </div>

        <!-- Empty -->
        <div v-else-if="!orders?.length" class="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 py-16 text-center">
          <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-zinc-100">
            <Icon :icon="PackageIcon" class="text-xl text-zinc-400" />
          </div>
          <h2 class="font-semibold text-zinc-900">შეკვეთები ჯერ არ არის</h2>
          <p class="mt-1 text-sm text-zinc-500">შეკვეთები გამოჩნდება პირველი შეძენის შემდეგ.</p>
          <NuxtLink
            to="/shop"
            class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            შოპინგის დაწყება
          </NuxtLink>
        </div>

        <!-- Orders list -->
        <div v-else class="space-y-4">
          <div
            v-for="order in orders"
            :key="order.id"
            class="overflow-hidden rounded-2xl border border-zinc-100 bg-white"
          >
            <div class="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div>
                <p class="text-xs font-medium text-zinc-400">შეკვეთა</p>
                <p class="font-display font-semibold text-zinc-900">{{ order.orderNumber }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-medium text-zinc-400">თარიღი</p>
                <p class="text-sm text-zinc-600">{{ formatDate(order.createdAt) }}</p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="statusClass(order.status)"
              >
                {{ statusLabel(order.status) }}
              </span>
            </div>

            <div class="px-5 py-4">
              <p class="text-xs font-medium text-zinc-400">პროდუქტები</p>
              <ul class="mt-1.5 space-y-0.5">
                <li
                  v-for="(item, idx) in order.items.slice(0, 3)"
                  :key="idx"
                  class="flex items-center justify-between text-sm"
                >
                  <span class="text-zinc-700">{{ item.title }} × {{ item.quantity }}</span>
                  <span class="text-zinc-500">{{ formatPrice(item.price * item.quantity) }}</span>
                </li>
                <li v-if="order.items.length > 3" class="text-xs text-zinc-400">
                  + {{ order.items.length - 3 }} პროდუქტი
                </li>
              </ul>
            </div>

            <div class="flex items-center justify-between border-t border-zinc-100 px-5 py-3">
              <span class="text-xs text-zinc-400">
                {{ order.address }}, {{ order.city }}
              </span>
              <span class="font-display font-bold text-zinc-900">{{ formatPrice(order.total) }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PackageIcon from '~/assets/icons/package.svg'
import type { Order, OrderStatus } from '~/types'

definePageMeta({ layout: 'default', middleware: 'auth' })

useSeoMeta({ title: 'ჩემი შეკვეთები — Kuchkucha' })

const authStore = useAuthStore()
const formatPrice = usePriceFormatter()

const { data: ordersData, pending, error } = await useAsyncData('my-orders', () => {
  const token = authStore.getToken()
  return $fetch<{ data: Order[] }>('/api/strapi/orders', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    params: {
      'filters[email][$eq]': authStore.user?.email,
      'sort': 'createdAt:desc',
      'pagination[pageSize]': 20,
    },
  })
})

const orders = computed(() => ordersData.value?.data ?? [])

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ka-GE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr))
}

function statusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'მოლოდინში',
    confirmed: 'დადასტურებული',
    processing: 'მუშავდება',
    shipped: 'გაგზავნილი',
    delivered: 'მიტანილი',
    cancelled: 'გაუქმებული',
  }
  return labels[status] ?? status
}

function statusClass(status: OrderStatus): string {
  const classes: Record<OrderStatus, string> = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    processing: 'bg-purple-50 text-purple-700',
    shipped: 'bg-indigo-50 text-indigo-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-600',
  }
  return classes[status] ?? 'bg-zinc-100 text-zinc-500'
}
</script>
