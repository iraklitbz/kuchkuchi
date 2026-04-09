import type { Product } from '~/types'

export function useQuickView() {
  const product = useState<Product | null>('quick-view-product', () => null)

  function open(p: Product) {
    product.value = p
  }

  function close() {
    product.value = null
  }

  return { product, open, close }
}
