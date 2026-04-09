<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
    <div class="w-full max-w-md text-center">

      <NuxtLink to="/" class="mb-8 inline-flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/dketlufwl/image/upload/v1775286358/kutch_kutchi_logo_60cm_b96b40d732.jpg"
          alt="Kuchkucha"
          class="mx-auto size-40 rounded-full object-cover"
        />
      </NuxtLink>

      <div v-if="status === 'loading'" class="mt-6">
        <svg class="mx-auto size-8 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="mt-4 text-sm text-zinc-500">Signing you in...</p>
      </div>

      <div v-else-if="status === 'error'" class="mt-6">
        <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-100">
          <svg class="size-7 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <p class="text-sm text-zinc-500">{{ errorMessage }}</p>
        <NuxtLink to="/login" class="mt-4 inline-block text-sm font-medium text-brand hover:underline">
          Back to Sign In
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', ssr: false })

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()

type Status = 'loading' | 'error'
const status = ref<Status>('loading')
const errorMessage = ref('')

onMounted(async () => {
  const accessToken = route.query.access_token as string | undefined

  if (!accessToken) {
    errorMessage.value = 'Authentication failed. Please try again.'
    status.value = 'error'
    return
  }

  try {
    // Strapi JWTs start with 'eyJ'. If Strapi forwards a raw OAuth token,
    // exchange it for a Strapi JWT first.
    if (accessToken.startsWith('eyJ')) {
      await authStore.loginWithToken(accessToken)
    }
    else {
      const { jwt } = await $fetch<{ jwt: string }>(
        `${config.public.strapiUrl}/api/auth/google/callback`,
        { query: { access_token: accessToken } },
      )
      await authStore.loginWithToken(jwt)
    }
    await router.push('/account')
  }
  catch (err) {
    console.error('[OAuth Callback] error:', err)
    errorMessage.value = 'Authentication failed. Please try again.'
    status.value = 'error'
  }
})
</script>
