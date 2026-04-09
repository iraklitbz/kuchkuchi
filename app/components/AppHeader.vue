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
        <span class="font-display text-lg font-bold text-zinc-900">Kuchkuchi</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden items-center gap-6 md:flex">
        <NuxtLink
          to="/"
          class="text-sm font-medium text-zinc-600 transition-colors hover:text-brand"
          active-class="text-brand"
        >
          მთავარი
        </NuxtLink>
        <NuxtLink
          to="/shop"
          class="text-sm font-medium text-zinc-600 transition-colors hover:text-brand"
          active-class="text-brand"
        >
          მაღაზია
        </NuxtLink>

        <!-- Categories mega dropdown -->
        <div class="group relative">
          <button class="flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-brand">
            კატეგორიები
            <Icon :icon="ChevronDownIcon" class="text-xs transition-transform duration-200 group-hover:rotate-180" />
          </button>

          <div class="invisible absolute left-0 top-full z-50 mt-2 rounded-2xl border border-zinc-100 bg-white opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
            <!-- Loading skeleton -->
            <div v-if="categoriesPending" class="flex gap-8 p-5">
              <div v-for="i in 3" :key="i" class="w-28 space-y-2.5">
                <div class="h-3 w-20 animate-pulse rounded bg-zinc-100" />
                <div class="h-2.5 w-16 animate-pulse rounded bg-zinc-100" />
                <div class="h-2.5 w-14 animate-pulse rounded bg-zinc-100" />
                <div class="h-2.5 w-16 animate-pulse rounded bg-zinc-100" />
              </div>
            </div>

            <!-- Real data -->
            <template v-else-if="categories.length">
              <div class="flex flex-wrap gap-x-6 gap-y-4 p-5" style="min-width: 240px; max-width: 560px">
                <div v-for="cat in categories" :key="cat.id" class="min-w-[110px]">
                  <NuxtLink
                    :to="`/category/${cat.slug}`"
                    class="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-800 transition-colors hover:text-brand"
                  >
                    {{ cat.name }}
                  </NuxtLink>
                  <template v-if="cat.children?.length">
                    <NuxtLink
                      v-for="child in cat.children"
                      :key="child.id"
                      :to="`/category/${child.slug}`"
                      class="block py-0.5 text-sm text-zinc-500 transition-colors hover:text-brand"
                    >
                      {{ child.name }}
                    </NuxtLink>
                  </template>
                </div>
              </div>
              <div class="border-t border-zinc-100 px-5 py-2.5">
                <NuxtLink
                  to="/shop"
                  class="text-xs font-medium text-brand transition-opacity hover:opacity-70"
                >
                  ყველა პროდუქტი →
                </NuxtLink>
              </div>
            </template>

            <template v-else>
              <p class="px-5 py-4 text-xs text-zinc-400">კატეგორიები არ არის.</p>
            </template>
          </div>
        </div>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-1">
        <!-- Search -->
        <div class="relative">
          <button
            class="flex size-9 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="ძიება"
            @click="toggleSearch"
          >
            <Icon :icon="SearchIcon" />
          </button>

          <Transition name="fade-scale">
            <div
              v-if="searchOpen"
              class="absolute right-0 top-full z-50 mt-2 w-[min(92vw,22rem)] rounded-2xl border border-zinc-200 bg-white p-3 shadow-2xl"
            >
              <form @submit.prevent="submitSearch">
                <label class="sr-only" for="header-search">პროდუქტის ძიება</label>
                <div class="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
                  <Icon :icon="SearchIcon" class="text-zinc-400" />
                  <input
                    id="header-search"
                    ref="searchInput"
                    v-model="searchTerm"
                    type="search"
                    autocomplete="off"
                    placeholder="პროდუქტის ძიება..."
                    class="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                    @keydown.esc.prevent="closeSearch"
                  />
                </div>
              </form>
              <p class="mt-2 px-1 text-xs text-zinc-400">
                ძიება სახელით, SKU-ით, ბრენდით ან კატეგორიით.
              </p>
            </div>
          </Transition>
        </div>

        <!-- Cart -->
        <button
          class="relative flex size-9 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
          aria-label="კალათა"
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
              :aria-label="`ანგარიში: ${authStore.user?.username}`"
            >
              {{ authStore.userInitial }}
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="flex size-9 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
              aria-label="შესვლა"
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
          aria-label="მენიუ"
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
            მთავარი
          </NuxtLink>
          <NuxtLink
            to="/shop"
            class="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-brand"
            active-class="bg-brand/5 text-brand"
            @click="mobileOpen = false"
          >
            მაღაზია
          </NuxtLink>

          <!-- Mobile Categories expandable -->
          <div>
            <button
              class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              @click="mobileCatsOpen = !mobileCatsOpen"
            >
              <span>კატეგორიები</span>
              <Icon
                :icon="ChevronDownIcon"
                class="text-xs transition-transform duration-200"
                :class="mobileCatsOpen ? 'rotate-180' : ''"
              />
            </button>
            <Transition name="slide-down">
              <div v-if="mobileCatsOpen" class="mt-1 space-y-0.5 pl-2">
                <p v-if="categoriesPending" class="px-3 py-2 text-xs text-zinc-400">იტვირთება...</p>
                <template v-else>
                  <template v-for="cat in categories" :key="cat.id">
                    <NuxtLink
                      :to="`/category/${cat.slug}`"
                      class="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-brand"
                      @click="mobileOpen = false; mobileCatsOpen = false"
                    >
                      {{ cat.name }}
                    </NuxtLink>
                    <NuxtLink
                      v-for="child in cat.children"
                      :key="child.id"
                      :to="`/category/${child.slug}`"
                      class="block rounded-lg py-1.5 pl-7 pr-3 text-xs text-zinc-500 transition-colors hover:text-brand"
                      @click="mobileOpen = false; mobileCatsOpen = false"
                    >
                      {{ child.name }}
                    </NuxtLink>
                  </template>
                  <NuxtLink
                    to="/shop"
                    class="block rounded-lg px-3 py-2 text-xs font-medium text-brand hover:bg-brand/5"
                    @click="mobileOpen = false; mobileCatsOpen = false"
                  >
                    ყველა პროდუქტი →
                  </NuxtLink>
                </template>
              </div>
            </Transition>
          </div>

          <div class="my-1 border-t border-zinc-100" />

          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              to="/account"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              @click="mobileOpen = false"
            >
              ჩემი ანგარიში
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              @click="mobileOpen = false"
            >
              შესვლა
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-brand hover:bg-brand/5"
              @click="mobileOpen = false"
            >
              რეგისტრაცია
            </NuxtLink>
          </template>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import type { Category } from '~/types'
import CartIcon from '~/assets/icons/cart.svg'
import UserIcon from '~/assets/icons/user.svg'
import SearchIcon from '~/assets/icons/search.svg'
import MenuIcon from '~/assets/icons/menu.svg'
import CloseIcon from '~/assets/icons/close.svg'
import ChevronDownIcon from '~/assets/icons/chevron-down.svg'

const authStore = useAuthStore()
const cartStore = useCartStore()
const { getCategories } = useStrapi()

const mobileOpen = ref(false)
const mobileCatsOpen = ref(false)
const searchOpen = ref(false)
const searchTerm = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const { data: categoriesData, pending: categoriesPending } = useLazyAsyncData(
  'nav-categories',
  () => getCategories(),
)
const categories = computed(() => (categoriesData.value?.data ?? []) as Category[])

const router = useRouter()

router.afterEach(() => {
  mobileOpen.value = false
  mobileCatsOpen.value = false
  closeSearch()
})

function openSearch() {
  searchOpen.value = true
  nextTick(() => searchInput.value?.focus())
}

function closeSearch() {
  searchOpen.value = false
  searchTerm.value = ''
}

function toggleSearch() {
  if (searchOpen.value) {
    closeSearch()
    return
  }
  openSearch()
}

async function submitSearch() {
  const term = searchTerm.value.trim()
  closeSearch()
  await router.push(term ? { path: '/shop', query: { q: term } } : '/shop')
}
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

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
