// Da acceso al panel /admin a un email.
//
//   node scripts/crear-admin.mjs correo@ejemplo.com "Nombre"                     # crea y muestra la contraseña UNA vez
//   node scripts/crear-admin.mjs correo@ejemplo.com "Nombre" --sin-contrasena    # crea sin mostrar nada (ver abajo)
//   node scripts/crear-admin.mjs correo@ejemplo.com --nueva-contrasena           # la persona la olvidó: genera otra y la muestra UNA vez
//
// Lee SUPABASE_URL y SUPABASE_SECRET_KEY de .env.local. Si el usuario no existe en
// Supabase Auth lo crea, y después lo suma a la tabla `administradores` (la allowlist).
//
// Cómo recibe la contraseña la persona:
//   - Sin banderas: se genera una, se imprime UNA sola vez y hay que pasársela (WhatsApp).
//     Apenas entra, la cambia desde el panel ("Cambiar contraseña"). Es el camino de HOY.
//   - --sin-contrasena: no se muestra ninguna; la persona la elige desde "¿Olvidaste tu
//     contraseña?" en el login. ⚠️ Con el email por defecto de Supabase, esos emails SOLO
//     llegan a miembros del equipo del proyecto (Adrián sí, Giu no). Sirve para todas
//     recién cuando haya SMTP propio (Fase E, Resend con el dominio).
//   - --nueva-contrasena: para alguien que ya existe y no puede entrar (mismo aviso de arriba
//     sobre el email). Se imprime una vez; la cambia desde el panel al entrar.
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
const sinContrasena = argumentos.includes('--sin-contrasena')
const nuevaContrasena = argumentos.includes('--nueva-contrasena')
const [email, nombre] = argumentos.filter((a) => !a.startsWith('--'))

if (!email || !email.includes('@')) {
  console.error('Uso: node scripts/crear-admin.mjs correo@ejemplo.com "Nombre" [--sin-contrasena | --nueva-contrasena]')
  process.exit(1)
}

const url = process.env.SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY
if (!url || !secret) {
  console.error('Faltan SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local.')
  process.exit(1)
}

const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })
const generarContrasena = () => randomBytes(18).toString('base64url')

async function buscarUsuario(correo) {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (error) throw new Error(`No pude listar usuarios: ${error.message}`)
  return data.users.find((u) => u.email?.toLowerCase() === correo.toLowerCase()) ?? null
}

let mensajeUsuario
const existente = await buscarUsuario(email)

if (existente && nuevaContrasena) {
  const password = generarContrasena()
  const { error } = await supabase.auth.admin.updateUserById(existente.id, { password })
  if (error) {
    console.error('No se pudo cambiar la contraseña:', error.message)
    process.exit(1)
  }
  mensajeUsuario = `Contraseña nueva para ${email} (guardala ahora, no se vuelve a mostrar): ${password}\nQue la cambie desde el panel al entrar ("Cambiar contraseña").`
} else if (existente) {
  mensajeUsuario = `El usuario ${email} ya existía en Auth: conserva su contraseña (para resetearla: --nueva-contrasena).`
} else {
  const password = generarContrasena()
  const { data: creado, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: nombre ? { nombre } : undefined,
  })
  if (error) {
    console.error('No se pudo crear el usuario:', error.message)
    process.exit(1)
  }
  mensajeUsuario = sinContrasena
    ? `Usuario creado: ${creado.user.email}. Que entre a /admin/login → "¿Olvidaste tu contraseña?" y elija la suya.`
    : `Usuario creado: ${creado.user.email}\nContraseña (guardala ahora, no se vuelve a mostrar): ${password}\nQue la cambie desde el panel al entrar ("Cambiar contraseña").`
}

const { error: errorAllowlist } = await supabase.from('administradores').upsert({ email: email.toLowerCase(), nombre: nombre ?? null })
if (errorAllowlist) {
  console.error('El usuario existe pero no se pudo agregar a administradores:', errorAllowlist.message)
  process.exit(1)
}

console.log(mensajeUsuario)
console.log(`${email} ya puede entrar al panel en /admin/login.`)
