'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requerirAdministrador } from '@/lib/admin/auth'
import { MENSAJE_ENLACE_ENVIADO, normalizarEmail, validarNuevaContrasena } from '@/lib/admin/recuperacion'
import { RUTA_CALLBACK, RUTA_LOGIN, RUTA_RESTABLECER } from '@/lib/admin/rutas'
import { ESTADOS } from '@/lib/consultas/tipos'
import { resolverUrlSitio } from '@/lib/seo'
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
  redirect(RUTA_LOGIN)
}

/** La URL desde la que se pidió (staging, producción o localhost): el enlace del email vuelve al mismo lugar. */
async function origenDelPedido() {
  const cabeceras = await headers()
  const host = cabeceras.get('x-forwarded-host') ?? cabeceras.get('host')
  if (!host) return resolverUrlSitio()
  const protocolo = cabeceras.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${protocolo}://${host}`
}

export type EstadoRecuperacion = { error?: string; mensaje?: string }

/**
 * Pide a Supabase el email con el enlace para elegir una contraseña nueva.
 * La respuesta es siempre la misma, exista o no el email: el formulario no
 * sirve para averiguar quién tiene acceso al panel.
 */
export async function solicitarRecuperacion(_previo: EstadoRecuperacion, formData: FormData): Promise<EstadoRecuperacion> {
  const email = normalizarEmail(formData.get('email'))
  if (!email) return { error: 'Escribí un email válido.' }

  let supabase
  try {
    supabase = await crearClienteServidor()
  } catch {
    return { error: 'El panel todavía no está configurado (faltan las variables de Supabase).' }
  }

  // La plantilla del email (Supabase → Auth → Email Templates → Reset password) arma el enlace
  // como {{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery: por eso `next` va en la query.
  const redirectTo = `${await origenDelPedido()}${RUTA_CALLBACK}?next=${encodeURIComponent(RUTA_RESTABLECER)}`
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  if (error) console.error('[admin] no se pudo pedir la recuperación:', error.message)

  return { mensaje: MENSAJE_ENLACE_ENVIADO }
}

export type EstadoContrasena = { error?: string }

/** Guarda la contraseña nueva. Exige la sesión que dio el enlace del email. */
export async function cambiarContrasena(_previo: EstadoContrasena, formData: FormData): Promise<EstadoContrasena> {
  const validacion = validarNuevaContrasena(formData.get('password'), formData.get('password2'))
  if (!validacion.ok) return { error: validacion.error }

  const supabase = await crearClienteServidor()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`${RUTA_LOGIN}?motivo=enlace-invalido`)

  const { error } = await supabase.auth.updateUser({ password: validacion.password })
  if (error) {
    return {
      error: /same|different/i.test(error.message)
        ? 'Elegí una contraseña distinta de la anterior.'
        : 'No se pudo guardar la contraseña. Pedí un enlace nuevo e intentá otra vez.',
    }
  }

  const { data: esAdmin } = await supabase.rpc('es_administrador')
  if (!esAdmin) {
    await supabase.auth.signOut()
    redirect(`${RUTA_LOGIN}?motivo=sin-acceso`)
  }

  redirect('/admin?contrasena=guardada')
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
