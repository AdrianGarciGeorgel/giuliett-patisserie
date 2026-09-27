'use client'

import { useRef, useState, type FormEvent } from 'react'
import { waLink } from '@/lib/giuliett'
import {
  armarMensajePedido,
  esEnvioRepetido,
  primerCampoConError,
  validarPedido,
  type CampoObligatorio,
  type ErroresPedido as FormErrors,
  type ValoresPedido as FormValues,
} from '@/lib/pedido'

const initialValues: FormValues = {
  name: '',
  email: '',
  whatsapp: '',
  orderType: '',
  eventDate: '',
  people: '',
  interests: [],
  description: '',
}

const orderTypes = ['Tortas', 'Galletas personalizadas', 'Box', 'Evento', 'Mesa dulce', 'Otro']
const interests = ['Tortas clásicas', 'Tortas personalizadas', 'Galletas personalizadas', 'Boxes', 'Mesa dulce','Celebraciones','Bodas','Cumpleaños',  'Otro']

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  // Los campos con asterisco, para llevar la vista al primero que tenga un error.
  const obligatorios = useRef<Partial<Record<CampoObligatorio, HTMLInputElement | HTMLSelectElement | null>>>({})
  const ultimoEnvio = useRef(-Infinity)

  const updateValue = <Field extends keyof FormValues>(field: Field, value: FormValues[Field]) => {
    setValues((current) => ({ ...current, [field]: value }))
    if (field === 'name' || field === 'email' || field === 'whatsapp' || field === 'orderType') {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  const toggleInterest = (interest: string) => {
    setValues((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validarPedido(values)
    setErrors(nextErrors)
    const conError = primerCampoConError(nextErrors)
    if (conError) {
      // El aviso puede quedar fuera de la pantalla (en el celular, "Enviar" queda lejos del primer campo):
      // se lleva la vista hasta el primer campo con error.
      const campo = obligatorios.current[conError]
      campo?.scrollIntoView({ block: 'center' })
      campo?.focus({ preventScroll: true })
      return
    }

    // Un doble clic abría WhatsApp dos veces.
    if (esEnvioRepetido(event.timeStamp, ultimoEnvio.current)) return
    ultimoEnvio.current = event.timeStamp

    window.open(waLink(armarMensajePedido(values)), '_blank', 'noopener,noreferrer')
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-7">
      <Field label="Nombre y apellido" required error={errors.name}>
        <input
          ref={(campo) => { obligatorios.current.name = campo }}
          value={values.name}
          onChange={(event) => updateValue('name', event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-required="true"
          className={inputClassName}
          autoComplete="name"
        />
      </Field>

      <Field label="Email" required error={errors.email}>
        <input
          ref={(campo) => { obligatorios.current.email = campo }}
          value={values.email}
          onChange={(event) => updateValue('email', event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-required="true"
          className={inputClassName}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
        />
      </Field>

      <Field label="Número de teléfono" required error={errors.whatsapp}>
        <input
          ref={(campo) => { obligatorios.current.whatsapp = campo }}
          type="tel"
          value={values.whatsapp}
          onChange={(event) => updateValue('whatsapp', event.target.value)}
          aria-invalid={Boolean(errors.whatsapp)}
          aria-required="true"
          className={inputClassName}
          autoComplete="tel"
          inputMode="tel"
        />
      </Field>

      <Field label="Tipo de pedido" required error={errors.orderType}>
        <select
          ref={(campo) => { obligatorios.current.orderType = campo }}
          value={values.orderType}
          onChange={(event) => updateValue('orderType', event.target.value)}
          aria-invalid={Boolean(errors.orderType)}
          aria-required="true"
          className={inputClassName}
        >
          <option value="">Elegí una opción</option>
          {orderTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Fecha del evento">
          <input
            type="date"
            value={values.eventDate}
            onChange={(event) => updateValue('eventDate', event.target.value)}
            className={inputClassName}
          />
        </Field>
        <Field label="Cantidad de invitados">
          <input
            type="number"
            min="1"
            value={values.people}
            onChange={(event) => updateValue('people', event.target.value)}
            className={inputClassName}
            inputMode="numeric"
          />
        </Field>
      </div>

      <fieldset>
        <legend className="text-[14px] font-medium text-primary">¿Qué estás buscando?</legend>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {interests.map((interest) => {
            const selected = values.interests.includes(interest)
            return (
              <label
                key={interest}
                className={`flex min-h-[48px] cursor-pointer items-center rounded-sm border px-4 text-[13px] transition-colors duration-200 ${
                  selected ? 'border-primary bg-lilac-soft text-primary' : 'border-border bg-surface text-muted-foreground hover:border-primary/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleInterest(interest)}
                  className="sr-only"
                />
                {interest}
              </label>
            )
          })}
        </div>
      </fieldset>

      <Field label="Contanos tu idea">
        <textarea
          value={values.description}
          onChange={(event) => updateValue('description', event.target.value)}
          className={`${inputClassName} min-h-[150px] resize-y py-3`}
        />
      </Field>

      <button
        type="submit"
        className="mt-3 inline-flex min-h-[56px] w-full items-center justify-center rounded-sm bg-primary px-8 text-[16px] font-medium text-primary-foreground transition-[background-color,box-shadow,transform] duration-[250ms] ease-out hover:bg-lilac-ink hover:shadow-[var(--shadow-giuliett)] active:scale-[0.985]"
      >
        Enviar consulta por WhatsApp →
      </button>
    </form>
  )
}

const inputClassName =
  'min-h-[50px] w-full border-b border-border bg-transparent px-0 text-[16px] text-primary outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary aria-[invalid=true]:border-[#9b4e4e]'

function Field({ label, required = false, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[14px] font-medium text-primary">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-2 block text-[13px] leading-relaxed text-[#9b4e4e]">{error}</span> : null}
    </label>
  )
}
