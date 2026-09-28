'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { BANDA_CENTRAL, bajarSegundaFoto, mostrarSegundaFoto } from '@/lib/foto-alterna'
import { formatearPrecio } from '@/lib/precio'
import { PRODUCT_CATEGORY_OPTIONS, isProductCategory } from '@/lib/products'
import { cn } from '@/lib/utils'
import type { Product, ProductCategory } from '@/types/product'
import { SectionLockup } from './section-lockup'
import { ChefHat } from 'lucide-react'

/** Una media query como estado de React (se actualiza si cambia). En el servidor, siempre `false`. */
function useCoincideMedia(consulta: string) {
  return useSyncExternalStore(
    (avisar) => {
      const media = window.matchMedia(consulta)
      media.addEventListener('change', avisar)
      return () => media.removeEventListener('change', avisar)
    },
    () => window.matchMedia(consulta).matches,
    () => false,
  )
}

/** Suma o saca un id de un conjunto, devolviendo el mismo conjunto si no cambió (así no se vuelve a pintar). */
function conId(conjunto: ReadonlySet<string>, id: string, dentro: boolean): ReadonlySet<string> {
  if (conjunto.has(id) === dentro) return conjunto
  const nuevo = new Set(conjunto)
  if (dentro) nuevo.add(id)
  else nuevo.delete(id)
  return nuevo
}


type ProductCatalogProps = {
  initialCategory: ProductCategory
  /** Los productos vienen de la página (lib/catalogo): el componente no sabe de dónde salen. */
  productos: Product[]
}


export function ProductCatalog({ initialCategory, productos }: ProductCatalogProps) {
  // La URL manda: así el botón Volver y el "Atrás" del navegador muestran siempre la categoría
  // que dice la barra de direcciones. Antes vivía en un useState y al volver quedaba desfasada.
  const categoriaUrl = useSearchParams().get('categoria')
  const selectedCategory: ProductCategory = isProductCategory(categoriaUrl) ? categoriaUrl : initialCategory
  const products = productos.filter((product) => product.category === selectedCategory)
  const selectedCategoryLabel = PRODUCT_CATEGORY_OPTIONS.find((category) => category.value === selectedCategory)?.label

  // En el celular no hay mouse: la foto que pasa por el medio de la pantalla muestra la segunda (lib/foto-alterna).
  const tactil = useCoincideMedia('(hover: none)')
  const movimientoReducido = useCoincideMedia('(prefers-reduced-motion: reduce)')
  const conFotoAlterna = tactil && !movimientoReducido
  const [desplazado, setDesplazado] = useState(false)
  const [vistas, setVistas] = useState<ReadonlySet<string>>(() => new Set())
  const [enBanda, setEnBanda] = useState<ReadonlySet<string>>(() => new Set())
  const [cargadas, setCargadas] = useState<ReadonlySet<string>>(() => new Set())
  const [principales, setPrincipales] = useState<ReadonlySet<string>>(() => new Set())
  // La foto de cada tarjeta → el id de su producto, para los observadores.
  const fotos = useRef(new Map<Element, string>())

  useEffect(() => {
    if (!conFotoAlterna) return
    // Desplazarse o deslizar el dedo (si la categoría entra entera en la pantalla, no hay nada que desplazar).
    const alDesplazar = () => setDesplazado(true)
    window.addEventListener('scroll', alDesplazar, { passive: true, once: true })
    window.addEventListener('touchmove', alDesplazar, { passive: true, once: true })
    const seguir = (actualizar: (id: string, dentro: boolean) => void) => (entradas: IntersectionObserverEntry[]) => {
      for (const entrada of entradas) {
        const id = fotos.current.get(entrada.target)
        if (id) actualizar(id, entrada.isIntersecting)
      }
    }
    // Aparece en pantalla: se descarga su segunda foto (una sola vez).
    const enPantalla = new IntersectionObserver(seguir((id, dentro) => { if (dentro) setVistas((antes) => conId(antes, id, true)) }))
    // Pasa por el medio: muestra la segunda foto; al salir, vuelve a la primera.
    const enElMedio = new IntersectionObserver(seguir((id, dentro) => setEnBanda((antes) => conId(antes, id, dentro))), {
      rootMargin: BANDA_CENTRAL,
    })
    for (const [foto, id] of fotos.current) {
      enPantalla.observe(foto)
      enElMedio.observe(foto)
      // Fotos que terminaron de bajar antes de que la página se activara: su onLoad ya pasó.
      const [principal, segunda] = foto.querySelectorAll('img')
      if (principal?.complete && principal.naturalWidth > 0) setPrincipales((antes) => conId(antes, id, true))
      if (segunda?.complete && segunda.naturalWidth > 0) setCargadas((antes) => conId(antes, id, true))
    }
    return () => {
      window.removeEventListener('scroll', alDesplazar)
      window.removeEventListener('touchmove', alDesplazar)
      enPantalla.disconnect()
      enElMedio.disconnect()
    }
  }, [conFotoAlterna, selectedCategory])

  return (
    <div>
      <style jsx>{`
        @keyframes product-card-chef-halo {
          0%, 100% { opacity: 0.26; }
          50% { opacity: 0.48; }
        }

        .product-card-chef-indicator::before {
          position: absolute;
          inset: -10px;
          z-index: -1;
          border-radius: 9999px;
          background: #bfb4dc;
          content: '';
          filter: blur(9px);
          animation: product-card-chef-halo 3.5s ease-in-out infinite;
        }

        @media (min-width: 768px) {
          .product-card-chef-indicator::before {
            opacity: 0;
            animation: none;
            transition: opacity 250ms ease-out;
          }

          .group:hover .product-card-chef-indicator::before {
            animation: product-card-chef-halo 3.5s ease-in-out infinite;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-card-chef-indicator::before {
            animation: none;
            opacity: 0.28;
          }
        }

        @media (min-width: 768px) and (prefers-reduced-motion: reduce) {
          .product-card-chef-indicator::before {
            opacity: 0;
          }

          .group:hover .product-card-chef-indicator::before {
            opacity: 0.28;
          }
        }
          .light {
         
          z-index: 1;
          transition: color 0.5s ease;
        }

        .light::before {
          content: "";
          position: absolute;
          inset: -8px;
          border: 1px solid rgba(191, 180, 220, 0.55);
          border-radius: 50%;
          pointer-events: none;
          z-index: -1;

          box-shadow:
            0 0 8px rgba(191, 180, 220, 0.35),
            0 0 18px rgba(191, 180, 220, 0.18);

          animation: lightGlow 3.5s ease-in-out infinite;
        }

        @keyframes lightGlow {
          0%,
          100% {
            opacity: 0.35;
            box-shadow:
              0 0 6px rgba(191, 180, 220, 0.25),
              0 0 14px rgba(191, 180, 220, 0.12);
          }

          50% {
            opacity: 0.9;
            box-shadow:
              0 0 9px rgba(191, 180, 220, 0.45),
              0 0 22px rgba(191, 180, 220, 0.22);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .light::before {
            animation: none;
            opacity: 0.6;
          }
        }
      `}</style>
      <SectionLockup caps={selectedCategoryLabel ?? ''} size="lg" />
      <div className="flex justify-center md:justify-end">
        <label className="sr-only" htmlFor="product-category">
          Categoría de productos
        </label>
        <select
          id="product-category"
          value={selectedCategory}
          onChange={(event) => {
            // Next sincroniza useSearchParams con replaceState: sin recarga ni viaje al servidor.
            window.history.replaceState(null, '', `/productos?categoria=${event.target.value}`)
          }}
          className="min-h-[46px] border-b border-primary/40 bg-transparent px-1 pr-9 text-[14px] text-primary outline-none transition-colors duration-200 focus-visible:border-primary"
        >
          {PRODUCT_CATEGORY_OPTIONS.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:mt-14 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4 lg:gap-x-10">
        {products.map((product) => {
          const segunda = mostrarSegundaFoto({
            tactil,
            movimientoReducido,
            desplazado,
            enBanda: enBanda.has(product.id),
            cargada: cargadas.has(product.id),
          })
          const bajar = bajarSegundaFoto({
            tactil,
            movimientoReducido,
            desplazado,
            enBanda: enBanda.has(product.id),
            vista: vistas.has(product.id),
            principalCargada: principales.has(product.id),
          })
          return (
          <li key={product.id}>
            <Link href={`/productos/${product.slug}?categoria=${selectedCategory}`} className="group block min-w-0" aria-label={`Ver ${product.name}`}>
              <div
                ref={(foto) => {
                  if (!foto) return
                  fotos.current.set(foto, product.id)
                  return () => {
                    fotos.current.delete(foto)
                  }
                }}
                className="relative aspect-[4/5] overflow-hidden rounded-md bg-lilac-soft"
              >
                <Image
                  src={product.imagePrimary}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 260px, (min-width: 768px) 30vw, 46vw"
                  onLoad={conFotoAlterna ? () => setPrincipales((antes) => conId(antes, product.id, true)) : undefined}
                  className={cn('object-cover transition-opacity duration-[250ms] ease-out md:group-hover:opacity-0', segunda && 'opacity-0')}
                />
                <Image
                  src={product.imageSecondary}
                  alt=""
                  fill
                  aria-hidden="true"
                  sizes="(min-width: 1024px) 260px, (min-width: 768px) 30vw, 46vw"
                  onLoad={conFotoAlterna ? () => setCargadas((antes) => conId(antes, product.id, true)) : undefined}
                  className={cn(
                    'hidden object-cover opacity-0 transition-opacity duration-[250ms] ease-out md:block md:group-hover:opacity-100',
                    bajar && 'block',
                    segunda && 'opacity-100',
                  )}
                />
                <span aria-hidden="true" className="product-card-chef-indicator  pointer-events-none absolute bottom-3 left-1/2 z-0 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-background/78 text-primary/75 backdrop-blur-sm md:transition-colors md:duration-200 md:ease-out md:group-hover:text-[#BFB4DC]">
                  <ChefHat className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                <h2 className="text-[14px] font-medium leading-snug text-primary md:text-[15px]">{product.name}</h2>
                {product.price ? <p className="text-[13px] text-muted-foreground">{formatearPrecio(product.price)}</p> : null}
              </div>
            </Link>
          </li>
          )
        })}
      </ul>
    </div>
  )
}
