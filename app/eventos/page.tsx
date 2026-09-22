import { PrimaryAction, QuietLink } from '@/components/giuliett/atoms'
import { ContactForm } from '@/components/giuliett/contact-form'
import { HeroCarousel } from '@/components/giuliett/hero-carousel'
import { IconWhatsApp } from '@/components/giuliett/line-art'
import { Reveal } from '@/components/giuliett/reveal'
import { Section } from '@/components/giuliett/section'
import { EVENTOS, WA_GENERAL, waLink } from '@/lib/giuliett'

const eventProposals = [
  {
    id: 'bodas',
    eyebrow: '01 · Bodas',
    title: 'Mucho más que una mesa dulce.',
    paragraphs: [
      'Creamos experiencias dulces totalmente personalizadas para uno de los días más importantes de sus vidas. Los acompañamos desde el asesoramiento inicial hasta la producción artesanal, el traslado y el montaje, cuidando cada detalle para que todo salga perfecto.',
    ],
    cta: 'Hablemos de tu boda',
    message: 'Hola Giuliett, quisiera solicitar presupuesto para una boda.',
    slides: EVENTOS.bodas,
    tone: 'cream',
    imageFirstOnDesktop: false,
    closing: undefined,
    secondary: undefined,
  },
  {
    id: 'empresas',
    eyebrow: '02 · Empresas',
    title: 'Regalos y experiencias que dejan huella.',
    paragraphs: [
      'Desarrollamos propuestas gastronómicas personalizadas para empresas, eventos corporativos, lanzamientos, acciones de marketing y regalos institucionales.',
      'Incorporamos la identidad de tu marca en cada detalle para crear una experiencia memorable.',
    ],
    cta: 'Hablemos de tu proyecto',
    message: 'Hola Giuliett, quisiera consultar por eventos corporativos.',
    slides: EVENTOS.empresas,
    tone: 'white',
    imageFirstOnDesktop: true,
    closing: undefined,
    /* Recorrido Empresa del Master Plan: deja la consulta registrada. */
    secondary: { href: '/contacto?para=empresa', label: 'Prefiero dejar los datos de mi empresa' },
  },
  {
    id: 'celebraciones',
    eyebrow: '03 · Celebraciones',
    title: 'Cada momento especial merece un detalle único.',
    paragraphs: [
      'Cumpleaños, bautismos, comuniones, baby showers, aniversarios y mucho más.',
      'Diseñamos propuestas a medida con mesas dulces, tortas, macarons y detalles pensados especialmente para vos.',
    ],
    closing: 'Contanos tu idea y creemos juntos una propuesta única.',
    cta: 'Contanos tu idea',
    message: 'Hola Giuliett, quiero mi presupuesto para una celebración.',
    slides: EVENTOS.celebraciones,
    tone: 'lilac-soft',
    imageFirstOnDesktop: false,
    secondary: undefined,
  },
] as const

export default function EventosPage() {
  return (
    <main>
      {eventProposals.map((proposal, index) => (
        <EventSection key={proposal.id} proposal={proposal} first={index === 0} />
      ))}

      {/* Recorrido Evento del Master Plan: la consulta queda registrada antes de ir a WhatsApp. */}
      <Section tone="cream" id="consulta-evento" aria-labelledby="consulta-evento-titulo">
        <div className="mx-auto max-w-[640px]">
          <Reveal>
            <p className="tracked text-[30px] font-medium text-muted-foreground">04 · Tu evento</p>
          </Reveal>
          <Reveal delay={60}>
            <h2
              id="consulta-evento-titulo"
              className="mt-5 max-w-[18ch] text-balance text-[30px] font-light leading-[1.18] text-primary md:text-[40px]"
            >
              Contanos tu evento y te armamos una propuesta.
            </h2>
          </Reveal>
          <Reveal delay={120} className="mt-12">
            <ContactForm origen="evento" />
          </Reveal>
        </div>
      </Section>

      {/* Botón flotante de WhatsApp: uno por página (antes se renderizaba una vez por sección). */}
      <a
        href={waLink(WA_GENERAL)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        className="czm-pulse fixed bottom-[calc(92px+env(safe-area-inset-bottom))] right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#51375C] text-[#FFF8E9] shadow-[0_12px_32px_-10px_rgb(81_55_92/0.45)] transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.03] active:scale-[0.97] sm:right-8 lg:right-8"
      >
        <IconWhatsApp className="h-6 w-6 czm-pulse" strokeWidth={1.7} />
      </a>
    </main>
  )
}

type EventProposal = (typeof eventProposals)[number]

function EventSection({ proposal, first }: { proposal: EventProposal; first: boolean }) {
  const Heading = first ? 'h1' : 'h2'

  return (
    <Section tone={proposal.tone} layered={!first} className={first ? 'pt-12 md:pt-20' : undefined} aria-labelledby={proposal.id}>
      <div className="grid gap-10 md:gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Reveal
          className={`order-1 w-full ${proposal.imageFirstOnDesktop ? 'lg:order-1' : 'lg:order-2'}`}
          delay={40}
        >
          <HeroCarousel
            slides={proposal.slides}
            ratio="4/5"
            showProductButton={false}
            showIndicators={true}
            ariaLabel={`Fotografías de ${proposal.eyebrow}`}
            className="w-full rounded-lg shadow-[var(--shadow-giuliett)] transition-transform duration-[350ms] ease-out lg:hover:-translate-y-1"
            sizes="(min-width: 1024px) 50vw, calc(100vw - 48px)"
          />
        </Reveal>

        <div className={`order-2 flex flex-col items-start ${proposal.imageFirstOnDesktop ? 'lg:order-2' : 'lg:order-1'}`}>
          <Reveal delay={100}>
            <p className="tracked text-[30px] font-medium text-muted-foreground" >{proposal.eyebrow}</p>
          </Reveal>
          <Reveal delay={160}>
            {/* Un solo h1 por página: la primera propuesta; las demás son h2. Mismo estilo. */}
            <Heading id={proposal.id} className="mt-5 max-w-[18ch] text-balance text-[30px] font-light leading-[1.18] text-primary md:text-[40px] lg:text-[46px]">
              {proposal.title}
            </Heading>
          </Reveal>
          <Reveal delay={220} className="max-w-[52ch]">
            <div className="mt-7 space-y-4 text-[15px] leading-[1.7] text-muted-foreground md:text-[16px]">
              {proposal.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {proposal.closing ? <p className="text-primary">{proposal.closing}</p> : null}
            </div>
          </Reveal>
          <Reveal delay={280}>
            <PrimaryAction href={waLink(proposal.message)} className="mt-9 w-full sm:w-auto">
              {proposal.cta}
            </PrimaryAction>
          </Reveal>
          {proposal.secondary ? (
            <Reveal delay={320}>
              <QuietLink href={proposal.secondary.href} external={false} className="mt-4">
                {proposal.secondary.label}
              </QuietLink>
            </Reveal>
          ) : null}
        </div>
      </div>

    </Section>
  )
}
