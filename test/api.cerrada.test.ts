import { afterEach, describe, expect, it, vi } from 'vitest'

/* Desde el 26-09-2026 la web usa el formulario de Marco, que manda directo a WhatsApp (decisión de
   Adrián tras el reclamo de la clienta). La API de consultas quedó sin quién la llame: se cierra para no
   dejar una puerta de escritura abierta (auditoría de seguridad) y se reabre con CONSULTAS_API_ACTIVA=1. */

vi.mock('@/lib/supabase/admin', () => {
  class ConfiguracionFaltante extends Error {}
  return { crearClienteAdmin: vi.fn(), ConfiguracionFaltante }
})
vi.mock('@/lib/notificaciones/consulta-nueva', () => ({ enviarAvisoConsulta: vi.fn(async () => true) }))

import { crearClienteAdmin } from '@/lib/supabase/admin'
import { POST as guardarConsulta } from '@/app/api/consultas/route'
import { POST as marcarWhatsApp } from '@/app/api/consultas/[id]/whatsapp/route'

const ID = 'a3bb189e-8bf9-4c8b-9a3d-1c2d3e4f5a6b'
const pedido = (url: string, cuerpo = '{}') =>
  new Request(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: cuerpo })

afterEach(() => {
  vi.unstubAllEnvs()
  vi.mocked(crearClienteAdmin).mockReset()
})

describe('API de consultas cerrada por defecto', () => {
  it('sin CONSULTAS_API_ACTIVA, guardar una consulta responde 404 y no toca la base', async () => {
    vi.stubEnv('CONSULTAS_API_ACTIVA', '')
    const respuesta = await guardarConsulta(pedido('http://localhost/api/consultas'))
    expect(respuesta.status).toBe(404)
    expect(crearClienteAdmin).not.toHaveBeenCalled()
  })

  it('sin CONSULTAS_API_ACTIVA, marcar WhatsApp responde 404 y no toca la base', async () => {
    vi.stubEnv('CONSULTAS_API_ACTIVA', '')
    const respuesta = await marcarWhatsApp(pedido(`http://localhost/api/consultas/${ID}/whatsapp`), { params: Promise.resolve({ id: ID }) })
    expect(respuesta.status).toBe(404)
    expect(crearClienteAdmin).not.toHaveBeenCalled()
  })

  it('con CONSULTAS_API_ACTIVA=1 vuelve a funcionar (un cuerpo ilegible da 400, no 404)', async () => {
    vi.stubEnv('CONSULTAS_API_ACTIVA', '1')
    const respuesta = await guardarConsulta(pedido('http://localhost/api/consultas', 'esto no es json'))
    expect(respuesta.status).toBe(400)
  })
})
