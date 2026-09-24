import { redirect } from 'next/navigation'
import { RUTA_LOGIN } from '@/lib/admin/rutas'
import { LARGO_MINIMO_CONTRASENA } from '@/lib/admin/recuperacion'
import { crearClienteServidor } from '@/lib/supabase/server'
import { FormularioRestablecer } from './formulario-restablecer'

/** Elegir la contraseña nueva. Exige la sesión que dio el enlace del email (proxy.ts la pide). */
export default async function RestablecerPage() {
  const supabase = await crearClienteServidor()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`${RUTA_LOGIN}?motivo=enlace-invalido`)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-6 py-16">
      <p className="font-script text-[44px] leading-none text-primary">Giuliett</p>
      <h1 className="mt-4 text-[24px] font-light text-primary">Elegí tu contraseña nueva</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
        Para <strong className="font-medium text-primary">{user.email}</strong>. Al menos {LARGO_MINIMO_CONTRASENA} caracteres; una
        frase fácil de recordar sirve.
      </p>

      <div className="mt-8">
        <FormularioRestablecer />
      </div>
    </main>
  )
}
