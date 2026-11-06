import { readFileSync } from 'node:fs'
import { join } from 'node:path'
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

  it('el ícono de la pestaña es el de Giuliett que hizo Marco (6-11-2026), no el "v0" de la plantilla', () => {
    // Marco lo cambió en su repo; acá se fija que los archivos estén y midan lo que se declara.
    const iconos = metadata.icons as { icon: { url: string; sizes: string }[]; apple: { url: string; sizes: string }[] }
    const todos = [...iconos.icon, ...iconos.apple]
    expect(iconos.icon.map((i) => i.url)).toEqual(['/Giuliett_favicon_claro_32x32.png', '/Giuliett_favicon_oscuro_32x32.png'])
    expect(JSON.stringify(metadata.icons)).not.toMatch(/icon\.svg|apple-icon|icon-(light|dark)-32x32/)
    for (const { url, sizes } of todos) {
      const png = readFileSync(join(process.cwd(), 'public', url))
      expect(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`).toBe(sizes)
    }
  })
})
