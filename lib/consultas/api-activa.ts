/**
 * ¿Está abierta la API de consultas?
 *
 * Desde el 26-09-2026 la web usa el formulario de Marco, que manda directo a WhatsApp (decisión de Adrián
 * tras el reclamo de la clienta por cambios de diseño). La API quedó sin quién la llame, y una puerta de
 * escritura sin uso solo suma riesgo: se podía usar para llenar la base o cargar consultas falsas en el
 * panel (auditoría de seguridad). Se reabre poniendo CONSULTAS_API_ACTIVA=1 en Vercel cuando vuelva un
 * formulario que la use.
 */
export function apiConsultasActiva(): boolean {
  return process.env.CONSULTAS_API_ACTIVA === '1'
}
