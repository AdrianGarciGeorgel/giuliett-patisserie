'use client'

import Link from 'next/link'
import { CakeSlice, House, MessageCircle, Sparkles, type LucideIcon, UserRound } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type NavigationItem = {
  href: string
  label: string
  icon: LucideIcon
}

const mobileNavigationItems: NavigationItem[] = [
  { href: '/', label: 'Inicio', icon: House },
  { href: '/giu', label: 'Giuliett', icon: UserRound },
  { href: '/galeria', label: 'Productos', icon: CakeSlice },
  { href: '/eventos', label: 'Eventos', icon: Sparkles },
  { href: '/contacto', label: 'Pedido', icon: MessageCircle },
]

const desktopNavigationItems = [
  { href: '/', label: 'Inicio' },
  { href: '/giu', label: 'Sobre Giuliett' },
  { href: '/galeria', label: 'Nuestros Productos' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/contacto', label: 'Hacé tu Pedido' },
] as const

function isCurrentPath(pathname: string, href: string) {
  return href === '/' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}

export function GlobalNavigation() {
  const pathname = usePathname()

  // El panel interno (/admin) no lleva la navegación del sitio.
  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <header className="sticky top-0 z-50 hidden border-b border-border/60 bg-background/85 backdrop-blur-md md:block">
        <nav aria-label="Navegación principal" className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-center px-8">
          {/* <Link href="/" className="font-script text-[30px] leading-none text-primary" aria-label="Giuliett, inicio">
            Giuliett
          </Link> */}
          <ul className="flex items-center gap-7 lg:gap-9">
            {desktopNavigationItems.map(({ href, label }) => {
              const active = isCurrentPath(pathname, href)

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative inline-flex min-h-[44px] items-center text-[12px] font-medium tracking-[0.08em] transition-colors duration-200',
                      active ? 'text-primary' : 'text-muted-foreground hover:text-primary',
                    )}
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 bottom-1 h-px bg-current transition-[opacity,transform] duration-200 ease-out',
                        active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0',
                      )}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden"
      >
        <ul className="mx-auto flex min-h-[68px] max-w-md items-center justify-around rounded-[28px] bg-[#FFF8E9]/90 px-3 shadow-[0_12px_32px_-12px_rgb(63_42_80/0.14)] backdrop-blur-md">
          {mobileNavigationItems.map(({ href, label, icon: Icon }) => {
            const active = isCurrentPath(pathname, href)

            return (
              <li key={href} className="flex flex-1 justify-center">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex min-h-[56px] min-w-[48px] flex-col items-center justify-center gap-1 px-1.5',
                    'transition-colors duration-200 ease-out',
                    // Taupe oscurecido: el #9C8065 de marca da 3,5:1 sobre el fondo crema y
                    // el texto es de 10px; con #7D6650 llega a 5,1:1 (AA) sin cambiar de familia.
                    active ? 'text-[#51375C]' : 'text-[#7D6650]',
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.7}
                    className={cn('h-5 w-5 transition-transform duration-200 ease-out', active ? 'scale-100' : 'scale-[0.95]')}
                  />
                  <span className="text-[10px] font-medium leading-none tracking-[0.02em]">{label}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute bottom-0.5 h-1 w-1 rounded-full bg-current transition-[opacity,transform] duration-200 ease-out',
                      active ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                    )}
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
