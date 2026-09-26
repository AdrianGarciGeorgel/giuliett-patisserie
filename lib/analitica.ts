import type { BeforeSendEvent } from '@vercel/analytics/next'

/** Vercel Analytics no registra el panel: sus URLs llevan el id de cada consulta (y antes, textos de error).
 *  Las páginas públicas se registran igual que siempre (auditoría del 26-09-2026). */
export function excluirPanel<E extends Pick<BeforeSendEvent, 'url'>>(evento: E): E | null {
  const { pathname } = new URL(evento.url)
  return pathname === '/admin' || pathname.startsWith('/admin/') ? null : evento
}
