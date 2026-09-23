'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PRODUCT_CATEGORY_OPTIONS, isProductCategory } from '@/lib/products'
import type { Product, ProductCategory } from '@/types/product'
import { SectionLockup } from './section-lockup'
import { ChefHat } from 'lucide-react'


type ProductCatalogProps = {
  initialCategory: ProductCategory
  /** Los productos vienen de la página (lib/catalogo): el componente no sabe de dónde salen. */
  productos: Product[]
}

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export function ProductCatalog({ initialCategory, productos }: ProductCatalogProps) {
  // La URL manda: así el botón Volver y el "Atrás" del navegador muestran siempre la categoría
  // que dice la barra de direcciones. Antes vivía en un useState y al volver quedaba desfasada.
  const categoriaUrl = useSearchParams().get('categoria')
  const selectedCategory: ProductCategory = isProductCategory(categoriaUrl) ? categoriaUrl : initialCategory
  const products = productos.filter((product) => product.category === selectedCategory)
  const selectedCategoryLabel = PRODUCT_CATEGORY_OPTIONS.find((category) => category.value === selectedCategory)?.label

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
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/productos/${product.slug}?categoria=${selectedCategory}`} className="group block min-w-0" aria-label={`Ver ${product.name}`}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-lilac-soft">
                <Image
                  src={product.imagePrimary}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 260px, (min-width: 768px) 30vw, 46vw"
                  className="object-cover transition-opacity duration-[250ms] ease-out md:group-hover:opacity-0"
                />
                <Image
                  src={product.imageSecondary}
                  alt=""
                  fill
                  aria-hidden="true"
                  sizes="(min-width: 1024px) 260px, (min-width: 768px) 30vw, 46vw"
                  className="hidden object-cover opacity-0 transition-opacity duration-[250ms] ease-out md:block md:group-hover:opacity-100"
                />
                <span aria-hidden="true" className="product-card-chef-indicator  pointer-events-none absolute bottom-3 left-1/2 z-0 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-background/78 text-primary/75 backdrop-blur-sm md:transition-colors md:duration-200 md:ease-out md:group-hover:text-[#BFB4DC]">
                  <ChefHat className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                <h2 className="text-[14px] font-medium leading-snug text-primary md:text-[15px]">{product.name}</h2>
                <p className="text-[13px] text-muted-foreground">{priceFormatter.format(product.price)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
