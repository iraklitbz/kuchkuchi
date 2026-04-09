// ─── Auth ──────────────────────────────────────────────────────────────────────

export interface UserRole {
  id: number
  name: string
  type: string
}

export interface User {
  id: number
  documentId: string
  username: string
  email: string
  confirmed: boolean
  blocked: boolean
  role?: UserRole
}

export interface AuthResponse {
  jwt: string
  user: User
}

// ─── Strapi base ───────────────────────────────────────────────────────────────

export interface StrapiImageFormat {
  url: string
  width: number
  height: number
}

export interface StrapiImage {
  id: number
  documentId: string
  url: string
  alternativeText: string | null
  width: number
  height: number
  formats?: {
    thumbnail?: StrapiImageFormat
    small?: StrapiImageFormat
    medium?: StrapiImageFormat
    large?: StrapiImageFormat
  }
}

export interface StrapiMeta {
  pagination?: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export interface StrapiResponse<T> {
  data: T
  meta: StrapiMeta
}

// ─── Catalog ───────────────────────────────────────────────────────────────────

export interface Specification {
  label: string
  value: string
}

export interface IngredientLine {
  name: string
  amount?: number
  unit?: 'g' | 'kg' | 'ml' | 'l' | 'unit'
  note?: string
}

export interface Brand {
  id: number
  documentId: string
  name: string
  slug: string
  logo?: StrapiImage
  isActive: boolean
}

export interface Category {
  id: number
  documentId: string
  name: string
  slug: string
  description?: string
  image?: StrapiImage
  parent?: Category | null
  children?: Category[]
  isActive: boolean
  sortOrder?: number
}

export interface Product {
  id: number
  documentId: string
  title: string
  slug: string
  description?: string
  mainImage?: StrapiImage
  gallery?: StrapiImage[]
  price: number
  discountPrice?: number | null
  sku?: string
  barcode?: string
  quantity?: number
  quantityUnit?: string
  stock: number
  lowStockThreshold?: number
  isActive: boolean
  featured: boolean
  sortOrder?: number
  brand?: Brand
  categories?: Category[]
  specifications?: Specification[]
  ingredients?: IngredientLine[]
  relatedProducts?: Product[]
  createdAt: string
  updatedAt: string
}

// ─── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
}

// ─── Checkout / Orders ─────────────────────────────────────────────────────────

export interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  notes: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: number
  title: string
  price: number
  quantity: number
  imageUrl?: string
}

export interface Order {
  id: number
  documentId: string
  orderNumber: string
  status: OrderStatus
  firstName: string
  lastName: string
  email: string
  phone?: string
  address: string
  city: string
  notes?: string
  subtotal: number
  discount: number
  total: number
  items: OrderItem[]
  couponCode?: string
  user?: User | null
  createdAt: string
  updatedAt: string
}
