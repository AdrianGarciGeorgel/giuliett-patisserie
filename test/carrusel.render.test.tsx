// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { HeroCarousel } from '@/components/giuliett/hero-carousel'
import { productCategories } from '@/lib/giuliett'

/**
 * El carrusel como lo arma el servidor (26-09-2026):
 * - sin "mano" como cursor (cursor-grab prometía un arrastre que en galería/eventos ni existía);
 * - puntitos clickeables (antes eran decorativos: con mouse no había forma de cambiar de foto);
 * - botón de pausa si se mueve solo (WCAG 2.2.2);
 * - solo la foto visible es interactiva: las otras van con `inert` (no se enfocan ni se leen).
 */

const fotos = [
  { id: 'a', image: '/images/EVENTOS/BODAS/BODA_1.webp', alt: 'Boda 1' },
  { id: 'b', image: '/images/EVENTOS/BODAS/BODA_2.webp', alt: 'Boda 2' },
  { id: 'c', image: '/images/EVENTOS/BODAS/BODA_3.webp', alt: 'Boda 3' },
]

const viewport = (html: string) => html.match(/<div[^>]*aria-roledescription="carrusel"[^>]*>/)?.[0] ?? ''
const figuras = (html: string) => [...html.matchAll(/<figure\b[^>]*>/g)].map((m) => m[0])
const botones = (html: string, etiqueta: RegExp) => [...html.matchAll(/<button\b[^>]*>/g)].map((m) => m[0]).filter((b) => etiqueta.test(b))

describe('HeroCarousel (galería / eventos)', () => {
  const html = renderToStaticMarkup(<HeroCarousel slides={fotos} ariaLabel="Fotos de bodas" showProductButton={false} />)

  it('no muestra la mano como cursor', () => {
    expect(viewport(html)).not.toBe('')
    expect(viewport(html)).not.toMatch(/cursor-grab/)
  })

  it('los puntitos son botones que llevan a cada foto; el primero está marcado como actual', () => {
    const puntos = botones(html, /aria-label="Ver foto \d+ de 3"/)
    expect(puntos).toHaveLength(3)
    expect(puntos[0]).toMatch(/aria-current="true"/)
    expect(puntos.slice(1).every((b) => !/aria-current/.test(b))).toBe(true)
  })

  it('tiene botón para pausar el movimiento', () => {
    expect(botones(html, /aria-label="Pausar el carrusel"/)).toHaveLength(1)
  })

  it('solo la primera foto es interactiva; las otras van con inert', () => {
    const f = figuras(html)
    expect(f).toHaveLength(3)
    expect(f[0]).not.toMatch(/\binert\b/)
    expect(f.slice(1).every((x) => /\binert\b/.test(x))).toBe(true)
  })

  it('con autoplay={false} no hay botón de pausa (no hay nada que pausar)', () => {
    const quieto = renderToStaticMarkup(<HeroCarousel slides={fotos} autoplay={false} showProductButton={false} />)
    expect(botones(quieto, /aria-label="(Pausar|Reanudar) el carrusel"/)).toHaveLength(0)
  })
})

describe('HeroCarousel de la home', () => {
  const html = renderToStaticMarkup(<HeroCarousel variant="home" ariaLabel="Productos destacados Giuliett" />)
  const total = productCategories.length

  it('no muestra la mano como cursor', () => {
    expect(viewport(html)).not.toMatch(/cursor-grab/)
  })

  it('cada categoría tiene su puntito clickeable, con su nombre', () => {
    for (const categoria of productCategories) {
      expect(botones(html, new RegExp(`aria-label="Ver ${categoria.name}"`)).length).toBeGreaterThan(0)
    }
  })

  it('solo la primera slide es interactiva y tiene botón de pausa', () => {
    const f = figuras(html)
    expect(f).toHaveLength(total)
    expect(f[0]).not.toMatch(/\binert\b/)
    expect(f.slice(1).every((x) => /\binert\b/.test(x))).toBe(true)
    expect(botones(html, /aria-label="Pausar el carrusel"/).length).toBeGreaterThan(0)
  })
})
