/** Precio en pesos como lo pide Giu: signo pegado y punto de miles ("$60.000"). Sin Intl, así sale igual en el
 *  servidor, en el navegador y en la tarjeta para compartir. */
export function formatearPrecio(pesos: number) {
  return '$' + String(Math.round(pesos)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
