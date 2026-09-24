/**
 * Reglas de la recuperación de contraseña del panel. Funciones puras: las
 * server actions las usan, los tests las prueban.
 */

export const LARGO_MINIMO_CONTRASENA = 10

/**
 * Se muestra siempre igual, exista o no el email: así nadie puede usar el
 * formulario para averiguar qué correos tienen acceso al panel.
 */
export const MENSAJE_ENLACE_ENVIADO =
  'Si ese email tiene acceso al panel, en unos minutos te llega un enlace para elegir una contraseña nueva. Revisá también la carpeta de spam.'

export function normalizarEmail(valor: unknown): string | null {
  if (typeof valor !== 'string') return null
  const email = valor.trim().toLowerCase()
  // Forma mínima: algo@dominio.tld. La validación real la hace Supabase al mandar el mail.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null
}

export type ResultadoContrasena = { ok: true; password: string } | { ok: false; error: string }

export function validarNuevaContrasena(nueva: unknown, repetida: unknown): ResultadoContrasena {
  if (typeof nueva !== 'string' || typeof repetida !== 'string') {
    return { ok: false, error: 'Completá la contraseña dos veces.' }
  }
  if (nueva.length < LARGO_MINIMO_CONTRASENA) {
    return { ok: false, error: `La contraseña tiene que tener al menos ${LARGO_MINIMO_CONTRASENA} caracteres.` }
  }
  if (nueva !== repetida) {
    return { ok: false, error: 'Las dos contraseñas no coinciden.' }
  }
  return { ok: true, password: nueva }
}
