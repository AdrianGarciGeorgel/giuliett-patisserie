'use client'

import { Analytics } from '@vercel/analytics/next'
import { excluirPanel } from '@/lib/analitica'

/** Vercel Analytics sin el panel (ver lib/analitica.ts). No renderiza nada visible. */
export function Analitica() {
  return <Analytics beforeSend={excluirPanel} />
}
