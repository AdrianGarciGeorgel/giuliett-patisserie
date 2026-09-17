import Image from 'next/image'
import { CLIENTS } from '@/lib/giuliett'
import { ArtOkHand } from './line-art'
import { Reveal } from './reveal'
import { Section } from './section'
import { SectionLockup } from './section-lockup'

/** Prueba social editorial, con los clientes ya configurados para Giuliett. */
export function TrustedClients() {
  return (
    <Section tone="cream" aria-labelledby="clientes-confian">
      <Reveal>
        <div id="clientes-confian">
          <SectionLockup caps="Clientes que" script="confían" />
        </div>
      </Reveal>

      <div id="clientes-icons" className="mx-auto mt-12 grid max-w-[1040px] items-center gap-10 lg:grid-cols-[140px_minmax(0,1fr)_140px] lg:gap-12">
        <Reveal className="hidden  lg:block lg:size-[200px] " delay={80}>
          <img src="/images/mesero.png" className="size-[200px] object-contain text-primary" />
        </Reveal>
        <ul className="mx-auto mt-12 grid max-w-[1040px] grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0">
            {CLIENTS.map((reason, index) => {

              return (
                <Reveal as="li" key={reason.id} delay={index * 80} className="relative flex min-h-[142px] flex-col items-center justify-start px-2 text-center lg:px-8 lg:self-center">
                  {index > 0 ? <span aria-hidden="true" className=" absolute bottom-2 left-0 top-2 hidden lg:block" /> : null}
                  <img className="h-[96px] w-[132px] object-contain lg:size-[140px]" src={reason.Image} alt="" />
                </Reveal>
              )
            })}
        </ul>
      <Reveal delay={180} className="mx-auto w-full max-w-[1040px] lg:size-[200px] lg:max-w-none lg:self-center">
          <Image
            src="/images/gui_wine.png"
            alt="Ilustración de Giu, fundadora de Giuliett"
            width={4500}
            height={4500}
            sizes="(min-width: 1024px) 230px, 190px"
            className="h-auto w-full object-contain"
          />
        </Reveal>
      </div>
    </Section>
  )
}
