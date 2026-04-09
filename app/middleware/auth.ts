export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  if (!authStore.getToken()) {
    return navigateTo('/login')
  }
})
