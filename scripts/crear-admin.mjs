// Da acceso al panel /admin a un email.
//
//   node scripts/crear-admin.mjs correo@ejemplo.com "Nombre"
//   node scripts/crear-admin.mjs correo@ejemplo.com "Nombre" --enviar-enlace --sitio https://giuliettpatisserie.com
//
// Lee SUPABASE_URL, SUPABASE_SECRET_KEY y SUPABASE_PUBLISHABLE_KEY de .env.local.
// Si el usuario no existe en Supabase Auth lo crea, y después lo suma a la tabla
// `administradores` (la allowlist).
//
// Cómo recibe la contraseña la persona:
//   - Sin --enviar-enlace: se genera una y se imprime UNA sola vez (hay que pasársela a mano).
//   - Con --enviar-enlace (recomendado): no se muestra nada. Supabase le manda un email con un
//     enlace a /admin/restablecer y ella elige su contraseña. Nadie más la ve.
//     --sitio es la URL pública donde vive el panel (o NEXT_PUBLIC_SITE_URL en .env.local);
//     tiene que estar en Supabase → Auth → URL Configuration → Redirect URLs.
//
// Se corre una vez por persona, desde la máquina de Adrián. Nunca en el deploy.

import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

try {
  process.loadEnvFile('.env.local')
} catch {
  console.error('No encontré .env.local en la raíz del repo. Copiá .env.example y completalo.')
  process.exit(1)
}

const argumentos = process.argv.slice(2)
const enviarEnlace = argumentos.includes('--enviar-enlace')
const indiceSitio = argumentos.indexOf('--sitio')
const sitio = (indiceSitio >= 0 ? argumentos[indiceSitio + 1] : process.env.NEXT_PUBLIC_SITE_URL)?.replace(/\/+$/, '')
const [email, nombre] = argumentos.filter((a, i) => !a.startsWith('--') && argumentos[i - 1] !== '--sitio')

if (!email || !email.includes('@')) {
  console.error('Uso: node scripts/crear-admin.mjs correo@ejemplo.com "Nombre" [--enviar-enlace --sitio https://…]')
  process.exit(1)
}
if (enviarEnlace && !sitio) {
  console.error('Con --enviar-enlace hace falta --sitio https://… (o NEXT_PUBLIC_SITE_URL en .env.local).')
  process.exit(1)
}

const url = process.env.SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY
const publishable = process.env.SUPABASE_PUBLISHABLE_KEY
if (!url || !secret) {
  console.error('Faltan SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local.')
  process.exit(1)
}
if (enviarEnlace && !publishable) {
  console.error('Con --enviar-enlace hace falta SUPABASE_PUBLISHABLE_KEY en .env.local.')
  process.exit(1)
}

const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })

const password = randomBytes(18).toString('base64url')
const { data: creado, error: errorCrear } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: nombre ? { nombre } : undefined,
})

let mensajeUsuario
if (errorCrear) {
  const yaExiste = /already|registered|exists/i.test(errorCrear.message)
  if (!yaExiste) {
    console.error('No se pudo crear el usuario:', errorCrear.message)
    process.exit(1)
  }
  mensajeUsuario = `El usuario ${email} ya existía en Auth: conserva su contraseña.`
} else if (enviarEnlace) {
  mensajeUsuario = `Usuario creado: ${creado.user.email} (la contraseña la elige por el enlace del email).`
} else {
  mensajeUsuario = `Usuario creado: ${creado.user.email}\nContraseña (guardala ahora, no se vuelve a mostrar): ${password}`
}

const { error: errorAllowlist } = await supabase.from('administradores').upsert({ email: email.toLowerCase(), nombre: nombre ?? null })
if (errorAllowlist) {
  console.error('El usuario existe pero no se pudo agregar a administradores:', errorAllowlist.message)
  process.exit(1)
}

console.log(mensajeUsuario)

if (enviarEnlace) {
  // Mismo pedido que hace el botón "¿Olvidaste tu contraseña?" del panel.
  const publico = createClient(url, publishable, { auth: { persistSession: false, autoRefreshToken: false } })
  const redirectTo = `${sitio}/admin/auth/callback?next=${encodeURIComponent('/admin/restablecer')}`
  const { error: errorEnlace } = await publico.auth.resetPasswordForEmail(email, { redirectTo })
  if (errorEnlace) {
    console.error('El acceso quedó dado, pero no se pudo mandar el email:', errorEnlace.message)
    console.error(`Puede pedirlo igual desde ${sitio}/admin/recuperar.`)
    process.exit(1)
  }
  console.log(`Email enviado a ${email} con el enlace para elegir la contraseña (vale 1 hora; si vence, ${sitio}/admin/recuperar).`)
}

console.log(`${email} ya puede entrar al panel en /admin/login.`)
