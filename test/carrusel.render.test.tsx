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

  it('conserva el cursor de Marco', () => {
    expect(viewport(html)).toMatch(/cursor-grab/)
  })
})

describe('home: el texto queda quieto y solo se desliza la foto (prueba del 26-09-2026)', () => {
  const html = renderToStaticMarkup(<Hero />)
  const figuras = [...html.matchAll(/<figure\b[\s\S]*?<\/figure>/g)].map((m) => m[0])

  it('cada foto lleva solo la imagen: nada de texto ni botones adentro', () => {
    expect(figuras).toHaveLength(productCategories.length)
    for (const figura of figuras) {
      expect(figura).not.toMatch(/Ver producto|Pastelería Francesa|giuliett-logo|<h2/)
    }
  })

  it('logo, bajada, botón, nombre y puntitos aparecen una sola vez, en una capa fija encima', () => {
    // Una sola imagen del logo (el nombre del archivo se repite dentro de su srcset, por eso se cuentan las <img>).
    expect(html.match(/<img\b[^>]*alt="Giuliett Pâtisserie"/g)).toHaveLength(1)
    expect(html.match(/Pastelería Francesa · Mendoza, Argentina/g)).toHaveLength(1)
    expect(html.match(/>Ver producto</g)).toHaveLength(1)
    expect(html.match(/<h2\b/g)).toHaveLength(1)
    expect(puntitos(html)).toHaveLength(productCategories.length)
  })

  it('la capa fija deja pasar el dedo y el mouse a la foto, salvo el botón', () => {
    expect(html).toMatch(/class="pointer-events-none absolute inset-0 z-10/)
    const boton = html.match(/<a\b[^>]*>(?=Ver producto)/)?.[0] ?? ''
    expect(boton).toMatch(/class="pointer-events-auto /)
    expect(boton).toMatch(/href="\/productos\?categoria=tortas-clasicas"/)
  })

  it('el nombre de la categoría cambia con un fundido: se ve el de la foto actual y los otros quedan ocultos', () => {
    const h2 = html.match(/<h2\b[\s\S]*?<\/h2>/)?.[0] ?? ''
    const nombres = [...h2.matchAll(/<span\b([^>]*)>([^<]*)<\/span>/g)].map((m) => ({ atributos: m[1], nombre: m[2] }))
    expect(nombres.map((n) => n.nombre)).toEqual(productCategories.map((c) => c.name))
    expect(nombres[0].atributos).toMatch(/opacity-100/)
    expect(nombres[0].atributos).not.toMatch(/aria-hidden="true"/)
    for (const otro of nombres.slice(1)) {
      expect(otro.atributos).toMatch(/opacity-0/)
      expect(otro.atributos).toMatch(/aria-hidden="true"/)
    }
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
