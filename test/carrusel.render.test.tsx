// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { HeroCarousel } from '@/components/giuliett/hero-carousel'
import { Hero } from '@/components/giuliett/sections/hero'
import { productCategories } from '@/lib/giuliett'

/**
 * El carrusel como lo arma el servidor. Home (pedido de Adrián del 26-09-2026): se mueve solo, SIN
 * botón de pausa, con los puntitos de Marco tal cual, y en la computadora un clic en el costado avanza
 * o retrocede. Galería y eventos siguen exactamente como los diseñó Marco.
 */

const viewport = (html: string) => html.match(/<div[^>]*aria-roledescription="carrusel"[^>]*>/)?.[0] ?? ''
const botones = (html: string) => [...html.matchAll(/<button\b[^>]*>/g)].map((m) => m[0])
const puntitos = (html: string) => [...html.matchAll(/<span aria-hidden="true" class="h-2 w-2 rounded-full bg-primary[^"]*"/g)]

describe('carrusel de la home', () => {
  const html = renderToStaticMarkup(<Hero />)

  it('no tiene botón de pausa', () => {
    expect(html).not.toMatch(/Pausar el carrusel|Reanudar el carrusel/)
  })

  it('en la computadora, un costado retrocede y el otro avanza', () => {
    const anterior = botones(html).filter((b) => /aria-label="Foto anterior"/.test(b))
    const siguiente = botones(html).filter((b) => /aria-label="Foto siguiente"/.test(b))
    expect(anterior).toHaveLength(1)
    expect(siguiente).toHaveLength(1)
    expect(anterior[0]).toMatch(/\bleft-0\b/)
    expect(siguiente[0]).toMatch(/\bright-0\b/)
  })

  it('los costados solo existen con mouse: en el celular no tapan el deslizar con el dedo', () => {
    for (const b of botones(html).filter((x) => /aria-label="Foto (anterior|siguiente)"/.test(x))) {
      expect(b).toMatch(/class="[^"]*\bhidden\b/)
      expect(b).toMatch(/\[@media\(hover:hover\)_and_\(pointer:fine\)\]:block/)
    }
  })

  it('los puntitos son los de Marco, sin tocar: adornos, uno por categoría en cada foto', () => {
    expect(puntitos(html)).toHaveLength(productCategories.length * productCategories.length)
    expect(botones(html).some((b) => /aria-label="Ver (Tortas|Galletas|Boxes)/.test(b))).toBe(false)
  })

  it('conserva el cursor de Marco', () => {
    expect(viewport(html)).toMatch(/cursor-grab/)
  })
})

describe('carrusel de galería y eventos (sin cambios)', () => {
  const fotos = [
    { id: 'a', image: '/images/EVENTOS/BODAS/BODA_1.png', alt: 'Boda 1' },
    { id: 'b', image: '/images/EVENTOS/BODAS/BODA_2.png', alt: 'Boda 2' },
  ]
  const html = renderToStaticMarkup(<HeroCarousel slides={fotos} ariaLabel="Fotos de bodas" showProductButton={false} />)

  it('no se agregan costados clickeables ni botón de pausa', () => {
    expect(html).not.toMatch(/Foto anterior|Foto siguiente|Pausar el carrusel/)
    expect(botones(html)).toHaveLength(0)
  })

  it('mantiene el cursor y los puntitos de Marco', () => {
    expect(viewport(html)).toMatch(/cursor-grab/)
    expect(html.match(/<span aria-hidden="true" class="h-1\.5 rounded-full bg-\[#51375C\]/g)).toHaveLength(2)
  })
})
