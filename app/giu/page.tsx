import Image from 'next/image'
import { Reveal } from '@/components/giuliett/reveal'
import { Section } from '@/components/giuliett/section'
import { IconWhatsApp } from '@/components/giuliett/line-art'
import { WA_GENERAL, waLink } from '@/lib/giuliett'
import { metadataPagina } from '@/lib/seo'

export const metadata = metadataPagina({
  titulo: 'Sobre Giuliett',
  ruta: '/giu',
  descripcion:
    'Giu, formada en École Ferrandi Paris, y el equipo detrás de Giuliett Pâtisserie: pastelería francesa artesanal en Mendoza desde 2018.',
})

const teamMembers = [
  {
    name: 'Giu',
    image: '/images/giu/GIU.webp',
    role: 'Fundadora & Chef Pastelera',
    description:
      'Fundadora de Giuliett y formada en École Ferrandi Paris. Lidera el desarrollo creativo de la marca y supervisa cada creación para que refleje la calidad, la estética y la esencia de Giuliett.',
  },
  {
    name: 'Rai',
    image: '/images/giu/RAI.webp',
    role: 'Administración & Gestión General',
    description:
      'Es quien coordina el funcionamiento diario de Giuliett, organiza los procesos internos y acompaña al equipo para que cada detalle esté bajo control.',
  },
  {
    name: 'Juli',
    image: '/images/giu/JULI.webp',
    role: 'Responsable de cocina',
    description: 'Lidera la producción artesanal de Giuliett. Supervisa cada elaboración y trabaja con dedicación para garantizar la calidad y el cuidado en cada detalle.',
  },
  {
    name: 'Jime',
    image: '/images/giu/JIME.webp',
    role: 'Diseño gráfico & Producción',
    description: 'Es la responsable de la identidad visual de Giuliett. Diseña cada pieza gráfica de la marca y acompaña al equipo de cocina, aportando creatividad y atención a los detalles en cada proyecto.',
  },
  {
    name: 'Ana',
    image: '/images/giu/ANA.webp',
    role: 'Marketing & Community Manager',
    description: 'Planifica la comunicación de Giuliett y gestiona nuestras redes sociales. Es quien transforma cada creación en contenido, acercando la esencia de la marca a nuestra comunidad.',
  },
  {
    name: 'Ceci',
    image: '/images/giu/CECI.webp',
    role: 'Ingeniera Comercial & Desarrollo Estratégico',
    description: 'Aporta una mirada estratégica al crecimiento de Giuliett, liderando la planificación, el desarrollo de la marca y los objetivos que acompañan su evolución.',
  }
] as const

export default function GiuPage() {
  return (
    <main>
      <HistorySection />
      <TeamSection />
    </main>
  )
}

function HistorySection() {
  return (
    <Section tone="cream" layered={false} className="pb-24 pt-12 md:pb-[140px] md:pt-20" aria-labelledby="historia-titulo">
      <div className="mx-auto max-w-[1040px]">
        <Reveal>
          <h1 id="historia-titulo" className="text-center text-[34px] font-light text-primary md:text-[48px]">
            Nuestra historia
          </h1>
        </Reveal>

        <div className="mt-12 flex flex-col gap-16 md:mt-16 md:gap-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-16">
            <Reveal>
              <Photo src="/images/giu/giu_1.webp" alt="Giu cocinando" ratio="4/3" position="20% center" />
            </Reveal>
            <Reveal delay={100}>
              <h2 id="historia-titulo-2" className="font-script pb-12 text-[34px] font-light text-primary md:text-[48px]">
                Todo empezó en la cocina de casa
              </h2>
              <p className="max-w-[42ch] text-[16px] leading-[1.75] text-muted-foreground md:text-[17px]">
                Giuliett nació en 2017, cuando con tan solo 17 años decidí convertir mi pasión por la pastelería en un sueño.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-16">
            <Reveal className="lg:order-2">
              <Photo src="/images/giu/giu_2.webp" alt="Giu durante su formación en París" ratio="4/5" position="center 28%" />
            </Reveal>
            <Reveal delay={100} className="lg:order-1 lg:justify-self-end">
               <h2 id="historia-titulo-3" className="font-script pb-12 text-[34px] font-light text-primary md:text-[48px]">
                Paris, un sueño hecho realidad
              </h2>
              <p className="max-w-[42ch] text-[16px] leading-[1.75] text-muted-foreground md:text-[17px]">
                Años después, viajé a París para estudiar en la prestigiosa École Ferrandi Paris y, tras finalizar mi
                formación, me quedé tres años trabajando en numerosas pastelerías y perfeccionándome.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-16">
            <Reveal>
              <Photo src="/images/giu/giu_3.webp" alt="Giu en la École Ferrandi Paris" ratio="4/5" />
            </Reveal>
            <Reveal delay={100}>
              <h2 id="historia-titulo-4" className="font-script pb-12 text-[34px] font-light text-primary md:text-[48px]">
                Giuliett en la actualidad
              </h2>
              <p className="max-w-[42ch] text-[16px] leading-[1.75] text-muted-foreground md:text-[17px]">
                De regreso en Argentina, todo lo aprendido se transformó en la Giuliett de hoy: una pâtisserie que combina técnica francesa, sabores argentinos y diseño, y que continúa creciendo cada día sin perder la esencia con la que empezó.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}

function TeamSection() {
  return (
    <Section tone="white" aria-labelledby="equipo-titulo">
      <div className="mx-auto max-w-[1040px]">
        <Reveal>
          <Photo src="/images/giu/EQUIPO.webp" alt="Equipo Giuliett" ratio="16/9" position="center 60%" />
        </Reveal>
        <Reveal delay={100}>
          <h2 id="equipo-titulo" className="mt-14 text-center text-[34px] font-light text-primary md:mt-20 md:text-[48px]">
            El equipo
          </h2>
        </Reveal>

        <div className="mt-14 flex flex-col gap-20 md:mt-20 md:gap-28">
          {teamMembers.map((member, index) => (
            <article key={member.name} className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
              <Reveal className={index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} delay={40}>
                <Photo src={member.image} alt={`${member.name}, equipo Giuliett`} ratio="4/3" />
              </Reveal>
              <div className={index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}>
                <Reveal delay={120}>
                  <h3 className="text-[28px] font-light text-primary md:text-[34px]">{member.name}</h3>
                  <p className="tracked mt-3 text-[10px] font-medium text-muted-foreground">{member.role}</p>
                </Reveal>
                <Reveal delay={180}>
                  <p className="mt-6 max-w-[42ch] text-[15px] leading-[1.75] text-muted-foreground md:text-[16px]">
                    {member.description}
                  </p>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </div>
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
  )
}

function Photo({
  src,
  alt,
  ratio,
  position = 'center',
}: {
  src: string
  alt: string
  ratio: '4/5' | '4/3' | '16/9'
  position?: string
}) {
  return (
    <figure className="group relative overflow-hidden rounded-lg bg-lilac-soft transition-transform duration-[350ms] ease-out lg:hover:-translate-y-1" style={{ aspectRatio: ratio.replace('/', ' / ') }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 520px, calc(100vw - 48px)"
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </figure>
  )
}
