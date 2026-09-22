import { z } from 'zod'
import { MENSAJES, OPCIONES_ESPECIALES, ORIGENES, type ErroresPorCampo } from './tipos'

/* Validación con Zod. Solo del lado servidor (API y panel): el formulario hace
   una validación liviana propia para no cargar Zod en el navegador. */

export { ESTADOS, ETIQUETA_ESTADO, ETIQUETA_ORIGEN, MENSAJES, OPCIONES_ESPECIALES, ORIGENES } from './tipos'
export type { Consulta, ErroresPorCampo, Estado, OpcionEspecial, Origen } from './tipos'

/** Un campo opcional que llega como '' desde un input se trata como ausente. */
const opcional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((valor) => (typeof valor === 'string' && valor.trim() === '' ? undefined : valor), schema.optional())

export const consultaEntradaSchema = z
  .object({
    origen: z.enum(ORIGENES),

    nombre: z.string().trim().min(2, MENSAJES.nombre).max(120, 'El nombre es muy largo.'),
    whatsapp: z
      .string()
      .trim()
      .min(6, MENSAJES.whatsapp)
      .max(30, MENSAJES.whatsappFormato)
      .regex(/^[+\d\s().-]+$/, MENSAJES.whatsappFormato),
    email: opcional(z.email(MENSAJES.email).max(160, MENSAJES.email)),
    empresa: opcional(z.string().trim().max(120)),
    localidad: opcional(z.string().trim().max(120)),

    tipo_pedido: opcional(z.string().trim().max(60)),
    fecha_evento: opcional(z.iso.date(MENSAJES.fecha)),
    cantidad_personas: opcional(z.coerce.number().int().positive().max(100000)),
    volumen: opcional(z.string().trim().max(120)),
    frecuencia: opcional(z.string().trim().max(40)),
    tematica: opcional(z.string().trim().max(120)),
    intereses: z.array(z.string().trim().max(60)).max(20).default([]),
    opcion_especial: z.enum(OPCIONES_ESPECIALES, MENSAJES.opcionEspecial),
    mensaje: opcional(z.string().trim().max(2000, MENSAJES.mensajeLargo)),

    producto_slug: opcional(z.string().trim().max(80)),
    pagina_origen: opcional(z.string().max(200)),
    utm: z.record(z.string().max(40), z.string().max(200)).optional(),

    // Anti-spam. `sitio_web` es un campo trampa que las personas no ven;
    // `iniciado_en` es la hora en que se abrió el formulario.
    sitio_web: z.string().optional(),
    iniciado_en: z.number().int().optional(),
  })
  .superRefine((datos, ctx) => {
    // Lo que es obligatorio solo en algunos recorridos.
    if (datos.origen === 'empresa' && !datos.empresa) {
      ctx.addIssue({ code: 'custom', path: ['empresa'], message: MENSAJES.empresa })
    }
    if (datos.origen === 'mayorista') {
      if (!datos.empresa) ctx.addIssue({ code: 'custom', path: ['empresa'], message: MENSAJES.local })
      if (!datos.localidad) ctx.addIssue({ code: 'custom', path: ['localidad'], message: MENSAJES.localidad })
    }
  })

export type ConsultaEntrada = z.infer<typeof consultaEntradaSchema>

export function erroresPorCampo(error: z.ZodError): ErroresPorCampo {
  const errores: ErroresPorCampo = {}
  for (const issue of error.issues) {
    const campo = String(issue.path[0] ?? '_')
    if (!errores[campo]) errores[campo] = issue.message
  }
  return errores
}
