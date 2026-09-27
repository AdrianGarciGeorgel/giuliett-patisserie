/**
 * Reglas del formulario "Hacé tu pedido" (/contacto), el de Marco: qué se valida y qué mensaje llega por WhatsApp.
 * Puras, para poder testearlas (test/pedido.test.ts). QA del 26-09-2026 sobre producción: el email tenía asterisco
 * de obligatorio pero se aceptaba vacío o mal escrito y no llegaba en el mensaje, y un doble clic abría WhatsApp
 * dos veces.
 */

export type ValoresPedido = {
  name: string
  email: string
  whatsapp: string
  orderType: string
  eventDate: string
  people: string
  interests: string[]
  description: string
}

/** Los campos con asterisco, en el orden del formulario. */
const OBLIGATORIOS = ['name', 'email', 'whatsapp', 'orderType'] as const
export type CampoObligatorio = (typeof OBLIGATORIOS)[number]
export type ErroresPedido = Partial<Record<CampoObligatorio, string>>

// algo@algo.algo, sin espacios. No cubre todo lo que permite el estándar: frena los errores de tipeo.
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarPedido(valores: ValoresPedido): ErroresPedido {
  const errores: ErroresPedido = {}
  const email = valores.email.trim()
  if (!valores.name.trim()) errores.name = 'Contanos tu nombre para poder responderte.'
  if (!email) errores.email = 'Dejanos tu email para poder responderte.'
  else if (!FORMATO_EMAIL.test(email)) errores.email = 'Revisá tu email: parece incompleto.'
  if (!valores.whatsapp.trim()) errores.whatsapp = 'Necesitamos un WhatsApp para contactarte.'
  if (!valores.orderType) errores.orderType = 'Elegí el tipo de pedido que estás imaginando.'
  return errores
}

/** El primer campo con error, siguiendo el formulario de arriba hacia abajo. */
export function primerCampoConError(errores: ErroresPedido): CampoObligatorio | undefined {
  return OBLIGATORIOS.find((campo) => errores[campo])
}

export function armarMensajePedido(valores: ValoresPedido): string {
  return [
    'Hola Giuliett! Quiero hacer una consulta.',
    '',
    `Nombre: ${valores.name.trim()}`,
    `Email: ${valores.email.trim()}`,
    `WhatsApp: ${valores.whatsapp.trim()}`,
    `Tipo de pedido: ${valores.orderType}`,
    `Fecha del evento: ${valores.eventDate || 'No especificada'}`,
    `Cantidad aproximada de personas: ${valores.people.trim() || 'No especificada'}`,
    `Productos / intereses: ${valores.interests.length ? valores.interests.join(', ') : 'No especificados'}`,
    `Idea: ${valores.description.trim() || 'No especificada'}`,
  ].join('\n')
}

/** Un segundo envío dentro de este tiempo (un doble clic) se ignora: abría WhatsApp dos veces. */
export const ESPERA_ENTRE_ENVIOS_MS = 2000

export function esEnvioRepetido(ahora: number, anterior: number): boolean {
  return ahora - anterior < ESPERA_ENTRE_ENVIOS_MS
}
