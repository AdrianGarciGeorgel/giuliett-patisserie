// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import PaginaNoEncontrada, { metadata } from '@/app/not-found'

/** La 404 propia (QA del 26-09-2026): la de fábrica de Next salía en inglés y sin región principal. */
describe('página 404', () => {
  const html = renderToStaticMarkup(<PaginaNoEncontrada />)

  it('está en español y no en el inglés de fábrica de Next', () => {
    expect(html).toMatch(/No encontramos esta página/)
    expect(html).not.toMatch(/could not be found/i)
    expect(metadata.title).toBe('Página no encontrada')
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
