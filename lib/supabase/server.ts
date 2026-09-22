import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * Cliente de Supabase atado a la sesión del usuario (cookies).
 * Es el que usan el panel /admin y sus server actions: respeta RLS.
 *
 * Usa la clave PUBLICABLE. La secreta nunca pasa por acá.
 */
export async function crearClienteServidor() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    throw new Error('Faltan SUPABASE_URL o SUPABASE_PUBLISHABLE_KEY')
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Desde un Server Component no se pueden escribir cookies.
          // No pasa nada: proxy.ts refresca la sesión en cada request.
        }
      },
    },
  })
}
