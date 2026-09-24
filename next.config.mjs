/* Content-Security-Policy. Se calibró en modo reporte sobre el staging (9 páginas,
   0 avisos: 23-09-2026) y después se pasó a bloquear. Si alguna vez una página deja de
   cargar algo, primero mirar la consola del navegador ("Refused to…"); para volver al
   modo reporte alcanza con cambiar la clave a 'Content-Security-Policy-Report-Only'.
   'unsafe-inline' en scripts es inevitable hoy: Next hidrata con scripts inline y el
   JSON-LD también lo es; igual la política frena scripts de cualquier otro origen. */
const esDesarrollo = process.env.NODE_ENV === 'development'
const politicaContenido = [
  "default-src 'self'",
  // Vercel Analytics carga su script desde va.vercel-scripts.com. En dev, Turbopack necesita eval.
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com${esDesarrollo ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // El build valida tipos: `npx tsc --noEmit` tiene que estar limpio.
  // Las imágenes las optimiza next/image (WebP/AVIF y tamaños por dispositivo).

  // Cabeceras de seguridad para todo el sitio (punto 10 del checklist).
  // HSTS lo agrega Vercel solo.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: politicaContenido },
          // El navegador no adivina tipos de archivo (evita ejecutar algo que no es script).
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Nadie puede meter la web dentro de un iframe (clickjacking).
          { key: 'X-Frame-Options', value: 'DENY' },
          // Al salir a otros sitios (WhatsApp, Instagram) solo se manda el dominio, no la URL completa.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // La web no usa cámara, micrófono ni ubicación: se declaran apagados.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        ],
      },
      {
        // El panel nunca se indexa ni se cachea en intermediarios.
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      },
    ]
  },
}

export default nextConfig
