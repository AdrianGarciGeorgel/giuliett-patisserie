import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/* Protege /admin: refresca la sesión de Supabase en cada request y manda al
   login a quien no la tenga. En Next 16 este archivo se llama proxy.ts
   (antes middleware.ts). */

const LOGIN = '/admin/login'

export async function proxy(request: NextRequest) {
  const esLogin = request.nextUrl.pathname === LOGIN
  let respuesta = NextResponse.next({ request })

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    // Sin configuración no hay panel. El login explica qué falta.
    if (esLogin) return respuesta
    return NextResponse.redirect(new URL(`${LOGIN}?motivo=sin-config`, request.url))
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        respuesta = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options))
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const autenticado = Boolean(data?.claims)

  if (!autenticado && !esLogin) {
    return NextResponse.redirect(new URL(LOGIN, request.url))
  }

  if (autenticado && esLogin) {
    const alPanel = NextResponse.redirect(new URL('/admin', request.url))
    // Si la sesión se refrescó recién, las cookies nuevas viajan en el redirect.
    respuesta.cookies.getAll().forEach((cookie) => alPanel.cookies.set(cookie))
    return alPanel
  }

  return respuesta
}

export const config = {
  matcher: ['/admin/:path*'],
}
