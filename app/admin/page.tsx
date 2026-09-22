import Link from 'next/link'
import { requerirAdministrador } from '@/lib/admin/auth'
import { ESTADOS, ETIQUETA_ESTADO, type Consulta, type Estado } from '@/lib/consultas/tipos'
import { getProductBySlug } from '@/lib/products'
import { cerrarSesion } from './acciones'
import { EtiquetaEstado, EtiquetaOrigen, botonSecundarioClassName, formatearFechaEvento, formatearFechaHora } from './ui'

type Props = { searchParams: Promise<{ estado?: string }> }

type Fila = Pick<
  Consulta,
  'id' | 'created_at' | 'origen' | 'nombre' | 'whatsapp' | 'empresa' | 'tipo_pedido' | 'fecha_evento' | 'estado' | 'producto_slug'
>

function esEstado(valor: string | undefined): valor is Estado {
  return ESTADOS.includes(valor as Estado)
}

export default async function AdminPage({ searchParams }: Props) {
  const { estado } = await searchParams
  const filtro = esEstado(estado) ? estado : null
  const { supabase, user } = await requerirAdministrador()

  let consulta = supabase
    .from('consultas')
    .select('id, created_at, origen, nombre, whatsapp, empresa, tipo_pedido, fecha_evento, estado, producto_slug')
    .order('created_at', { ascending: false })
    .limit(200)
  if (filtro) consulta = consulta.eq('estado', filtro)

  const [{ data: filas, error }, { data: todas }] = await Promise.all([
    consulta,
    supabase.from('consultas').select('estado').limit(5000),
  ])

  const conteo = Object.fromEntries(ESTADOS.map((e) => [e, 0])) as Record<Estado, number>
  for (const fila of todas ?? []) conteo[fila.estado as Estado] += 1
  const total = Object.values(conteo).reduce((suma, n) => suma + n, 0)

  return (
    <main className="mx-auto w-full max-w-[960px] px-6 pb-24 pt-10 md:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-script text-[36px] leading-none text-primary">Giuliett</p>
          <h1 className="mt-3 text-[26px] font-light text-primary">Consultas</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">{user.email}</p>
        </div>
        <form action={cerrarSesion}>
          <button type="submit" className={botonSecundarioClassName}>
            Cerrar sesión
          </button>
        </form>
      </header>

      <nav aria-label="Filtrar por estado" className="mt-8 flex flex-wrap gap-2">
        <FiltroChip href="/admin" activo={!filtro} etiqueta="Todas" cantidad={total} />
        {ESTADOS.map((e) => (
          <FiltroChip key={e} href={`/admin?estado=${e}`} activo={filtro === e} etiqueta={ETIQUETA_ESTADO[e]} cantidad={conteo[e]} />
        ))}
      </nav>

      {error ? (
        <p role="alert" className="mt-10 text-[15px] text-[#9b4e4e]">
          No se pudieron cargar las consultas: {error.message}
        </p>
      ) : null}

      {!error && (filas ?? []).length === 0 ? (
        <p className="mt-12 text-center text-[16px] text-muted-foreground">
          {filtro ? `No hay consultas en estado "${ETIQUETA_ESTADO[filtro]}".` : 'Todavía no entró ninguna consulta.'}
        </p>
      ) : null}

      <ul className="mt-6 flex flex-col gap-3">
        {((filas ?? []) as Fila[]).map((fila) => (
          <li key={fila.id}>
            <Link
              href={`/admin/consultas/${fila.id}`}
              className="block rounded-md border border-border bg-surface px-5 py-4 transition-colors duration-200 hover:border-primary/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="text-[17px] text-primary">
                  {fila.nombre}
                  {fila.empresa ? <span className="text-muted-foreground"> · {fila.empresa}</span> : null}
                </p>
                <EtiquetaEstado estado={fila.estado} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
                <EtiquetaOrigen origen={fila.origen} />
                <span>{resumenPedido(fila)}</span>
                {fila.fecha_evento ? <span>Evento: {formatearFechaEvento(fila.fecha_evento)}</span> : null}
                <span className="ml-auto">{formatearFechaHora(fila.created_at)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

function resumenPedido(fila: Fila) {
  if (fila.producto_slug) return getProductBySlug(fila.producto_slug)?.name ?? fila.producto_slug
  return fila.tipo_pedido ?? 'Sin tipo'
}

function FiltroChip({ href, activo, etiqueta, cantidad }: { href: string; activo: boolean; etiqueta: string; cantidad: number }) {
  return (
    <Link
      href={href}
      aria-current={activo ? 'page' : undefined}
      className={`inline-flex min-h-[40px] items-center gap-2 rounded-sm border px-4 text-[13px] transition-colors duration-200 ${
        activo ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-surface text-primary hover:border-primary/50'
      }`}
    >
      {etiqueta}
      <span className={activo ? 'text-primary-foreground/70' : 'text-muted-foreground'}>{cantidad}</span>
    </Link>
  )
}
