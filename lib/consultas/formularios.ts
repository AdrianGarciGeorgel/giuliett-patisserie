import type { Origen } from './tipos'

/* Configuración de los cuatro recorridos del Master Plan (particular, eventos,
   empresas, mayoristas). Un solo componente (<ContactForm>) los renderiza a
   todos; lo que cambia es esto. Sin imports de servidor: viaja al navegador. */

export type CampoFormulario =
  | 'email'
  | 'empresa'
  | 'localidad'
  | 'tipoPedido'
  | 'fechaEvento'
  | 'invitados'
  | 'volumen'
  | 'frecuencia'
  | 'tematica'
  | 'intereses'
  | 'mensaje'

export type ProductoConsulta = {
  slug: string
  nombre: string
  /** Etiqueta de la categoría, p. ej. "Tortas personalizadas". */
  categoria: string
}

export type ConfigFormulario = {
  /** Cómo se llama el recorrido en el selector de /contacto. */
  etiqueta: string
  /** Campos visibles además de nombre, WhatsApp y opción especial, en orden. */
  campos: readonly CampoFormulario[]
  etiquetaEmpresa: string
  etiquetaTipo: string
  tiposPedido: readonly string[]
  etiquetaInvitados: string
  intereses: readonly string[]
  etiquetaMensaje: string
  textoBoton: string
  /** Primera línea del mensaje de WhatsApp. */
  saludo: string
}

export const FORMULARIOS: Record<Origen, ConfigFormulario> = {
  particular: {
    etiqueta: 'Para mí',
    campos: ['email', 'tipoPedido', 'fechaEvento', 'invitados', 'tematica', 'intereses', 'mensaje'],
    etiquetaEmpresa: 'Empresa',
    etiquetaTipo: 'Tipo de pedido',
    tiposPedido: ['Torta', 'Galletas personalizadas', 'Box', 'Mesa dulce', 'Otro'],
    etiquetaInvitados: 'Cantidad de personas',
    intereses: ['Tortas clásicas', 'Tortas personalizadas', 'Galletas personalizadas', 'Boxes', 'Mesa dulce', 'Otro'],
    etiquetaMensaje: 'Contanos tu idea',
    textoBoton: 'Enviar consulta',
    saludo: 'Hola Giuliett! Quiero hacer una consulta.',
  },

  evento: {
    etiqueta: 'Un evento',
    campos: ['email', 'tipoPedido', 'fechaEvento', 'invitados', 'tematica', 'intereses', 'mensaje'],
    etiquetaEmpresa: 'Empresa',
    etiquetaTipo: '¿Qué celebrás?',
    tiposPedido: ['Boda', 'Cumpleaños', 'Bautismo o comunión', 'Baby shower', 'Aniversario', 'Otro'],
    etiquetaInvitados: 'Cantidad de invitados',
    intereses: ['Mesa dulce', 'Torta', 'Macarons', 'Galletas personalizadas', 'Boxes', 'Otro'],
    etiquetaMensaje: 'Contanos tu idea',
    textoBoton: 'Pedir propuesta',
    saludo: 'Hola Giuliett! Quisiera una propuesta para un evento.',
  },

  empresa: {
    etiqueta: 'Mi empresa',
    campos: ['empresa', 'email', 'tipoPedido', 'fechaEvento', 'invitados', 'mensaje'],
    etiquetaEmpresa: 'Empresa',
    etiquetaTipo: '¿Qué necesitás?',
    tiposPedido: ['Regalos corporativos', 'Kits de bienvenida', 'Catering o evento corporativo', 'Cookies con tu marca', 'Otro'],
    etiquetaInvitados: 'Cantidad aproximada',
    intereses: [],
    etiquetaMensaje: 'Contanos el proyecto',
    textoBoton: 'Pedir propuesta',
    saludo: 'Hola Giuliett! Quisiera consultar por una propuesta para mi empresa.',
  },

  mayorista: {
    etiqueta: 'Mi local o cafetería',
    campos: ['empresa', 'localidad', 'email', 'tipoPedido', 'volumen', 'frecuencia', 'mensaje'],
    etiquetaEmpresa: 'Nombre del local',
    etiquetaTipo: '¿Qué te interesa?',
    tiposPedido: ['Pastelería para vitrina', 'Cookies con tu marca', 'Macarons', 'Boxes', 'Otro'],
    etiquetaInvitados: 'Cantidad aproximada',
    intereses: [],
    etiquetaMensaje: 'Contanos sobre tu local',
    textoBoton: 'Pedir información',
    saludo: 'Hola Giuliett! Tengo un local y quisiera consultar por pastelería mayorista.',
  },
}

/** Texto bajo el botón (Ley 25.326). Confirmado por Adrián el 22-09-2026; si cambia, cambia acá. */
export const AVISO_PRIVACIDAD = 'Usamos tus datos solo para responder esta consulta. No los compartimos con nadie.'
