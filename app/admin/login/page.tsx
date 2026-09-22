import { FormularioLogin } from './formulario-login'

const MOTIVOS: Record<string, string> = {
  'sin-acceso': 'Esa cuenta existe pero no tiene acceso al panel. Pedile a Adrián que la habilite.',
  'sin-config': 'El panel todavía no está configurado: faltan las variables de Supabase en el servidor.',
}

type Props = { searchParams: Promise<{ motivo?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { motivo } = await searchParams
  const aviso = motivo ? MOTIVOS[motivo] : undefined

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
    </main>
  )
}
