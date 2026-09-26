import { NextResponse, after } from 'next/server'
import { apiConsultasActiva } from '@/lib/consultas/api-activa'
import { consultaEntradaSchema, erroresPorCampo } from '@/lib/consultas/schema'
import { enviarAvisoConsulta } from '@/lib/notificaciones/consulta-nueva'
import { resolverUrlSitio } from '@/lib/seo'
import { ConfiguracionFaltante, crearClienteAdmin } from '@/lib/supabase/admin'

/* POST /api/consultas — guarda una consulta y devuelve su id.
   El formulario recién después abre WhatsApp: si el usuario no manda el
   mensaje, la consulta ya quedó registrada igual. */

const VENTANA_MS = 10 * 60 * 1000
const MAX_ENVIOS_POR_VENTANA = 6
const MIN_SEGUNDOS_EN_FORMULARIO = 2
const VENTANA_REPETIDA_MS = 2 * 60 * 1000

/** Límite por IP. Vive en memoria: es un freno razonable, no un muro. */
const enviosPorIp = new Map<string, number[]>()

function superaLimite(ip: string) {
  const ahora = Date.now()
  const recientes = (enviosPorIp.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS)
  recientes.push(ahora)
  enviosPorIp.set(ip, recientes)
  if (enviosPorIp.size > 5000) enviosPorIp.clear()
  return recientes.length > MAX_ENVIOS_POR_VENTANA
}

/** A un bot se le responde OK sin guardar nada: que no aprenda qué lo delató. */
function respuestaSilenciosa() {
  return NextResponse.json({ id: crypto.randomUUID() }, { status: 201 })
}

export async function POST(request: Request) {
  // Cerrada mientras ningún formulario de la web la use (ver lib/consultas/api-activa.ts).
  if (!apiConsultasActiva()) return new Response(null, { status: 404 })

  let cuerpo: unknown
  try {
    cuerpo = await request.json()
  } catch {
    return NextResponse.json({ error: 'No pudimos leer los datos del formulario.' }, { status: 400 })
  }

  if (cuerpo && typeof cuerpo === 'object' && (cuerpo as { sitio_web?: unknown }).sitio_web) {
    return respuestaSilenciosa()
  }

  const resultado = consultaEntradaSchema.safeParse(cuerpo)
  if (!resultado.success) {
    return NextResponse.json(
      { error: 'Revisá los datos marcados.', errores: erroresPorCampo(resultado.error) },
      { status: 422 },
    )
  }

  const { sitio_web: _trampa, iniciado_en, ...fila } = resultado.data
  void _trampa

  if (iniciado_en && Date.now() - iniciado_en < MIN_SEGUNDOS_EN_FORMULARIO * 1000) {
    return respuestaSilenciosa()
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'desconocida'
  if (superaLimite(ip)) {
    return NextResponse.json(
      { error: 'Demasiados envíos seguidos. Esperá unos minutos o escribinos directo por WhatsApp.' },
      { status: 429 },
    )
  }

  try {
    const supabase = crearClienteAdmin()

    // Doble clic, doble envío o recarga: mismo WhatsApp, mismo origen y mismo
    // mensaje en los últimos dos minutos → devolvemos la consulta que ya existe.
    const desde = new Date(Date.now() - VENTANA_REPETIDA_MS).toISOString()
    let repetidaQuery = supabase
      .from('consultas')
      .select('id')
      .eq('whatsapp', fila.whatsapp)
      .eq('origen', fila.origen)
      .gte('created_at', desde)
    repetidaQuery = fila.mensaje ? repetidaQuery.eq('mensaje', fila.mensaje) : repetidaQuery.is('mensaje', null)
    const { data: repetida } = await repetidaQuery.order('created_at', { ascending: false }).limit(1).maybeSingle()
    if (repetida) return NextResponse.json({ id: repetida.id, repetida: true }, { status: 200 })

    const { data, error } = await supabase.from('consultas').insert(fila).select('id').single()
    if (error) throw error

    // El aviso a Giu sale después de responder: no demora al usuario y, si falla, no lo afecta.
    after(() =>
      enviarAvisoConsulta({ ...fila, id: data.id }, resolverUrlSitio()).catch((e) =>
        console.error('[api/consultas] no se pudo mandar el aviso:', e),
      ),
    )

    return NextResponse.json({ id: data.id }, { status: 201 })
  } catch (error) {
    const sinConfigurar = error instanceof ConfiguracionFaltante
    console.error('[api/consultas] no se pudo guardar la consulta:', error)
    return NextResponse.json(
      {
        error: sinConfigurar
          ? 'El registro de consultas todavía no está configurado.'
          : 'No pudimos guardar tu consulta en este momento.',
      },
      { status: sinConfigurar ? 503 : 500 },
    )
  }
}
