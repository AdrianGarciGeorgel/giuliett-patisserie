'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type ProductGalleryProps = {
  name: string
  images: string[]
}

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div>
      <div
        aria-label={`Galería de ${name}`}
        onScroll={(event) => {
          const viewport = event.currentTarget
          setActiveIndex(Math.round(viewport.scrollLeft / viewport.clientWidth))
        }}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-lg bg-lilac-soft [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <figure key={image} className="relative min-w-full snap-center aspect-[4/5]">
            <Image
              src={image}
              alt={`${name}, vista ${index + 1}`}
              fill
              priority={index === 0}
              sizes="calc(100vw - 40px)"
              className="object-cover"
            />
          </figure>
        ))}
      </div>

      <div role="group" className="mt-4 flex justify-center gap-1.5 md:hidden" aria-label={`Foto ${activeIndex + 1} de ${images.length}`}>
        {images.map((image, index) => (
          <span
            key={image}
            aria-hidden="true"
            className={cn(
              'h-1.5 rounded-full bg-primary transition-[opacity,width] duration-200 ease-out',
              activeIndex === index ? 'w-4 opacity-100' : 'w-1.5 opacity-30',
            )}
          />
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_112px] md:gap-4 lg:grid-cols-[minmax(0,1fr)_132px] lg:gap-5">
        <figure className="relative aspect-[4/5] overflow-hidden rounded-lg bg-lilac-soft">
          <Image
            src={images[activeIndex]}
            alt={`${name}, vista ${activeIndex + 1}`}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 58vw"
            className="object-cover"
          />
        </figure>
        <div className="flex flex-col gap-3 lg:gap-4">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver foto ${index + 1} de ${name}`}
              aria-pressed={activeIndex === index}
              className={cn(
                'relative aspect-square overflow-hidden rounded-md bg-lilac-soft transition-opacity duration-200',
                activeIndex === index ? 'opacity-100' : 'opacity-55 hover:opacity-80',
              )}
            >
              <Image src={image} alt="" fill aria-hidden="true" sizes="132px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
