<template>
  <div class="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-800">
    <AppHeader />

    <main class="flex-1">
      <section class="container mx-auto px-4 py-10 lg:px-6 lg:py-16">
        <div class="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(24,24,27,0.08)]">
          <div class="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div class="p-6 sm:p-8 lg:p-12">
              <div class="inline-flex items-center gap-3">
                <img
                  src="https://res.cloudinary.com/dketlufwl/image/upload/v1775286358/kutch_kutchi_logo_60cm_b96b40d732.jpg"
                  alt="Kuchkucha"
                  class="size-14 rounded-full object-cover ring-4 ring-brand/10"
                />
                <span class="font-display text-lg font-bold text-zinc-900">Kuchkuchi</span>
              </div>

              <div class="mt-8 inline-flex items-center rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                {{ isNotFound ? '404' : `Error ${statusCode}` }}
              </div>

              <h1 class="font-display mt-5 max-w-xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
                {{ title }}
              </h1>

              <p class="mt-4 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
                {{ description }}
              </p>

              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                <NuxtLink
                  to="/"
                  class="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  @click="clearErrorState('/')"
                >
                  {{ isNotFound ? 'მთავარ გვერდზე დაბრუნება' : 'მთავარ გვერდზე გადასვლა' }}
                </NuxtLink>
                <NuxtLink
                  to="/shop"
                  class="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                  @click="clearErrorState('/shop')"
                >
                  მაღაზიაში გადასვლა
                </NuxtLink>
              </div>

              <div v-if="details" class="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  ტექნიკური დეტალები
                </p>
                <p class="mt-2 text-sm leading-6 text-zinc-600">
                  {{ details }}
                </p>
              </div>
            </div>

            <div class="relative flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.14),transparent_60%),linear-gradient(180deg,#fffaf3,#fff)] px-6 py-12 sm:px-8 lg:px-10">
              <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),transparent_45%)]" />

              <div class="w-full max-w-sm rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(24,24,27,0.08)] backdrop-blur">
                <div class="mx-auto flex size-24 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-brand to-amber-500 text-white shadow-lg shadow-brand/20">
                  <span class="font-display text-4xl font-bold leading-none">
                    {{ statusCode }}
                  </span>
                </div>

                <div class="mt-6 text-center">
                  <p class="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-400">
                    {{ isNotFound ? 'გვერდი არ მოიძებნა' : 'შეცდომა' }}
                  </p>
                  <p class="mt-3 text-sm leading-6 text-zinc-500">
                    {{ errorHint }}
                  </p>
                </div>

                <div class="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                  <p class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    რა შეგიძლიათ სცადოთ
                  </p>
                  <ul class="mt-3 space-y-2 text-sm leading-6 text-zinc-600">
                    <li>• დაბრუნდით მთავარ გვერდზე ან მაღაზიაში</li>
                    <li>• გადაამოწმეთ მისამართი</li>
                    <li>• თუ ეს შეცდომა გაგრძელდა, სცადეთ მოგვიანებით</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error.statusCode ?? 500)
const isNotFound = computed(() => statusCode.value === 404)

const title = computed(() => {
  if (isNotFound.value) return 'გვერდი ვერ მოიძებნა'
  return 'სამწუხაროდ, რაღაც შეიცვალა'
})

const description = computed(() => {
  if (isNotFound.value) {
    return 'მოთხოვნილი გვერდი აღარ არის ხელმისაწვდომი ან არასოდეს არსებობდა. შეგიძლიათ დაბრუნდეთ მთავარ გვერდზე ან გააგრძელოთ მაღაზიაში.'
  }
  return 'ვერ ჩავტვირთეთ გვერდი. ეს შეიძლება იყოს დროებითი პრობლემა ჩვენს მხარეს ან Strapi-ის პასუხის შეცდომა.'
})

const errorHint = computed(() => {
  if (isNotFound.value) {
    return 'გვერდი ან წაშლილია, ან მისამართი შეცვლილია.'
  }
  return 'შეიძლება დროებითი შეცდომა იყოს. სცადეთ თავიდან ან დაუბრუნდით ცოტა ხანში.'
})

const details = computed(() => {
  if (import.meta.dev) {
    return props.error.statusMessage || props.error.message || ''
  }
  if (isNotFound.value) return ''
  return props.error.statusMessage || ''
})

useSeoMeta({
  title: computed(() => `${statusCode.value} — Kuchkucha`),
  robots: 'noindex, nofollow',
})

function clearErrorState(redirect: string) {
  clearError({ redirect })
}
</script>
