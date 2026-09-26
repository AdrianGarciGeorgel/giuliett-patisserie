import { WA_GENERAL, waLink } from '@/lib/giuliett'
import { IconWhatsApp } from '../line-art'
import { HeroCarousel } from '../hero-carousel'
import { HomeFooter } from './home-footer'

/**
 * 01 · HERO
 * Una sola idea: quién es Giuliett y cómo escribirle.
 * Mobile first · foto primero · WhatsApp visible al instante.
 */
export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-[#FFF8E9] text-[#51375C]">
      {/* El único h1 de la home. Visualmente lo cuentan el logo y la bajada del carrusel. */}
      <h1 className="sr-only">Giuliett Pâtisserie · Pastelería francesa artesanal en Mendoza</h1>
      {/* Las fotos avanzan solas, sin botón de pausa; en la computadora, clic en un costado para ir y volver. */}
      <HeroCarousel variant="home" ariaLabel="Productos destacados Giuliett" autoplay navegacionLateral />
      <HomeFooter />

      <a
        href={waLink(WA_GENERAL)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        className="czm-pulse fixed bottom-[calc(92px+env(safe-area-inset-bottom))] right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#51375C] text-[#FFF8E9] shadow-[0_12px_32px_-10px_rgb(81_55_92/0.45)] transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.03] active:scale-[0.97] sm:right-8 lg:right-8"
      >
        <IconWhatsApp className="h-6 w-6 czm-pulse" strokeWidth={1.7} />
      </a>
    </section>
  )
}
