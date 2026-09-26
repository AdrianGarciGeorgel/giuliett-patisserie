import { describe, expect, it } from 'vitest'
import configNext from '../next.config.mjs'

/** Cabeceras de seguridad (punto 10 del checklist de Marco; auditoría del 26-09-2026). */
describe('next.config: seguridad', () => {
  it('no anuncia la tecnología del servidor (sin X-Powered-By: Next.js)', () => {
    expect(configNext.poweredByHeader).toBe(false)
  })

  it('las cabeceras de seguridad aplican a todo el sitio', async () => {
    const reglas = await configNext.headers!()
    const todoElSitio = reglas.find((r) => r.source === '/(.*)')
    const claves = (todoElSitio?.headers ?? []).map((h) => h.key)
    expect(claves).toEqual(
      expect.arrayContaining([
        'Content-Security-Policy',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'Referrer-Policy',
        'Permissions-Policy',
      ]),
    )
  })

  it('la CSP no permite scripts de terceros ni que la web se meta en un iframe', async () => {
    const reglas = await configNext.headers!()
    const csp = reglas.find((r) => r.source === '/(.*)')?.headers.find((h) => h.key === 'Content-Security-Policy')?.value ?? ''
    expect(csp).toMatch(/frame-ancestors 'none'/)
    expect(csp).toMatch(/object-src 'none'/)
    expect(csp).toMatch(/base-uri 'self'/)
    expect(csp).toMatch(/form-action 'self'/)
    const scripts = csp.split(';').find((d) => d.trim().startsWith('script-src')) ?? ''
    expect(scripts.trim().split(/\s+/).slice(1)).toEqual(["'self'", "'unsafe-inline'", 'https://va.vercel-scripts.com'])
  })

  it('el panel no se indexa ni se guarda en cachés intermedias', async () => {
    const reglas = await configNext.headers!()
    const admin = reglas.find((r) => r.source === '/admin/:path*')
    const valores = Object.fromEntries((admin?.headers ?? []).map((h) => [h.key, h.value]))
    expect(valores['X-Robots-Tag']).toMatch(/noindex/)
    expect(valores['Cache-Control']).toMatch(/no-store/)
  })
})
