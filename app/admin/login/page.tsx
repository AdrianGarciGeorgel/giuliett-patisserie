import Link from 'next/link'
import { avisoDeLogin } from '@/lib/admin/avisos'
import { RUTA_RECUPERAR } from '@/lib/admin/rutas'
import { FormularioLogin } from './formulario-login'

type Props = { searchParams: Promise<{ motivo?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { motivo } = await searchParams
  const aviso = avisoDeLogin(motivo)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-6 py-16">
      <p className="font-script text-[44px] leading-none text-primary">Giuliett</p>
      <h1 className="mt-4 text-[24px] font-light text-primary">Panel de consultas</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">Acceso solo para el equipo.</p>

      {aviso ? (
        <p role="alert" className="mt-6 rounded-sm bg-lilac-soft px-4 py-3 text-[14px] leading-relaxed text-primary">
          {aviso}
        </p>
      ) : null}

      <div className="mt-8">
        <FormularioLogin />
      </div>

      <Link
        href={RUTA_RECUPERAR}
        className="underline-write mt-6 inline-flex min-h-[44px] items-center self-start text-[14px] text-primary/70 hover:text-primary"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </main>
  )
}
