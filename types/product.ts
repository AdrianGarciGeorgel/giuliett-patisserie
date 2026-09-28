export const PRODUCT_CATEGORIES = {
  CLASSIC_CAKES: 'tortas-clasicas',
  CUSTOM_CAKES: 'tortas-personalizadas',
  CUSTOM_COOKIES: 'galletas-personalizadas',
  BOXES: 'boxes',
} as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES]

export type Product = {
  id: string
  slug: string
  name: string
  category: ProductCategory
  /** Sin precio = "Sin precio publicado" (depende del modelo y la cantidad): no se muestra ningún importe. */
  price?: number
  imagePrimary: string
  imageSecondary: string
  description?: string
  gallery?: string[]
  featured?: boolean
  available?: boolean
  tags?: string[]
  variants?: string[]
  ingredients?: string[]
  quantityOptions?: string[]
}
