import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '@/lib/giuliett'
import { isProductCategory } from '@/lib/products'

/**
 * "Ver producto" en el carrusel de la galería (QA del 26-09-2026): mandaba el nombre visible
 * (/productos?categoria=Boxes) en lugar del identificador de la categoría, así que los cinco botones
 * terminaban en la lista de Tortas clásicas. Cada foto lleva ahora su destino.
 */
describe('destinos del carrusel de la galería', () => {
  it('cada foto tiene un destino', () => {
    for (const foto of PRODUCTS) expect(foto.destino, foto.id).toMatch(/^\//)
  })

  it('los que van al catálogo usan una categoría que existe', () => {
    for (const foto of PRODUCTS.filter((f) => f.destino.startsWith('/productos'))) {
      const categoria = new URL(foto.destino, 'https://x.y').searchParams.get('categoria')
      expect(isProductCategory(categoria), `${foto.id} → ${foto.destino}`).toBe(true)
    }
  })

  // Macarons y Mesas dulces no tienen categoría propia: van a Tortas clásicas (decisión de Adrián del 26-09-2026).
  it('cada foto va adonde corresponde', () => {
    const destinos = Object.fromEntries(PRODUCTS.map((f) => [f.label, f.destino]))
    expect(destinos).toEqual({
      Macarons: '/productos?categoria=tortas-clasicas',
      'Tortas personalizadas': '/productos?categoria=tortas-personalizadas',
      'Tortas clasicas': '/productos?categoria=tortas-clasicas',
      'Mesas dulces': '/productos?categoria=tortas-clasicas',
      Boxes: '/productos?categoria=boxes',
    })
  })
})
