import { describe, expect, it, vi } from 'vitest'

// La tarjeta arma la imagen con sharp y next/og: acá solo interesa qué rutas genera.
vi.mock('@/lib/og', () => ({ comprimirTarjeta: vi.fn(), fotoParaTarjeta: vi.fn() }))

import * as tarjeta from '@/app/productos/[slug]/opengraph-image'
import { getProductos } from '@/lib/catalogo'

/** Auditoría del 26-09-2026: la tarjeta de cada producto se generaba en cada pedido y con cualquier
 *  slug (un slug inventado devolvía 200 y gastaba CPU con sharp). Ahora se genera en el build. */
describe('tarjeta Open Graph de producto', () => {
  it('se genera en el build para cada producto del catálogo', async () => {
    const productos = await getProductos()
    const params = await tarjeta.generateStaticParams()
    expect(params.map((p) => p.slug).sort()).toEqual(productos.map((p) => p.slug).sort())
  })

  it('un slug que no está en el catálogo no se genera en el servidor (404)', () => {
    expect(tarjeta.dynamicParams).toBe(false)
  })
})
