import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { excluirPanel } from '@/lib/analitica'
import { jsonLdSeguro } from '@/lib/seo'

/** Endurecimientos chicos de la auditoría del 26-09-2026. */
const leer = (ruta: string) => readFileSync(join(process.cwd(), ruta), 'utf8')

describe('datos estructurados (JSON-LD)', () => {
  it('se escapan: un nombre con </script> no puede cerrar el bloque e inyectar código', () => {
    // Hoy los datos son fijos; con el CMS de la Fase D podrían venir de un formulario.
    const html = jsonLdSeguro({ name: '</script><script>alert(1)</script>' })
    expect(html).not.toMatch(/<\/script/i)
    expect(html).not.toContain('<')
    expect(JSON.parse(html)).toEqual({ name: '</script><script>alert(1)</script>' })
  })

  it('el layout y la ficha de producto usan la versión escapada', () => {
    for (const archivo of ['app/layout.tsx', 'app/productos/[slug]/page.tsx']) {
      const fuente = leer(archivo)
      expect(fuente, archivo).toMatch(/jsonLdSeguro\(/)
      expect(fuente, archivo).not.toMatch(/__html: JSON\.stringify/)
    }
  })
})

describe('analítica', () => {
  const visita = (url: string) => ({ type: 'pageview' as const, url })

  it('no registra las páginas del panel (URLs con el id de cada consulta)', () => {
    expect(excluirPanel(visita('https://giuliettpatisserie.com/admin/consultas/a3bb189e?error=datos'))).toBeNull()
    expect(excluirPanel(visita('https://giuliettpatisserie.com/admin'))).toBeNull()
  })

  it('las páginas públicas se registran igual que antes', () => {
    const evento = visita('https://giuliettpatisserie.com/productos?categoria=boxes')
    expect(excluirPanel(evento)).toBe(evento)
    expect(excluirPanel(visita('https://giuliettpatisserie.com/administracion-de-eventos'))).not.toBeNull()
  })
})

describe('higiene del repo', () => {
  it('.gitignore cubre todos los .env (los dos repos son públicos), salvo el ejemplo', () => {
    const lineas = leer('.gitignore').split(/\r?\n/).map((l) => l.trim())
    expect(lineas).toContain('.env*')
    expect(lineas).toContain('!.env.example')
  })

  it('el aviso por email (usa la clave de Resend) no se puede importar desde el navegador', () => {
    expect(leer('lib/notificaciones/consulta-nueva.ts')).toMatch(/^import 'server-only'/m)
  })
})
