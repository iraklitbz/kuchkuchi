import { defineStore } from 'pinia'
import type { User, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.strapiUrl

  // Token persisted in cookie (30 days). Pinia unwraps the ref:
  // store.token === string | null  (NOT Ref<string | null>)
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  })

  const user = ref<User | null>(null)
  const authReady = ref(false)

  // Computed — use token.value because we're INSIDE the store
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userInitial = computed(() => {
    const name = user.value?.username
    if (!name) return '?'
    return name.charAt(0).toUpperCase()
  })

  // ─── Actions ────────────────────────────────────────────────────────────────

  async function login(email: string, password: string): Promise<void> {
    const data = await $fetch<AuthResponse>(`${baseUrl}/api/auth/local`, {
      method: 'POST',
      body: { identifier: email, password },
    })
    token.value = data.jwt
    user.value = data.user
  }

  async function register(username: string, email: string, password: string): Promise<void> {
    await $fetch<AuthResponse>(`${baseUrl}/api/auth/local/register`, {
      method: 'POST',
      body: { username, email, password },
    })
  }

  function logout(): void {
    token.value = null
    user.value = null
  }

  async function fetchUser(): Promise<void> {
    if (!token.value) return
    try {
      const data = await $fetch<User>(`${baseUrl}/api/users/me?populate=role`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = data
    }
    catch {
      token.value = null
      user.value = null
    }
  }

  async function forgotPassword(email: string): Promise<void> {
    await $fetch(`${baseUrl}/api/auth/forgot-password`, {
      method: 'POST',
      body: { email },
    })
  }

  async function resetPassword(
    code: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<void> {
    const data = await $fetch<AuthResponse>(`${baseUrl}/api/auth/reset-password`, {
      method: 'POST',
      body: { code, password, passwordConfirmation },
    })
    token.value = data.jwt
    user.value = data.user
  }

  async function confirmEmail(confirmation: string): Promise<void> {
    const data = await $fetch<AuthResponse>(
      `${baseUrl}/api/auth/email-confirmation?confirmation=${confirmation}`,
    )
    token.value = data.jwt
    user.value = data.user
  }

  async function resendConfirmation(email: string): Promise<void> {
    await $fetch(`${baseUrl}/api/auth/send-email-confirmation`, {
      method: 'POST',
      body: { email },
    })
  }

  async function loginWithToken(jwt: string): Promise<void> {
    try {
      const data = await $fetch<User>(`${baseUrl}/api/users/me?populate=role`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      token.value = jwt
      user.value = data
    }
    catch (err) {
      token.value = null
      user.value = null
      throw err
    }
  }

  function connectWithProvider(provider: 'google') {
    window.location.href = `${baseUrl}/api/connect/${provider}`
  }

  // Expose the raw cookie ref so plugins/middleware can access .value
  // (they run in Nuxt context where $pinia is not yet set up via storeToRefs)
  function getToken(): string | null {
    return token.value
  }

  return {
    // State (Pinia unwraps refs — outside code uses store.user, store.authReady)
    user,
    authReady,
    // Computed
    isAuthenticated,
    userInitial,
    // Token accessor (avoids Pinia ref-unwrapping confusion)
    getToken,
    // Actions
    login,
    register,
    logout,
    fetchUser,
    forgotPassword,
    resetPassword,
    confirmEmail,
    resendConfirmation,
    loginWithToken,
    connectWithProvider,
  }
})
