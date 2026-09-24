import { describe, expect, it } from 'vitest'
import { armarAvisoConsulta, configuracionAvisos, type ConsultaParaAviso } from '@/lib/notificaciones/consulta-nueva'

const base: ConsultaParaAviso = {
  id: '11111111-2222-4333-8444-555555555555',
  origen: 'evento',
  nombre: 'María <script>alert(1)</script> Pérez',
  whatsapp: '261 555 1234',
  email: 'maria@ejemplo.com',
  empresa: null,
  tipo_pedido: 'Mesa dulce',
  fecha_evento: '2026-11-15',
  cantidad_personas: '80',
  opcion_especial: 'sin_tacc',
  mensaje: 'Queremos algo lila.\nCon flores.',
  producto_slug: null,
  localidad: null,
  volumen: null,
  frecuencia: null,
  tematica: 'Boda',
  intereses: ['Macarons', 'Torta'],
}
const sitio = 'https://giuliettpatisserie.com'

describe('armarAvisoConsulta', () => {
  it('asunto: qué recorrido y quién, para leerlo desde la notificación del celular', () => {
    const { asunto } = armarAvisoConsulta(base, sitio)
    expect(asunto).toMatch(/Nueva consulta/)
    expect(asunto).toMatch(/Evento/)
    expect(asunto).toMatch(/María/)
  })

  it('texto plano con los datos clave y el link directo al detalle en el panel', () => {
    const { texto } = armarAvisoConsulta(base, sitio)
    expect(texto).toContain('261 555 1234')
    expect(texto).toContain('maria@ejemplo.com')
    expect(texto).toContain('15/11/2026')
    expect(texto).toContain('Mesa dulce')
    expect(texto).toContain('Macarons, Torta')
    expect(texto).toContain(`${sitio}/admin/consultas/${base.id}`)
  })

  it('Sin TACC aparece marcado como tercerizado; sin promesas de tiempos', () => {
    const { texto, html } = armarAvisoConsulta(base, sitio)
    expect(texto).toMatch(/Sin TACC \(tercerizado\)/)
    expect(html).toMatch(/Sin TACC \(tercerizado\)/)
    expect(texto).not.toMatch(/\b\d+\s*(hs|horas)\b/i)
  })

  it('el HTML escapa lo que escribió el usuario', () => {
    const { html } = armarAvisoConsulta(base, sitio)
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('Queremos algo lila.<br>Con flores.')
  })

  it('omite los campos vacíos en vez de imprimir "null"', () => {
    const { texto } = armarAvisoConsulta({ ...base, email: null, mensaje: null, intereses: [] }, sitio)
    expect(texto).not.toMatch(/null|undefined/)
    expect(texto).not.toMatch(/Email/)
  })

  it('mayorista muestra empresa, localidad, volumen y frecuencia', () => {
    const { texto } = armarAvisoConsulta(
      {
        ...base,
        origen: 'mayorista',
        empresa: 'Café Andino',
        localidad: 'Godoy Cruz',
        volumen: '50 tortas/mes',
        frecuencia: 'semanal',
      },
      sitio,
    )
    expect(texto).toContain('Café Andino')
    expect(texto).toContain('Godoy Cruz')
    expect(texto).toContain('50 tortas/mes')
    expect(texto).toContain('semanal')
  })
})

describe('configuracionAvisos: se activa solo con las variables puestas', () => {
  it('sin variables no hay aviso (y no explota)', () => {
    expect(configuracionAvisos({})).toBeNull()
    expect(configuracionAvisos({ RESEND_API_KEY: 're_x' })).toBeNull()
    expect(configuracionAvisos({ AVISOS_EMAIL_DESTINO: 'giu@ejemplo.com' })).toBeNull()
  })

  it('con clave y destino queda activo; el remitente tiene un valor por defecto de la marca', () => {
    const config = configuracionAvisos({
      RESEND_API_KEY: 're_x',
      AVISOS_EMAIL_DESTINO: 'giu@ejemplo.com, adri@ejemplo.com',
    })
    expect(config).not.toBeNull()
    expect(config?.destinos).toEqual(['giu@ejemplo.com', 'adri@ejemplo.com'])
    expect(config?.remitente).toMatch(/Giuliett/)
    expect(config?.remitente).toMatch(/@giuliettpatisserie\.com/)
  })

  it('respeta un remitente explícito', () => {
    const config = configuracionAvisos({
      RESEND_API_KEY: 're_x',
      AVISOS_EMAIL_DESTINO: 'a@b.co',
      AVISOS_EMAIL_REMITENTE: 'Web <web@otro.com>',
    })
    expect(config?.remitente).toBe('Web <web@otro.com>')
  })
})
