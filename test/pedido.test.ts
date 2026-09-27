import { describe, expect, it } from 'vitest'
import { waLink } from '@/lib/giuliett'
import {
  ESPERA_ENTRE_ENVIOS_MS,
  armarMensajePedido,
  esEnvioRepetido,
  primerCampoConError,
  validarPedido,
  type ValoresPedido,
} from '@/lib/pedido'

/**
 * Formulario "Hacé tu pedido" (/contacto), el de Marco. QA del 26-09-2026 sobre producción:
 * - el email tenía asterisco de obligatorio, pero se aceptaba vacío o mal escrito y no llegaba en el mensaje;
 * - un doble clic en "Enviar" abría WhatsApp dos veces.
 */
const vacio: ValoresPedido = {
  name: '',
  email: '',
  whatsapp: '',
  orderType: '',
  eventDate: '',
  people: '',
  interests: [],
  description: '',
}

const completo: ValoresPedido = {
  name: '  José Ñandú & Cía #1 ',
  email: ' jose.perez+eventos@mail.com.ar ',
  whatsapp: ' 261 555-1234 ',
  orderType: 'Evento',
  eventDate: '2026-12-05',
  people: ' 80 ',
  interests: ['Bodas', 'Mesa dulce'],
  description: ' Mesa dulce para 80 🎂\n¿Se puede sin frutos secos? 50% chocolate + 50% frutilla = ideal ',
}

describe('validarPedido', () => {
  it('vacío: pide los cuatro campos con asterisco, con los textos de Marco para los que ya tenía', () => {
    expect(validarPedido(vacio)).toEqual({
      name: 'Contanos tu nombre para poder responderte.',
      email: 'Dejanos tu email para poder responderte.',
      whatsapp: 'Necesitamos un WhatsApp para contactarte.',
      orderType: 'Elegí el tipo de pedido que estás imaginando.',
    })
  })

  it('solo espacios cuenta como vacío', () => {
    const errores = validarPedido({ ...completo, name: '   ', email: '  ', whatsapp: ' ' })
    expect(Object.keys(errores).sort()).toEqual(['email', 'name', 'whatsapp'])
  })

  it.each(['jose@ejemplo', 'jose', 'jose@', '@mail.com', 'jose@.com', 'jose @mail.com', 'jose@mail.', 'jose@@mail.com'])(
    'un email mal escrito no pasa: %s',
    (email) => {
      expect(validarPedido({ ...completo, email }).email).toBe('Revisá tu email: parece incompleto.')
    },
  )

  it.each(['jose@ejemplo.com', 'Jose.Perez+eventos@mail.com.ar', ' hola@giuliettpatisserie.com '])('un email bien escrito pasa: %s', (email) => {
    expect(validarPedido({ ...completo, email }).email).toBeUndefined()
  })

  it('completo: sin errores (fecha, invitados, intereses e idea siguen siendo opcionales)', () => {
    expect(validarPedido(completo)).toEqual({})
    expect(validarPedido({ ...completo, eventDate: '', people: '', interests: [], description: '' })).toEqual({})
  })
})

describe('primerCampoConError', () => {
  it('sigue el orden del formulario: nombre, email, teléfono, tipo de pedido', () => {
    expect(primerCampoConError(validarPedido(vacio))).toBe('name')
    expect(primerCampoConError({ orderType: 'x', email: 'x' })).toBe('email')
    expect(primerCampoConError({ orderType: 'x', whatsapp: 'x' })).toBe('whatsapp')
    expect(primerCampoConError({ orderType: 'x' })).toBe('orderType')
    expect(primerCampoConError({})).toBeUndefined()
  })
})

describe('armarMensajePedido', () => {
  it('el email llega en el mensaje, debajo del nombre; el resto queda como lo armó Marco', () => {
    expect(armarMensajePedido(completo)).toBe(
      [
        'Hola Giuliett! Quiero hacer una consulta.',
        '',
        'Nombre: José Ñandú & Cía #1',
        'Email: jose.perez+eventos@mail.com.ar',
        'WhatsApp: 261 555-1234',
        'Tipo de pedido: Evento',
        'Fecha del evento: 2026-12-05',
        'Cantidad aproximada de personas: 80',
        'Productos / intereses: Bodas, Mesa dulce',
        'Idea: Mesa dulce para 80 🎂\n¿Se puede sin frutos secos? 50% chocolate + 50% frutilla = ideal',
      ].join('\n'),
    )
  })

  it('lo opcional sin completar dice "No especificada/os"', () => {
    const mensaje = armarMensajePedido({ ...completo, eventDate: '', people: '  ', interests: [], description: ' ' })
    expect(mensaje).toContain('Fecha del evento: No especificada')
    expect(mensaje).toContain('Cantidad aproximada de personas: No especificada')
    expect(mensaje).toContain('Productos / intereses: No especificados')
    expect(mensaje).toContain('Idea: No especificada')
  })

  it('tildes, ñ, emojis y símbolos llegan intactos a WhatsApp', () => {
    const mensaje = armarMensajePedido(completo)
    expect(new URL(waLink(mensaje)).searchParams.get('text')).toBe(mensaje)
  })
})

describe('esEnvioRepetido', () => {
  it('un segundo envío pegado al primero (doble clic) se ignora; uno posterior, no', () => {
    expect(esEnvioRepetido(1000, -Infinity)).toBe(false)
    expect(esEnvioRepetido(1250, 1000)).toBe(true)
    expect(esEnvioRepetido(1000 + ESPERA_ENTRE_ENVIOS_MS - 1, 1000)).toBe(true)
    expect(esEnvioRepetido(1000 + ESPERA_ENTRE_ENVIOS_MS, 1000)).toBe(false)
  })
})
