'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, type PointerEvent } from 'react'
import { PRODUCTS } from '@/lib/giuliett'
import { cn } from '@/lib/utils'
import { productCategories } from '@/lib/giuliett'
import { CakeSlice, Truck } from 'lucide-react'
import { IconArrow } from './line-art'

type DragState = {
  pointerId: number
  startX: number
  startScrollLeft: number
}

type CarouselSlide = {
  id?: string
  image: string
  alt: string
  text?: string
  label?: string
  script?: string
}

type HeroCarouselProps = {
  /** Slides opcionales para reutilizar el gesto de carrusel fuera del hero. */
  slides?: readonly CarouselSlide[]
  /** Mantiene la proporción de la fotografía que el carrusel reemplaza. */
  ratio?: '4/5' | '16/9' | '4/3' | '1/1'
  sizes?: string
  className?: string
  showProductButton?: boolean
  showIndicators?: boolean
  ariaLabel?: string
  /** Presentación inmersiva reservada para la portada. */
  variant?: 'default' | 'home'
  /**
   * Precarga la primera foto (next/image `priority`). Solo para el carrusel que se ve al entrar:
   * en una página con varios carruseles, los de más abajo compiten por la red con la foto principal.
   */
  priority?: boolean
}

const productSlides: readonly CarouselSlide[] = PRODUCTS.map((product) => ({
  id: product.id,
  image: product.image,
  alt: product.alt,
  label: product.label,
  script: product.script,
}))

/**
 * Native horizontal scrolling gives touch the same direct feel as an image
 * post. Pointer handling is limited to a mouse so mobile keeps its browser
 * scrolling physics and scroll snap settles every gesture naturally.
 */
export function HeroCarousel({
  slides,
  ratio = '4/5',
  sizes = '(min-width: 1024px) 54vw, calc(100vw - 40px)',
  className,
  showProductButton = true,
  showIndicators = true,
  ariaLabel = 'Productos Giuliett',
  variant = 'default',
  priority = true,
}: HeroCarouselProps) {
  const carouselSlides = slides ?? productSlides
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const animationFrame = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragging, setDragging] = useState(false)

  const updateActiveSlide = () => {
    const viewport = viewportRef.current
    if (!viewport) return

    const nextIndex = Math.round(viewport.scrollLeft / viewport.clientWidth)
    setActiveIndex(Math.min(carouselSlides.length - 1, Math.max(0, nextIndex)))
  }

  const handleScroll = () => {
    if (animationFrame.current !== null) return

    animationFrame.current = window.requestAnimationFrame(() => {
      animationFrame.current = null
      updateActiveSlide()
    })
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return

    const viewport = viewportRef.current
    if (!viewport) return

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: viewport.scrollLeft,
    }
    viewport.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current
    const drag = dragRef.current
    if (!viewport || !drag || event.pointerId !== drag.pointerId) return

    viewport.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX)
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current
    const drag = dragRef.current
    if (!viewport || !drag || event.pointerId !== drag.pointerId) return

    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
    dragRef.current = null
    setDragging(false)
    updateActiveSlide()
  }

  if (variant === 'home') {
    return (
      <div className="relative w-full overflow-hidden">
        <div
          ref={viewportRef}
          role="region"
          aria-roledescription="carrusel"
          aria-label={ariaLabel}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={cn(
            'flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden bg-[#BFB4DC]/20',
            'touch-pan-x touch-pan-y select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            dragging ? 'cursor-grabbing' : 'cursor-grab',
            className,
          )}
        >
          {productCategories.map((slide, index) => (
            <figure
              key={slide.name}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${productCategories.length}: ${slide.name}`}
              className="relative isolate flex min-h-[680px] min-w-full snap-center items-center justify-center overflow-hidden sm:min-h-[720px] lg:min-h-[calc(100svh-76px)]"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={priority && index === 0}
                sizes="100vw"
                draggable={false}
                className="-z-20 object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,248,233,0.92)_0%,rgba(255,248,233,0.72)_35%,rgba(255,248,233,0.18)_61%,transparent_76%)]"
              />

              <div className="relative z-10 flex w-full max-w-[680px] flex-col items-center px-6 pb-[108px] pt-10 text-center text-primary sm:px-10 sm:pb-12 lg:px-12">
                <Image
                  src="/images/giuliett-logo.png"
                  alt="Giuliett Pâtisserie"
                  width={3500}
                  height={1700}
                  sizes="(min-width: 1024px) 370px, 250px"
                  className="h-auto w-[230px] object-contain sm:w-[280px] lg:w-[370px]"
                />
                <p className="tracked mt-4 text-[10px] font-medium leading-relaxed sm:text-[11px] lg:mt-5 lg:text-[12px]">
                  Pastelería Francesa · Mendoza, Argentina
                </p>
                <span aria-hidden="true" className="mt-5 h-px w-8 bg-primary/55 lg:mt-6" />

             

                <Link
                  href={`/productos?categoria=${slide.category}`}
                  className="mt-8 inline-flex min-h-[50px] items-center gap-3 rounded-full bg-primary px-6 text-[14px] font-medium text-primary-foreground shadow-[0_12px_28px_-14px_rgb(63_42_80/0.5)] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-lilac-ink hover:shadow-[var(--shadow-giuliett)] active:scale-[0.985] lg:mt-9"
                >
                  Ver producto
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current">
                    <IconArrow className="h-3 w-3" strokeWidth={1.8} />
                  </span>
                </Link>

                {/* h2: el título de la página es el h1 de sections/hero.tsx. Un h1 por slide daba 4 en la home. */}
                <h2 className="mt-5 text-balance text-[25px] font-medium leading-tight text-primary sm:text-[29px] lg:mt-6 lg:text-[34px]">
                  {slide.name}
                </h2>

                {/* role="group": un div sin rol no puede llevar aria-label (Lighthouse: aria-prohibited-attr). */}
                <div role="group" className="mt-6 flex justify-center gap-2" aria-label={`Producto ${activeIndex + 1} de ${productCategories.length}`}>
                  {productCategories.map((category, indicatorIndex) => (
                    <span
                      key={category.name}
                      aria-hidden="true"
                      className={cn(
                        'h-2 w-2 rounded-full bg-primary transition-[opacity,transform] duration-200 ease-out',
                        indicatorIndex === activeIndex ? 'scale-100 opacity-100' : 'scale-75 opacity-30',
                      )}
                    />
                  ))}
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carrusel"
        aria-label={ariaLabel}
        onScroll={handleScroll}
        // onPointerDown={handlePointerDown}
        // onPointerMove={handlePointerMove}
        // onPointerUp={endDrag}
        // onPointerCancel={endDrag}
        className={cn(
          'flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-[32px] bg-[#BFB4DC]/20',
          '[touch-action:pan-x_pan-y] select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'shadow-[0_20px_48px_-20px_rgb(81_55_92/0.22)]',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
          className,
        )}
      >
        {carouselSlides.map((slide, index) => (
          <figure
            key={`${slide.id}-${index}`}
            role="group"
            aria-roledescription="diapositiva"
            // aria-label={`${index + 1} de ${carouselSlides.length}${slide.label ? `: ${slide.label}${slide.script ? ` ${slide.script}` : ''}` : ''}`}
            className="relative min-w-full snap-center"
          >
            <div className="relative" style={{ aspectRatio: ratio.replace('/', ' / ') }}>
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={priority && index === 0}
                sizes={sizes}
                draggable={false}
                className="object-cover"
                // onClick={() => window.location.assign(`/productos?categoria=${slide.category}`)}
              />
            </div>
            <div>

            {slide.text ? (
              <figcaption className="absolute bottom-3 left-3 right-3 truncate rounded-sm bg-white/82 px-3 py-2 text-center text-[12px] font-medium text-primary backdrop-blur-sm" style={{backgroundColor:'color-mix(in oklab, #beb4dc 82%, #d04d4d00)'}}>
                {slide.text}
              </figcaption>
            ) : null}
            </div>
            <div>

            {showProductButton ? (
              <button
              type="button"
              onClick={() => window.location.assign(`/productos?categoria=${slide.label}`)}
              aria-label={`Ver producto: ${slide.label}`}
              className="absolute bottom-15 left-1/2 min-h-[40px] -translate-x-1/2 rounded-full bg-[#FFF8E9]/82 px-5 text-[12px] font-medium text-[#51375C] shadow-[0_8px_20px_-10px_rgb(63_42_80/0.35)] backdrop-blur-md transition-colors duration-200 hover:bg-[#FFF8E9]"
              >
                Ver producto
              </button>
            ) : null}
            </div>
          </figure>
        ))}
      </div>

      {showIndicators ? (
        <div role="group" className="mt-4 flex justify-center gap-1.5" aria-label={`Producto ${activeIndex + 1} de ${carouselSlides.length}`}>
          {carouselSlides.map((slide, index) => (
            <span
              key={slide.id ?? slide.image}
              aria-hidden="true"
              className={cn(
                'h-1.5 rounded-full bg-[#51375C] transition-[opacity,width] duration-200 ease-out',
                index === activeIndex ? 'w-4 opacity-100' : 'w-1.5 opacity-30',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
