import { describe, expect, it } from 'vitest'
import { FORMULARIOS } from '@/lib/consultas/formularios'
import { AVISO_SIN_TACC, ETIQUETA_ORIGEN, ORIGENES } from '@/lib/consultas/tipos'

/* Lo que el Master Plan de Giuliett exige de los formularios, como test. */

describe('los cuatro recorridos', () => {
  it('son exactamente particular, evento, empresa y mayorista', () => {
    expect([...ORIGENES]).toEqual(['particular', 'evento', 'empresa', 'mayorista'])
    expect(Object.keys(FORMULARIOS).sort()).toEqual([...ORIGENES].sort())
    expect(Object.keys(ETIQUETA_ORIGEN).sort()).toEqual([...ORIGENES].sort())
  })

  it.each(ORIGENES)('%s tiene etiqueta, saludo, botón y mensaje libre', (origen) => {
    const config = FORMULARIOS[origen]
    expect(config.etiqueta.length).toBeGreaterThan(0)
    expect(config.saludo).toMatch(/^Hola Giuliett!/)
    expect(config.textoBoton.length).toBeGreaterThan(0)
    expect(config.campos).toContain('mensaje')
  })

  it('particular y evento preguntan tipo, fecha, cantidad y temática', () => {
    for (const origen of ['particular', 'evento'] as const) {
      expect(FORMULARIOS[origen].campos).toEqual(expect.arrayContaining(['tipoPedido', 'fechaEvento', 'invitados', 'tematica']))
      expect(FORMULARIOS[origen].tiposPedido.length).toBeGreaterThan(0)
    }
  })

  it('empresa pide el nombre de la empresa', () => {
    expect(FORMULARIOS.empresa.campos).toContain('empresa')
    expect(FORMULARIOS.empresa.etiquetaEmpresa).toBe('Empresa')
  })

  it('mayorista califica al local: nombre, localidad, volumen y frecuencia', () => {
    expect(FORMULARIOS.mayorista.campos).toEqual(expect.arrayContaining(['empresa', 'localidad', 'volumen', 'frecuencia']))
    expect(FORMULARIOS.mayorista.etiquetaEmpresa).toBe('Nombre del local')
  })

  it('el aviso legal del Sin TACC dice que es tercerizado y según disponibilidad, sin prometer tiempos', () => {
    expect(AVISO_SIN_TACC).toMatch(/proveedor habilitado/)
    expect(AVISO_SIN_TACC).toMatch(/disponibilidad/)
    expect(AVISO_SIN_TACC).not.toMatch(/\d+\s*(hs|horas|días)/i)
  })

  it('ningún saludo promete tiempos de respuesta', () => {
    for (const config of Object.values(FORMULARIOS)) {
      expect(config.saludo).not.toMatch(/\d+\s*(hs|horas|días)/i)
    }
  })
})
