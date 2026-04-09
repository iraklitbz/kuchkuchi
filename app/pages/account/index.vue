<template>
  <div class="min-h-[calc(100vh-4rem)] py-12">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="mx-auto max-w-2xl">

        <h1 class="font-display mb-8 text-2xl font-bold text-zinc-900">ჩემი ანგარიში</h1>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Profile card -->
          <div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-card">
            <div class="mb-4 flex items-center gap-3">
              <div class="flex size-12 items-center justify-center rounded-full bg-brand/10 text-lg font-bold text-brand">
                {{ authStore.userInitial }}
              </div>
              <div>
                <p class="font-semibold text-zinc-900">{{ authStore.user?.username }}</p>
                <p class="text-xs text-zinc-500">{{ authStore.user?.email }}</p>
              </div>
            </div>
            <div class="space-y-2 border-t border-zinc-100 pt-4">
              <div class="flex items-center justify-between">
                <span class="text-xs text-zinc-400">სტატუსი</span>
                <span
                  class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="authStore.user?.confirmed ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'"
                >
                  <span class="size-1.5 rounded-full" :class="authStore.user?.confirmed ? 'bg-green-500' : 'bg-yellow-500'" />
                  {{ authStore.user?.confirmed ? 'დადასტურებული' : 'დაუდასტურებელი' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Orders card -->
          <NuxtLink
            to="/account/orders"
            class="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div class="mb-3 flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon :icon="PackageIcon" class="text-lg" />
            </div>
            <h2 class="font-semibold text-zinc-900">ჩემი შეკვეთები</h2>
            <p class="mt-1 text-sm text-zinc-500">ნახეთ შეკვეთების ისტორია</p>
            <div class="mt-3 flex items-center gap-1 text-xs font-medium text-brand">
              შეკვეთების ნახვა
              <Icon :icon="ChevronRightIcon" class="text-xs transition-transform group-hover:translate-x-0.5" />
            </div>
          </NuxtLink>
        </div>

        <!-- Logout -->
        <div class="mt-6">
          <button
            class="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            @click="handleLogout"
          >
            <Icon :icon="LogoutIcon" />
            გასვლა
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PackageIcon from '~/assets/icons/package.svg'
import ChevronRightIcon from '~/assets/icons/chevron-right.svg'
import LogoutIcon from '~/assets/icons/logout.svg'

definePageMeta({ layout: 'default', middleware: 'auth' })

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>
