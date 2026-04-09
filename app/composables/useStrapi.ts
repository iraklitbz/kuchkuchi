import type { StrapiResponse, Product, Category, Brand } from '~/types'

export function useStrapi() {
  const authStore = useAuthStore()

  function authHeaders(): Record<string, string> {
    const token = authStore.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function strapiGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return $fetch<T>(`/api/strapi/${path}`, {
      params,
      headers: authHeaders(),
    })
  }

  // ─── Products ───────────────────────────────────────────────────────────────

  async function getProducts(opts?: {
    page?: number
    pageSize?: number
  }): Promise<StrapiResponse<Product[]>> {
    return strapiGet<StrapiResponse<Product[]>>('products', {
      'populate[mainImage]': true,
      'populate[categories][fields][0]': 'name',
      'populate[categories][fields][1]': 'slug',
      'populate[brand][fields][0]': 'name',
      'populate[brand][fields][1]': 'slug',
      'filters[isActive][$eq]': true,
      'pagination[page]': opts?.page ?? 1,
      'pagination[pageSize]': opts?.pageSize ?? 24,
      'sort[0]': 'sortOrder:asc',
      'sort[1]': 'createdAt:desc',
    })
  }

  async function getFeaturedProducts(): Promise<StrapiResponse<Product[]>> {
    return strapiGet<StrapiResponse<Product[]>>('products', {
      'populate[mainImage]': true,
      'populate[categories][fields][0]': 'name',
      'populate[categories][fields][1]': 'slug',
      'populate[brand][fields][0]': 'name',
      'filters[featured][$eq]': true,
      'filters[isActive][$eq]': true,
      'pagination[pageSize]': 8,
      'sort[0]': 'sortOrder:asc',
    })
  }

  async function getProductBySlug(slug: string): Promise<StrapiResponse<Product[]>> {
    return strapiGet<StrapiResponse<Product[]>>('products', {
      'populate[mainImage]': true,
      'populate[gallery]': true,
      'populate[categories][fields][0]': 'name',
      'populate[categories][fields][1]': 'slug',
      'populate[brand][fields][0]': 'name',
      'populate[brand][fields][1]': 'slug',
      'populate[brand][populate][logo]': true,
      'populate[specifications]': true,
      'populate[ingredients]': true,
      'filters[slug][$eq]': slug,
      'filters[isActive][$eq]': true,
    })
  }

  async function getProductsByCategory(
    categorySlug: string,
    opts?: { page?: number, pageSize?: number },
  ): Promise<StrapiResponse<Product[]>> {
    return strapiGet<StrapiResponse<Product[]>>('products', {
      'populate[mainImage]': true,
      'populate[categories][fields][0]': 'name',
      'populate[categories][fields][1]': 'slug',
      'filters[categories][slug][$eq]': categorySlug,
      'filters[isActive][$eq]': true,
      'pagination[page]': opts?.page ?? 1,
      'pagination[pageSize]': opts?.pageSize ?? 24,
      'sort[0]': 'sortOrder:asc',
    })
  }

  // ─── Categories ─────────────────────────────────────────────────────────────

  async function getCategories(): Promise<StrapiResponse<Category[]>> {
    return strapiGet<StrapiResponse<Category[]>>('categories', {
      'populate[image]': true,
      'populate[children][fields][0]': 'name',
      'populate[children][fields][1]': 'slug',
      'filters[isActive][$eq]': true,
      'filters[parent][id][$null]': true,
      'sort[0]': 'sortOrder:asc',
    })
  }

  async function getCategoryBySlug(slug: string): Promise<StrapiResponse<Category[]>> {
    return strapiGet<StrapiResponse<Category[]>>('categories', {
      'populate[image]': true,
      'populate[children][fields][0]': 'name',
      'populate[children][fields][1]': 'slug',
      'filters[slug][$eq]': slug,
    })
  }

  // ─── Brands ─────────────────────────────────────────────────────────────────

  async function getBrands(): Promise<StrapiResponse<Brand[]>> {
    return strapiGet<StrapiResponse<Brand[]>>('brands', {
      'populate[logo]': true,
      'filters[isActive][$eq]': true,
      'sort[0]': 'sortOrder:asc',
    })
  }

  return {
    strapiGet,
    getProducts,
    getFeaturedProducts,
    getProductBySlug,
    getProductsByCategory,
    getCategories,
    getCategoryBySlug,
    getBrands,
  }
}
