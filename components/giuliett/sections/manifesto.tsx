import { FramedPhoto } from '../atoms'
import { Reveal } from '../reveal'
import { Prose, Section } from '../section'

/**
 * 03 · MANIFIESTO — la razón emocional. Único bloque en primera persona
 * y único autorizado a superar las 20 palabras. Sin CTA: interrumpirlo
 * con un botón lo convertiría en publicidad.
 * Es la pantalla más vacía del sitio a propósito.
 */
export function Manifesto() {
  return (
    <Section tone="white" aria-labelledby="manifiesto-titulo">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">
        {/* Único uso del corazón en todo el sitio. */}
        <Reveal className="shrink-0">
          <HeartMark />
        </Reveal>

        <div className="flex w-full flex-col items-center lg:items-start">
          <Reveal delay={80}>
            <Prose className="text-center lg:text-left">
              <p className="text-[17px] leading-[1.65] text-primary md:text-[18px]">
                Aprendí en Francia y volví con la técnica intacta.
              </p>
              <p className="mt-4">
                Todo lo que sale de acá está hecho a mano, con ingredientes que elegimos uno por uno. Sin atajos y sin
                apuro.
              </p>
              <p className="mt-4 text-primary">Cada pedido lleva tu marca. Y también la nuestra.</p>
            </Prose>
          </Reveal>

          {/* Ratio horizontal: rompe el patrón vertical del sitio a propósito. */}
          <Reveal delay={160} className="mt-10 w-full max-w-[62ch]">
            <FramedPhoto
              src="/images/manifiesto-manos.webp"
              alt="Manos decorando a mano una cookie glaseada con glasé violeta"
              ratio="16/9"
              radius="md"
              sizes="(min-width: 1024px) 620px, calc(100vw - 48px)"
            />
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

/** El corazón como contenedor de la frase de marca. */
function HeartMark() {
  return (
    <div className="relative mx-auto h-[190px] w-[210px] md:h-[230px] md:w-[260px]">
      <svg viewBox="0 0 200 180" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path
          d="M100 172C100 172 8 118 8 62 8 30 30 8 58 8c18 0 34 10 42 26 8-16 24-26 42-26 28 0 50 22 50 54 0 56-92 110-92 110Z"
          fill="var(--primary)"
        />
      </svg>

      <h2
        id="manifiesto-titulo"
        className="relative flex h-full w-full flex-col items-center justify-center pb-8 text-center"
      >
        <span className="tracked text-[13px] font-medium leading-[1.5] text-primary-foreground md:text-[15px]">
          Técnica
          <br />
          Francesa
        </span>
        <span className="mt-1.5 text-[11px] font-light text-primary-foreground/75">con</span>
        <span className="font-script -mt-0.5 text-[26px] leading-none text-primary-foreground md:text-[30px]">
          Alma Mendocina
        </span>
      </h2>
    </div>
  )
}
