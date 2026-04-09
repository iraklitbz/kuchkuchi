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
        <h1 class="font-display text-2xl font-bold text-zinc-900">Set new password</h1>
        <p class="mt-2 text-sm text-zinc-500">Choose a strong password for your account</p>
      </div>

      <!-- No code -->
      <div v-if="!code" class="rounded-xl border border-red-100 bg-red-50 px-5 py-6 text-center">
        <p class="text-sm text-red-600">Invalid or expired reset link.</p>
        <NuxtLink to="/forgot-password" class="mt-3 inline-block text-sm font-medium text-brand hover:underline">
          Request a new link
        </NuxtLink>
      </div>

      <!-- Success -->
      <div v-else-if="success" class="rounded-xl border border-green-100 bg-green-50 px-5 py-6 text-center">
        <div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-green-100">
          <svg class="size-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h2 class="font-semibold text-zinc-900">Password updated!</h2>
        <p class="mt-1 text-sm text-zinc-500">Your password has been changed successfully.</p>
        <NuxtLink to="/account" class="mt-4 inline-block text-sm font-medium text-brand hover:underline">
          Go to My Account
        </NuxtLink>
      </div>

      <!-- Form -->
      <form v-else class="space-y-4" @submit.prevent="handleReset">
        <div v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {{ error }}
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-zinc-700">New Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            autocomplete="new-password"
            class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-brand focus:ring-2 focus:ring-brand/10"
            placeholder="Min. 8 characters"
          />
          <ul v-if="form.password.length > 0" class="mt-2 space-y-1">
            <li
              v-for="rule in passwordRules"
              :key="rule.label"
              class="flex items-center gap-1.5 text-xs"
              :class="rule.valid ? 'text-green-600' : 'text-zinc-400'"
            >
              <svg class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path v-if="rule.valid" d="M20 6L9 17l-5-5"/>
                <circle v-else cx="12" cy="12" r="9"/>
              </svg>
              {{ rule.label }}
            </li>
          </ul>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-zinc-700">Confirm New Password</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            autocomplete="new-password"
            class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-brand focus:ring-2 focus:ring-brand/10"
            placeholder="Repeat your password"
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
          Update Password
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const authStore = useAuthStore()

const code = computed(() => route.query.code as string | undefined)
const form = reactive({ password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

const passwordRules = computed(() => [
  { label: 'At least 8 characters', valid: form.password.length >= 8 },
  { label: 'At least one uppercase letter', valid: /[A-Z]/.test(form.password) },
  { label: 'At least one special character', valid: /[^A-Za-z0-9]/.test(form.password) },
])

const passwordValid = computed(() => passwordRules.value.every(r => r.valid))

async function handleReset() {
  if (!passwordValid.value) {
    error.value = 'Password does not meet the requirements.'
    return
  }
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }
  if (!code.value) return
  loading.value = true
  error.value = ''
  try {
    await authStore.resetPassword(code.value, form.password, form.confirmPassword)
    success.value = true
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
