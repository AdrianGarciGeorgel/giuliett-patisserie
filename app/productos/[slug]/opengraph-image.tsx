import { ImageResponse } from 'next/og'
import { comprimirTarjeta, fotoParaTarjeta } from '@/lib/og'
import { getProductoPorSlug, getProductos } from '@/lib/catalogo'
import { etiquetaCategoria } from '@/lib/seo'

/* Se generan en el build, una por producto del catálogo. Antes se armaban en cada pedido y con
   cualquier slug: /productos/lo-que-sea/opengraph-image devolvía 200 y gastaba CPU con sharp
   (auditoría del 26-09-2026). Un slug que no existe ahora da 404 sin tocar el servidor. */
export async function generateStaticParams() {
  return (await getProductos()).map((producto) => ({ slug: producto.slug }))
}

export const dynamicParams = false

/* Tarjeta 1200×630 que ven WhatsApp, Instagram y Google al compartir una ficha.
   JPEG liviano (WebP no siempre se previsualiza; PNG pesa demasiado) con la
   paleta oficial: Warm White de fondo, Aubergine en el texto, Warm Taupe en la
   categoría, Lilac en el punto. */

export const alt = 'Producto de Giuliett Pâtisserie'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/jpeg'

const priceFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductoPorSlug(slug)
  const foto = product ? await fotoParaTarjeta(product.imagePrimary, 630, 630) : null

  return comprimirTarjeta(
    new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#FFF8E9', color: '#51375C' }}>
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} width={630} height={630} alt="" style={{ width: 630, height: 630, objectFit: 'cover' }} />
        ) : null}
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: '56px 64px' }}>
          <div style={{ fontSize: 26, letterSpacing: 6, textTransform: 'uppercase', color: '#9C8065' }}>
            {product ? etiquetaCategoria(product) : 'Pastelería francesa'}
          </div>
          <div style={{ fontSize: product && product.name.length > 18 ? 60 : 76, fontWeight: 700, lineHeight: 1.05, marginTop: 18 }}>
            {product?.name ?? 'Giuliett Pâtisserie'}
          </div>
          {product ? <div style={{ fontSize: 34, marginTop: 22 }}>{priceFormatter.format(product.price)}</div> : null}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 'auto', fontSize: 28 }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: '#BFB4DC' }} />
            Giuliett Pâtisserie · Mendoza
          </div>
        </div>
      </div>
      ),
      { ...size },
    ),
  )
}
