import Image from 'next/image'
import { PageIntro } from '@/components/giuliett/page-intro'
import { Section } from '@/components/giuliett/section'
import { PRODUCT_CATEGORIES } from '@/types/product'
import { PrimaryAction } from '@/components/giuliett/atoms'
import { HeroCarousel } from '@/components/giuliett/hero-carousel'
import { Reveal } from '@/components/giuliett/reveal'
import { SectionLockup } from '@/components/giuliett/section-lockup'
import { waLink, WA_GENERAL, CONTACT } from '@/lib/giuliett'
import { IconWhatsApp } from '@/components/giuliett/line-art'
import { metadataPagina } from '@/lib/seo'

export const metadata = metadataPagina({
  titulo: 'Galería',
  ruta: '/galeria',
  descripcion:
    'Fotos de tortas, macarons, galletas personalizadas, boxes y mesas dulces de Giuliett Pâtisserie, pastelería francesa en Mendoza.',
})

const productCategories = [
  {
    name: 'Tortas clásicas',
    src: '/images/Tortas_clasicas.webp',
    alt: 'Cookies artesanales glaseadas con el logo de Giuliett sobre mármol blanco',
    imageFirstOnDesktop: false,
    category: PRODUCT_CATEGORIES.CLASSIC_CAKES,
    bgColor: '#f5f1eb',
    textColor: '#3f2a50',
  },
  {
    name: 'Tortas personalizadas',
    src: '/images/Tortas_Personalizadas.webp',
    alt: 'Mesa dulce montada con macarons, flores y cerámica lila',
    imageFirstOnDesktop: true,
    category: PRODUCT_CATEGORIES.CUSTOM_CAKES,
    bgColor: '#51375c',
    textColor: '#f5f1eb',
  },
  {
    name: 'Galletas personalizadas',
    src: '/images/Galletas_personalizadas.webp',
    alt: 'Manos decorando una cookie glaseada a mano',
    imageFirstOnDesktop: false,
    category: PRODUCT_CATEGORIES.CUSTOM_COOKIES,
    bgColor: '#beb4dc',
    textColor: '#3f2a50',
  },
  {
    name: 'Boxes',
    src: '/images/Boxes.webp',
    alt: 'Caja de regalo lila con macarons y cinta de raso',
    imageFirstOnDesktop: true,
    category: PRODUCT_CATEGORIES.BOXES,
    bgColor: '#f5f1eb',
    textColor: '#3f2a50',
  },
] as const

export default function GaleriaPage() {
  return (
    <main>
    

      <div className=" flex flex-1 flex-col gap-10 sm: py-20 lg:flex-row lg:items-center lg:gap-16 xl:gap-20  overflow-hidden mx-auto w-full max-w-[1200px] max-h-[80rem]">


                <div className="flex w-full flex-col items-center lg:w-[20%] lg:items-center lg:px-1">
                  <Reveal delay={180} className="w-full">
                    <p className="text-center text-[13px] uppercase tracking-[0.18em] text-[#51375C]/75 lg:text-left">
                      NUESTROS PRODUCTOS
                    </p>
                  </Reveal>
      
                  <Reveal delay={120} className="mt-8 w-full">
                    <SectionLockup
                      as="h1"
                      caps="Hecho para"
                      script="disfrutar"
                      
                      size="lg"
                      align="center"
                      className="lg:items-start lg:text-left [&_span:first-child]:text-[#51375C] [&_span:last-child]:text-[#51375C]"
                      capsClassName="font-light"
                      scriptClassName="text-[#51375C]"
                    />
                     <p className="text-center text-[13px]  tracking-[0.18em] text-[#51375C]/75 lg:text-left">
                     Creaciones dulces, hechas artesanalmente para cada ocasión.
                    </p>
                  </Reveal>
      
               
                </div>

                 <Reveal className="w-full lg:w-[80%]" delay={60}>
                  <div className="mx-auto w-full max-w-[480px] lg:max-w-[90rem] ">
                    <HeroCarousel />
                  </div>
                </Reveal>
              </div>




      <Section tone="white" aria-labelledby="galeria-titulo" innerClassName="max-w-[1280px] px-5 md:px-8">
        <h2 id="galeria-titulo" className="sr-only">
          Categorías de productos Giuliett Pâtisserie
        </h2>
        <ul className="flex flex-col gap-16 md:gap-0">
          {productCategories.map((category) => (
            <li key={category.name} className="grid md:min-h-[440px] md:grid-cols-2 lg:min-h-[520px]">
              <div
                className={`order-1 flex min-h-[240px] flex-col items-center justify-center bg-background px-8 py-14 text-center md:min-h-0 md:px-12 lg:px-16 ${
                  category.imageFirstOnDesktop ? 'md:order-2' : ''
                }`} style={{backgroundColor: category.bgColor}}
              >
                <h3 className="tracked max-w-[14ch] text-[20px] font-medium leading-[1.25] text-primary md:text-[26px] lg:text-[32px]" style={{color: category.textColor}}>
                  {category.name}
                </h3>
                <a
                  href={`/productos?categoria=${category.category}`}
                  className="mt-8 inline-flex min-h-[44px] items-center border-b border-primary/40 text-[13px] text-primary transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-primary"
                  style={{ color: category.textColor, borderColor: category.textColor }}
                >
                  Ver todos los productos <span aria-hidden="true">→</span>
                </a>
              </div>
              <figure
                className={`relative order-2 aspect-[4/3] overflow-hidden bg-lilac-soft md:aspect-auto md:min-h-0 ${
                  category.imageFirstOnDesktop ? 'md:order-1' : ''
                }`} 
              >
                <Image
                  src={category.src}
                  alt={category.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </figure>
            </li>
          ))}
        </ul>

         <a
                href={waLink(WA_GENERAL)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribinos por WhatsApp"
                className="czm-pulse fixed bottom-[calc(92px+env(safe-area-inset-bottom))] right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#51375C] text-[#FFF8E9] shadow-[0_12px_32px_-10px_rgb(81_55_92/0.45)] transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.03] active:scale-[0.97] sm:right-8 lg:right-8"
              >
                <IconWhatsApp className="h-6 w-6 czm-pulse" strokeWidth={1.7} />
              </a>
      </Section>
    </main>
  )
}
