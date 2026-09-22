import { ETIQUETA_ESTADO, ETIQUETA_ORIGEN, type Estado, type Origen } from '@/lib/consultas/tipos'

/* Piezas chicas del panel. Sin hooks: sirven en Server Components. */

const fechaHora = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Argentina/Mendoza',
})

const soloFecha = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeZone: 'UTC' })

export function formatearFechaHora(iso: string) {
  return fechaHora.format(new Date(iso))
}

/** Fechas `date` de Postgres (AAAA-MM-DD) sin corrimiento de zona horaria. */
export function formatearFechaEvento(fecha: string) {
  return soloFecha.format(new Date(`${fecha}T00:00:00Z`))
}

const TONO_ESTADO: Record<Estado, string> = {
  nueva: 'bg-lilac text-primary',
  contactada: 'bg-lilac-soft text-primary',
  presupuestada: 'border border-primary/30 bg-surface text-primary',
  cerrada: 'bg-primary text-primary-foreground',
  perdida: 'bg-border text-muted-foreground',
}

export function EtiquetaEstado({ estado }: { estado: Estado }) {
  return (
    <span className={`inline-flex items-center rounded-sm px-2.5 py-1 text-[12px] font-medium leading-none ${TONO_ESTADO[estado]}`}>
      {ETIQUETA_ESTADO[estado]}
    </span>
  )
}

export function EtiquetaOrigen({ origen }: { origen: Origen }) {
  return <span className="tracked text-[11px] font-medium text-muted-foreground">{ETIQUETA_ORIGEN[origen]}</span>
}

export const botonPanelClassName =
  'inline-flex min-h-[48px] items-center justify-center rounded-sm bg-primary px-6 text-[15px] font-medium text-primary-foreground transition-colors duration-200 hover:bg-lilac-ink disabled:opacity-60'

export const botonSecundarioClassName =
  'inline-flex min-h-[44px] items-center justify-center rounded-sm border border-primary/30 px-5 text-[14px] font-medium text-primary transition-colors duration-200 hover:border-primary/50 hover:bg-lilac-soft'

export const inputPanelClassName =
  'min-h-[48px] w-full rounded-sm border border-border bg-surface px-4 text-[16px] text-primary outline-none transition-colors duration-200 focus:border-primary'
