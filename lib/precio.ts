/** Precio en pesos como lo pide Giu: signo pegado y punto de miles ("$60.000"). Sin Intl, así sale igual en el
 *  servidor, en el navegador y en la tarjeta para compartir. */
export function formatearPrecio(pesos: number) {
  return '$' + String(Math.round(pesos)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** Lo que se lee donde iría el precio de un producto "Sin precio publicado" (acordado con Giu el 28-09-2026). */
export const PRECIO_SEGUN_DISENO = 'Precio según diseño'

/** El texto del precio de un producto: el importe, o "Precio según diseño" si no tiene uno publicado. */
export function textoPrecio(pesos: number | undefined) {
  return pesos ? formatearPrecio(pesos) : PRECIO_SEGUN_DISENO
}
