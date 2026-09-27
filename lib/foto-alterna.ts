/**
 * Segunda foto de las tarjetas del catálogo en el celular (pedido de Giu vía Adrián, 26-09-2026). En la compu aparece
 * al pasar el mouse, como lo diseñó Marco. En pantallas táctiles no hay mouse: la foto que pasa por el medio de la
 * pantalla al desplazarse muestra la segunda, con el mismo fundido, y vuelve a la primera al salir. Reglas puras,
 * testeadas en test/foto-alterna.test.ts.
 */

/**
 * Franja del medio de la pantalla, como `rootMargin` de un IntersectionObserver: del 35 % al 52 % del alto. Con dos
 * columnas cambia más o menos una fila por vez. Medido en iPhone SE, 13 y 14 Pro Max y en Pixel 7: la primera fila
 * al abrir termina entre el 45 % y el 55 % del alto, y la última al final de la página empieza entre el 34 % y el
 * 46 %; esta franja alcanza a las dos.
 */
export const BANDA_CENTRAL = '-35% 0px -48% 0px'

export type EstadoFotoAlterna = {
  /** Pantalla sin mouse (celular, tablet): `(hover: none)`. */
  tactil: boolean
  movimientoReducido: boolean
  /**
   * La persona ya se desplazó o deslizó el dedo (si la categoría entra entera en la pantalla, no hay nada que
   * desplazar): al entrar, nada cambia solo.
   */
  desplazado: boolean
  /** La foto está pasando por la franja del medio. */
  enBanda: boolean
  /** La segunda foto ya bajó: si no, el fundido mostraría un hueco. */
  cargada: boolean
}

export function mostrarSegundaFoto(estado: EstadoFotoAlterna): boolean {
  return estado.tactil && !estado.movimientoReducido && estado.desplazado && estado.enBanda && estado.cargada
}

/**
 * En el celular la segunda foto estaba oculta y no se descargaba. Son los archivos originales de Marco y pesan
 * (12,5 MB las de Tortas clásicas si se recorre toda la categoría), así que se descarga solo cuando hace falta:
 * - cuando la persona ya se desplaza, la de cada tarjeta que aparece en pantalla (llega antes de pasar por el medio);
 * - al abrir, solo la de la fila que ya está en el medio, y después de su foto principal: así no compiten y esa
 *   fila cambia apenas la persona empieza a bajar.
 */
export function bajarSegundaFoto(
  estado: Pick<EstadoFotoAlterna, 'tactil' | 'movimientoReducido' | 'desplazado' | 'enBanda'> & {
    vista: boolean
    principalCargada: boolean
  },
): boolean {
  if (!estado.tactil || estado.movimientoReducido || !estado.vista) return false
  return estado.desplazado || (estado.enBanda && estado.principalCargada)
}
