import { Hero } from '@/components/giuliett/sections/hero'
import { metadataPagina } from '@/lib/seo'

export const metadata = metadataPagina({
  titulo: 'Inicio',
  ruta: '/',
  descripcion:
    'Pastelería francesa artesanal en Mendoza. Tortas de autor, macarons, galletas personalizadas, boxes y mesas dulces para particulares, eventos y empresas.',
})

export default function Page() {
  return (
    <main>
      <Hero />
    </main>
  )
}
