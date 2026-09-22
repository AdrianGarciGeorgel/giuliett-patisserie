/** @type {import('next').NextConfig} */
const nextConfig = {
  // El build valida tipos: `npx tsc --noEmit` tiene que estar limpio.
  // Las imágenes las optimiza next/image (WebP/AVIF y tamaños por dispositivo).

  // Cabeceras de seguridad para todo el sitio (punto 10 del checklist).
  // HSTS lo agrega Vercel solo. Sin CSP por ahora: el JSON-LD y los scripts de
  // Next son inline y una CSP mal calibrada rompe la página en silencio.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
