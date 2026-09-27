// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { TrustedClients } from '@/components/giuliett/trusted-clients'
import { CLIENTS } from '@/lib/giuliett'

/**
 * "Clientes que confían" (/contacto). Los logos tenían `alt=""`, como si fueran adorno: un lector de pantalla no
 * decía qué empresas son (checklist de Marco, puntos 6 y 9). Revisión de la página del 26-09-2026.
 */
describe('logos de clientes', () => {
  const html = renderToStaticMarkup(<TrustedClients />)

  it('cada logo lleva el nombre de su empresa como texto alternativo', () => {
    expect(CLIENTS.length).toBeGreaterThan(0)
    for (const cliente of CLIENTS) expect(html).toContain(`src="${cliente.Image}" alt="${cliente.text}"`)
  })
})
