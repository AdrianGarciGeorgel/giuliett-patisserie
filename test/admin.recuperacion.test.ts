import { describe, expect, it } from 'vitest'
import {
  LARGO_MINIMO_CONTRASENA,
  MENSAJE_ENLACE_ENVIADO,
  normalizarEmail,
  validarNuevaContrasena,
} from '@/lib/admin/recuperacion'

describe('normalizarEmail', () => {
  it('recorta, pasa a minúsculas y exige forma de email', () => {
    expect(normalizarEmail('  Giu@Ejemplo.com ')).toBe('giu@ejemplo.com')
    expect(normalizarEmail('sin-arroba.com')).toBeNull()
    expect(normalizarEmail('a@b')).toBeNull()
    expect(normalizarEmail('')).toBeNull()
    expect(normalizarEmail(undefined)).toBeNull()
    expect(normalizarEmail(42)).toBeNull()
  })
})

describe('validarNuevaContrasena', () => {
  it(`exige al menos ${LARGO_MINIMO_CONTRASENA} caracteres`, () => {
    const corta = validarNuevaContrasena('corta1', 'corta1')
    expect(corta.ok).toBe(false)
    if (!corta.ok) expect(corta.error).toMatch(new RegExp(String(LARGO_MINIMO_CONTRASENA)))
  })

  it('exige que las dos coincidan', () => {
    const distintas = validarNuevaContrasena('unaClaveLarga123', 'otraClaveLarga123')
    expect(distintas.ok).toBe(false)
    if (!distintas.ok) expect(distintas.error).toMatch(/coinciden/i)
  })

  it('acepta una contraseña válida y la devuelve tal cual (sin recortar espacios internos)', () => {
    const ok = validarNuevaContrasena('mi clave con espacios 2026', 'mi clave con espacios 2026')
    expect(ok).toEqual({ ok: true, password: 'mi clave con espacios 2026' })
  })

  it('no acepta valores que no sean texto', () => {
    expect(validarNuevaContrasena(undefined, undefined).ok).toBe(false)
    expect(validarNuevaContrasena(null, 'x').ok).toBe(false)
  })
})

describe('mensaje al pedir el enlace', () => {
  it('no revela si el email existe (anti-enumeración) y avisa mirar spam', () => {
    expect(MENSAJE_ENLACE_ENVIADO).toMatch(/^Si /)
    expect(MENSAJE_ENLACE_ENVIADO).toMatch(/spam/i)
    expect(MENSAJE_ENLACE_ENVIADO).not.toMatch(/no existe|no encontramos|no está registrado/i)
  })
})
