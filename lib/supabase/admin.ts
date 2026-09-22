import 'server-only'
import { createClient } from '@supabase/supabase-js'

/** Se lanza cuando faltan las variables de entorno de Supabase. */
export class ConfiguracionFaltante extends Error {
  constructor(variables: string[]) {
    super(`Faltan variables de entorno: ${variables.join(', ')}`)
    this.name = 'ConfiguracionFaltante'
  }
}

/**
 * Cliente con la clave SECRETA de Supabase. Saltea RLS.
 *
 * Solo se usa del lado servidor para insertar consultas desde los formularios
 * públicos (y para el script que crea administradores). `server-only` hace que
 * importarlo desde un componente cliente rompa el build, a propósito.
 */
export function crearClienteAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY

  const faltan = [!url && 'SUPABASE_URL', !key && 'SUPABASE_SECRET_KEY'].filter(Boolean) as string[]
  if (faltan.length) throw new ConfiguracionFaltante(faltan)

  return createClient(url!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
