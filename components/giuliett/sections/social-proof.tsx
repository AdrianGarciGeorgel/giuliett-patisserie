import { CLIENTS } from '@/lib/giuliett'
import { ArtOkHand } from '../line-art'
import { Reveal } from '../reveal'
import { Section } from '../section'
import { SectionLockup } from '../section-lockup'

/**
 * 06 · PRUEBA SOCIAL — el muro de clientes.
 * Los nombres en tipografía, no en logos: logos de calidad dispar
 * destruirían la coherencia visual. Un solo testimonio, porque uno
 * bueno pesa más que cuatro genéricos.
 */
export function SocialProof() {
  return (
    <Section tone="cream" aria-labelledby="clientes-titulo">
      <Reveal>
        <SectionLockup id="clientes-titulo" caps="Clientes que" script="confiaron" />
      </Reveal>

      <div className="mt-12 flex flex-col items-center gap-10 md:mt-14 lg:flex-row lg:items-center lg:gap-16">
        {/* Ilustración recortada por el borde: sugiere que la composición sigue. */}
        <Reveal className="relative hidden w-[140px] shrink-0 self-end overflow-hidden lg:block">
          <ArtOkHand className="-mb-10 h-[240px] w-auto text-primary" />
        </Reveal>

        <div className="flex w-full flex-col items-center lg:items-start">
          <Reveal delay={80} className="w-full">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start lg:gap-x-10">
              {CLIENTS.map((client) => (
                <li key={client.id} className="tracked text-[14px] font-medium text-primary/75 md:text-[16px]">
                  {client.text}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160} className="mt-10 w-full max-w-[560px]">
            <figure className="rounded-lg bg-surface px-7 py-8 md:px-9 md:py-10">
              <span aria-hidden="true" className="font-script block text-[40px] leading-none text-lilac-deep">
                &ldquo;
              </span>
              <blockquote className="-mt-3 text-[17px] leading-[1.6] text-primary md:text-[18px]">
                <p className="text-pretty">
                  Los kits llegaron un lunes a la mañana. Todavía hay gente que los menciona.
                </p>
              </blockquote>
              <figcaption className="mt-5 text-[13px] text-muted-foreground">
                — Carolina M., <span className="text-primary/70">UltraTex</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
