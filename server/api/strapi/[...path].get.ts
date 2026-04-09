export default defineEventHandler(async (event): Promise<unknown> => {
  const config = useRuntimeConfig(event)
  const pathParam = getRouterParam(event, 'path') ?? ''
  const rawSearch = getRequestURL(event).search
  const strapiPath = pathParam + rawSearch

  const incomingAuth = getHeader(event, 'authorization')
  const auth = incomingAuth ?? `Bearer ${config.strapiToken}`
  const isAuthenticatedRequest = Boolean(incomingAuth)

  setHeader(event, 'Vary', 'Authorization')
  if (isAuthenticatedRequest) {
    // No cachear respuestas con JWT de usuario
    setHeader(event, 'Cache-Control', 'private, no-store')
  }
  else {
    // Cache para CDN (Cloudflare/Vercel Edge), no para el navegador.
    // stale-while-revalidate corto para que cambios en Strapi sean visibles en ~90s.
    setHeader(event, 'Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=30')
  }

  return $fetch(`${config.public.strapiUrl}/api/${strapiPath}`, {
    headers: { Authorization: auth },
  })
})
