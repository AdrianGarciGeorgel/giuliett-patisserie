import Image from 'next/image'
import { CONTACT } from '@/lib/giuliett'
import { IconInstagram, IconMail, IconPhone, IconWhatsApp } from '../line-art'
import { Reveal } from '../reveal'
import { SectionLockup } from '../section-lockup'
import { Logo } from '../logo'

const FOOTER_EMAIL = 'hola@giuliettpatisserie.com'

const contactLinks = [
  { label: CONTACT.phoneDisplay, href: `tel:+${CONTACT.phoneRaw}`, Icon: IconWhatsApp, external: false },
  { label: FOOTER_EMAIL, href: `mailto:${FOOTER_EMAIL}`, Icon: IconMail, external: false },
  { label: CONTACT.instagramHandle, href: CONTACT.instagramUrl, Icon: IconInstagram, external: true },
] as const

/** Footer editorial, shown with the contact form. */
export function Footer() {
  return (
    <footer className="overflow-hidden bg-lilac py-16 md:py-0">
      <div className="mx-auto flex min-h-[360px] w-full max-w-[1200px] flex-col items-center gap-10 px-6 md:min-h-[340px] md:flex-row md:items-end md:justify-between md:gap-12 md:px-8">
        <div className="flex w-full flex-col items-center pt-2 text-center md:max-w-[620px] md:items-start md:py-16 md:text-left">
          <Reveal>
            
            <Logo></Logo>
          </Reveal>

          <Reveal delay={100}>
            <ul className="mt-9 flex flex-col items-start gap-3.5 md:mt-10">
              {contactLinks.map(({ label, href, Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group inline-flex min-h-[48px] items-center gap-3 text-[15px] text-primary transition-opacity duration-200 hover:opacity-70"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/55 transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={160} className="relative flex w-full max-w-[260px] justify-center md:max-w-[340px] md:justify-end">
          <Image
            src="/images/giu-footer.png"
            alt="Ilustración de Giu, chef pastelera de Giuliett"
            width={4500}
            height={4500}
            sizes="(min-width: 768px) 340px, 260px"
            className="h-auto w-full object-contain"
          />
        </Reveal>
      </div>
    </footer>
  )
}
