import type { Product } from '~/types'

const STORAGE_KEY = 'kuchkucha_recently_viewed'
const MAX_ITEMS = 8

export function useRecentlyViewed() {
  const recentlyViewed = ref<Product[]>([])

  function load(): Product[] {
    if (!import.meta.client) return []
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    }
    catch {
      return []
    }
  }

  function trackProduct(product: Product) {
    if (!import.meta.client) return
    // Store a lightweight snapshot (skip heavy fields)
    const snapshot: Product = {
      id: product.id,
      documentId: product.documentId,
      title: product.title,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      isActive: product.isActive,
      featured: product.featured,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      mainImage: product.mainImage,
      categories: product.categories,
      brand: product.brand,
    }
    const current = load().filter(p => p.id !== product.id)
    const updated = [snapshot, ...current].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    recentlyViewed.value = updated
  }

  onMounted(() => {
    recentlyViewed.value = load()
  })

  return { recentlyViewed, trackProduct }
}
