import { NextResponse, type NextRequest } from 'next/server'
import { RUTA_LOGIN, destinoSeguro } from '@/lib/admin/rutas'
import { crearClienteServidor } from '@/lib/supabase/server'

/* Acá cae el enlace del email de recuperación. Lo canjea por una sesión y manda
   a la persona a elegir su contraseña nueva (/admin/restablecer, que exige sesión).

   Dos formatos de enlace, según la plantilla del email en Supabase:
   - `token_hash` + `type=recovery` (plantilla propia, recomendado para servidor):
     funciona aunque el pedido lo haya hecho otro navegador o el script de admins.
   - `code` (flujo PKCE por defecto): solo si el enlace se abre en el mismo
     navegador que lo pidió. Se acepta por compatibilidad. */

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const destino = destinoSeguro(searchParams.get('next'))
  const alLogin = (motivo: string) => NextResponse.redirect(new URL(`${RUTA_LOGIN}?motivo=${motivo}`, request.url))

  let supabase
  try {
    supabase = await crearClienteServidor()
  } catch {
    return alLogin('sin-config')
  }

  const tokenHash = searchParams.get('token_hash')
  const tipo = searchParams.get('type')
  if (tokenHash && tipo === 'recovery') {
    const { error } = await supabase.auth.verifyOtp({ type: 'recovery', token_hash: tokenHash })
    return error ? alLogin('enlace-invalido') : NextResponse.redirect(new URL(destino, request.url))
  }

  const code = searchParams.get('code')
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    return error ? alLogin('enlace-invalido') : NextResponse.redirect(new URL(destino, request.url))
  }

  return alLogin('enlace-invalido')
}
