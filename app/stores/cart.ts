import { defineStore } from 'pinia'
import type { CartItem, Product } from '~/types'

interface AppliedCoupon {
  code: string
  discountType: 'percentage' | 'fixed'
  value: number
  minimumSubtotal?: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)
  const appliedCoupon = ref<AppliedCoupon | null>(null)
  const couponError = ref('')
  const couponLoading = ref(false)

  // ─── Computed ───────────────────────────────────────────────────────────────

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price
      return sum + price * item.quantity
    }, 0),
  )

  const discount = computed(() => {
    if (!appliedCoupon.value) return 0
    if (appliedCoupon.value.discountType === 'percentage') {
      return Math.round(subtotal.value * appliedCoupon.value.value) / 100
    }
    return Math.min(appliedCoupon.value.value, subtotal.value)
  })

  const total = computed(() => Math.max(0, subtotal.value - discount.value))

  const isEmpty = computed(() => items.value.length === 0)

  // ─── Cart actions ────────────────────────────────────────────────────────────

  function addItem(product: Product, quantity = 1): void {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    }
    else {
      items.value.push({ product, quantity })
    }
    isOpen.value = true
    persist()
  }

  function removeItem(productId: number): void {
    items.value = items.value.filter(i => i.product.id !== productId)
    persist()
  }

  function updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      item.quantity = quantity
      persist()
    }
  }

  function clear(): void {
    items.value = []
    appliedCoupon.value = null
    couponError.value = ''
    persist()
  }

  function openCart(): void { isOpen.value = true }
  function closeCart(): void { isOpen.value = false }

  // ─── Coupon ─────────────────────────────────────────────────────────────────

  async function applyCoupon(code: string): Promise<void> {
    couponError.value = ''
    couponLoading.value = true

    try {
      const res = await $fetch<{ data: Array<{
        id: number
        code: string
        discountType: 'percentage' | 'fixed'
        value: number
        isActive: boolean
        minimumSubtotal?: number
        startsAt?: string
        endsAt?: string
      }> }>('/api/strapi/coupons', {
        params: {
          'filters[code][$eqi]': code.trim(),
          'filters[isActive][$eq]': true,
          'pagination[pageSize]': 1,
        },
      })

      const coupon = res.data?.[0]

      if (!coupon) {
        couponError.value = 'Invalid or expired coupon code.'
        return
      }

      const now = new Date()
      if (coupon.startsAt && new Date(coupon.startsAt) > now) {
        couponError.value = 'This coupon is not active yet.'
        return
      }
      if (coupon.endsAt && new Date(coupon.endsAt) < now) {
        couponError.value = 'This coupon has expired.'
        return
      }
      if (coupon.minimumSubtotal && subtotal.value < coupon.minimumSubtotal) {
        couponError.value = `Minimum order of ${coupon.minimumSubtotal} ₾ required.`
        return
      }

      appliedCoupon.value = {
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
        minimumSubtotal: coupon.minimumSubtotal,
      }
    }
    catch {
      couponError.value = 'Could not validate coupon. Please try again.'
    }
    finally {
      couponLoading.value = false
    }
  }

  function removeCoupon(): void {
    appliedCoupon.value = null
    couponError.value = ''
  }

  // ─── Persistence ────────────────────────────────────────────────────────────

  function persist(): void {
    if (import.meta.client) {
      try {
        localStorage.setItem('kuchkucha_cart', JSON.stringify({
          items: items.value,
          coupon: appliedCoupon.value,
        }))
      }
      catch { /* ignore */ }
    }
  }

  function restore(): void {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem('kuchkucha_cart')
        if (saved) {
          const parsed = JSON.parse(saved)
          items.value = parsed.items ?? parsed ?? []
          appliedCoupon.value = parsed.coupon ?? null
        }
      }
      catch {
        items.value = []
      }
    }
  }

  return {
    items,
    isOpen,
    appliedCoupon,
    couponError,
    couponLoading,
    count,
    subtotal,
    discount,
    total,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    openCart,
    closeCart,
    applyCoupon,
    removeCoupon,
    restore,
  }
})
