// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import PaginaNoEncontrada, { metadata } from '@/app/not-found'

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('notFound')
  },
}))

import { generateMetadata } from '@/app/productos/[slug]/page'

/** La 404 propia (QA del 26-09-2026): la de fábrica de Next salía en inglés y sin región principal. */
describe('página 404', () => {
  const html = renderToStaticMarkup(<PaginaNoEncontrada />)

  it('está en español y no en el inglés de fábrica de Next', () => {
    expect(html).toMatch(/No encontramos esta página/)
    expect(html).not.toMatch(/could not be found/i)
  })

  it('el título de la pestaña sigue el formato del resto de la web', () => {
    expect(metadata.title).toBe('Página no encontrada · Giuliett Pâtisserie')
  })

  it('un producto que no existe no pide "no indexar" por su cuenta: ya lo pone Next (si no, salían dos)', async () => {
    const datos = await generateMetadata({ params: Promise.resolve({ slug: 'no-existe' }) })
    expect(datos.title).toBe('Producto no encontrado · Giuliett Pâtisserie')
    expect(datos).not.toHaveProperty('robots')
  })

  it('tiene región principal y un solo h1 (lectores de pantalla)', () => {
    expect(html).toMatch(/<main\b/)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
  })

  it('ofrece el camino de vuelta y el WhatsApp directo', () => {
    expect(html).toMatch(/href="\/productos"/)
    expect(html).toMatch(/href="\/"/)
    expect(html).toMatch(/href="https:\/\/wa\.me\/\d+\?text=/)
  })
})
