import Image from 'next/image'
import { ContactForm } from '@/components/giuliett/contact-form'
import { Reveal } from '@/components/giuliett/reveal'
import { Section } from '@/components/giuliett/section'
import { Footer } from '@/components/giuliett/sections/footer'
import { TrustedClients } from '@/components/giuliett/trusted-clients'
import { WhyChooseUs } from '@/components/giuliett/why-choose-us'
import { IconWhatsApp } from '@/components/giuliett/line-art'
import { WA_GENERAL, waLink } from '@/lib/giuliett'

export default function ContactoPage() {
  return (
  
    <main>
      <section className="relative overflow-hidden bg-primary" aria-labelledby="contacto-titulo">
        <div className="relative h-[280px] sm:h-[340px] md:h-[420px]">
          <Image
            src="/images/cierre-mesa-dulce.webp"
            alt="Mesa dulce con macarons, tartas y cookies sobre stands de cerámica lila"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            />
          <div aria-hidden="true" className="absolute inset-0 bg-primary/45" />
          <div className="relative mx-auto flex h-full w-full max-w-[1200px] items-end px-6 pb-10 md:px-8 md:pb-16">
            <h1 id="contacto-titulo" className="max-w-[17ch] text-balance text-[30px] font-light leading-[1.2] text-primary-foreground sm:text-[38px] md:text-[52px]">
              Contanos qué necesitás
              <br />y te ayudamos a hacerlo realidad.
            </h1>
          </div>
        </div>
      </section>

      <Section tone="cream" className="pb-24 pt-20 md:pb-[140px] md:pt-28" aria-labelledby="consulta-titulo">
        <div className="mx-auto max-w-[640px]">
          <Reveal>
            <p id="consulta-titulo" className="text-balance text-center text-[18px] leading-[1.65] text-primary md:text-[21px]">
              Cada pedido es único. Contanos qué estás imaginando y nos ponemos en contacto con vos.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-14 md:mt-16">
            <ContactForm />
          </Reveal>
        </div>
      </Section>
      <WhyChooseUs />
      <TrustedClients />
      <Footer />
       <a
              href={waLink(WA_GENERAL)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escribinos por WhatsApp"
              className="czm-pulse fixed bottom-[calc(92px+env(safe-area-inset-bottom))] right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#51375C] text-[#FFF8E9] shadow-[0_12px_32px_-10px_rgb(81_55_92/0.45)] transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.03] active:scale-[0.97] sm:right-8 lg:right-8"
              >
              <IconWhatsApp className="czm-pulse h-6 w-6" strokeWidth={1.7} />
            </a>
      
    </main>

  )
}
