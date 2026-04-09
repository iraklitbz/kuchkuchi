interface OrderPayload {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address: string
  city: string
  notes?: string
  items: Array<{
    productId: number
    title: string
    price: number
    quantity: number
    imageUrl?: string
  }>
  subtotal: number
  discount: number
  total: number
  couponCode?: string
}

export default defineEventHandler(async (event): Promise<unknown> => {
  const config = useRuntimeConfig(event)
  const body = await readBody<OrderPayload>(event)

  // Optional: forward user JWT if authenticated
  const incomingAuth = getHeader(event, 'authorization')

  const orderNumber = `KK-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.strapiToken}`,
    'Content-Type': 'application/json',
  }

  // If user is authenticated, include their JWT for relation linking on Strapi side
  if (incomingAuth) {
    headers['X-User-Authorization'] = incomingAuth
  }

  return $fetch(`${config.public.strapiUrl}/api/orders`, {
    method: 'POST',
    headers,
    body: {
      data: {
        orderNumber,
        status: 'pending',
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone ?? '',
        address: body.address,
        city: body.city,
        notes: body.notes ?? '',
        items: body.items,
        subtotal: body.subtotal,
        discount: body.discount,
        total: body.total,
        couponCode: body.couponCode ?? '',
      },
    },
  })
})
