import type { Metadata, Viewport } from 'next'
import { Ephesis, Poppins } from 'next/font/google'
import { GlobalNavigation } from '@/components/giuliett/mobile-bottom-nav'
import { Analitica } from '@/components/analitica'
import { NOMBRE_SITIO, jsonLdPasteleria, jsonLdSeguro, metadataPagina, resolverUrlSitio } from '@/lib/seo'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
})

const ephesis = Ephesis({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-ephesis',
  display: 'swap',
})

const urlSitio = resolverUrlSitio()

/* Base para todo el sitio: las páginas pisan título, descripción y canonical con
   `metadataPagina`; las fichas de producto usan `generateMetadata`. */
export const metadata: Metadata = {
  metadataBase: new URL(urlSitio),
  ...metadataPagina({
    titulo: NOMBRE_SITIO,
    ruta: '/',
    base: urlSitio,
    descripcion:
      'Pastelería francesa artesanal en Mendoza. Tortas de autor, macarons, galletas personalizadas, boxes y mesas dulces para particulares, eventos y empresas.',
  }),
  // Sin `robots`: indexar es el comportamiento por defecto. Fijarlo acá chocaba con el noindex
  // que Next pone en la 404 (salían las dos metas). El panel fija su noindex en admin/layout.
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#d8cbe8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" className={`${poppins.variable} ${ephesis.variable} bg-background`}>
      <body className="bg-background pb-[calc(92px+env(safe-area-inset-bottom))] font-sans antialiased md:pb-0">
        {/* Schema.org: la pastelería como negocio local (Google Maps / fichas locales). */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSeguro(jsonLdPasteleria(urlSitio)) }} />
        <GlobalNavigation />
        {children}
        {process.env.NODE_ENV === 'production' && <Analitica />}
      </body>
    </html>
  )
}
