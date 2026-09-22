/* Armado del mensaje de WhatsApp y normalización de números.
   Sin imports de servidor: lo usan el formulario (navegador) y el panel. */

export type DatosMensaje = {
  saludo: string
  nombre: string
  whatsapp: string
  email?: string
  empresa?: string
  /** Cómo llamar a `empresa` en el mensaje: "Empresa" o "Local". */
  etiquetaEmpresa?: string
  localidad?: string
  producto?: string
  tipoPedido?: string
  fechaEvento?: string
  invitados?: string
  volumen?: string
  frecuencia?: string
  tematica?: string
  intereses?: readonly string[]
  opcionEspecial?: string
  mensaje?: string
}

/** AAAA-MM-DD → DD/MM/AAAA. Cualquier otra cosa vuelve igual. */
export function formatearFecha(fecha: string) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha.trim())
  return partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : fecha
}

const conValor = (valor?: string) => (valor ?? '').trim()

/**
 * El mensaje que el cliente le manda a Giu. Nombre y WhatsApp van siempre;
 * el resto solo si se completó. Menos líneas, más fácil de leer en el celular.
 */
export function armarMensajeWhatsapp(datos: DatosMensaje) {
  const lineas: Array<[string, string]> = [
    ['Nombre', conValor(datos.nombre)],
    ['WhatsApp', conValor(datos.whatsapp)],
    ['Email', conValor(datos.email)],
    [datos.etiquetaEmpresa ?? 'Empresa', conValor(datos.empresa)],
    ['Localidad', conValor(datos.localidad)],
    ['Producto', conValor(datos.producto)],
    ['Tipo de pedido', conValor(datos.tipoPedido)],
    ['Fecha del evento', conValor(datos.fechaEvento) ? formatearFecha(datos.fechaEvento!) : ''],
    ['Cantidad aproximada de personas', conValor(datos.invitados)],
    ['Volumen estimado', conValor(datos.volumen)],
    ['Frecuencia', conValor(datos.frecuencia)],
    ['Temática', conValor(datos.tematica)],
    ['Productos / intereses', (datos.intereses ?? []).filter(Boolean).join(', ')],
    ['Opción especial', conValor(datos.opcionEspecial)],
    ['Idea', conValor(datos.mensaje)],
  ]

  return [datos.saludo, '', ...lineas.filter(([, valor]) => valor).map(([etiqueta, valor]) => `${etiqueta}: ${valor}`)].join(
    '\n',
  )
}

/**
 * Deja el número como lo espera wa.me: solo dígitos, con 549 adelante.
 * Reglas simples a propósito (los números argentinos se escriben de mil
 * formas): saca todo lo que no sea dígito, saca el 0 inicial, y si no viene
 * con código de país le pone 549. No intenta quitar el "15".
 */
export function normalizarWhatsapp(entrada: string): string | null {
  let digitos = entrada.replace(/\D/g, '')
  if (digitos.startsWith('0')) digitos = digitos.slice(1)
  if (digitos.length < 8) return null

  if (digitos.startsWith('549')) return digitos
  if (digitos.startsWith('54')) return `549${digitos.slice(2)}`
  return `549${digitos}`
}

/** Link wa.me hacia un número escrito por una persona (lo usa el panel). */
export function linkWhatsappA(numero: string, texto: string): string | null {
  const normalizado = normalizarWhatsapp(numero)
  if (!normalizado) return null
  return `https://wa.me/${normalizado}?text=${encodeURIComponent(texto)}`
}
