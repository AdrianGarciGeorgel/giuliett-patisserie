import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductGallery } from '@/components/giuliett/product-gallery'
import { PrimaryAction } from '@/components/giuliett/atoms'
import { Section } from '@/components/giuliett/section'
import { getProductoPorSlug, getProductos } from '@/lib/catalogo'
import { PRODUCT_CATEGORY_OPTIONS } from '@/lib/products'
import { waLink } from '@/lib/giuliett'
import { jsonLdMigas, jsonLdProducto, jsonLdSeguro, metadataProducto, resolverUrlSitio } from '@/lib/seo'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

/** Las fichas se generan en el build: son estáticas y el sitemap las conoce. */
export async function generateStaticParams() {
  return (await getProductos()).map((product) => ({ slug: product.slug }))
}

/** Título, descripción, canonical y tarjeta Open Graph por producto (para WhatsApp y Google). */
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductoPorSlug(slug)
  if (!product) return { title: 'Producto no encontrado · Giuliett Pâtisserie', robots: { index: false } }
  return metadataProducto(product)
}

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductoPorSlug(slug)

  if (!product) notFound()

  const category = PRODUCT_CATEGORY_OPTIONS.find((option) => option.value === product.category)
  const productsUrl = `/productos?categoria=${encodeURIComponent(product.category)}`
  const images = product.gallery?.length ? product.gallery : [product.imagePrimary, product.imageSecondary]
  const whatsappMessage = `Hola Giuliett! Quisiera consultar por ${product.name}.`
  const base = resolverUrlSitio()
  const datosEstructurados = [
    jsonLdProducto(product, base),
    jsonLdMigas(base, [
      { nombre: 'Inicio', ruta: '/' },
      { nombre: 'Productos', ruta: '/productos' },
      { nombre: product.name, ruta: `/productos/${product.slug}` },
    ]),
  ]

  return (
    <main>
      {/* Schema.org: Google entiende que es un producto con precio, y de qué pastelería. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSeguro(datosEstructurados) }} />
      <Section tone="cream" layered={false} className="pb-20 pt-12 md:pb-28 md:pt-20">
        <Link href={productsUrl} className="mb-8 inline-flex min-h-[48px] items-center rounded-sm border border-primary/30 px-5 text-[14px] font-medium text-primary transition-[background-color,border-color] duration-200 hover:border-primary/50 hover:bg-lilac-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          Volver
        </Link>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.72fr)] lg:items-center lg:gap-20">
          <ProductGallery name={product.name} images={images} />

          <article className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p className="tracked text-[11px] font-medium text-muted-foreground">{category?.label}</p>
            <h1 className="mt-5 text-balance text-[32px] font-light leading-[1.15] text-primary md:text-[42px] lg:text-[48px]">
              {product.name}
            </h1>
            <p className="mt-5 text-[18px] text-primary md:text-[20px]">{priceFormatter.format(product.price)}</p>
            <p className="mt-7 max-w-[38ch] text-[15px] leading-[1.7] text-muted-foreground whitespace-pre-line">{product.description}</p>
            <PrimaryAction href={waLink(whatsappMessage)} className="mt-10 w-full max-w-[400px] lg:w-auto">
              Consultar por WhatsApp
            </PrimaryAction>
          </article>
        </div>
      </Section>
    </main>
  )
}
