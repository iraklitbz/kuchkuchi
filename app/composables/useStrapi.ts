import type { StrapiResponse, Product, Category, Brand } from '~/types'

export function useStrapi() {
  const authStore = useAuthStore()

  function strapiPublicGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return $fetch<T>(`/api/strapi/${path}`, { params })
  }

  function strapiAuthenticatedGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const token = authStore.getToken()
    return $fetch<T>(`/api/strapi/${path}`, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  function emptyResponse<T>(data: T): StrapiResponse<T> {
    return { data, meta: {} }
  }

  async function safeStrapi<T>(
    label: string,
    getter: () => Promise<T>,
    fallback: T,
  ): Promise<T> {
    try {
      return await getter()
    }
    catch (error) {
      const statusCode = (error as { statusCode?: number; status?: number })?.statusCode
        ?? (error as { statusCode?: number; status?: number })?.status
      console.warn(`[Strapi] ${label} failed${statusCode ? ` (${statusCode})` : ''}`)
      return fallback
    }
  }

  // ─── Products ───────────────────────────────────────────────────────────────

  async function getProducts(opts?: {
    page?: number
    pageSize?: number
    query?: string
  }): Promise<StrapiResponse<Product[]>> {
    const query = opts?.query?.trim()
    return safeStrapi(
      'getProducts',
      () => strapiPublicGet<StrapiResponse<Product[]>>('products', {
      'populate[mainImage]': true,
      'populate[categories][fields][0]': 'name',
      'populate[categories][fields][1]': 'slug',
      'populate[brand][fields][0]': 'name',
      'populate[brand][fields][1]': 'slug',
      'filters[isActive][$eq]': true,
      ...(query ? {
        'filters[$or][0][title][$containsi]': query,
        'filters[$or][1][sku][$containsi]': query,
        'filters[$or][2][brand][name][$containsi]': query,
        'filters[$or][3][categories][name][$containsi]': query,
      } : {}),
      'pagination[page]': opts?.page ?? 1,
      'pagination[pageSize]': opts?.pageSize ?? 24,
      'sort[0]': 'sortOrder:asc',
      'sort[1]': 'createdAt:desc',
      }),
      emptyResponse([]),
    )
  }

  async function getFeaturedProducts(): Promise<StrapiResponse<Product[]>> {
    return safeStrapi(
      'getFeaturedProducts',
      () => strapiPublicGet<StrapiResponse<Product[]>>('products', {
      'populate[mainImage]': true,
      'populate[categories][fields][0]': 'name',
      'populate[categories][fields][1]': 'slug',
      'populate[brand][fields][0]': 'name',
      'filters[featured][$eq]': true,
      'filters[isActive][$eq]': true,
      'pagination[pageSize]': 8,
      'sort[0]': 'sortOrder:asc',
      }),
      emptyResponse([]),
    )
  }

  async function getProductBySlug(slug: string): Promise<StrapiResponse<Product[]>> {
    return safeStrapi(
      'getProductBySlug',
      () => strapiPublicGet<StrapiResponse<Product[]>>('products', {
      'populate[mainImage]': true,
      'populate[gallery]': true,
      'populate[categories][fields][0]': 'name',
      'populate[categories][fields][1]': 'slug',
      'populate[brand][fields][0]': 'name',
      'populate[brand][fields][1]': 'slug',
      'populate[brand][populate][logo]': true,
      'populate[specifications]': true,
      'populate[ingredients]': true,
      'populate[relatedProducts][populate][mainImage]': true,
      'populate[relatedProducts][populate][categories][fields][0]': 'name',
      'populate[relatedProducts][populate][categories][fields][1]': 'slug',
      'populate[relatedProducts][populate][brand][fields][0]': 'name',
      'filters[slug][$eq]': slug,
      'filters[isActive][$eq]': true,
      }),
      emptyResponse([]),
    )
  }

  async function getProductsByCategory(
    categorySlug: string,
    opts?: { page?: number, pageSize?: number, query?: string },
  ): Promise<StrapiResponse<Product[]>> {
    const query = opts?.query?.trim()
    return safeStrapi(
      'getProductsByCategory',
      () => strapiPublicGet<StrapiResponse<Product[]>>('products', {
      'populate[mainImage]': true,
      'populate[categories][fields][0]': 'name',
      'populate[categories][fields][1]': 'slug',
      'filters[categories][slug][$eq]': categorySlug,
      'filters[isActive][$eq]': true,
      ...(query ? {
        'filters[$or][0][title][$containsi]': query,
        'filters[$or][1][sku][$containsi]': query,
        'filters[$or][2][brand][name][$containsi]': query,
        'filters[$or][3][categories][name][$containsi]': query,
      } : {}),
      'pagination[page]': opts?.page ?? 1,
      'pagination[pageSize]': opts?.pageSize ?? 24,
      'sort[0]': 'sortOrder:asc',
      }),
      emptyResponse([]),
    )
  }

  // ─── Categories ─────────────────────────────────────────────────────────────

  async function getCategories(): Promise<StrapiResponse<Category[]>> {
    return safeStrapi(
      'getCategories',
      () => strapiPublicGet<StrapiResponse<Category[]>>('categories', {
      'populate[image]': true,
      'populate[children][fields][0]': 'name',
      'populate[children][fields][1]': 'slug',
      'filters[isActive][$eq]': true,
      'filters[parent][id][$null]': true,
      'sort[0]': 'sortOrder:asc',
      }),
      emptyResponse([]),
    )
  }

  async function getCategoryBySlug(slug: string): Promise<StrapiResponse<Category[]>> {
    return safeStrapi(
      'getCategoryBySlug',
      () => strapiPublicGet<StrapiResponse<Category[]>>('categories', {
      'populate[image]': true,
      'populate[children][fields][0]': 'name',
      'populate[children][fields][1]': 'slug',
      'populate[parent][fields][0]': 'name',
      'populate[parent][fields][1]': 'slug',
      'filters[slug][$eq]': slug,
      }),
      emptyResponse([]),
    )
  }

  // ─── Brands ─────────────────────────────────────────────────────────────────

  async function getBrands(): Promise<StrapiResponse<Brand[]>> {
    return safeStrapi(
      'getBrands',
      () => strapiPublicGet<StrapiResponse<Brand[]>>('brands', {
      'populate[logo]': true,
      'filters[isActive][$eq]': true,
      'sort[0]': 'sortOrder:asc',
      }),
      emptyResponse([]),
    )
  }

  return {
    strapiPublicGet,
    strapiAuthenticatedGet,
    getProducts,
    getFeaturedProducts,
    getProductBySlug,
    getProductsByCategory,
    getCategories,
    getCategoryBySlug,
    getBrands,
  }
}
