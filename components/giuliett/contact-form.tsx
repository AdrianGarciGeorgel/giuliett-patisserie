'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { waLink } from '@/lib/giuliett'
import { AVISO_PRIVACIDAD, FORMULARIOS, type CampoFormulario, type ProductoConsulta } from '@/lib/consultas/formularios'
import {
  AVISO_SIN_TACC,
  ETIQUETA_OPCION_ESPECIAL,
  FRECUENCIAS,
  MENSAJES,
  OPCIONES_ESPECIALES,
  ORIGENES,
  type OpcionEspecial,
  type Origen,
} from '@/lib/consultas/tipos'
import { armarMensajeWhatsapp } from '@/lib/consultas/whatsapp'

/* Un solo formulario para los cuatro recorridos del Master Plan (particular,
   evento, empresa, mayorista). Primero guarda la consulta en /api/consultas;
   recién después ofrece abrir WhatsApp. Así, si el usuario no manda el
   mensaje, la consulta ya quedó registrada igual. */

type Valores = {
  nombre: string
  email: string
  whatsapp: string
  empresa: string
  localidad: string
  tipoPedido: string
  fechaEvento: string
  invitados: string
  volumen: string
  frecuencia: string
  tematica: string
  intereses: string[]
  opcionEspecial: OpcionEspecial | ''
  mensaje: string
}

type Errores = Partial<Record<keyof Valores, string>>

type Fase =
  | { tipo: 'editando' }
  | { tipo: 'enviando' }
  | { tipo: 'listo'; id: string; whatsappUrl: string; nombre: string }
  | { tipo: 'error'; mensaje: string; whatsappUrl: string }

type Props = {
  /** Recorrido inicial. Con `selector`, el usuario puede cambiarlo. */
  origen: Origen
  /** Muestra el selector de recorrido (solo en /contacto). */
  selector?: boolean
  /** Producto desde cuya ficha se consulta (recorrido particular). */
  producto?: ProductoConsulta
  className?: string
}

const valoresIniciales: Valores = {
  nombre: '',
  email: '',
  whatsapp: '',
  empresa: '',
  localidad: '',
  tipoPedido: '',
  fechaEvento: '',
  invitados: '',
  volumen: '',
  frecuencia: '',
  tematica: '',
  intereses: [],
  opcionEspecial: '',
  mensaje: '',
}

const EMAIL_SIMPLE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WHATSAPP_PERMITIDO = /^[+\d\s().-]+$/

function esOrigen(valor: string | null): valor is Origen {
  return ORIGENES.includes(valor as Origen)
}

/** Misma validación que el servidor, sin Zod. El servidor sigue siendo la autoridad. */
function validar(valores: Valores, origen: Origen, pideTipo: boolean): Errores {
  const errores: Errores = {}
  if (valores.nombre.trim().length < 2) errores.nombre = MENSAJES.nombre
  const whatsapp = valores.whatsapp.trim()
  if (whatsapp.length < 6) errores.whatsapp = MENSAJES.whatsapp
  else if (!WHATSAPP_PERMITIDO.test(whatsapp)) errores.whatsapp = MENSAJES.whatsappFormato
  if (valores.email.trim() && !EMAIL_SIMPLE.test(valores.email.trim())) errores.email = MENSAJES.email
  if (pideTipo && !valores.tipoPedido) errores.tipoPedido = MENSAJES.tipoPedido
  if (origen === 'empresa' && !valores.empresa.trim()) errores.empresa = MENSAJES.empresa
  if (origen === 'mayorista') {
    if (!valores.empresa.trim()) errores.empresa = MENSAJES.local
    if (!valores.localidad.trim()) errores.localidad = MENSAJES.localidad
  }
  if (!valores.opcionEspecial) errores.opcionEspecial = MENSAJES.opcionEspecial
  if (valores.mensaje.length > 2000) errores.mensaje = MENSAJES.mensajeLargo
  return errores
}

/** Los nombres de campo de la API (snake_case) → los del formulario. */
const CAMPO_DESDE_API: Record<string, keyof Valores> = {
  nombre: 'nombre',
  email: 'email',
  whatsapp: 'whatsapp',
  empresa: 'empresa',
  localidad: 'localidad',
  tipo_pedido: 'tipoPedido',
  fecha_evento: 'fechaEvento',
  cantidad_personas: 'invitados',
  volumen: 'volumen',
  frecuencia: 'frecuencia',
  tematica: 'tematica',
  intereses: 'intereses',
  opcion_especial: 'opcionEspecial',
  mensaje: 'mensaje',
}

function leerUtm() {
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const clave of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const valor = params.get(clave)
    if (valor) utm[clave] = valor.slice(0, 200)
  }
  return Object.keys(utm).length ? utm : undefined
}

function marcarAbrioWhatsapp(id: string) {
  fetch(`/api/consultas/${id}/whatsapp`, { method: 'POST', keepalive: true }).catch(() => {})
}

export function ContactForm({ origen: origenInicial, selector = false, producto, className }: Props) {
  const [origen, setOrigen] = useState<Origen>(origenInicial)
  const [valores, setValores] = useState<Valores>(valoresIniciales)
  const [errores, setErrores] = useState<Errores>({})
  const [fase, setFase] = useState<Fase>({ tipo: 'editando' })
  const [trampa, setTrampa] = useState('')
  const iniciadoEn = useRef(0)
  const formRef = useRef<HTMLFormElement>(null)
  const claveBorrador = `giuliett:consulta:${origen}:${producto?.slug ?? ''}`

  const config = FORMULARIOS[origen]
  const campos = new Set<CampoFormulario>(config.campos)
  // Desde la ficha de un producto no se pregunta el tipo: ya se sabe.
  const pideTipo = campos.has('tipoPedido') && config.tiposPedido.length > 0 && !producto
  const tipoPedidoFinal = pideTipo ? valores.tipoPedido : (producto?.categoria ?? '')
  const etiquetaEmpresaMensaje = origen === 'mayorista' ? 'Local' : 'Empresa'

  useEffect(() => {
    iniciadoEn.current = Date.now()
    // Deep link al recorrido: /contacto?para=empresa
    if (selector) {
      const para = new URLSearchParams(window.location.search).get('para')
      if (esOrigen(para)) setOrigen(para)
    }
  }, [selector])

  useEffect(() => {
    // Si recargó o volvió atrás, recuperamos lo que había escrito en este recorrido.
    try {
      const guardado = sessionStorage.getItem(claveBorrador)
      setValores(guardado ? { ...valoresIniciales, ...(JSON.parse(guardado) as Partial<Valores>) } : valoresIniciales)
    } catch {
      // Sin sessionStorage (modo privado, etc.) el formulario funciona igual.
    }
    setErrores({})
  }, [claveBorrador])

  useEffect(() => {
    if (fase.tipo !== 'editando') return
    try {
      const hayAlgo = Object.values(valores).some((valor) => (Array.isArray(valor) ? valor.length > 0 : valor !== ''))
      if (hayAlgo) sessionStorage.setItem(claveBorrador, JSON.stringify(valores))
    } catch {
      // ídem
    }
  }, [valores, fase.tipo, claveBorrador])

  useEffect(() => {
    if (Object.keys(errores).length === 0) return
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [errores])

  const actualizar = <Campo extends keyof Valores>(campo: Campo, valor: Valores[Campo]) => {
    setValores((actual) => ({ ...actual, [campo]: valor }))
    setErrores((actual) => (actual[campo] ? { ...actual, [campo]: undefined } : actual))
  }

  const alternarInteres = (interes: string) => {
    setValores((actual) => ({
      ...actual,
      intereses: actual.intereses.includes(interes)
        ? actual.intereses.filter((item) => item !== interes)
        : [...actual.intereses, interes],
    }))
  }

  const reiniciar = () => {
    setValores(valoresIniciales)
    setErrores({})
    setFase({ tipo: 'editando' })
    iniciadoEn.current = Date.now()
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (fase.tipo === 'enviando') return

    const nuevosErrores = validar(valores, origen, pideTipo)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    const whatsappUrl = waLink(
      armarMensajeWhatsapp({
        saludo: producto ? `Hola Giuliett! Quisiera consultar por ${producto.nombre}.` : config.saludo,
        nombre: valores.nombre,
        whatsapp: valores.whatsapp,
        email: valores.email,
        empresa: campos.has('empresa') ? valores.empresa : '',
        etiquetaEmpresa: etiquetaEmpresaMensaje,
        localidad: campos.has('localidad') ? valores.localidad : '',
        producto: producto?.nombre,
        tipoPedido: tipoPedidoFinal,
        fechaEvento: valores.fechaEvento,
        invitados: valores.invitados,
        volumen: campos.has('volumen') ? valores.volumen : '',
        frecuencia: campos.has('frecuencia') ? valores.frecuencia : '',
        tematica: valores.tematica,
        intereses: valores.intereses,
        opcionEspecial: valores.opcionEspecial ? ETIQUETA_OPCION_ESPECIAL[valores.opcionEspecial] : '',
        mensaje: valores.mensaje,
      }),
    )

    setFase({ tipo: 'enviando' })
    try {
      const respuesta = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origen,
          nombre: valores.nombre,
          whatsapp: valores.whatsapp,
          email: valores.email,
          empresa: campos.has('empresa') ? valores.empresa : '',
          localidad: campos.has('localidad') ? valores.localidad : '',
          tipo_pedido: tipoPedidoFinal,
          fecha_evento: valores.fechaEvento,
          cantidad_personas: valores.invitados,
          volumen: campos.has('volumen') ? valores.volumen : '',
          frecuencia: campos.has('frecuencia') ? valores.frecuencia : '',
          tematica: valores.tematica,
          intereses: valores.intereses,
          opcion_especial: valores.opcionEspecial,
          mensaje: valores.mensaje,
          producto_slug: producto?.slug ?? '',
          pagina_origen: window.location.pathname,
          utm: leerUtm(),
          sitio_web: trampa,
          iniciado_en: iniciadoEn.current,
        }),
      })
      const json = (await respuesta.json().catch(() => ({}))) as { id?: string; error?: string; errores?: Record<string, string> }

      if (!respuesta.ok) {
        if (respuesta.status === 422 && json.errores) {
          const desdeApi: Errores = {}
          for (const [campoApi, mensaje] of Object.entries(json.errores)) {
            const campo = CAMPO_DESDE_API[campoApi]
            if (campo) desdeApi[campo] = mensaje
          }
          setErrores(desdeApi)
          setFase({ tipo: 'editando' })
          return
        }
        throw new Error(json.error || 'No pudimos guardar tu consulta.')
      }

      try {
        sessionStorage.removeItem(claveBorrador)
      } catch {
        // ídem
      }
      setFase({ tipo: 'listo', id: json.id ?? '', whatsappUrl, nombre: valores.nombre.trim() })
    } catch (error) {
      setFase({
        tipo: 'error',
        mensaje: error instanceof Error ? error.message : 'No pudimos guardar tu consulta.',
        whatsappUrl,
      })
    }
  }

  if (fase.tipo === 'listo') {
    return (
      <div role="status" aria-live="polite" className={`rounded-md bg-lilac-soft px-6 py-10 text-center ${className ?? ''}`}>
        <p className="font-script text-[36px] leading-none text-primary">¡Gracias, {fase.nombre}!</p>
        <p className="mt-5 text-[16px] leading-[1.65] text-primary">Ya tenemos tu consulta. Te respondemos por WhatsApp.</p>
        <p className="mt-2 text-[14px] leading-[1.65] text-muted-foreground">
          Si querés adelantar la charla, abrí WhatsApp con tu mensaje ya escrito.
        </p>
        <a
          href={fase.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => fase.id && marcarAbrioWhatsapp(fase.id)}
          className={`${botonClassName} mt-8`}
        >
          Abrir WhatsApp →
        </a>
        <div className="mt-5">
          <button type="button" onClick={reiniciar} className="underline-write min-h-[44px] text-[14px] text-primary/70 hover:text-primary">
            Enviar otra consulta
          </button>
        </div>
      </div>
    )
  }

  if (fase.tipo === 'error') {
    return (
      <div role="alert" className={`rounded-md border border-[#9b4e4e]/30 bg-surface px-6 py-10 text-center ${className ?? ''}`}>
        <p className="text-[16px] leading-[1.65] text-primary">{fase.mensaje}</p>
        <p className="mt-2 text-[14px] leading-[1.65] text-muted-foreground">
          Podés escribirnos directo por WhatsApp: tu consulta ya está armada.
        </p>
        <a href={fase.whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${botonClassName} mt-8`}>
          Abrir WhatsApp →
        </a>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setFase({ tipo: 'editando' })}
            className="underline-write min-h-[44px] text-[14px] text-primary/70 hover:text-primary"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    )
  }

  const enviando = fase.tipo === 'enviando'

  return (
    <form ref={formRef} noValidate onSubmit={enviar} className={`flex flex-col gap-7 ${className ?? ''}`} aria-busy={enviando}>
      {selector ? (
        <fieldset>
          <legend className="text-[14px] font-medium text-primary">¿Para quién es?</legend>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {ORIGENES.map((recorrido) => {
              const seleccionado = recorrido === origen
              return (
                <label key={recorrido} className={chipClassName(seleccionado)}>
                  <input
                    type="radio"
                    name="recorrido"
                    value={recorrido}
                    checked={seleccionado}
                    onChange={() => setOrigen(recorrido)}
                    className="sr-only"
                  />
                  {FORMULARIOS[recorrido].etiqueta}
                </label>
              )
            })}
          </div>
        </fieldset>
      ) : null}

      <Field label="Nombre y apellido" required error={errores.nombre}>
        <input
          value={valores.nombre}
          onChange={(evento) => actualizar('nombre', evento.target.value)}
          aria-invalid={Boolean(errores.nombre)}
          className={inputClassName}
          autoComplete="name"
          maxLength={120}
        />
      </Field>

      <Field label="WhatsApp" required error={errores.whatsapp}>
        <input
          type="tel"
          value={valores.whatsapp}
          onChange={(evento) => actualizar('whatsapp', evento.target.value)}
          aria-invalid={Boolean(errores.whatsapp)}
          className={inputClassName}
          autoComplete="tel"
          inputMode="tel"
          maxLength={30}
        />
      </Field>

      {campos.has('empresa') ? (
        <Field label={config.etiquetaEmpresa} required error={errores.empresa}>
          <input
            value={valores.empresa}
            onChange={(evento) => actualizar('empresa', evento.target.value)}
            aria-invalid={Boolean(errores.empresa)}
            className={inputClassName}
            autoComplete="organization"
            maxLength={120}
          />
        </Field>
      ) : null}

      {campos.has('localidad') ? (
        <Field label="Localidad" required error={errores.localidad}>
          <input
            value={valores.localidad}
            onChange={(evento) => actualizar('localidad', evento.target.value)}
            aria-invalid={Boolean(errores.localidad)}
            className={inputClassName}
            autoComplete="address-level2"
            placeholder="Ciudad, Godoy Cruz, Maipú…"
            maxLength={120}
          />
        </Field>
      ) : null}

      {campos.has('email') ? (
        <Field label="Email" error={errores.email}>
          <input
            type="email"
            value={valores.email}
            onChange={(evento) => actualizar('email', evento.target.value)}
            aria-invalid={Boolean(errores.email)}
            className={inputClassName}
            autoComplete="email"
            inputMode="email"
            maxLength={160}
          />
        </Field>
      ) : null}

      {pideTipo ? (
        <Field label={config.etiquetaTipo} required error={errores.tipoPedido}>
          <select
            value={valores.tipoPedido}
            onChange={(evento) => actualizar('tipoPedido', evento.target.value)}
            aria-invalid={Boolean(errores.tipoPedido)}
            className={inputClassName}
          >
            <option value="">Elegí una opción</option>
            {config.tiposPedido.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </Field>
      ) : null}

      {campos.has('fechaEvento') || campos.has('invitados') ? (
        <div className="grid gap-7 sm:grid-cols-2">
          {campos.has('fechaEvento') ? (
            <Field label="Fecha del evento" error={errores.fechaEvento}>
              <input
                type="date"
                value={valores.fechaEvento}
                onChange={(evento) => actualizar('fechaEvento', evento.target.value)}
                aria-invalid={Boolean(errores.fechaEvento)}
                className={inputClassName}
              />
            </Field>
          ) : null}
          {campos.has('invitados') ? (
            <Field label={config.etiquetaInvitados} error={errores.invitados}>
              <input
                type="number"
                min="1"
                max="100000"
                value={valores.invitados}
                onChange={(evento) => actualizar('invitados', evento.target.value)}
                aria-invalid={Boolean(errores.invitados)}
                className={inputClassName}
                inputMode="numeric"
              />
            </Field>
          ) : null}
        </div>
      ) : null}

      {campos.has('volumen') || campos.has('frecuencia') ? (
        <div className="grid gap-7 sm:grid-cols-2">
          {campos.has('volumen') ? (
            <Field label="Volumen estimado" error={errores.volumen}>
              <input
                value={valores.volumen}
                onChange={(evento) => actualizar('volumen', evento.target.value)}
                className={inputClassName}
                placeholder="40 unidades por semana"
                maxLength={120}
              />
            </Field>
          ) : null}
          {campos.has('frecuencia') ? (
            <Field label="Frecuencia" error={errores.frecuencia}>
              <select value={valores.frecuencia} onChange={(evento) => actualizar('frecuencia', evento.target.value)} className={inputClassName}>
                <option value="">Elegí una opción</option>
                {FRECUENCIAS.map((frecuencia) => (
                  <option key={frecuencia} value={frecuencia}>
                    {frecuencia}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
        </div>
      ) : null}

      {campos.has('tematica') ? (
        <Field label="Temática o estilo" error={errores.tematica}>
          <input
            value={valores.tematica}
            onChange={(evento) => actualizar('tematica', evento.target.value)}
            className={inputClassName}
            placeholder="Flores, boho, un personaje, tu marca…"
            maxLength={120}
          />
        </Field>
      ) : null}

      {campos.has('intereses') && config.intereses.length > 0 ? (
        <fieldset>
          <legend className="text-[14px] font-medium text-primary">¿Qué estás buscando?</legend>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {config.intereses.map((interes) => {
              const seleccionado = valores.intereses.includes(interes)
              return (
                <label key={interes} className={chipClassName(seleccionado)}>
                  <input type="checkbox" checked={seleccionado} onChange={() => alternarInteres(interes)} className="sr-only" />
                  {interes}
                </label>
              )
            })}
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="text-[14px] font-medium text-primary">
          ¿Necesitás una opción especial?<span aria-hidden="true"> *</span>
        </legend>
        <div className="mt-4 grid grid-cols-1 gap-3">
          {OPCIONES_ESPECIALES.map((opcion) => {
            const seleccionado = valores.opcionEspecial === opcion
            return (
              <label key={opcion} className={chipClassName(seleccionado)}>
                <input
                  type="radio"
                  name="opcion_especial"
                  value={opcion}
                  checked={seleccionado}
                  onChange={() => actualizar('opcionEspecial', opcion)}
                  className="sr-only"
                />
                {ETIQUETA_OPCION_ESPECIAL[opcion]}
              </label>
            )
          })}
        </div>
        {errores.opcionEspecial ? (
          <p role="alert" className="mt-2 text-[13px] leading-relaxed text-[#9b4e4e]">
            {errores.opcionEspecial}
          </p>
        ) : null}
        <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">{AVISO_SIN_TACC}</p>
      </fieldset>

      {campos.has('mensaje') ? (
        <Field label={config.etiquetaMensaje} error={errores.mensaje}>
          <textarea
            value={valores.mensaje}
            onChange={(evento) => actualizar('mensaje', evento.target.value)}
            aria-invalid={Boolean(errores.mensaje)}
            className={`${inputClassName} min-h-[150px] resize-y py-3`}
            maxLength={2000}
          />
        </Field>
      ) : null}

      {/* Campo trampa: las personas no lo ven, los bots lo completan. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Sitio web
          <input name="sitio_web" tabIndex={-1} autoComplete="off" value={trampa} onChange={(evento) => setTrampa(evento.target.value)} />
        </label>
      </div>

      <button type="submit" disabled={enviando} className={`${botonClassName} mt-3 w-full disabled:cursor-wait disabled:opacity-70`}>
        {enviando ? 'Enviando…' : `${config.textoBoton} →`}
      </button>

      <p className="-mt-3 text-center text-[12px] leading-relaxed text-muted-foreground">{AVISO_PRIVACIDAD}</p>
    </form>
  )
}

const botonClassName =
  'inline-flex min-h-[56px] items-center justify-center rounded-sm bg-primary px-8 text-[16px] font-medium text-primary-foreground transition-[background-color,box-shadow,transform] duration-[250ms] ease-out hover:bg-lilac-ink hover:shadow-[var(--shadow-giuliett)] active:scale-[0.985]'

const inputClassName =
  'min-h-[50px] w-full border-b border-border bg-transparent px-0 text-[16px] text-primary outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary aria-[invalid=true]:border-[#9b4e4e]'

function chipClassName(seleccionado: boolean) {
  return `flex min-h-[48px] cursor-pointer items-center rounded-sm border px-4 text-[13px] transition-colors duration-200 focus-within:ring-2 focus-within:ring-primary/40 ${
    seleccionado ? 'border-primary bg-lilac-soft text-primary' : 'border-border bg-surface text-muted-foreground hover:border-primary/50'
  }`
}

function Field({
  label,
  required = false,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-[14px] font-medium text-primary">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>
      <span className="mt-2 block">{children}</span>
      {error ? (
        <span role="alert" className="mt-2 block text-[13px] leading-relaxed text-[#9b4e4e]">
          {error}
        </span>
      ) : null}
    </label>
  )
}
