'use client'

import { useActionState } from 'react'
import { solicitarRecuperacion, type EstadoRecuperacion } from '../acciones'
import { botonPanelClassName, inputPanelClassName } from '../ui'

export function FormularioRecuperar() {
  const [estado, accion, pendiente] = useActionState<EstadoRecuperacion, FormData>(solicitarRecuperacion, {})

  if (estado.mensaje) {
    return (
      <p role="status" className="rounded-sm bg-lilac-soft px-4 py-3 text-[14px] leading-relaxed text-primary">
        {estado.mensaje}
      </p>
    )
  }

  return (
    <form action={accion} className="flex flex-col gap-5" aria-busy={pendiente}>
      <label className="block">
        <span className="text-[14px] font-medium text-primary">Email</span>
        <input name="email" type="email" required autoComplete="email" inputMode="email" className={`${inputPanelClassName} mt-2`} />
      </label>

      {estado.error ? (
        <p role="alert" className="text-[14px] leading-relaxed text-[#9b4e4e]">
          {estado.error}
        </p>
      ) : null}

      <button type="submit" disabled={pendiente} className={`${botonPanelClassName} mt-2 w-full`}>
        {pendiente ? 'Enviando…' : 'Enviarme el enlace'}
      </button>
    </form>
  )
}
