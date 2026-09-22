'use client'

import { useActionState } from 'react'
import { iniciarSesion, type EstadoLogin } from '../acciones'
import { botonPanelClassName, inputPanelClassName } from '../ui'

export function FormularioLogin() {
  const [estado, accion, pendiente] = useActionState<EstadoLogin, FormData>(iniciarSesion, {})

  return (
    <form action={accion} className="flex flex-col gap-5" aria-busy={pendiente}>
      <label className="block">
        <span className="text-[14px] font-medium text-primary">Email</span>
        <input name="email" type="email" required autoComplete="email" inputMode="email" className={`${inputPanelClassName} mt-2`} />
      </label>
      <label className="block">
        <span className="text-[14px] font-medium text-primary">Contraseña</span>
        <input name="password" type="password" required autoComplete="current-password" className={`${inputPanelClassName} mt-2`} />
      </label>

      {estado.error ? (
        <p role="alert" className="text-[14px] leading-relaxed text-[#9b4e4e]">
          {estado.error}
        </p>
      ) : null}

      <button type="submit" disabled={pendiente} className={`${botonPanelClassName} mt-2 w-full`}>
        {pendiente ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
