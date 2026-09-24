/**
 * Rutas del panel. Sin Zod ni imports de servidor: las usa proxy.ts (corre en
 * cada request) y también las páginas.
 */

export const RUTA_LOGIN = '/admin/login'
export const RUTA_RECUPERAR = '/admin/recuperar'
export const RUTA_CALLBACK = '/admin/auth/callback'
export const RUTA_RESTABLECER = '/admin/restablecer'

/** Se pueden visitar sin sesión. Todo lo demás bajo /admin exige estar logueado. */
export const RUTAS_PUBLICAS_ADMIN = [RUTA_LOGIN, RUTA_RECUPERAR, RUTA_CALLBACK] as const

export function esRutaPublicaAdmin(pathname: string): boolean {
  const sinBarraFinal = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return (RUTAS_PUBLICAS_ADMIN as readonly string[]).includes(sinBarraFinal)
}

/**
 * A dónde mandar al usuario después del callback. Solo se aceptan rutas
 * internas del panel: nada de `https://…`, `//otro-sitio` ni `..`. Si el valor
 * no sirve, se vuelve al destino por defecto. Evita el "open redirect".
 */
export function destinoSeguro(next: string | null | undefined, porDefecto = '/admin'): string {
  if (typeof next !== 'string') return porDefecto
  const esInterna = /^\/admin(\/[^\s]*)?$/.test(next) && !next.startsWith('//') && !next.includes('\\') && !next.includes('..')
  return esInterna ? next : porDefecto
}
