export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const cartStore = useCartStore()

  // Restore cart from localStorage
  cartStore.restore()

  // Restore auth session from cookie
  if (authStore.getToken()) {
    await authStore.fetchUser()
  }
  authStore.authReady = true
})
