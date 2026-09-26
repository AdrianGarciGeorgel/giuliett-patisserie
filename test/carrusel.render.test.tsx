// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/galeria',
  useRouter: () => ({ push: () => {}, replace: () => {}, prefetch: () => {}, back: () => {} }),
}))
import { HeroCarousel } from '@/components/giuliett/hero-carousel'
import { Hero } from '@/components/giuliett/sections/hero'
import GaleriaPage from '@/app/galeria/page'
import EventosPage from '@/app/eventos/page'
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

  it('sin "mano": sobre la foto se ve el cursor normal, también al arrastrar (pedido de Adrián)', () => {
    expect(viewport(html)).not.toBe('')
    expect(viewport(html)).not.toMatch(/cursor-grab/)
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

describe('carrusel sin opciones (como lo diseñó Marco)', () => {
  const fotos = [
    { id: 'a', image: '/images/EVENTOS/BODAS/BODA_1.png', alt: 'Boda 1', text: 'Boda en la finca' },
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

  it('la leyenda va dentro de su foto y se desliza con ella, como la diseñó Marco', () => {
    expect(html.match(/<figure\b[\s\S]*?<\/figure>/g)?.[0]).toMatch(/<figcaption[^>]*>Boda en la finca<\/figcaption>/)
    expect(html).not.toMatch(/data-leyenda-fija/)
  })
})

describe('carrusel de la galería (pedido de Adrián del 26-09-2026: como el de la home)', () => {
  const pagina = renderToStaticMarkup(GaleriaPage())
  const carrusel = pagina.slice(pagina.indexOf('aria-roledescription="carrusel"') - 200)
  const figuras = [...carrusel.matchAll(/<figure\b[\s\S]*?<\/figure>/g)].map((m) => m[0])

  it('sin botón de pausa y sin la "mano" como cursor', () => {
    expect(pagina).not.toMatch(/Pausar el carrusel|Reanudar el carrusel/)
    expect(viewport(pagina)).not.toBe('')
    expect(viewport(pagina)).not.toMatch(/cursor-grab/)
  })

  it('en la computadora, un costado retrocede y el otro avanza; en pantallas táctiles no existen', () => {
    const costados = botones(pagina).filter((b) => /aria-label="Foto (anterior|siguiente)"/.test(b))
    expect(costados).toHaveLength(2)
    for (const b of costados) expect(b).toMatch(/\bhidden\b[\s\S]*\[@media\(hover:hover\)_and_\(pointer:fine\)\]:block/)
  })

  it('"Ver producto" queda quieto (uno solo, fuera de las fotos) y lleva a la categoría de la foto actual', () => {
    expect(figuras.length).toBeGreaterThan(1)
    for (const figura of figuras) expect(figura).not.toMatch(/Ver producto/)
    const enlaces = [...carrusel.matchAll(/<a\b[^>]*>Ver producto<\/a>/g)].map((m) => m[0])
    expect(enlaces).toHaveLength(1)
    expect(enlaces[0]).toMatch(/href="\/productos\?categoria=tortas-clasicas"/)
    expect(enlaces[0]).toMatch(/aria-label="Ver producto: Macarons"/)
  })

  it('la foto conserva el borde redondeado y la sombra de Marco', () => {
    expect(viewport(pagina)).toMatch(/rounded-\[32px\]/)
    expect(viewport(pagina)).toMatch(/shadow-\[0_20px_48px_-20px_rgb\(81_55_92\/0\.22\)\]/)
  })
})

describe('carruseles de eventos (pedido de Adrián del 26-09-2026: como la home y la galería)', async () => {
  const pagina = renderToStaticMarkup(await EventosPage())
  const visores = [...pagina.matchAll(/<div[^>]*aria-roledescription="carrusel"[^>]*>/g)].map((m) => m[0])
  const figuras = [...pagina.matchAll(/<figure\b[\s\S]*?<\/figure>/g)].map((m) => m[0])
  const leyendas = [...pagina.matchAll(/<p\b[^>]*data-leyenda-fija="true"[^>]*>[\s\S]*?<\/p>/g)].map((m) => m[0])

  it('son tres, sin botón de pausa y sin la "mano" como cursor', () => {
    expect(visores).toHaveLength(3)
    expect(pagina).not.toMatch(/Pausar el carrusel|Reanudar el carrusel/)
    for (const v of visores) expect(v).not.toMatch(/cursor-grab/)
  })

  it('en la computadora, cada uno se maneja con clic en los costados (en pantallas táctiles no existen)', () => {
    const costados = botones(pagina).filter((b) => /aria-label="Foto (anterior|siguiente)"/.test(b))
    expect(costados).toHaveLength(6)
    for (const b of costados) expect(b).toMatch(/\bhidden\b[\s\S]*\[@media\(hover:hover\)_and_\(pointer:fine\)\]:block/)
  })

  it('la leyenda queda quieta: ninguna foto la lleva adentro, hay una por carrusel y deja pasar el dedo', () => {
    expect(figuras.length).toBe(18)
    for (const figura of figuras) expect(figura).not.toMatch(/<figcaption/)
    expect(leyendas).toHaveLength(3)
    for (const l of leyendas) expect(l).toMatch(/pointer-events-none/)
  })

  it('el texto de la leyenda cambia con un fundido: se ve el de la foto actual y los otros quedan ocultos', () => {
    for (const l of leyendas) {
      const textos = [...l.matchAll(/<span\b([^>]*)>([^<]*)<\/span>/g)].map((m) => ({ atributos: m[1], texto: m[2] }))
      expect(textos).toHaveLength(6)
      expect(textos[0].atributos).toMatch(/opacity-100/)
      expect(textos[0].atributos).not.toMatch(/aria-hidden="true"/)
      for (const otro of textos.slice(1)) {
        expect(otro.atributos).toMatch(/opacity-0/)
        expect(otro.atributos).toMatch(/aria-hidden="true"/)
      }
    }
  })

  it('al pasar el mouse sube la tarjeta entera (foto, leyenda y costados juntos), como la diseñó Marco', () => {
    for (const v of visores) {
      expect(v).toMatch(/rounded-\[inherit\]/)
      expect(v).not.toMatch(/hover:-translate-y-1/)
    }
    expect(pagina.match(/<div class="relative w-full rounded-lg [^"]*lg:hover:-translate-y-1"/g)).toHaveLength(3)
  })
})
