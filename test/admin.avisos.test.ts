import { describe, expect, it } from 'vitest'
import { avisoDeLogin, codigoDeErrorConsulta, esperaParaRespuestaPareja, mensajeDeErrorConsulta, origenParaEnlaces } from '@/lib/admin/avisos'

/** Endurecimiento del panel (auditoría del 26-09-2026). */

describe('avisoDeLogin', () => {
  it('muestra el texto de un motivo conocido', () => {
    expect(avisoDeLogin('enlace-invalido')).toMatch(/venció o ya se usó/)
  })

  it('ignora motivos que no son suyos: "__proto__" o "constructor" en la URL rompían la página (error 500)', () => {
    expect(avisoDeLogin('__proto__')).toBeUndefined()
    expect(avisoDeLogin('constructor')).toBeUndefined()
    expect(avisoDeLogin('toString')).toBeUndefined()
    expect(avisoDeLogin(undefined)).toBeUndefined()
  })
})

describe('errores al guardar una consulta', () => {
  it('la URL lleva un código, nunca texto libre', () => {
    expect(codigoDeErrorConsulta('notas_internas')).toBe('notas')
    expect(codigoDeErrorConsulta('estado')).toBe('datos')
    expect(codigoDeErrorConsulta(undefined)).toBe('datos')
  })

  it('solo se muestran mensajes fijos: un texto armado en un link no aparece en el panel', () => {
    expect(mensajeDeErrorConsulta('notas')).toMatch(/4000/)
    expect(mensajeDeErrorConsulta('guardar')).toMatch(/No se pudo guardar/)
    expect(mensajeDeErrorConsulta('Por seguridad, escribí tu contraseña en este otro sitio')).toBeUndefined()
    expect(mensajeDeErrorConsulta('__proto__')).toBeUndefined()
    expect(mensajeDeErrorConsulta(undefined)).toBeUndefined()
  })
})

describe('recuperación de contraseña', () => {
  it('la respuesta tarda lo mismo exista o no la cuenta: se completa hasta un mínimo', () => {
    expect(esperaParaRespuestaPareja(1000, 1200, 1500)).toBe(1300)
    expect(esperaParaRespuestaPareja(1000, 2600, 1500)).toBe(0)
  })

  it('el enlace del email vuelve solo a un origen conocido, nunca al Host que mande quien pide', () => {
    const base = 'https://giuliettpatisserie.com'
    expect(origenParaEnlaces('giuliettpatisserie.com', 'https', base, false)).toBe('https://giuliettpatisserie.com')
    expect(origenParaEnlaces('giuliett-patisserie-nu.vercel.app', 'https', base, false)).toBe('https://giuliett-patisserie-nu.vercel.app')
    expect(origenParaEnlaces('evil.example', 'https', base, false)).toBe(base)
    expect(origenParaEnlaces(null, null, base, false)).toBe(base)
    // localhost solo en desarrollo
    expect(origenParaEnlaces('localhost:3000', 'http', base, false)).toBe(base)
    expect(origenParaEnlaces('localhost:3000', 'http', base, true)).toBe('http://localhost:3000')
  })
})
