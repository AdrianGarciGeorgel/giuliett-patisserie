import { EVENTOS } from '@/lib/giuliett'
import { PRODUCT_CATEGORY_OPTIONS, PRODUCTS } from '@/lib/products'
import type { Product, ProductCategory } from '@/types/product'

/**
 * Capa de acceso a los datos del catálogo (punto 11 del checklist: preparados
 * para un CMS sin rehacer el frontend).
 *
 * HOY: lee los arrays estáticos de `lib/products.ts` y `lib/giuliett.ts`.
 * MAÑANA: estas mismas funciones consultan Supabase (o el CMS que se elija);
 * las páginas y componentes no cambian, porque solo conocen esta API.
 *
 * Por eso son `async` aunque hoy no esperen nada: el contrato ya es el de
 * una fuente remota. Un test (`test/catalogo.acceso.test.ts`) prohíbe que
 * `app/` o `components/` importen PRODUCTS, getProductBySlug o EVENTOS directo.
 */

export async function getProductos(): Promise<Product[]> {
  return PRODUCTS
}

export async function getProductoPorSlug(slug: string): Promise<Product | null> {
  if (!slug) return null
  return PRODUCTS.find((producto) => producto.slug === slug) ?? null
}

export async function getProductosPorCategoria(categoria: ProductCategory): Promise<Product[]> {
  return PRODUCTS.filter((producto) => producto.category === categoria)
}

/** Las categorías son parte del tipo `ProductCategory`: config estática, no dato editable. */
export function getCategorias() {
  return PRODUCT_CATEGORY_OPTIONS
}

export type Eventos = typeof EVENTOS

export async function getEventos(): Promise<Eventos> {
  return EVENTOS
}
