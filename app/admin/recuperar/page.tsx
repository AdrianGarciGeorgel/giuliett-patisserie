import Link from 'next/link'
import { RUTA_LOGIN } from '@/lib/admin/rutas'
import { FormularioRecuperar } from './formulario-recuperar'

/** Pedir el enlace para elegir una contraseña nueva. Pública: la protege el mensaje neutro. */
export default function RecuperarPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-6 py-16">
      <p className="font-script text-[44px] leading-none text-primary">Giuliett</p>
      <h1 className="mt-4 text-[24px] font-light text-primary">Recuperar contraseña</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
        Escribí el email con el que entrás al panel. Te mandamos un enlace para elegir una contraseña nueva.
      </p>

      <div className="mt-8">
        <FormularioRecuperar />
      </div>

      <Link href={RUTA_LOGIN} className="underline-write mt-8 inline-flex min-h-[44px] items-center text-[14px] text-primary/70 hover:text-primary">
        ← Volver al login
      </Link>
    </main>
  )
}
