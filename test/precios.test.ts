import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '@/lib/products'
import { PRECIO_SEGUN_DISENO, formatearPrecio, textoPrecio } from '@/lib/precio'
import { jsonLdProducto } from '@/lib/seo'

/** Lista de Giu "Precios para Web, septiembre 2026" (catálogo de WhatsApp Business del 28-09-2026).
 *  `null` = "Sin precio publicado": depende del modelo y la cantidad, no se muestra un importe fijo. */
const LISTA_GIU: Record<string, number | null> = {
  marquise: 60000,
  'bomba-oreo': 65000,
  'ny-cheesecake': 55000,
  'lemon-pie': 45000,
  'tarta-casha': 50000,
  'tarta-frutilla': 35000,
  'chocotorta-premium': 65000, // Chocotorta Petit
  'mil-hojas': 65000,
  'box-parisino': 35000,
  'box-macarons': 20000,
  'box-cookies': 25000,
  'box-souvenirs': null,
  'torta-letter': 75000,
  'torta-butter': null,
  'wedding-cake': null,
  'flower-cake': null,
  // Las galletas, por el audio de Giu: "lo mismo con las galletas".
  'galletas-artesanales': null,
  'galletas-empresas': null,
}

describe('precios de la web (lista de Giu, septiembre 2026)', () => {
  it('la lista cubre los 18 productos', () => {
    expect(Object.keys(LISTA_GIU).sort()).toEqual(PRODUCTS.map((p) => p.slug).sort())
  })

  it('cada producto tiene exactamente el precio de la lista, o ninguno', () => {
    for (const p of PRODUCTS) expect(p.price ?? null, p.slug).toBe(LISTA_GIU[p.slug])
  })

  it('ninguna descripción repite un precio (la lista manda)', () => {
    for (const p of PRODUCTS) expect(p.description ?? '', p.slug).not.toMatch(/\$\s?\d/)
  })

  it('formato de Giu: signo pegado y punto de miles', () => {
    expect(formatearPrecio(60000)).toBe('$60.000')
    expect(formatearPrecio(5000)).toBe('$5.000')
    expect(formatearPrecio(950)).toBe('$950')
    expect(formatearPrecio(1250000)).toBe('$1.250.000')
  })

  it('sin precio publicado se lee "Precio según diseño" (acordado con Giu el 28-09)', () => {
    expect(PRECIO_SEGUN_DISENO).toBe('Precio según diseño')
    expect(textoPrecio(60000)).toBe('$60.000')
    expect(textoPrecio(undefined)).toBe('Precio según diseño')
    const sinPrecio = PRODUCTS.filter((p) => p.price === undefined).map((p) => textoPrecio(p.price))
    expect(sinPrecio).toHaveLength(6)
    expect(new Set(sinPrecio)).toEqual(new Set(['Precio según diseño']))
  })

  it('Google recibe la oferta solo si hay precio', () => {
    const conPrecio = PRODUCTS.find((p) => p.slug === 'marquise')!
    const sinPrecio = PRODUCTS.find((p) => p.slug === 'wedding-cake')!
    expect(jsonLdProducto(conPrecio, 'https://x.com').offers?.price).toBe(60000)
    expect(jsonLdProducto(sinPrecio, 'https://x.com').offers).toBeUndefined()
  })
})
