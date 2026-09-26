'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore, type FocusEvent, type PointerEvent, type WheelEvent } from 'react'
import { PRODUCTS } from '@/lib/giuliett'
import { cn } from '@/lib/utils'
import { productCategories } from '@/lib/giuliett'
import { DESCANSO_TRAS_INTERACCION_MS, INTERVALO_AUTOPLAY_MS, debeAvanzar, esGestoHorizontal, siguienteIndice } from '@/lib/carrusel'
import { CakeSlice, Pause, Play, Truck } from 'lucide-react'
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
  /** Se mueve solo cada INTERVALO_AUTOPLAY_MS (reglas en lib/carrusel.ts). Con botón de pausa (WCAG 2.2.2). */
  autoplay?: boolean
  /**
   * Pausar mientras el mouse está encima. Por defecto sí en los carruseles chicos (galería, eventos)
   * y no en la home: ahí el carrusel ocupa toda la pantalla y nunca avanzaría.
   */
  pausarAlPasarElMouse?: boolean
}

const productSlides: readonly CarouselSlide[] = PRODUCTS.map((product) => ({
  id: product.id,
  image: product.image,
  alt: product.alt,
  label: product.label,
  script: product.script,
}))

const CONSULTA_MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'

/** prefers-reduced-motion como estado de React, sin setState dentro de un efecto. En el servidor: no. */
function usePrefiereMovimientoReducido() {
  return useSyncExternalStore(
    (avisar) => {
      const consulta = window.matchMedia(CONSULTA_MOVIMIENTO_REDUCIDO)
      consulta.addEventListener('change', avisar)
      return () => consulta.removeEventListener('change', avisar)
    },
    () => window.matchMedia(CONSULTA_MOVIMIENTO_REDUCIDO).matches,
    () => false,
  )
}

/** Links y botones dentro del carrusel no inician un arrastre: si no, la captura del puntero se traga el clic. */
const esControl = (objetivo: EventTarget | null) => objetivo instanceof Element && objetivo.closest('a, button') !== null

function BotonPausa({ pausado, onClick }: { pausado: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={pausado ? 'Reanudar el carrusel' : 'Pausar el carrusel'}
      className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-primary/55 transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {pausado ? <Play aria-hidden="true" className="h-3 w-3" strokeWidth={2} /> : <Pause aria-hidden="true" className="h-3 w-3" strokeWidth={2} />}
    </button>
  )
}

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
  autoplay = true,
  pausarAlPasarElMouse = variant !== 'home',
}: HeroCarouselProps) {
  const carouselSlides = slides ?? productSlides
  const total = variant === 'home' ? productCategories.length : carouselSlides.length
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const animationFrame = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [pausado, setPausado] = useState(false)
  const movimientoReducido = usePrefiereMovimientoReducido()

  // Lo que el autoplay consulta en cada tic. En refs: cambian seguido y no deben re-renderizar.
  const indiceActual = useRef(0)
  const senales = useRef({ visible: false, mouseEncima: false, foco: false, ultimaInteraccion: 0 })

  const puedeMoverse = autoplay && total > 1
  const girando = puedeMoverse && !pausado && !movimientoReducido

  const updateActiveSlide = () => {
    const viewport = viewportRef.current
    if (!viewport) return

    const nextIndex = Math.min(total - 1, Math.max(0, Math.round(viewport.scrollLeft / viewport.clientWidth)))
    indiceActual.current = nextIndex
    setActiveIndex(nextIndex)
  }

  const handleScroll = () => {
    if (animationFrame.current !== null) return

    animationFrame.current = window.requestAnimationFrame(() => {
      animationFrame.current = null
      updateActiveSlide()
    })
  }

  const irA = (indice: number) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const destino = indice * viewport.clientWidth
    const inicio = viewport.scrollLeft
    viewport.scrollTo({ left: destino, behavior: movimientoReducido ? 'auto' : 'smooth' })
    // Respaldo: si el navegador no anima el desplazamiento (ventana tapada, ahorro de energía), salta directo.
    // Solo si no se movió nada: si la persona empezó a deslizar, no se le pelea.
    if (!movimientoReducido && inicio !== destino) {
      window.setTimeout(() => {
        if (viewport.scrollLeft === inicio) viewport.scrollTo({ left: destino, behavior: 'auto' })
      }, 900)
    }
  }

  /** Hora del gesto en ms de reloj: event.timeStamp cuenta desde que abrió la página (performance.timeOrigin). */
  const marcarInteraccion = (evento: { timeStamp: number }) => {
    senales.current.ultimaInteraccion = performance.timeOrigin + evento.timeStamp
  }

  const elegir = (indice: number, evento: { timeStamp: number }) => {
    marcarInteraccion(evento)
    irA(indice)
  }

  const alternarPausa = () => {
    if (pausado) senales.current.ultimaInteraccion = 0 // al reanudar, que siga en el próximo tic
    setPausado(!pausado)
  }

  // Solo se mueve si al menos la mitad del carrusel está en pantalla (los de más abajo esperan su turno).
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || typeof IntersectionObserver === 'undefined') return
    const observador = new IntersectionObserver(([entrada]) => {
      senales.current.visible = entrada.isIntersecting
    }, { threshold: 0.5 })
    observador.observe(viewport)
    return () => observador.disconnect()
  }, [])

  useEffect(() => {
    if (!girando) return
    const tic = window.setInterval(() => {
      const s = senales.current
      const avanzar = debeAvanzar({
        habilitado: puedeMoverse,
        movimientoReducido,
        pausadoPorUsuario: pausado,
        visible: s.visible,
        pestanaVisible: document.visibilityState === 'visible',
        mouseEncima: s.mouseEncima,
        foco: s.foco,
        arrastrando: dragRef.current !== null,
        ultimaInteraccion: s.ultimaInteraccion,
        ahora: Date.now(),
      })
      if (avanzar) irA(siguienteIndice(indiceActual.current, total))
    }, INTERVALO_AUTOPLAY_MS)
    return () => window.clearInterval(tic)
    // irA solo depende de movimientoReducido, que ya está en la lista.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [girando, puedeMoverse, movimientoReducido, pausado, total])

  // Señales de "la persona lo está mirando o usando" sobre todo el carrusel (fotos + puntitos).
  const alrededor = {
    onPointerEnter: (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' && pausarAlPasarElMouse) senales.current.mouseEncima = true
    },
    // Si el mouse ya estaba encima antes de que React terminara de cargar, el "enter" se perdió:
    // cualquier movimiento adentro también cuenta.
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' && pausarAlPasarElMouse) senales.current.mouseEncima = true
    },
    onPointerLeave: (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse') senales.current.mouseEncima = false
    },
    // Solo el foco de teclado pausa: un clic con el mouse (por ejemplo en "Reanudar") no debe frenarlo.
    onFocus: (event: FocusEvent<HTMLDivElement>) => {
      if (event.target instanceof Element && event.target.matches(':focus-visible')) senales.current.foco = true
    },
    onBlur: (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) senales.current.foco = false
    },
  }

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (esGestoHorizontal(event.deltaX, event.deltaY)) marcarInteraccion(event)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    marcarInteraccion(event)
    if (event.pointerType !== 'mouse' || esControl(event.target)) return

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
      <div className="relative w-full overflow-hidden" {...alrededor}>
        <div
          ref={viewportRef}
          role="region"
          aria-roledescription="carrusel"
          aria-label={ariaLabel}
          aria-live={girando ? 'off' : 'polite'}
          onScroll={handleScroll}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={cn(
            'flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden bg-[#BFB4DC]/20',
            'touch-pan-x touch-pan-y select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            // Sin la "mano" por defecto: el cursor normal; la mano cerrada solo mientras se arrastra.
            dragging && 'cursor-grabbing',
            className,
          )}
        >
          {productCategories.map((slide, index) => (
            <figure
              key={slide.name}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${productCategories.length}: ${slide.name}`}
              // Solo la slide visible es interactiva: las otras no se enfocan ni se leen.
              inert={index !== activeIndex}
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

                {/* Puntitos clickeables (24 px de área, WCAG 2.5.8) + pausa si se mueve solo. */}
                <div role="group" className="mt-5 flex items-center justify-center" aria-label="Elegir categoría">
                  {productCategories.map((category, indicatorIndex) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={(event) => elegir(indicatorIndex, event)}
                      aria-label={`Ver ${category.name}`}
                      aria-current={indicatorIndex === activeIndex ? 'true' : undefined}
                      className="flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'h-2 w-2 rounded-full bg-primary transition-[opacity,transform] duration-200 ease-out',
                          indicatorIndex === activeIndex ? 'scale-100 opacity-100' : 'scale-75 opacity-30',
                        )}
                      />
                    </button>
                  ))}
                  {puedeMoverse && !movimientoReducido ? <BotonPausa pausado={pausado} onClick={alternarPausa} /> : null}
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full" {...alrededor}>
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carrusel"
        aria-label={ariaLabel}
        aria-live={girando ? 'off' : 'polite'}
        onScroll={handleScroll}
        onWheel={handleWheel}
        onPointerDown={marcarInteraccion}
        // onPointerDown={handlePointerDown}
        // onPointerMove={handlePointerMove}
        // onPointerUp={endDrag}
        // onPointerCancel={endDrag}
        className={cn(
          'flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-[32px] bg-[#BFB4DC]/20',
          '[touch-action:pan-x_pan-y] select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'shadow-[0_20px_48px_-20px_rgb(81_55_92/0.22)]',
          // Sin la "mano": acá el arrastre con mouse está desactivado, así que prometía algo que no hacía.
          className,
        )}
      >
        {carouselSlides.map((slide, index) => (
          <figure
            key={`${slide.id}-${index}`}
            role="group"
            aria-roledescription="diapositiva"
            // aria-label={`${index + 1} de ${carouselSlides.length}${slide.label ? `: ${slide.label}${slide.script ? ` ${slide.script}` : ''}` : ''}`}
            inert={index !== activeIndex}
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

      {showIndicators || puedeMoverse ? (
        <div role="group" className="mt-3 flex items-center justify-center" aria-label="Elegir foto">
          {showIndicators
            ? carouselSlides.map((slide, index) => (
                <button
                  key={slide.id ?? slide.image}
                  type="button"
                  onClick={(event) => elegir(index, event)}
                  aria-label={`Ver foto ${index + 1} de ${carouselSlides.length}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  className="flex h-6 min-w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-1.5 rounded-full bg-[#51375C] transition-[opacity,width] duration-200 ease-out',
                      index === activeIndex ? 'w-4 opacity-100' : 'w-1.5 opacity-30',
                    )}
                  />
                </button>
              ))
            : null}
          {puedeMoverse && !movimientoReducido ? <BotonPausa pausado={pausado} onClick={alternarPausa} /> : null}
        </div>
      ) : null}
    </div>
  )
}
