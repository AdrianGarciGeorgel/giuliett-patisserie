// @vitest-environment node
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ProductGallery } from '@/components/giuliett/product-gallery'
import { PRODUCTS } from '@/lib/products'

/**
 * Galería de la ficha de producto (revisión de las fichas de Tortas clásicas, 27-09-2026). En el celular las fotos se
 * deslizan con el dedo dentro de una caja con scroll horizontal, que no se podía recorrer con el teclado (axe:
 * scrollable-region-focusable). La ven también quienes agrandan mucho la pantalla en la compu. Ahora la caja es una
 * región con nombre que recibe el foco: con las flechas se pasa de foto. Nada visible cambia: el HTML es el de antes
 * (fixtures/galeria-marquise.html) salvo esos dos atributos.
 */
const marquise = PRODUCTS.find((p) => p.slug === 'marquise')!
const html = renderToStaticMarkup(<ProductGallery name={marquise.name} images={marquise.gallery!} />)
const antes = readFileSync(new URL('./fixtures/galeria-marquise.html', import.meta.url), 'utf8').trim()

describe('galería de la ficha de producto', () => {
  it('se ve igual que antes: mismo HTML, salvo los atributos invisibles agregados', () => {
    expect(html.replace(/ role="region"| tabindex="0"/gi, '')).toBe(antes)
  })

  it('en el celular, la caja que se desliza se puede recorrer con el teclado y dice qué es', () => {
    const caja = html.match(/<div\b[^>]*aria-label="Galería de Marquise"[^>]*>/)?.[0] ?? ''
    expect(caja).toMatch(/role="region"/)
    expect(caja).toMatch(/tabindex="0"/i)
  })
})
