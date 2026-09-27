import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '@/lib/products'

/**
 * Las fotos de cada producto son las que eligió Marco (regla 8). Referencia: sus datos de `lib/products.ts` en su
 * repo (commit 93b9a97), guardados en fixtures/fotos-productos-marco.json.
 *
 * Regresión del 26-09-2026: al volver a sus fotos originales (PR #9), la segunda foto de la Tarta Cabsha quedó
 * apuntando a CABSHA_1.png, una versión que Marco había reemplazado el 15-09 por CABSHA_1.jpeg. Se veía al pasar el
 * mouse por la torta en el catálogo y en su ficha.
 */
const marco = JSON.parse(readFileSync(new URL('./fixtures/fotos-productos-marco.json', import.meta.url), 'utf8'))

describe('fotos de los productos', () => {
  it('cada producto usa las fotos que eligió Marco, en el mismo orden', () => {
    const nuestras = PRODUCTS.map((p) => ({ slug: p.slug, imagePrimary: p.imagePrimary, imageSecondary: p.imageSecondary, gallery: p.gallery ?? [] }))
    expect(nuestras).toEqual(marco)
  })
})
