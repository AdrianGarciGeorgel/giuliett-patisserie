'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requerirAdministrador } from '@/lib/admin/auth'
import { ESTADOS } from '@/lib/consultas/tipos'
import { crearClienteServidor } from '@/lib/supabase/server'

export type EstadoLogin = { error?: string }

export async function iniciarSesion(_previo: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) return { error: 'Completá email y contraseña.' }

  let supabase
  try {
    supabase = await crearClienteServidor()
  } catch {
    return { error: 'El panel todavía no está configurado (faltan las variables de Supabase).' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: 'Email o contraseña incorrectos.' }

  const { data: esAdmin } = await supabase.rpc('es_administrador')
  if (!esAdmin) {
    await supabase.auth.signOut()
    return { error: 'Esta cuenta no tiene acceso al panel.' }
  }

  redirect('/admin')
}

export async function cerrarSesion() {
  const supabase = await crearClienteServidor()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

const cambiosSchema = z.object({
  estado: z.enum(ESTADOS),
  notas_internas: z.string().trim().max(4000, 'Las notas son muy largas (máximo 4000 caracteres).'),
})

export async function actualizarConsulta(id: string, formData: FormData) {
  const { supabase } = await requerirAdministrador()

  if (!z.uuid().safeParse(id).success) redirect('/admin')

  const cambios = cambiosSchema.safeParse({
    estado: formData.get('estado'),
    notas_internas: formData.get('notas_internas') ?? '',
  })
  if (!cambios.success) {
    redirect(`/admin/consultas/${id}?error=${encodeURIComponent(cambios.error.issues[0]?.message ?? 'Datos inválidos.')}`)
  }

  const { error } = await supabase
    .from('consultas')
    .update({ estado: cambios.data.estado, notas_internas: cambios.data.notas_internas || null })
    .eq('id', id)

  if (error) redirect(`/admin/consultas/${id}?error=${encodeURIComponent('No se pudo guardar. Probá de nuevo.')}`)

  revalidatePath('/admin')
  revalidatePath(`/admin/consultas/${id}`)
  redirect(`/admin/consultas/${id}?guardado=1`)
}
