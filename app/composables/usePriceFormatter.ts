export function usePriceFormatter() {
  function formatPrice(amount: number): string {
    const safeAmount = Number.isFinite(amount) ? amount : 0
    const [whole, fraction] = safeAmount.toFixed(2).split('.')
    const normalizedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return `GEL ${normalizedWhole}.${fraction}`
  }

  return formatPrice
}
