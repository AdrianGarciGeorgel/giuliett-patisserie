import Link from 'next/link'
import { notFound } from 'next/navigation'
import { mensajeDeErrorConsulta } from '@/lib/admin/avisos'
import { requerirAdministrador } from '@/lib/admin/auth'
import { ESTADOS, ETIQUETA_ESTADO, ETIQUETA_OPCION_ESPECIAL, type Consulta } from '@/lib/consultas/tipos'
import { linkWhatsappA } from '@/lib/consultas/whatsapp'
import { getProductoPorSlug } from '@/lib/catalogo'
import { actualizarConsulta } from '../../acciones'
import {
  EtiquetaEstado,
  EtiquetaOrigen,
  botonPanelClassName,
  botonSecundarioClassName,
  formatearFechaEvento,
  formatearFechaHora,
  inputPanelClassName,
} from '../../ui'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ guardado?: string; error?: string }>
}

export default async function ConsultaPage({ params, searchParams }: Props) {
  const [{ id }, { guardado, error: codigoError }] = await Promise.all([params, searchParams])
  // Solo mensajes fijos: un texto armado en el link no se muestra (auditoría del 26-09-2026).
  const errorGuardado = mensajeDeErrorConsulta(codigoError)
  const { supabase } = await requerirAdministrador()

  const { data, error } = await supabase.from('consultas').select('*').eq('id', id).maybeSingle()
  if (error || !data) notFound()
  const consulta = data as Consulta

  const producto = await getProductoPorSlug(consulta.producto_slug ?? '')
  const saludo = `Hola ${consulta.nombre.split(' ')[0]}! Soy Giu, de Giuliett Pâtisserie. Recibí tu consulta y te escribo para charlar los detalles.`
  const whatsapp = linkWhatsappA(consulta.whatsapp, saludo)
  const guardar = actualizarConsulta.bind(null, consulta.id)

  return (
    <main className="mx-auto w-full max-w-[760px] px-6 pb-24 pt-10 md:px-8">
      <Link href="/admin" className={botonSecundarioClassName}>
        ← Volver a consultas
      </Link>

      <header className="mt-8">
        <EtiquetaOrigen origen={consulta.origen} />
        <h1 className="mt-2 text-[30px] font-light leading-tight text-primary">
          {consulta.nombre}
          {consulta.empresa ? <span className="text-muted-foreground"> · {consulta.empresa}</span> : null}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
          <EtiquetaEstado estado={consulta.estado} />
          <span>Recibida el {formatearFechaHora(consulta.created_at)}</span>
          {consulta.abrio_whatsapp ? <span>· Abrió WhatsApp</span> : <span>· No abrió WhatsApp</span>}
        </div>
      </header>

      <section aria-label="Contacto" className="mt-8 rounded-md border border-border bg-surface px-5 py-5">
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          <Dato etiqueta="WhatsApp">{consulta.whatsapp}</Dato>
          <Dato etiqueta="Email">{consulta.email ?? '—'}</Dato>
        </dl>
        <div className="mt-5 flex flex-wrap gap-3">
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={botonPanelClassName}>
              Escribirle por WhatsApp
            </a>
          ) : (
            <p className="text-[14px] text-[#9b4e4e]">El número no se pudo interpretar. Escribile a mano: {consulta.whatsapp}</p>
          )}
          {consulta.email ? (
            <a href={`mailto:${consulta.email}`} className={botonSecundarioClassName}>
              Enviar email
            </a>
          ) : null}
        </div>
      </section>

      <section aria-label="Pedido" className="mt-4 rounded-md border border-border bg-surface px-5 py-5">
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {producto ? <Dato etiqueta="Producto">{producto.name}</Dato> : null}
          <Dato etiqueta="Tipo de pedido">{consulta.tipo_pedido ?? '—'}</Dato>
          {consulta.origen === 'mayorista' ? <Dato etiqueta="Localidad">{consulta.localidad ?? '—'}</Dato> : null}
          <Dato etiqueta="Fecha del evento">{consulta.fecha_evento ? formatearFechaEvento(consulta.fecha_evento) : '—'}</Dato>
          <Dato etiqueta="Cantidad">{consulta.cantidad_personas ?? '—'}</Dato>
          {consulta.origen === 'mayorista' ? (
            <>
              <Dato etiqueta="Volumen estimado">{consulta.volumen ?? '—'}</Dato>
              <Dato etiqueta="Frecuencia">{consulta.frecuencia ?? '—'}</Dato>
            </>
          ) : null}
          <Dato etiqueta="Temática">{consulta.tematica ?? '—'}</Dato>
          <Dato etiqueta="Intereses">{consulta.intereses.length ? consulta.intereses.join(', ') : '—'}</Dato>
          <Dato etiqueta="Opción especial">
            {consulta.opcion_especial === 'sin_tacc' ? <strong>Sin TACC (tercerizado)</strong> : ETIQUETA_OPCION_ESPECIAL[consulta.opcion_especial]}
          </Dato>
        </dl>
        {consulta.mensaje ? (
          <div className="mt-5">
            <p className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">Mensaje</p>
            <p className="mt-1 whitespace-pre-line text-[15px] leading-[1.7] text-primary">{consulta.mensaje}</p>
          </div>
        ) : null}
        <p className="mt-5 text-[12px] text-muted-foreground">
          Llegó desde {consulta.pagina_origen ?? 'la web'}
          {consulta.utm?.utm_source ? ` · campaña: ${consulta.utm.utm_source}${consulta.utm.utm_campaign ? ` / ${consulta.utm.utm_campaign}` : ''}` : ''}
        </p>
      </section>

      <form action={guardar} className="mt-4 rounded-md border border-border bg-surface px-5 py-5">
        <h2 className="text-[18px] text-primary">Seguimiento</h2>

        {guardado ? (
          <p role="status" className="mt-3 rounded-sm bg-lilac-soft px-4 py-2 text-[14px] text-primary">
            Guardado.
          </p>
        ) : null}
        {errorGuardado ? (
          <p role="alert" className="mt-3 text-[14px] text-[#9b4e4e]">
            {errorGuardado}
          </p>
        ) : null}

        <label className="mt-5 block">
          <span className="text-[14px] font-medium text-primary">Estado</span>
          <select name="estado" defaultValue={consulta.estado} className={`${inputPanelClassName} mt-2`}>
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {ETIQUETA_ESTADO[estado]}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-5 block">
          <span className="text-[14px] font-medium text-primary">Notas internas</span>
          <textarea
            name="notas_internas"
            defaultValue={consulta.notas_internas ?? ''}
            maxLength={4000}
            className={`${inputPanelClassName} mt-2 min-h-[140px] resize-y py-3`}
            placeholder="Presupuesto enviado, fecha confirmada, detalles del pedido…"
          />
        </label>

        <button type="submit" className={`${botonPanelClassName} mt-6 w-full sm:w-auto`}>
          Guardar
        </button>
      </form>
    </main>
  )
}

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">{etiqueta}</dt>
      <dd className="mt-1 text-[15px] text-primary">{children}</dd>
    </div>
  )
}
