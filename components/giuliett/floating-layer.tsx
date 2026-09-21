'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { WA_GENERAL, waLink } from '@/lib/giuliett'
import { IconWhatsApp } from './line-art'

/**
 * Barra superior mínima. Sólo el logotipo script centrado: no hay menú
 * porque el scroll es la navegación. Transparente sobre el hero,
 * aparece a los 600px y queda fija sin auto-ocultarse.
 */
function TopBar() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden={!shown}
      className={cn(
        'fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-center',
        'border-b border-border/60 bg-background/85 backdrop-blur-md',
        'transition-opacity duration-300 ease-out',
        shown ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <a
        href="#inicio"
        className="font-script px-6 text-[22px] leading-none text-primary"
        tabIndex={shown ? 0 : -1}
      >
        Giuliett
      </a>
    </div>
  )
}

/**
 * Botón flotante de WhatsApp: que nunca exista un momento en el que
 * el usuario no pueda contactar. Círculo en mobile, pill en desktop.
 * Sin pulso ni badge: un botón que late es un botón que ruega.
 */
function WhatsAppFab() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
    
      <a
        href={waLink(WA_GENERAL)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        tabIndex={shown ? 0 : -1}
        className={cn(
          'czm-pulse',
          'fixed bottom-6 right-5 z-50 md:bottom-8 md:right-8',
          'inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-primary text-primary-foreground',
          'w-14 md:h-13 md:w-auto md:rounded-sm md:px-6',
          'shadow-[var(--shadow-giuliett)]',
          'transition-[opacity,transform,box-shadow] duration-[350ms] ease-out',
          'hover:scale-105 hover:shadow-[var(--shadow-giuliett-lift)] active:scale-[0.96]',
          shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <IconWhatsApp className="czm-pulse h-6 w-6 shrink-0" strokeWidth={1.7} />
        <span className="hidden text-[15px] font-medium md:inline">Escribinos</span>
      </a>
    </>
  )
}

export function FloatingLayer() {
  return (
    <>
      <TopBar />
      <WhatsAppFab />
    </>
  )
}
