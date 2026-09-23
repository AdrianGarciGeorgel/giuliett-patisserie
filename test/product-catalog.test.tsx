// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProductCatalog } from '@/components/giuliett/product-catalog'
import { PRODUCTS } from '@/lib/products'

/**
 * Checklist de Marco, punto 3 (Navegación producto → categoría).
 *
 * Bug encontrado en staging el 23-09-2026: al cambiar de categoría con el selector,
 * entrar a un producto y volver con "Atrás" del navegador, la URL decía
 * `?categoria=galletas-personalizadas` pero la grilla mostraba Boxes. El componente
 * guardaba la categoría en un estado local y nunca volvía a mirar la URL.
 *
 * Regla: la URL manda. Lo que dice la barra de direcciones es lo que se ve.
 */

let parametros = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useSearchParams: () => parametros,
}))

function render(initialCategory: Parameters<typeof ProductCatalog>[0]['initialCategory']) {
  return renderToStaticMarkup(<ProductCatalog initialCategory={initialCategory} productos={PRODUCTS} />)
}

beforeEach(() => {
  parametros = new URLSearchParams()
})

describe('ProductCatalog: la categoría sale de la URL', () => {
  it('si la URL trae ?categoria=, gana sobre la categoría inicial del servidor', () => {
    parametros = new URLSearchParams('categoria=galletas-personalizadas')
    const html = render('boxes')

    expect(html).toContain('/productos/galletas-artesanales?categoria=galletas-personalizadas')
    expect(html).not.toContain('/productos/box-cookies')
    expect(html).toContain('value="galletas-personalizadas" selected')
  })

  it('sin parámetro usa la categoría inicial', () => {
    const html = render('boxes')

    expect(html).toContain('/productos/box-cookies?categoria=boxes')
    expect(html).not.toContain('/productos/marquise')
  })

  it('un parámetro inválido no rompe: cae en la categoría inicial', () => {
    parametros = new URLSearchParams('categoria=inventada')
    const html = render('tortas-clasicas')

    expect(html).toContain('/productos/marquise?categoria=tortas-clasicas')
  })

  it('cada tarjeta lleva la categoría en el link para que "Volver" vuelva al mismo lugar', () => {
    parametros = new URLSearchParams('categoria=boxes')
    const html = render('tortas-clasicas')
    const links = [...html.matchAll(/href="(\/productos\/[^"]+)"/g)].map((m) => m[1])

    expect(links.length).toBeGreaterThan(0)
    for (const link of links) expect(link).toMatch(/\?categoria=boxes$/)
  })
})
