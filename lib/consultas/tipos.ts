/* Tipos, listas y mensajes de las consultas. SIN Zod a propósito: este archivo
   viaja al navegador con el formulario; la validación con Zod vive en schema.ts
   y solo corre en el servidor. */

/** Los cuatro recorridos del Master Plan de Giuliett (particular, eventos, empresas, mayoristas). */
export const ORIGENES = ['particular', 'evento', 'empresa', 'mayorista'] as const
export type Origen = (typeof ORIGENES)[number]

export const ESTADOS = ['nueva', 'contactada', 'presupuestada', 'cerrada', 'perdida'] as const
export type Estado = (typeof ESTADOS)[number]

/** Campo obligatorio "¿Necesitás una opción especial?" (Master Plan v2). */
export const OPCIONES_ESPECIALES = ['ninguna', 'sin_tacc', 'otra'] as const
export type OpcionEspecial = (typeof OPCIONES_ESPECIALES)[number]

export const FRECUENCIAS = ['Semanal', 'Quincenal', 'Mensual', 'A definir'] as const

export const ETIQUETA_ORIGEN: Record<Origen, string> = {
  particular: 'Particular',
  evento: 'Evento',
  empresa: 'Empresa',
  mayorista: 'Mayorista',
}

export const ETIQUETA_ESTADO: Record<Estado, string> = {
  nueva: 'Nueva',
  contactada: 'Contactada',
  presupuestada: 'Presupuestada',
  cerrada: 'Cerrada',
  perdida: 'Perdida',
}

export const ETIQUETA_OPCION_ESPECIAL: Record<OpcionEspecial, string> = {
  ninguna: 'No, ninguna',
  sin_tacc: 'Sí, Sin TACC',
  otra: 'Sí, otra (la cuento en el mensaje)',
}

/**
 * Aclaración legal del Sin TACC (Master Plan v2: tercerizado, según disponibilidad).
 * Redacción confirmada por Adrián el 22-09-2026. Cambiarla solo con su OK.
 * Nunca prometer tiempos ni decir que se elabora en el taller.
 */
export const AVISO_SIN_TACC =
  'Las opciones Sin TACC se elaboran a través de un proveedor habilitado y están sujetas a disponibilidad. No se elaboran en el taller de Giuliett.'

/** Mensajes de validación. Van directo a la pantalla: escritos para el usuario. */
export const MENSAJES = {
  nombre: 'Contanos tu nombre para poder responderte.',
  whatsapp: 'Necesitamos un WhatsApp para contactarte.',
  whatsappFormato: 'Revisá el número: solo dígitos, espacios, paréntesis, + y guiones.',
  email: 'Revisá el email, parece incompleto.',
  tipoPedido: 'Elegí una opción para orientar tu consulta.',
  empresa: 'Contanos el nombre de tu empresa.',
  local: 'Contanos el nombre de tu local.',
  localidad: '¿En qué localidad está tu local?',
  opcionEspecial: 'Contanos si necesitás una opción especial.',
  fecha: 'La fecha no tiene un formato válido.',
  mensajeLargo: 'El mensaje es muy largo (máximo 2000 caracteres).',
} as const

/** Lo que viaja de la API al formulario cuando algo no valida. */
export type ErroresPorCampo = Record<string, string>

/** Fila tal como la devuelve Supabase (para el panel). */
export type Consulta = {
  id: string
  created_at: string
  updated_at: string
  origen: Origen
  nombre: string
  whatsapp: string
  email: string | null
  empresa: string | null
  localidad: string | null
  tipo_pedido: string | null
  fecha_evento: string | null
  cantidad_personas: number | null
  volumen: string | null
  frecuencia: string | null
  tematica: string | null
  intereses: string[]
  opcion_especial: OpcionEspecial
  mensaje: string | null
  producto_slug: string | null
  pagina_origen: string | null
  utm: Record<string, string> | null
  estado: Estado
  notas_internas: string | null
  abrio_whatsapp: boolean
}
