<template>
  <header class="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
    <div class="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <img
          src="https://res.cloudinary.com/dketlufwl/image/upload/v1775286358/kutch_kutchi_logo_60cm_b96b40d732.jpg"
          alt="Kuchkucha"
          class="size-11 rounded-full object-cover ring-2 ring-brand/20"
        />
        <span class="font-display text-lg font-bold text-zinc-900">Kuchkucha</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden items-center gap-6 md:flex">
        <NuxtLink
          to="/"
          class="text-sm font-medium text-zinc-600 transition-colors hover:text-brand"
          active-class="text-brand"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/shop"
          class="text-sm font-medium text-zinc-600 transition-colors hover:text-brand"
          active-class="text-brand"
        >
          Shop
        </NuxtLink>

        <!-- Categories dropdown -->
        <div class="group relative">
          <button class="flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-brand">
            Categories
            <Icon :icon="ChevronDownIcon" class="text-xs transition-transform group-hover:rotate-180" />
          </button>
          <div class="invisible absolute left-0 top-full z-50 mt-1 min-w-48 rounded-xl border border-zinc-100 bg-white py-1.5 opacity-0 shadow-card transition-all group-hover:visible group-hover:opacity-100">
            <p class="px-4 py-2 text-xs text-zinc-400">Loading categories...</p>
          </div>
        </div>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-1">
        <!-- Search (future) -->
        <button
          class="flex size-9 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
          aria-label="Search"
        >
          <Icon :icon="SearchIcon" />
        </button>

        <!-- Cart -->
        <button
          class="relative flex size-9 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
          aria-label="Cart"
          @click="cartStore.openCart()"
        >
          <Icon :icon="CartIcon" />
          <ClientOnly>
            <span
              v-if="cartStore.count > 0"
              class="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white"
            >
              {{ cartStore.count > 99 ? '99+' : cartStore.count }}
            </span>
          </ClientOnly>
        </button>

        <!-- Account -->
        <ClientOnly>
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              to="/account"
              class="flex size-9 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand transition-colors hover:bg-brand/20"
              :aria-label="`Account: ${authStore.user?.username}`"
            >
              {{ authStore.userInitial }}
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="flex size-9 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
              aria-label="Login"
            >
              <Icon :icon="UserIcon" />
            </NuxtLink>
          </template>
          <template #fallback>
            <div class="size-9" />
          </template>
        </ClientOnly>

        <!-- Mobile menu button -->
        <button
          class="flex size-9 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 md:hidden"
          aria-label="Menu"
          @click="mobileOpen = !mobileOpen"
        >
          <Icon v-if="!mobileOpen" :icon="MenuIcon" />
          <Icon v-else :icon="CloseIcon" />
        </button>
      </div>
    </div>

    <!-- Mobile Nav -->
    <Transition name="slide-down">
      <div v-if="mobileOpen" class="border-t border-zinc-100 bg-white md:hidden">
        <nav class="container mx-auto flex flex-col gap-1 px-4 py-3">
          <NuxtLink
            to="/"
            class="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-brand"
            active-class="bg-brand/5 text-brand"
            @click="mobileOpen = false"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/shop"
            class="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-brand"
            active-class="bg-brand/5 text-brand"
            @click="mobileOpen = false"
          >
            Shop
          </NuxtLink>
          <NuxtLink
            to="/shop"
            class="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-brand"
            active-class="bg-brand/5 text-brand"
            @click="mobileOpen = false"
          >
            Categories
          </NuxtLink>
          <div class="my-1 border-t border-zinc-100" />
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              to="/account"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              @click="mobileOpen = false"
            >
              My Account
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              @click="mobileOpen = false"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-brand hover:bg-brand/5"
              @click="mobileOpen = false"
            >
              Create Account
            </NuxtLink>
          </template>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import CartIcon from '~/assets/icons/cart.svg'
import UserIcon from '~/assets/icons/user.svg'
import SearchIcon from '~/assets/icons/search.svg'
import MenuIcon from '~/assets/icons/menu.svg'
import CloseIcon from '~/assets/icons/close.svg'
import ChevronDownIcon from '~/assets/icons/chevron-down.svg'

const authStore = useAuthStore()
const cartStore = useCartStore()

const mobileOpen = ref(false)

// Close mobile menu on route change
const router = useRouter()
router.afterEach(() => { mobileOpen.value = false })
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
