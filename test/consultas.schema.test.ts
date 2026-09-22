import { describe, expect, it } from 'vitest'
import { consultaEntradaSchema, erroresPorCampo, MENSAJES } from '@/lib/consultas/schema'

const minima = {
  origen: 'particular',
  nombre: 'Ana Pérez',
  whatsapp: '+54 9 261 713 7765',
  opcion_especial: 'ninguna',
}

describe('consultaEntradaSchema', () => {
  it('acepta una consulta mínima: origen, nombre, WhatsApp y opción especial', () => {
    const r = consultaEntradaSchema.safeParse(minima)
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.intereses).toEqual([])
      expect(r.data.email).toBeUndefined()
    }
  })

  it('exige la opción especial (campo obligatorio del Master Plan)', () => {
    const { opcion_especial: _sin, ...sinOpcion } = minima
    void _sin
    const r = consultaEntradaSchema.safeParse(sinOpcion)
    expect(r.success).toBe(false)
    if (!r.success) expect(erroresPorCampo(r.error).opcion_especial).toBe(MENSAJES.opcionEspecial)
  })

  it('rechaza una opción especial que no existe', () => {
    const r = consultaEntradaSchema.safeParse({ ...minima, opcion_especial: 'vegano' })
    expect(r.success).toBe(false)
  })

  it('trata los campos opcionales vacíos como ausentes, no como error', () => {
    const r = consultaEntradaSchema.safeParse({
      ...minima,
      email: '',
      fecha_evento: '',
      cantidad_personas: '',
      tematica: '   ',
      mensaje: '',
      localidad: '',
      volumen: '',
      frecuencia: '',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.email).toBeUndefined()
      expect(r.data.fecha_evento).toBeUndefined()
      expect(r.data.cantidad_personas).toBeUndefined()
      expect(r.data.tematica).toBeUndefined()
      expect(r.data.mensaje).toBeUndefined()
      expect(r.data.localidad).toBeUndefined()
    }
  })

  it('convierte la cantidad de personas que llega como texto', () => {
    const r = consultaEntradaSchema.safeParse({ ...minima, cantidad_personas: '25' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.cantidad_personas).toBe(25)
  })

  it('rechaza un email mal formado con el mensaje para el usuario', () => {
    const r = consultaEntradaSchema.safeParse({ ...minima, email: 'ana@' })
    expect(r.success).toBe(false)
    if (!r.success) expect(erroresPorCampo(r.error)).toEqual({ email: MENSAJES.email })
  })

  it('rechaza un WhatsApp con letras', () => {
    const r = consultaEntradaSchema.safeParse({ ...minima, whatsapp: '261 abc 7765' })
    expect(r.success).toBe(false)
    if (!r.success) expect(erroresPorCampo(r.error).whatsapp).toBe(MENSAJES.whatsappFormato)
  })

  it('rechaza un nombre vacío con el mensaje para el usuario', () => {
    const r = consultaEntradaSchema.safeParse({ ...minima, nombre: ' ' })
    expect(r.success).toBe(false)
    if (!r.success) expect(erroresPorCampo(r.error).nombre).toBe(MENSAJES.nombre)
  })

  it('rechaza una fecha que no es AAAA-MM-DD', () => {
    const r = consultaEntradaSchema.safeParse({ ...minima, fecha_evento: '15/11/2026' })
    expect(r.success).toBe(false)
    if (!r.success) expect(erroresPorCampo(r.error).fecha_evento).toBe(MENSAJES.fecha)
  })

  it('rechaza un mensaje de más de 2000 caracteres', () => {
    const r = consultaEntradaSchema.safeParse({ ...minima, mensaje: 'a'.repeat(2001) })
    expect(r.success).toBe(false)
    if (!r.success) expect(erroresPorCampo(r.error).mensaje).toBe(MENSAJES.mensajeLargo)
  })

  it('rechaza un origen que no existe (los viejos "general" y "corporativo" incluidos)', () => {
    for (const origen of ['otro', 'general', 'corporativo', 'producto']) {
      expect(consultaEntradaSchema.safeParse({ ...minima, origen }).success).toBe(false)
    }
  })

  it('en el recorrido Empresa exige el nombre de la empresa', () => {
    const r = consultaEntradaSchema.safeParse({ ...minima, origen: 'empresa' })
    expect(r.success).toBe(false)
    if (!r.success) expect(erroresPorCampo(r.error).empresa).toBe(MENSAJES.empresa)
    expect(consultaEntradaSchema.safeParse({ ...minima, origen: 'empresa', empresa: 'LTN' }).success).toBe(true)
  })

  it('en el recorrido Mayorista exige nombre del local y localidad', () => {
    const r = consultaEntradaSchema.safeParse({ ...minima, origen: 'mayorista' })
    expect(r.success).toBe(false)
    if (!r.success) {
      const errores = erroresPorCampo(r.error)
      expect(errores.empresa).toBe(MENSAJES.local)
      expect(errores.localidad).toBe(MENSAJES.localidad)
    }
    const ok = consultaEntradaSchema.safeParse({
      ...minima,
      origen: 'mayorista',
      empresa: 'Café Central',
      localidad: 'Godoy Cruz',
      volumen: '40 unidades por semana',
      frecuencia: 'Semanal',
    })
    expect(ok.success).toBe(true)
  })

  it('conserva tildes y caracteres especiales tal cual', () => {
    const r = consultaEntradaSchema.safeParse({ ...minima, nombre: 'Ñandú Ávila', mensaje: '¿Torta de 3 pisos? ¡Sí!' })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.nombre).toBe('Ñandú Ávila')
      expect(r.data.mensaje).toBe('¿Torta de 3 pisos? ¡Sí!')
    }
  })
})
