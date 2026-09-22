// Da acceso al panel /admin a un email.
//
//   node scripts/crear-admin.mjs correo@ejemplo.com "Nombre"
//
// Lee SUPABASE_URL y SUPABASE_SECRET_KEY de .env.local. Si el usuario no
// existe en Supabase Auth lo crea con una contraseña generada, y la imprime
// UNA sola vez. Después lo suma a la tabla `administradores` (la allowlist).
// Se corre una vez por persona, desde la máquina de Adrián. Nunca en el deploy.

import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

try {
  process.loadEnvFile('.env.local')
} catch {
  console.error('No encontré .env.local en la raíz del repo. Copiá .env.example y completalo.')
  process.exit(1)
}

const [email, nombre] = process.argv.slice(2)
if (!email || !email.includes('@')) {
  console.error('Uso: node scripts/crear-admin.mjs correo@ejemplo.com "Nombre"')
  process.exit(1)
}

const url = process.env.SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY
if (!url || !secret) {
  console.error('Faltan SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local.')
  process.exit(1)
}

const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })

const password = randomBytes(12).toString('base64url')
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
} else {
  mensajeUsuario = `Usuario creado: ${creado.user.email}\nContraseña (guardala ahora, no se vuelve a mostrar): ${password}`
}

const { error: errorAllowlist } = await supabase.from('administradores').upsert({ email: email.toLowerCase(), nombre: nombre ?? null })
if (errorAllowlist) {
  console.error('El usuario existe pero no se pudo agregar a administradores:', errorAllowlist.message)
  process.exit(1)
}

console.log(mensajeUsuario)
console.log(`${email} ya puede entrar al panel en /admin/login.`)
