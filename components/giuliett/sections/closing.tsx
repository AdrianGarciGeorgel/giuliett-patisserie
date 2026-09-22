import { CONTACT, WA_GENERAL, waLink } from '@/lib/giuliett'
import { FramedPhoto, PrimaryAction, QuietLink } from '../atoms'
import { IconInstagram } from '../line-art'
import { Reveal } from '../reveal'
import { Section } from '../section'
import { SectionLockup } from '../section-lockup'

/**
 * 08 · CIERRE — el regreso al lila cierra el arco abierto en el hero:
 * el usuario siente que llegó al final y que es momento de decidir.
 * "Contestamos el mismo día" elimina la única ansiedad real: el silencio.
 */
export function Closing() {
  return (
    <Section tone="lilac" aria-labelledby="cierre-titulo">
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        <Reveal className="w-full lg:w-[46%]">
          <FramedPhoto
            src="/images/cierre-mesa-dulce.webp"
            alt="Mesa dulce con macarons, tartas y cookies sobre stands de cerámica lila"
            ratio="4/3"
            lifted
            sizes="(min-width: 1024px) 520px, calc(100vw - 48px)"
          />
        </Reveal>

        <div className="flex w-full flex-col items-center lg:flex-1 lg:items-start">
          <Reveal delay={80}>
            <SectionLockup
              id="cierre-titulo"
              caps="Hablemos de tu"
              script="Próximo Pedido"
              size="lg"
              className="lg:items-start lg:text-left"
            />
          </Reveal>

          <Reveal delay={160} className="w-full">
            <p className="mt-6 text-center text-[15px] text-primary/80 lg:text-left">Contestamos el mismo día.</p>
          </Reveal>

          <Reveal delay={240} className="mt-8 flex w-full flex-col items-center gap-4 lg:items-start">
            <PrimaryAction
              href={waLink(WA_GENERAL)}
              className="w-full max-w-[420px] lg:w-auto lg:max-w-none"
              ariaLabel="Escribinos por WhatsApp"
            >
              Escribinos por WhatsApp
            </PrimaryAction>

            <QuietLink href={CONTACT.instagramUrl} className="text-primary/70">
              <IconInstagram className="h-[18px] w-[18px]" />
              Ver Instagram
            </QuietLink>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
