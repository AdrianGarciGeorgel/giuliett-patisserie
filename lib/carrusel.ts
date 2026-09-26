/**
 * Reglas del carrusel de la home (pedido de Adrián del 26-09-2026): las fotos avanzan solas, sin botón
 * de pausa, y en la computadora un clic en el costado avanza o retrocede. Funciones puras: el componente
 * (components/giuliett/hero-carousel.tsx) las usa y test/carrusel.logica.test.ts las prueba.
 *
 * Sin botón de pausa por pedido de la clienta. Para no mover nada a quien no quiere: con
 * prefers-reduced-motion no se mueve, y se frena mientras el teclado está adentro del carrusel.
 */

/** Tiempo entre una foto y la siguiente. */
export const INTERVALO_AUTOPLAY_MS = 5000

/** Después de que la persona usa el carrusel (desliza, arrastra, hace clic en un costado), se espera esto antes de seguir solo. */
export const DESCANSO_TRAS_INTERACCION_MS = 8000

/** Índice circular: después de la última foto viene la primera, y antes de la primera, la última. */
function circular(indice: number, total: number): number {
  if (!Number.isFinite(total) || total <= 1) return 0
  return ((indice % total) + total) % total
}

/** Un valor raro (NaN, infinito) cuenta como la primera foto. */
function normalizar(actual: number): number {
  return Number.isFinite(actual) ? Math.trunc(actual) : 0
}

export function siguienteIndice(actual: number, total: number): number {
  return circular(normalizar(actual) + 1, total)
}

export function anteriorIndice(actual: number, total: number): number {
  return circular(normalizar(actual) - 1, total)
}

export type EstadoAutoplay = {
  /** El carrusel tiene el movimiento activado y más de una foto. */
  habilitado: boolean
  /** prefers-reduced-motion: reduce. */
  movimientoReducido: boolean
  /** Al menos la mitad del carrusel está en pantalla. */
  visible: boolean
  /** La pestaña del navegador está al frente. */
  pestanaVisible: boolean
  /** El foco del teclado está adentro del carrusel. */
  foco: boolean
  /** La persona lo está arrastrando con el mouse. */
  arrastrando: boolean
  /** Última vez que la persona lo usó (ms). 0 = nunca. */
  ultimaInteraccion: number
  /** Ahora (ms). */
  ahora: number
}

export function debeAvanzar(e: EstadoAutoplay): boolean {
  if (!e.habilitado || e.movimientoReducido) return false
  if (!e.visible || !e.pestanaVisible) return false
  if (e.foco || e.arrastrando) return false
  return e.ahora - e.ultimaInteraccion >= DESCANSO_TRAS_INTERACCION_MS
}

/** Una rueda o trackpad cuenta como usar el carrusel solo si el gesto es horizontal (bajar la página no). */
export function esGestoHorizontal(deltaX: number, deltaY: number): boolean {
  return Math.abs(deltaX) > Math.abs(deltaY)
}
