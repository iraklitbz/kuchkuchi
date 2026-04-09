// Called by Strapi webhooks when content is published/updated/deleted.
// Purges the CDN cache so fresh data is served immediately.
//
// Strapi webhook config:
//   URL: https://kuchkuchi.ge/api/revalidate
//   Headers: { x-webhook-secret: <REVALIDATE_SECRET> }
//   Events: entry.create, entry.update, entry.delete, entry.publish, entry.unpublish

export default defineEventHandler(async (event): Promise<{ ok: boolean; message: string }> => {
  const config = useRuntimeConfig(event)

  // Verify secret
  const secret = getHeader(event, 'x-webhook-secret')
    ?? getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!config.revalidateSecret || secret !== config.revalidateSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or missing webhook secret' })
  }

  // If Cloudflare is configured, purge the zone cache
  const cfToken = process.env.CLOUDFLARE_API_TOKEN
  const cfZoneId = process.env.CLOUDFLARE_ZONE_ID

  if (cfToken && cfZoneId) {
    await $fetch(
      `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfToken}`,
          'Content-Type': 'application/json',
        },
        body: { purge_everything: true },
      },
    )
    return { ok: true, message: 'Cloudflare cache purged' }
  }

  // Without Cloudflare, the CDN will naturally revalidate within s-maxage + stale-while-revalidate (~90s)
  return { ok: true, message: 'No CDN configured — cache will expire naturally' }
})
