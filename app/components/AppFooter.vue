<template>
  <footer class="border-t border-zinc-100 bg-zinc-50">
    <div class="container mx-auto px-4 py-12 lg:px-6">
      <div class="grid gap-8 md:grid-cols-3 lg:grid-cols-4">

        <!-- Brand -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-2.5">
            <img
              src="https://res.cloudinary.com/dketlufwl/image/upload/v1775286358/kutch_kutchi_logo_60cm_b96b40d732.jpg"
              alt="Kuchkucha"
              class="size-10 rounded-full object-cover"
            />
            <span class="font-display text-xl font-bold text-zinc-900">Kuchkucha</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
            Quality Georgian products delivered to your door.
          </p>
          <div class="mt-4 flex items-center gap-3">
            <a
              href="#"
              target="_blank"
              rel="noopener"
              class="flex size-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700"
              aria-label="Instagram"
            >
              <Icon :icon="InstagramIcon" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener"
              class="flex size-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700"
              aria-label="Facebook"
            >
              <Icon :icon="FacebookIcon" />
            </a>
          </div>
        </div>

        <!-- Shop links -->
        <div>
          <h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Shop</h3>
          <ul class="space-y-2.5">
            <li v-for="link in shopLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm text-zinc-500 transition-colors hover:text-brand"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Account links -->
        <div>
          <h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Account</h3>
          <ul class="space-y-2.5">
            <li v-for="link in accountLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm text-zinc-500 transition-colors hover:text-brand"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 sm:flex-row">
        <p class="text-xs text-zinc-400">
          &copy; {{ new Date().getFullYear() }} Kuchkucha. All rights reserved.
        </p>
        <div class="flex items-center gap-4">
          <NuxtLink to="/privacy-policy" class="text-xs text-zinc-400 transition-colors hover:text-brand">
            Privacy Policy
          </NuxtLink>
          <NuxtLink to="/terms-of-service" class="text-xs text-zinc-400 transition-colors hover:text-brand">
            Terms of Service
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import InstagramIcon from '~/assets/icons/instagram.svg'
import FacebookIcon from '~/assets/icons/facebook.svg'

const shopLinks = [
  { label: 'All Products', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?sort=new' },
  { label: 'Featured', to: '/shop?featured=true' },
  { label: 'Categories', to: '/shop' },
]

const accountLinks = [
  { label: 'My Account', to: '/account' },
  { label: 'My Orders', to: '/account/orders' },
  { label: 'Sign In', to: '/login' },
  { label: 'Register', to: '/register' },
]
</script>
