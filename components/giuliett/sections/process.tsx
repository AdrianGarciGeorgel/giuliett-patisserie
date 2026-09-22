import { STEPS } from '@/lib/giuliett'
import { DottedX } from '../atoms'
import { ArtFounderSeated } from '../line-art'
import { Reveal } from '../reveal'
import { Section } from '../section'
import Image from 'next/image'

/**
 * 07 · CÓMO TRABAJAMOS — desactiva la objeción del esfuerzo.
 * Tres pasos: el primero es del cliente, los otros dos de Giuliett.
 * La estructura de los verbos ya cuenta la historia.
 * Único lockup íntegramente en script del sitio.
 */
export function Process() {
  return (
    <Section tone="lilac-soft" aria-labelledby="proceso-titulo">
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-20">
        <div className="w-full lg:flex-1">
          <Reveal>
            <h2
              id="proceso-titulo"
              className="font-script text-center text-[38px] leading-none text-primary md:text-[46px] lg:text-left"
            >
              ¿Cómo trabajamos?
            </h2>
          </Reveal>

          <ol className="mt-10 flex flex-col">
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 80}>
                {i > 0 ? <DottedX className="my-6" /> : null}
                <div className="flex items-start gap-5">
                  {/* Número en script: el paso se siente escrito a mano. */}
                  <span
                    aria-hidden="true"
                    className="font-script w-8 shrink-0 text-[34px] leading-[0.8] text-lilac-deep md:text-[40px]"
                  >
                    {step.n}
                  </span>
                  <div className="pt-1">
                    <h3 className="tracked-tight text-[14px] font-semibold text-primary md:text-[15px]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-[1.6] text-muted-foreground">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* La fundadora: una sola aparición por pantalla, recortada por el borde. */}
        <Reveal delay={160} className="relative w-full max-w-[300px] shrink-0 lg:max-w-[340px]">
           <figure className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
                        <div
                          className="relative overflow-hidden rounded-[32px] bg-[#BFB4DC]/20 shadow-[0_20px_48px_-20px_rgb(81_55_92/0.22)]"
                          style={{ aspectRatio: '4 / 5' }}
                        >
                          <Image
                            src="/images/gui_wine.webp"
                            alt="Caja de cookies artesanales con el logo de Giuliett sobre mármol blanco"
                            fill
                            priority
                            sizes="(min-width: 1024px) 54vw, calc(100vw - 40px)"
                            className="object-cover"
                          />
                        </div>
                        <figcaption className="sr-only">Pastelería francesa artesanal Giuliett</figcaption>
                      </figure>
        </Reveal>
      </div>
    </Section>
  )
}
