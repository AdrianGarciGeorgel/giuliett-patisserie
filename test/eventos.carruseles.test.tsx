import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

/**
 * Los tres carruseles de /eventos se comportan como los de la home y la galería (pedido de Adrián del
 * 26-09-2026). Que avancen solos no se ve en el HTML (es un efecto del navegador): acá se revisa que la página
 * se los pida a cada uno.
 */
const { recibidos } = vi.hoisted(() => ({ recibidos: [] as Record<string, unknown>[] }))

vi.mock('@/components/giuliett/hero-carousel', () => ({
  HeroCarousel: (props: Record<string, unknown>) => {
    recibidos.push(props)
    return null
  },
}))

import EventosPage from '@/app/eventos/page'

describe('página de eventos: lo que le pide a cada carrusel', () => {
  it('los tres avanzan solos, se manejan con los costados, sin "mano" y con la leyenda quieta', async () => {
    renderToStaticMarkup(await EventosPage())
    expect(recibidos).toHaveLength(3)
    for (const props of recibidos) {
      expect(props).toMatchObject({
        autoplay: true,
        navegacionLateral: true,
        cursorNormal: true,
        leyendaFija: true,
        showProductButton: false,
      })
    }
  })
})
