import 'server-only'
import { redirect } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/server'

/**
 * Para usar al inicio de cada página y acción del panel.
 * Exige sesión Y que el email esté en la tabla `administradores`.
 * Si no, manda al login. Devuelve el cliente ya autenticado.
 */
export async function requerirAdministrador() {
  const supabase = await crearClienteServidor()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: esAdmin } = await supabase.rpc('es_administrador')
  if (!esAdmin) {
    await supabase.auth.signOut()
    redirect('/admin/login?motivo=sin-acceso')
  }

  return { supabase, user }
}
