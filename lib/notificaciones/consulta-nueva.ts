import { ETIQUETA_OPCION_ESPECIAL, ETIQUETA_ORIGEN, type OpcionEspecial, type Origen } from '@/lib/consultas/tipos'
import { formatearFecha } from '@/lib/consultas/whatsapp'

/**
 * Aviso por email a Giu cuando entra una consulta nueva.
 *
 * Se manda con Resend por HTTP directo (sin SDK: es una sola llamada y no queremos
 * otra dependencia). Se activa solo si están las variables de entorno; sin ellas
 * no hace nada y la consulta se guarda igual. El envío nunca puede hacer fallar
 * el registro: la API lo llama con `after()`, fuera del camino de la respuesta.
 *
 * El remitente tiene que ser un dominio verificado en Resend. Hasta que el DNS de
 * giuliettpatisserie.com apunte a nosotros (Fase E), esto queda apagado.
 */

type Texto = string | null | undefined

/** Lo que la API tiene a mano al insertar (los campos opcionales pueden venir sin definir). */
export type ConsultaParaAviso = {
  id: string
  origen: Origen
  nombre: string
  whatsapp: string
  opcion_especial: OpcionEspecial
  email?: Texto
  empresa?: Texto
  tipo_pedido?: Texto
  fecha_evento?: Texto
  cantidad_personas?: Texto | number
  mensaje?: Texto
  producto_slug?: Texto
  localidad?: Texto
  volumen?: Texto
  frecuencia?: Texto
  tematica?: Texto
  intereses?: string[] | null
}

export type ConfiguracionAvisos = { apiKey: string; destinos: string[]; remitente: string }

export const REMITENTE_POR_DEFECTO = 'Giuliett Web <avisos@giuliettpatisserie.com>'

export function configuracionAvisos(env: Record<string, string | undefined> = process.env): ConfiguracionAvisos | null {
  const apiKey = env.RESEND_API_KEY?.trim()
  const destinos = (env.AVISOS_EMAIL_DESTINO ?? '')
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean)
  if (!apiKey || destinos.length === 0) return null
  return { apiKey, destinos, remitente: env.AVISOS_EMAIL_REMITENTE?.trim() || REMITENTE_POR_DEFECTO }
}

function escaparHtml(texto: string) {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Solo las líneas con contenido: en el email nunca aparece "null" ni un campo vacío. */
function lineasDeConsulta(consulta: ConsultaParaAviso): Array<[string, string]> {
  const esMayorista = consulta.origen === 'mayorista'
  const opcionEspecial =
    consulta.opcion_especial === 'sin_tacc' ? 'Sin TACC (tercerizado)' : ETIQUETA_OPCION_ESPECIAL[consulta.opcion_especial]

  const lineas: Array<[string, Texto]> = [
    ['Recorrido', ETIQUETA_ORIGEN[consulta.origen]],
    ['Nombre', consulta.nombre],
    ['Empresa', consulta.empresa],
    ['WhatsApp', consulta.whatsapp],
    ['Email', consulta.email],
    ['Producto', consulta.producto_slug],
    ['Tipo de pedido', consulta.tipo_pedido],
    ['Fecha del evento', consulta.fecha_evento ? formatearFecha(consulta.fecha_evento) : null],
    ['Cantidad', consulta.cantidad_personas == null ? null : String(consulta.cantidad_personas)],
    ['Temática', consulta.tematica],
    ['Intereses', consulta.intereses?.length ? consulta.intereses.join(', ') : null],
    ['Localidad', esMayorista ? consulta.localidad : null],
    ['Volumen estimado', esMayorista ? consulta.volumen : null],
    ['Frecuencia', esMayorista ? consulta.frecuencia : null],
    ['Opción especial', opcionEspecial],
    ['Mensaje', consulta.mensaje],
  ]
  return lineas.filter((l): l is [string, string] => typeof l[1] === 'string' && l[1].trim() !== '')
}

export function armarAvisoConsulta(consulta: ConsultaParaAviso, urlSitio: string) {
  const base = urlSitio.replace(/\/+$/, '')
  const linkPanel = `${base}/admin/consultas/${consulta.id}`
  const lineas = lineasDeConsulta(consulta)
  const primerNombre = consulta.nombre.trim().split(/\s+/)[0] || consulta.nombre

  const asunto = `Nueva consulta · ${ETIQUETA_ORIGEN[consulta.origen]} · ${primerNombre}`

  const texto = [
    'Entró una consulta nueva en la web de Giuliett.',
    '',
    ...lineas.map(([etiqueta, valor]) => `${etiqueta}: ${valor}`),
    '',
    `Verla y responder desde el panel: ${linkPanel}`,
  ].join('\n')

  const filas = lineas
    .map(
      ([etiqueta, valor]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#9C8065;font-size:12px;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;white-space:nowrap">${escaparHtml(etiqueta)}</td>` +
        `<td style="padding:6px 0;color:#51375C;font-size:15px;line-height:1.5">${escaparHtml(valor).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('')

  const html =
    `<div style="font-family:Poppins,Helvetica,Arial,sans-serif;background:#FFF8E9;padding:32px 20px;color:#51375C">` +
    `<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:28px 24px">` +
    `<p style="margin:0 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#9C8065">Giuliett Pâtisserie</p>` +
    `<h1 style="margin:0 0 20px;font-size:22px;font-weight:400">Entró una consulta nueva</h1>` +
    `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">${filas}</table>` +
    `<p style="margin:28px 0 0"><a href="${escaparHtml(linkPanel)}" style="display:inline-block;background:#51375C;color:#FFF8E9;text-decoration:none;padding:12px 20px;border-radius:4px;font-size:14px">Ver en el panel</a></p>` +
    `</div></div>`

  return { asunto, texto, html }
}

/**
 * Manda el aviso. Devuelve `true` si Resend lo aceptó. Nunca lanza: un problema
 * con el email no tiene que afectar a la persona que acaba de dejar su consulta.
 */
export async function enviarAvisoConsulta(
  consulta: ConsultaParaAviso,
  urlSitio: string,
  config: ConfiguracionAvisos | null = configuracionAvisos(),
): Promise<boolean> {
  if (!config) return false
  const { asunto, texto, html } = armarAvisoConsulta(consulta, urlSitio)

  try {
    const respuesta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: config.remitente, to: config.destinos, subject: asunto, text: texto, html }),
    })
    if (!respuesta.ok) {
      console.error('[avisos] Resend rechazó el email:', respuesta.status, await respuesta.text())
      return false
    }
    return true
  } catch (error) {
    console.error('[avisos] no se pudo mandar el aviso de consulta nueva:', error)
    return false
  }
}
