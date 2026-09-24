import { describe, expect, it } from 'vitest'
import {
  RUTAS_PUBLICAS_ADMIN,
  RUTA_CALLBACK,
  RUTA_LOGIN,
  RUTA_RECUPERAR,
  RUTA_RESTABLECER,
  destinoSeguro,
  esRutaPublicaAdmin,
} from '@/lib/admin/rutas'

/**
 * proxy.ts protege /admin. Estas son las únicas puertas que se pueden cruzar sin
 * sesión: el login, el pedido de recuperación y el callback que canjea el enlace
 * del email por una sesión. Restablecer la contraseña exige sesión (la que da el
 * enlace), así que NO es pública.
 */
describe('rutas públicas del panel', () => {
  it('login, recuperar y callback son públicas; restablecer y el resto no', () => {
    expect(RUTAS_PUBLICAS_ADMIN).toEqual([RUTA_LOGIN, RUTA_RECUPERAR, RUTA_CALLBACK])
    expect(esRutaPublicaAdmin('/admin/login')).toBe(true)
    expect(esRutaPublicaAdmin('/admin/recuperar')).toBe(true)
    expect(esRutaPublicaAdmin('/admin/auth/callback')).toBe(true)
    expect(esRutaPublicaAdmin(RUTA_RESTABLECER)).toBe(false)
    expect(esRutaPublicaAdmin('/admin')).toBe(false)
    expect(esRutaPublicaAdmin('/admin/consultas/abc')).toBe(false)
  })

  it('tolera la barra final pero no prefijos ni disfraces', () => {
    expect(esRutaPublicaAdmin('/admin/login/')).toBe(true)
    expect(esRutaPublicaAdmin('/admin/login/otra')).toBe(false)
    expect(esRutaPublicaAdmin('/admin/loginx')).toBe(false)
    expect(esRutaPublicaAdmin('/ADMIN/LOGIN')).toBe(false)
  })
})

describe('destinoSeguro: a dónde volver después del callback', () => {
  it('acepta solo rutas internas del panel', () => {
    expect(destinoSeguro('/admin/restablecer')).toBe('/admin/restablecer')
    expect(destinoSeguro('/admin/consultas/123?guardado=1')).toBe('/admin/consultas/123?guardado=1')
  })

  it('rechaza todo lo que pueda sacar al usuario del sitio (open redirect)', () => {
    const malos: Array<string | null | undefined> = [
      'https://evil.com/admin',
      '//evil.com',
      '/\\evil.com',
      '/productos',
      'admin',
      '',
      null,
      undefined,
      '/admin/../x',
    ]
    for (const malo of malos) expect(destinoSeguro(malo)).toBe('/admin')
  })

  it('permite elegir otro destino por defecto', () => {
    expect(destinoSeguro(null, '/admin/login')).toBe('/admin/login')
  })
})
