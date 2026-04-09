<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">

      <div class="mb-8 text-center">
        <NuxtLink to="/" class="mb-6 inline-flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dketlufwl/image/upload/v1775286358/kutch_kutchi_logo_60cm_b96b40d732.jpg"
            alt="Kuchkucha"
            class="mx-auto size-40 rounded-full object-cover"
          />
        </NuxtLink>
        <h1 class="font-display text-2xl font-bold text-zinc-900">Reset your password</h1>
        <p class="mt-2 text-sm text-zinc-500">Enter your email and we'll send you a reset link</p>
      </div>

      <!-- Success -->
      <div v-if="sent" class="rounded-xl border border-green-100 bg-green-50 px-5 py-6 text-center">
        <div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-green-100">
          <svg class="size-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h2 class="font-semibold text-zinc-900">Email sent!</h2>
        <p class="mt-1 text-sm text-zinc-500">Check your inbox for the password reset link.</p>
        <NuxtLink to="/login" class="mt-4 inline-block text-sm font-medium text-brand hover:underline">
          Back to Sign In
        </NuxtLink>
      </div>

      <!-- Form -->
      <form v-else class="space-y-4" @submit.prevent="handleSubmit">
        <div v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {{ error }}
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-brand focus:ring-2 focus:ring-brand/10"
            placeholder="your@email.com"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg v-if="loading" class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Send Reset Link
        </button>

        <p class="text-center text-sm text-zinc-500">
          <NuxtLink to="/login" class="font-medium text-brand hover:underline">Back to Sign In</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const authStore = useAuthStore()

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await authStore.forgotPassword(email.value)
    sent.value = true
  }
  catch (err: unknown) {
    const e = err as { data?: { error?: { message?: string } } }
    error.value = e?.data?.error?.message ?? 'An error occurred. Please try again.'
  }
  finally {
    loading.value = false
  }
}
</script>
