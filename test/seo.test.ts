import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '@/lib/products'
import {
  RUTAS_ESTATICAS,
  generarRobots,
  generarSitemap,
  jsonLdMigas,
  jsonLdPasteleria,
  jsonLdProducto,
  metadataProducto,
  resolverUrlSitio,
} from '@/lib/seo'

/* Fase C (punto 6 del checklist): lo que tiene que cumplir el SEO técnico,
   escrito como test antes que el código. */

const BASE = 'https://giuliett.example'

describe('resolverUrlSitio', () => {
  it('prefiere NEXT_PUBLIC_SITE_URL y le saca la barra final', () => {
    expect(resolverUrlSitio({ NEXT_PUBLIC_SITE_URL: 'https://giuliett.com.ar/' })).toBe('https://giuliett.com.ar')
  })
  it('si no está, usa la URL de producción de Vercel con https', () => {
    expect(resolverUrlSitio({ VERCEL_PROJECT_PRODUCTION_URL: 'giuliett-patisserie-nu.vercel.app' })).toBe(
      'https://giuliett-patisserie-nu.vercel.app',
    )
  })
  it('en local cae a localhost', () => {
    expect(resolverUrlSitio({})).toBe('http://localhost:3000')
  })
})

describe('robots', () => {
  it('permite todo salvo el panel y la API, y apunta al sitemap', () => {
    const r = generarRobots(BASE)
    expect(r.rules).toEqual({ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] })
    expect(r.sitemap).toBe(`${BASE}/sitemap.xml`)
  })
})

describe('sitemap', () => {
  const entradas = generarSitemap(BASE, PRODUCTS)
  const urls = entradas.map((e) => e.url)

  it('incluye todas las rutas estáticas públicas', () => {
    for (const ruta of RUTAS_ESTATICAS) expect(urls).toContain(`${BASE}${ruta}`)
  })
  it('incluye todos los productos', () => {
    for (const p of PRODUCTS) expect(urls).toContain(`${BASE}/productos/${p.slug}`)
  })
  it('no incluye el panel ni la API y no repite URLs', () => {
    expect(urls.some((u) => u.includes('/admin') || u.includes('/api'))).toBe(false)
    expect(new Set(urls).size).toBe(urls.length)
  })
  it('la home tiene la prioridad más alta', () => {
    const home = entradas.find((e) => e.url === `${BASE}/`)
    expect(home?.priority).toBe(1)
  })
})

describe('metadata de producto', () => {
  const producto = PRODUCTS[0]
  const meta = metadataProducto(producto, BASE)

  it('título con el nombre y la marca, descripción breve sin saltos de línea', () => {
    expect(meta.title).toContain(producto.name)
    expect(meta.title).toContain('Giuliett')
    expect(meta.description.length).toBeGreaterThan(40)
    expect(meta.description.length).toBeLessThanOrEqual(160)
    expect(meta.description).not.toMatch(/\n/)
  })
  it('canonical absoluta al producto', () => {
    expect(meta.alternates.canonical).toBe(`${BASE}/productos/${producto.slug}`)
  })
  it('Open Graph con imagen generada (PNG 1200×630) y tipo website', () => {
    expect(meta.openGraph.images[0].url).toBe(`${BASE}/productos/${producto.slug}/opengraph-image`)
    expect(meta.openGraph.images[0].width).toBe(1200)
    expect(meta.openGraph.images[0].height).toBe(630)
    expect(meta.openGraph.locale).toBe('es_AR')
  })
})

describe('JSON-LD', () => {
  it('pastelería: Bakery en Mendoza con teléfono e Instagram', () => {
    const ld = jsonLdPasteleria(BASE)
    expect(ld['@type']).toBe('Bakery')
    expect(ld.address.addressLocality).toBe('Mendoza')
    expect(ld.address.addressCountry).toBe('AR')
    expect(ld.telephone).toMatch(/^\+54/)
    expect(ld.sameAs).toContain('https://instagram.com/giuliettpatisserie')
    expect(ld.url).toBe(BASE)
  })

  it('producto: Product con oferta en pesos y URL canónica', () => {
    const p = PRODUCTS[0]
    const ld = jsonLdProducto(p, BASE)
    expect(ld['@type']).toBe('Product')
    expect(ld.name).toBe(p.name)
    expect(ld.url).toBe(`${BASE}/productos/${p.slug}`)
    expect(ld.image[0]).toBe(`${BASE}${p.imagePrimary}`)
    expect(ld.offers.priceCurrency).toBe('ARS')
    expect(ld.offers.price).toBe(p.price)
    expect(ld.brand.name).toBe('Giuliett Pâtisserie')
  })

  it('migas de pan: Inicio → Productos → producto, con posiciones 1..3', () => {
    const p = PRODUCTS[0]
    const ld = jsonLdMigas(BASE, [
      { nombre: 'Inicio', ruta: '/' },
      { nombre: 'Productos', ruta: '/productos' },
      { nombre: p.name, ruta: `/productos/${p.slug}` },
    ])
    expect(ld['@type']).toBe('BreadcrumbList')
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2, 3])
    expect(ld.itemListElement[2].item).toBe(`${BASE}/productos/${p.slug}`)
  })
})
