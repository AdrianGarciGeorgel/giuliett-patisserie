import type { Metadata, MetadataRoute } from 'next'
import { CONTACT } from '@/lib/giuliett'
import { PRODUCT_CATEGORY_OPTIONS } from '@/lib/products'
import type { Product } from '@/types/product'

/* SEO técnico (Fase C). Funciones puras, sin dependencias de Next en runtime,
   para poder testearlas en Vitest. Las páginas las llaman desde `metadata`,
   `generateMetadata`, `robots.ts` y `sitemap.ts`. */

export const NOMBRE_SITIO = 'Giuliett Pâtisserie'
export const LEMA = 'Pastelería francesa en Mendoza'

/** Rutas públicas indexables. El panel y la API quedan afuera a propósito. */
export const RUTAS_ESTATICAS = ['/', '/productos', '/eventos', '/giu', '/galeria', '/contacto'] as const

/**
 * URL absoluta del sitio. Orden: NEXT_PUBLIC_SITE_URL (el dominio final, cuando
 * exista) → URL de producción que Vercel expone sola → localhost.
 */
export function resolverUrlSitio(env: Record<string, string | undefined> = process.env): string {
  const explicita = env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicita) return explicita.replace(/\/+$/, '')
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`
  return 'http://localhost:3000'
}

export function generarRobots(base: string): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${base}/sitemap.xml`,
  }
}

export function generarSitemap(base: string, productos: readonly Product[], fecha: Date = new Date()): MetadataRoute.Sitemap {
  const estaticas: MetadataRoute.Sitemap = RUTAS_ESTATICAS.map((ruta) => ({
    url: `${base}${ruta}`,
    lastModified: fecha,
    changeFrequency: ruta === '/' ? 'weekly' : 'monthly',
    priority: ruta === '/' ? 1 : 0.8,
  }))
  const deProductos: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${base}/productos/${p.slug}`,
    lastModified: fecha,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
  return [...estaticas, ...deProductos]
}

/** Una línea, sin saltos, cortada en una palabra entera (máx. 155 para Google). */
export function descripcionBreve(texto: string | undefined, max = 155): string {
  const plano = (texto ?? '').replace(/\s+/g, ' ').trim()
  if (plano.length <= max) return plano
  const corte = plano.slice(0, max - 1)
  return `${corte.slice(0, corte.lastIndexOf(' '))}…`
}

type MetadataPagina = {
  titulo: string
  descripcion: string
  /** Ruta absoluta dentro del sitio, p. ej. "/eventos". */
  ruta: string
  base?: string
}

/** Metadata completa para una página estática: título, canonical, Open Graph y Twitter. */
export function metadataPagina({ titulo, descripcion, ruta, base = resolverUrlSitio() }: MetadataPagina): Metadata {
  const url = `${base}${ruta === '/' ? '' : ruta}`
  const tituloCompleto = ruta === '/' ? `${NOMBRE_SITIO} · ${LEMA}` : `${titulo} · ${NOMBRE_SITIO}`
  return {
    title: tituloCompleto,
    description: descripcion,
    alternates: { canonical: url || `${base}/` },
    openGraph: {
      title: tituloCompleto,
      description: descripcion,
      url: url || `${base}/`,
      siteName: NOMBRE_SITIO,
      locale: 'es_AR',
      type: 'website',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: `${NOMBRE_SITIO} · ${LEMA}` }],
    },
    twitter: { card: 'summary_large_image', title: tituloCompleto, description: descripcion },
  }
}

export function etiquetaCategoria(producto: Product): string {
  return PRODUCT_CATEGORY_OPTIONS.find((o) => o.value === producto.category)?.label ?? ''
}

/** Metadata de una ficha de producto. La imagen OG la genera `opengraph-image.tsx`. */
export function metadataProducto(producto: Product, base: string = resolverUrlSitio()) {
  const url = `${base}/productos/${producto.slug}`
  const titulo = `${producto.name} · ${NOMBRE_SITIO}`
  const descripcion =
    descripcionBreve(producto.description) || `${producto.name} de ${NOMBRE_SITIO}, pastelería francesa artesanal en Mendoza.`
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      title: titulo,
      description: descripcion,
      url,
      siteName: NOMBRE_SITIO,
      locale: 'es_AR',
      type: 'website',
      images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: producto.name }],
    },
    twitter: { card: 'summary_large_image', title: titulo, description: descripcion },
  } satisfies Metadata
}

/* ---------------- JSON-LD (Schema.org) ---------------- */

/** JSON-LD listo para un <script>: escapa `<`, así un texto con `</script>` no puede cerrar el bloque e
 *  inyectar código. Hoy los datos son fijos; con el CMS podrían venir de un formulario (auditoría 26-09). */
export function jsonLdSeguro(datos: unknown): string {
  return JSON.stringify(datos).replace(/</g, '\\u003c')
}

export function jsonLdPasteleria(base: string = resolverUrlSitio()) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: NOMBRE_SITIO,
    description: 'Pastelería francesa artesanal de autor en Mendoza. Tortas, macarons, galletas personalizadas, boxes y mesas dulces para particulares, eventos y empresas.',
    url: base,
    image: `${base}/opengraph-image`,
    telephone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mendoza',
      addressRegion: 'Mendoza',
      addressCountry: 'AR',
    },
    sameAs: [CONTACT.instagramUrl],
    servesCuisine: 'Pastelería francesa',
    priceRange: '$$',
  }
}

export function jsonLdProducto(producto: Product, base: string = resolverUrlSitio()) {
  const url = `${base}/productos/${producto.slug}`
  const imagenes = [producto.imagePrimary, ...(producto.gallery ?? []).filter((g) => g !== producto.imagePrimary)]
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.name,
    description: descripcionBreve(producto.description, 300),
    image: imagenes.map((ruta) => `${base}${ruta}`),
    url,
    category: etiquetaCategoria(producto),
    brand: { '@type': 'Brand', name: NOMBRE_SITIO },
    offers: {
      '@type': 'Offer',
      url,
      price: producto.price,
      priceCurrency: 'ARS',
      availability: producto.available === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: NOMBRE_SITIO },
    },
  }
}

export function jsonLdMigas(base: string, migas: ReadonlyArray<{ nombre: string; ruta: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((miga, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: miga.nombre,
      item: `${base}${miga.ruta === '/' ? '' : miga.ruta}` || `${base}/`,
    })),
  }
}
