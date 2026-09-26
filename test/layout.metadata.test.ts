import { describe, expect, it, vi } from 'vitest'
import { metadata } from '../app/layout'

// El layout raíz importa fuentes, CSS y componentes de cliente: acá solo interesa su `metadata`.
// Vitest sube estos vi.mock por encima de los imports, así que aplican al import de arriba.
vi.mock('next/font/google', () => ({
  Poppins: () => ({ variable: '', className: '' }),
  Ephesis: () => ({ variable: '', className: '' }),
}))
vi.mock('@vercel/analytics/next', () => ({ Analytics: () => null }))
vi.mock('@/components/giuliett/mobile-bottom-nav', () => ({ GlobalNavigation: () => null }))
vi.mock('../app/globals.css', () => ({}))

describe('metadata del layout raíz', () => {
  it('no fija "robots": indexar es lo que pasa por defecto, y fijarlo choca con el noindex de la página 404', () => {
    // Con `robots: { index: true }` en el layout, la 404 salía con dos metas contradictorias
    // (index,follow y noindex). El panel fija su propio noindex en app/admin/layout.tsx.
    expect(metadata).not.toHaveProperty('robots')
  })

  it('conserva la base de las URLs y el título del sitio', () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL)
    expect(JSON.stringify(metadata.title)).toMatch(/Giuliett/)
  })
})
