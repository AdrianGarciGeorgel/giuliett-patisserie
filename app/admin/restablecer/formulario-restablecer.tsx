'use client'

import { useActionState } from 'react'
import { cambiarContrasena, type EstadoContrasena } from '../acciones'
import { botonPanelClassName, inputPanelClassName } from '../ui'

export function FormularioRestablecer() {
  const [estado, accion, pendiente] = useActionState<EstadoContrasena, FormData>(cambiarContrasena, {})

  return (
    <form action={accion} className="flex flex-col gap-5" aria-busy={pendiente}>
      <label className="block">
        <span className="text-[14px] font-medium text-primary">Contraseña nueva</span>
        <input name="password" type="password" required autoComplete="new-password" className={`${inputPanelClassName} mt-2`} />
      </label>
      <label className="block">
        <span className="text-[14px] font-medium text-primary">Repetila</span>
        <input name="password2" type="password" required autoComplete="new-password" className={`${inputPanelClassName} mt-2`} />
      </label>

      {estado.error ? (
        <p role="alert" className="text-[14px] leading-relaxed text-[#9b4e4e]">
          {estado.error}
        </p>
      ) : null}

      <button type="submit" disabled={pendiente} className={`${botonPanelClassName} mt-2 w-full`}>
        {pendiente ? 'Guardando…' : 'Guardar contraseña'}
      </button>
    </form>
  )
}
