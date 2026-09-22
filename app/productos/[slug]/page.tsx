import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/giuliett/contact-form'
import { ProductGallery } from '@/components/giuliett/product-gallery'
import { PrimaryAction } from '@/components/giuliett/atoms'
import { Section } from '@/components/giuliett/section'
import { PRODUCT_CATEGORY_OPTIONS, getProductBySlug } from '@/lib/products'
import { waLink } from '@/lib/giuliett'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) notFound()

  const category = PRODUCT_CATEGORY_OPTIONS.find((option) => option.value === product.category)
  const productsUrl = `/productos?categoria=${encodeURIComponent(product.category)}`
  const images = product.gallery?.length ? product.gallery : [product.imagePrimary, product.imageSecondary]
  const whatsappMessage = `Hola Giuliett! Quisiera consultar por ${product.name}.`

  return (
    <main>
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

            {/* Alternativa al WhatsApp directo: deja la consulta registrada. Cerrado por defecto, sin peso visual. */}
            <details className="group mt-6 w-full max-w-[400px] lg:max-w-[520px]">
              <summary className="underline-write inline-flex min-h-[44px] cursor-pointer list-none items-center text-[14px] text-primary/70 transition-colors duration-200 hover:text-primary [&::-webkit-details-marker]:hidden">
                ¿Preferís que te escribamos nosotros? Dejanos tus datos
              </summary>
              <div className="mt-8 text-left">
                <ContactForm
                  origen="particular"
                  producto={{ slug: product.slug, nombre: product.name, categoria: category?.label ?? '' }}
                />
              </div>
            </details>
          </article>
        </div>
      </Section>
    </main>
  )
}
