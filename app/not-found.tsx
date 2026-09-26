import type { Metadata } from 'next'
import { PrimaryAction, QuietLink } from '@/components/giuliett/atoms'
import { Section } from '@/components/giuliett/section'
import { SectionLockup } from '@/components/giuliett/section-lockup'
import { waLink } from '@/lib/giuliett'

export const metadata: Metadata = {
  title: 'Página no encontrada',
}

/* La 404 de fábrica de Next salía en inglés ("404: This page could not be found."), con la
   tipografía del sistema, dos <title> y sin la región principal que usan los lectores de
   pantalla (QA del 26-09-2026). Esta usa solo piezas del sistema de diseño de Marco.
   PROPUESTA: es visual, así que se publica con el OK de Adrián y Marco (regla 8). */
export default function PaginaNoEncontrada() {
  return (
    <main>
      <Section
        tone="cream"
        layered={false}
        className="pb-24 pt-20 md:pb-[140px] md:pt-28"
        aria-labelledby="no-encontrada-titulo"
      >
        <div className="flex flex-col items-center text-center">
          <SectionLockup id="no-encontrada-titulo" as="h1" caps="No encontramos esta página" script="Oh là là" />
          <p className="mt-6 max-w-[34ch] text-[15px] leading-[1.7] text-muted-foreground md:text-[16px]">
            Puede que el enlace haya cambiado. Te dejamos el camino de vuelta.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-8">
            <PrimaryAction href="/productos" external={false}>
              Ver productos
            </PrimaryAction>
            <QuietLink href="/" external={false}>
              Volver al inicio
            </QuietLink>
            <QuietLink href={waLink('Hola Giuliett! Llegué a una página que no existe en la web.')}>
              Escribinos por WhatsApp
            </QuietLink>
          </div>
        </div>
      </Section>
    </main>
  )
}
