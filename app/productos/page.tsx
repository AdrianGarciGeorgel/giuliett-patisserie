import { ProductCatalog } from '@/components/giuliett/product-catalog'
import { Section } from '@/components/giuliett/section'
import { getProductos } from '@/lib/catalogo'
import { isProductCategory } from '@/lib/products'
import { PRODUCT_CATEGORIES } from '@/types/product'
import { metadataPagina } from '@/lib/seo'

export const metadata = metadataPagina({
  titulo: 'Nuestros productos',
  ruta: '/productos',
  descripcion:
    'Tortas clásicas y personalizadas, galletas con tu marca, macarons y boxes. Pastelería francesa artesanal, hecha en Mendoza.',
})

type ProductosPageProps = {
  searchParams: Promise<{ categoria?: string }>
}

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const { categoria } = await searchParams
  const categoryParam = categoria ?? null
  const initialCategory = isProductCategory(categoryParam) ? categoryParam : PRODUCT_CATEGORIES.CLASSIC_CAKES
  const productos = await getProductos()

  return (
    <main>
      <Section tone="cream" layered={false} className="pb-20 pt-12 md:pb-28 md:pt-20" aria-labelledby="productos-titulo">
        <h1 id="productos-titulo" className="sr-only">
          Nuestros productos
        </h1>
        <ProductCatalog initialCategory={initialCategory} productos={productos} />
      </Section>
    </main>
  )
}
