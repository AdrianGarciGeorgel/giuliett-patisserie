/**
 * Reglas de los carruseles que se mueven solos (home, galería y eventos). Funciones puras: el
 * componente (components/giuliett/hero-carousel.tsx) las usa y test/carrusel.logica.test.ts las prueba.
 *
 * Accesibilidad: todo lo que se mueve solo se tiene que poder pausar (WCAG 2.2.2) y nada se mueve
 * si la persona pidió menos movimiento (prefers-reduced-motion).
 */

/** Tiempo entre una foto y la siguiente. */
export const INTERVALO_AUTOPLAY_MS = 5000

/** Después de que la persona toca el carrusel (swipe, puntito, rueda), se espera esto antes de seguir solo. */
export const DESCANSO_TRAS_INTERACCION_MS = 8000

export function siguienteIndice(actual: number, total: number): number {
  if (!Number.isFinite(total) || total <= 1) return 0
  const i = Number.isFinite(actual) ? Math.trunc(actual) : 0
  return (((i + 1) % total) + total) % total
}

export type EstadoAutoplay = {
  /** La prop `autoplay` está activa y hay más de una foto. */
  habilitado: boolean
  /** prefers-reduced-motion: reduce. */
  movimientoReducido: boolean
  /** La persona tocó el botón de pausa. */
  pausadoPorUsuario: boolean
  /** Al menos la mitad del carrusel está en pantalla. */
  visible: boolean
  /** La pestaña del navegador está al frente. */
  pestanaVisible: boolean
  /** El mouse está encima (solo cuenta en carruseles chicos: el hero ocupa toda la pantalla). */
  mouseEncima: boolean
  /** Algo del carrusel tiene el foco del teclado. */
  foco: boolean
  /** La persona lo está arrastrando con el mouse. */
  arrastrando: boolean
  /** Última vez que la persona lo tocó (ms). 0 = nunca. */
  ultimaInteraccion: number
  /** Ahora (ms). */
  ahora: number
}

export function debeAvanzar(e: EstadoAutoplay): boolean {
  if (!e.habilitado || e.movimientoReducido || e.pausadoPorUsuario) return false
  if (!e.visible || !e.pestanaVisible) return false
  if (e.mouseEncima || e.foco || e.arrastrando) return false
  return e.ahora - e.ultimaInteraccion >= DESCANSO_TRAS_INTERACCION_MS
}

/** Una rueda o trackpad cuenta como usar el carrusel solo si el gesto es horizontal (bajar la página no). */
export function esGestoHorizontal(deltaX: number, deltaY: number): boolean {
  return Math.abs(deltaX) > Math.abs(deltaY)
}
