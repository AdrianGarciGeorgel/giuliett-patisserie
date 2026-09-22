import { describe, expect, it } from 'vitest'
import { armarMensajeWhatsapp, formatearFecha, linkWhatsappA, normalizarWhatsapp } from '@/lib/consultas/whatsapp'

describe('armarMensajeWhatsapp', () => {
  it('incluye siempre saludo, nombre y WhatsApp, y omite lo que no se completó', () => {
    const texto = armarMensajeWhatsapp({
      saludo: 'Hola Giuliett! Quiero hacer una consulta.',
      nombre: 'Ana Pérez',
      whatsapp: '+54 9 261 713 7765',
    })
    expect(texto).toBe(
      ['Hola Giuliett! Quiero hacer una consulta.', '', 'Nombre: Ana Pérez', 'WhatsApp: +54 9 261 713 7765'].join('\n'),
    )
  })

  it('agrega cada dato completado en su línea, con la fecha en formato argentino', () => {
    const texto = armarMensajeWhatsapp({
      saludo: 'Hola Giuliett! Quisiera una propuesta para un evento.',
      nombre: 'Ana',
      whatsapp: '2617137765',
      email: 'ana@ejemplo.com',
      empresa: 'LTN',
      producto: 'Marquise',
      tipoPedido: 'Boda',
      fechaEvento: '2026-11-15',
      invitados: '80',
      tematica: 'Flores y lila',
      intereses: ['Mesa dulce', 'Torta'],
      opcionEspecial: 'Sí, Sin TACC',
      mensaje: 'Queremos algo delicado.',
    })
    expect(texto.split('\n')).toEqual([
      'Hola Giuliett! Quisiera una propuesta para un evento.',
      '',
      'Nombre: Ana',
      'WhatsApp: 2617137765',
      'Email: ana@ejemplo.com',
      'Empresa: LTN',
      'Producto: Marquise',
      'Tipo de pedido: Boda',
      'Fecha del evento: 15/11/2026',
      'Cantidad aproximada de personas: 80',
      'Temática: Flores y lila',
      'Productos / intereses: Mesa dulce, Torta',
      'Opción especial: Sí, Sin TACC',
      'Idea: Queremos algo delicado.',
    ])
  })

  it('en el recorrido mayorista nombra al local como tal y suma localidad, volumen y frecuencia', () => {
    const texto = armarMensajeWhatsapp({
      saludo: 'Hola',
      nombre: 'Ana',
      whatsapp: '261',
      empresa: 'Café Central',
      etiquetaEmpresa: 'Local',
      localidad: 'Godoy Cruz',
      volumen: '40 unidades por semana',
      frecuencia: 'Semanal',
    })
    expect(texto.split('\n').slice(4)).toEqual([
      'Local: Café Central',
      'Localidad: Godoy Cruz',
      'Volumen estimado: 40 unidades por semana',
      'Frecuencia: Semanal',
    ])
  })

  it('no deja líneas con valores vacíos aunque el campo venga como cadena vacía', () => {
    const texto = armarMensajeWhatsapp({
      saludo: 'Hola',
      nombre: 'Ana',
      whatsapp: '261',
      email: '',
      tematica: '   ',
      intereses: [],
    })
    expect(texto).not.toContain('Email')
    expect(texto).not.toContain('Temática')
    expect(texto).not.toContain('intereses')
  })
})

describe('formatearFecha', () => {
  it('pasa de AAAA-MM-DD a DD/MM/AAAA', () => {
    expect(formatearFecha('2026-11-15')).toBe('15/11/2026')
  })
  it('devuelve lo que recibe si no reconoce el formato', () => {
    expect(formatearFecha('noviembre')).toBe('noviembre')
  })
})

describe('normalizarWhatsapp', () => {
  it.each([
    ['+54 9 261 713-7765', '5492617137765'],
    ['54 9 261 713 7765', '5492617137765'],
    ['2617137765', '5492617137765'],
    ['02617137765', '5492617137765'],
    ['(261) 713 7765', '5492617137765'],
    ['54 261 713 7765', '5492617137765'],
  ])('%s → %s', (entrada, esperado) => {
    expect(normalizarWhatsapp(entrada)).toBe(esperado)
  })

  it('devuelve null si no hay un número usable', () => {
    expect(normalizarWhatsapp('')).toBeNull()
    expect(normalizarWhatsapp('abc')).toBeNull()
    expect(normalizarWhatsapp('12345')).toBeNull()
  })
})

describe('linkWhatsappA', () => {
  it('arma el link wa.me con el número normalizado y el texto codificado', () => {
    expect(linkWhatsappA('261 713 7765', 'Hola Ana, ¿cómo estás?')).toBe(
      'https://wa.me/5492617137765?text=Hola%20Ana%2C%20%C2%BFc%C3%B3mo%20est%C3%A1s%3F',
    )
  })
  it('devuelve null si el número no sirve', () => {
    expect(linkWhatsappA('abc', 'Hola')).toBeNull()
  })
})
