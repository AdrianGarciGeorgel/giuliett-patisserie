import { REASONS } from '@/lib/giuliett'
import { ArtEiffel, ArtFounderIcon, ArtGiftBox, ArtVan } from './line-art'
import { Reveal } from './reveal'
import { Section } from './section'

const REASON_ART = {
  francia: ArtEiffel,
  entregas: ArtVan,
  presentacion: ArtGiftBox,
  fundadora: ArtFounderIcon,
} as const

/** Diferenciales de Giuliett, reutilizables debajo de una conversión. */
export function WhyChooseUs() {
  return (
    <Section tone="white" aria-labelledby="por-que-elegirnos">
      <Reveal>
        <h2 id="por-que-elegirnos" className="tracked text-center text-[18px] font-medium text-primary md:text-[24px]">
          ¿Por qué nos eligen?
        </h2>
      </Reveal>

      <ul className="mx-auto mt-12 grid max-w-[1040px] grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0">
        {REASONS.map((reason, index) => {
          

          return (
            <Reveal as="li" key={reason.id} delay={index * 80} className="relative flex min-h-[142px] flex-col items-center justify-start px-2 text-center lg:px-8">
              {index > 0 ? <span aria-hidden="true" className="dotted-y absolute bottom-2 left-0 top-2 hidden lg:block" style={{ backgroundImage: "radial-gradient(circle, #3f2a509c 1px, transparent 1px)" }} /> : null}
              <img className='max-h-[100px] object-contain' src={reason.Image} alt="" loading="lazy" decoding="async" />
              <p className="mt-4 max-w-[15ch] text-[15px] font-medium leading-snug text-primary md:text-[17px]">{reason.text}</p>
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
