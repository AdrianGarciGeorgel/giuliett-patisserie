/* Reglas puras del panel que muestran texto o arman enlaces a partir de lo que llega en un pedido.
   Endurecimiento de la auditoría del 26-09-2026: nada de lo que viene en la URL o en las cabeceras se
   muestra ni se usa tal cual. */

const MOTIVOS_LOGIN: Record<string, string> = {
  'sin-acceso': 'Esa cuenta existe pero no tiene acceso al panel. Pedile a Adrián que la habilite.',
  'sin-config': 'El panel todavía no está configurado: faltan las variables de Supabase en el servidor.',
  'enlace-invalido': 'Ese enlace venció o ya se usó. Pedí uno nuevo desde "¿Olvidaste tu contraseña?".',
}

/** Texto del aviso del login. Solo motivos propios: `?motivo=__proto__` devolvía un objeto y rompía la página. */
export function avisoDeLogin(motivo: string | undefined): string | undefined {
  return motivo && Object.hasOwn(MOTIVOS_LOGIN, motivo) ? MOTIVOS_LOGIN[motivo] : undefined
}

const ERRORES_CONSULTA: Record<string, string> = {
  notas: 'Las notas son muy largas (máximo 4000 caracteres).',
  datos: 'Revisá los datos: algo no se pudo leer.',
  guardar: 'No se pudo guardar. Probá de nuevo.',
}

export type CodigoErrorConsulta = 'notas' | 'datos' | 'guardar'

/** Código para la URL según el campo que falló. La URL lleva un código, nunca el texto. */
export function codigoDeErrorConsulta(campo: PropertyKey | undefined): Exclude<CodigoErrorConsulta, 'guardar'> {
  return campo === 'notas_internas' ? 'notas' : 'datos'
}

/** Mensaje fijo para un código. Cualquier otro texto en `?error=` se ignora: antes se mostraba tal cual,
 *  así que un link armado podía poner un mensaje falso en el recuadro rojo del panel de Giu. */
export function mensajeDeErrorConsulta(codigo: string | undefined): string | undefined {
  return codigo && Object.hasOwn(ERRORES_CONSULTA, codigo) ? ERRORES_CONSULTA[codigo] : undefined
}

/** Milisegundos que faltan para que la respuesta tarde al menos `minimoMs`. Así pedir la recuperación
 *  tarda lo mismo exista o no la cuenta, y el tiempo no delata quién tiene acceso al panel. */
export function esperaParaRespuestaPareja(inicio: number, ahora: number, minimoMs: number): number {
  return Math.max(0, inicio + minimoMs - ahora)
}

/** Origen para el enlace del email de recuperación. Solo orígenes conocidos (el sitio y la URL técnica
 *  de Vercel; localhost solo en desarrollo): nunca el Host que mande quien hace el pedido. */
export function origenParaEnlaces(host: string | null, protocolo: string | null, base: string, desarrollo: boolean): string {
  const permitidos = new Set([new URL(base).host, 'giuliett-patisserie-nu.vercel.app'])
  if (host && permitidos.has(host)) return `https://${host}`
  if (desarrollo && host && /^localhost(:\d+)?$/.test(host)) return `${protocolo === 'https' ? 'https' : 'http'}://${host}`
  return base
}
