/**
 * Segunda foto de las tarjetas del catálogo en el celular (pedido de Giu vía Adrián, 26-09-2026). En la compu aparece
 * al pasar el mouse, como lo diseñó Marco. En pantallas táctiles no hay mouse: la foto que pasa por el medio de la
 * pantalla al desplazarse muestra la segunda, con el mismo fundido, y vuelve a la primera al salir. Reglas puras,
 * testeadas en test/foto-alterna.test.ts.
 */

/**
 * Franja del medio de la pantalla, como `rootMargin` de un IntersectionObserver: 10 % del alto. Con dos columnas,
 * cambia más o menos una fila por vez.
 */
export const BANDA_CENTRAL = '-45% 0px -45% 0px'

export type EstadoFotoAlterna = {
  /** Pantalla sin mouse (celular, tablet): `(hover: none)`. */
  tactil: boolean
  movimientoReducido: boolean
  /** La persona ya se desplazó por la página: al entrar, nada cambia solo. */
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
 * En el celular la segunda foto estaba oculta y no se descargaba. Se descarga recién cuando la persona empezó a
 * desplazarse y su tarjeta está en pantalla: son los archivos originales de Marco y pesan (12,5 MB las de Tortas
 * clásicas). Al abrir la página no compite con las fotos principales.
 */
export function bajarSegundaFoto(
  estado: Pick<EstadoFotoAlterna, 'tactil' | 'movimientoReducido' | 'desplazado'> & { vista: boolean },
): boolean {
  return estado.tactil && !estado.movimientoReducido && estado.desplazado && estado.vista
}
