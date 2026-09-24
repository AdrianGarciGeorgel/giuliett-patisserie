import { beforeEach, describe, expect, it, vi } from 'vitest'

/* La API se prueba con un Supabase falso: lo que importa acá es qué guarda,
   qué rechaza y qué responde. La base real se prueba a mano, con Playwright. */

vi.mock('@/lib/supabase/admin', () => {
  class ConfiguracionFaltante extends Error {}
  return { crearClienteAdmin: vi.fn(), ConfiguracionFaltante }
})

// Fuera de Next no hay request en curso: `after` corre la tarea al instante.
vi.mock('next/server', async (importOriginal) => {
  const original = await importOriginal<typeof import('next/server')>()
  return { ...original, after: (tarea: () => unknown) => void tarea() }
})

vi.mock('@/lib/notificaciones/consulta-nueva', () => ({ enviarAvisoConsulta: vi.fn(async () => true) }))

import { enviarAvisoConsulta } from '@/lib/notificaciones/consulta-nueva'
import { ConfiguracionFaltante, crearClienteAdmin } from '@/lib/supabase/admin'
import { POST } from '@/app/api/consultas/route'

const ID_NUEVA = 'a3bb189e-8bf9-4c8b-9a3d-1c2d3e4f5a6b'
const ID_PREVIA = '7c9e6679-7425-40de-944b-e07fc1f90ae7'

function supabaseFalso({ previa = null as null | { id: string }, errorInsert = null as null | { message: string } } = {}) {
  const cadena: Record<string, ReturnType<typeof vi.fn>> = {}
  const devuelveCadena = () => cadena
  for (const metodo of ['select', 'eq', 'is', 'gte', 'order', 'limit', 'insert', 'update']) {
    cadena[metodo] = vi.fn(devuelveCadena)
  }
  cadena.maybeSingle = vi.fn(async () => ({ data: previa, error: null }))
  cadena.single = vi.fn(async () => ({ data: errorInsert ? null : { id: ID_NUEVA }, error: errorInsert }))
  const cliente = { from: vi.fn(() => cadena) }
  vi.mocked(crearClienteAdmin).mockReturnValue(cliente as never)
  return { cliente, cadena }
}

let contadorIp = 0
function pedido(cuerpo: unknown, { ip }: { ip?: string } = {}) {
  return new Request('http://localhost/api/consultas', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip ?? `10.0.0.${++contadorIp}` },
    body: typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo),
  })
}

const valida = () => ({
  origen: 'particular',
  nombre: 'Ana Pérez',
  whatsapp: '+54 9 261 713 7765',
  opcion_especial: 'sin_tacc',
  producto_slug: 'marquise',
  mensaje: 'Para el 15, ¿se puede?',
  iniciado_en: Date.now() - 10_000,
})

beforeEach(() => {
  vi.mocked(crearClienteAdmin).mockReset()
  vi.mocked(enviarAvisoConsulta).mockClear()
})

describe('POST /api/consultas', () => {
  it('guarda una consulta válida y devuelve 201 con su id', async () => {
    const { cliente, cadena } = supabaseFalso()
    const res = await POST(pedido(valida()))
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ id: ID_NUEVA })
    expect(cliente.from).toHaveBeenCalledWith('consultas')
    const fila = cadena.insert.mock.calls[0][0]
    expect(fila).toMatchObject({ origen: 'particular', nombre: 'Ana Pérez', producto_slug: 'marquise', opcion_especial: 'sin_tacc' })
    expect(fila).not.toHaveProperty('iniciado_en')
    expect(fila).not.toHaveProperty('sitio_web')
  })

  it('responde 422 con el error por campo cuando faltan datos', async () => {
    supabaseFalso()
    const res = await POST(pedido({ ...valida(), nombre: '' }))
    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.errores.nombre).toBeTruthy()
  })

  it('responde 422 si falta la opción especial obligatoria', async () => {
    supabaseFalso()
    const { opcion_especial: _sin, ...cuerpo } = valida()
    void _sin
    const res = await POST(pedido(cuerpo))
    expect(res.status).toBe(422)
    expect((await res.json()).errores.opcion_especial).toBeTruthy()
  })

  it('responde 400 si el cuerpo no es JSON', async () => {
    supabaseFalso()
    const res = await POST(pedido('esto no es json'))
    expect(res.status).toBe(400)
  })

  it('si el campo trampa viene lleno, responde OK pero no guarda nada', async () => {
    const { cadena } = supabaseFalso()
    const res = await POST(pedido({ ...valida(), sitio_web: 'http://spam.example' }))
    expect(res.status).toBe(201)
    expect((await res.json()).id).toMatch(/^[0-9a-f-]{36}$/)
    expect(cadena.insert).not.toHaveBeenCalled()
  })

  it('si el formulario se completó en menos de 2 segundos, responde OK pero no guarda', async () => {
    const { cadena } = supabaseFalso()
    const res = await POST(pedido({ ...valida(), iniciado_en: Date.now() - 500 }))
    expect(res.status).toBe(201)
    expect(cadena.insert).not.toHaveBeenCalled()
  })

  it('un doble envío devuelve la consulta ya guardada en vez de duplicarla', async () => {
    const { cadena } = supabaseFalso({ previa: { id: ID_PREVIA } })
    const res = await POST(pedido(valida()))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ id: ID_PREVIA, repetida: true })
    expect(cadena.insert).not.toHaveBeenCalled()
  })

  it('responde 503 con un mensaje claro si Supabase no está configurado', async () => {
    vi.mocked(crearClienteAdmin).mockImplementation(() => {
      throw new ConfiguracionFaltante(['SUPABASE_URL', 'SUPABASE_SECRET_KEY'])
    })
    const res = await POST(pedido(valida()))
    expect(res.status).toBe(503)
    expect((await res.json()).error).toMatch(/no está configurado/)
  })

  it('responde 500 si la base falla al insertar', async () => {
    supabaseFalso({ errorInsert: { message: 'boom' } })
    const errorSilenciado = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await POST(pedido(valida()))
    expect(res.status).toBe(500)
    errorSilenciado.mockRestore()
  })

  it('frena a la misma IP después de 6 envíos en la ventana', async () => {
    supabaseFalso()
    const ip = '203.0.113.9'
    for (let i = 0; i < 6; i++) {
      const res = await POST(pedido({ ...valida(), mensaje: `envío ${i}` }, { ip }))
      expect(res.status).toBe(201)
    }
    const res = await POST(pedido(valida(), { ip }))
    expect(res.status).toBe(429)
  })
})

describe('aviso a Giu por consulta nueva', () => {
  it('después de guardar dispara el aviso con los datos y el id nuevo', async () => {
    supabaseFalso()
    const res = await POST(pedido(valida()))
    expect(res.status).toBe(201)
    expect(enviarAvisoConsulta).toHaveBeenCalledTimes(1)
    const [consulta, urlSitio] = vi.mocked(enviarAvisoConsulta).mock.calls[0]
    expect(consulta).toMatchObject({ id: ID_NUEVA, nombre: 'Ana Pérez', origen: 'particular', opcion_especial: 'sin_tacc' })
    expect(urlSitio).toMatch(/^https?:\/\//)
  })

  it('una consulta repetida no vuelve a avisar', async () => {
    supabaseFalso({ previa: { id: ID_PREVIA } })
    const res = await POST(pedido(valida()))
    expect(res.status).toBe(200)
    expect(enviarAvisoConsulta).not.toHaveBeenCalled()
  })

  it('si el aviso falla, la consulta igual se guarda y responde 201', async () => {
    supabaseFalso()
    vi.mocked(enviarAvisoConsulta).mockRejectedValueOnce(new Error('Resend caído'))
    const res = await POST(pedido(valida()))
    expect(res.status).toBe(201)
  })
})
