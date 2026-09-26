// @vitest-environment node
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

/**
 * Checklist de Marco, puntos 6 (SEO) y 9 (accesibilidad): un solo <h1> por página.
 *
 * Regresión encontrada en el barrido post-deploy del 26-09-2026 sobre el dominio: la home tenía
 * 4 <h1> (uno por slide del carrusel) y galería 2 (el "Hecho para disfrutar" visible y un
 * encabezado invisible de sección). La Fase C lo había dado por resuelto sin un test que lo
 * cubriera: este lo cubre renderizando cada página pública tal como la arma el servidor.
 */

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useRouter: () => ({ push: () => {}, replace: () => {}, prefetch: () => {}, back: () => {} }),
  notFound: () => {
    throw new Error('notFound')
  },
}))

import Home from '@/app/page'
import ContactoPage from '@/app/contacto/page'
import EventosPage from '@/app/eventos/page'
import GaleriaPage from '@/app/galeria/page'
import GiuPage from '@/app/giu/page'
import ProductosPage from '@/app/productos/page'
import ProductPage from '@/app/productos/[slug]/page'

function h1s(html: string) {
  return [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)].map((m) => m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
}

const paginas: Array<[string, () => ReactElement | Promise<ReactElement>]> = [
  ['/', () => Home()],
  ['/productos', () => ProductosPage({ searchParams: Promise.resolve({}) })],
  ['/productos/marquise', () => ProductPage({ params: Promise.resolve({ slug: 'marquise' }) })],
  ['/eventos', () => EventosPage()],
  ['/giu', () => GiuPage()],
  ['/galeria', () => GaleriaPage()],
  ['/contacto', () => ContactoPage()],
]

describe('un solo <h1> por página pública', () => {
  it.each(paginas)('%s tiene exactamente un <h1>', async (_ruta, render) => {
    const html = renderToStaticMarkup(await render())
    const encontrados = h1s(html)
    expect(encontrados, `h1 encontrados: ${JSON.stringify(encontrados)}`).toHaveLength(1)
    expect(encontrados[0].length).toBeGreaterThan(0)
  })

  it('la home dice qué es Giuliett en su <h1> (no el nombre de una categoría del carrusel)', () => {
    const [titulo] = h1s(renderToStaticMarkup(Home()))
    expect(titulo).toMatch(/Giuliett/)
    expect(titulo).not.toMatch(/^(Tortas clásicas|Tortas personalizadas|Galletas personalizadas|Boxes)$/)
  })
})
