// @vitest-environment node
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

/**
 * Checklist de Marco, punto 7 (performance): ninguna imagen se descarga "porque sí".
 *
 * Hallazgo del 26-09-2026 con PageSpeed Insights sobre el dominio: cada página bajaba ~450 KB de
 * imágenes de /contacto (torre, camión, alfajores, giu y 4 logos). Eran <img> comunes sin
 * loading="lazy": React 19 les genera una pista de precarga (":HL[…,\"image\"]") y Next, al
 * pre-cargar /contacto desde el menú, la ejecuta en la página actual. Competían por la red con la
 * foto del hero (LCP móvil 4,4 s).
 *
 * Regla: toda <img> de una página pública es diferida (loading="lazy") o prioritaria a propósito
 * (fetchpriority="high", la foto principal). next/image ya cumple sola; esto cuida los <img> a mano.
 */

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useRouter: () => ({ push: () => {}, replace: () => {}, prefetch: () => {}, back: () => {} }),
  notFound: () => {
    throw new Error('notFound')
  },
}))

import Home from '@/app/page'
import ContactoPage from '@/app/contacto/page'
import EventosPage from '@/app/eventos/page'
import GaleriaPage from '@/app/galeria/page'
import GiuPage from '@/app/giu/page'
import ProductosPage from '@/app/productos/page'
import ProductPage from '@/app/productos/[slug]/page'

const paginas: Array<[string, () => ReactElement | Promise<ReactElement>]> = [
  ['/', () => Home()],
  ['/productos', () => ProductosPage({ searchParams: Promise.resolve({}) })],
  ['/productos/marquise', () => ProductPage({ params: Promise.resolve({ slug: 'marquise' }) })],
  ['/eventos', () => EventosPage()],
  ['/giu', () => GiuPage()],
  ['/galeria', () => GaleriaPage()],
  ['/contacto', () => ContactoPage()],
]

const etiquetas = (html: string) => [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])
const src = (tag: string) => tag.match(/\bsrc="([^"]+)"/)?.[1] ?? tag.slice(0, 80)
const esDiferida = (tag: string) => /\bloading="lazy"/.test(tag)

/** Regla A: los <img> hechos a mano (sin next/image) van diferidos. */
function imgManualesSinDiferir(html: string) {
  return etiquetas(html)
    .filter((tag) => !/\bdata-nimg=/.test(tag) && !esDiferida(tag) && !/\bfetchpriority="high"/i.test(tag))
    .map(src)
}

/** Regla B: next/image con `priority` se precarga; eso se reserva para la foto principal (una por página). */
function fotosPrecargadas(html: string) {
  return [...new Set(etiquetas(html).filter((tag) => /\bdata-nimg=/.test(tag) && !esDiferida(tag)).map(src))]
}

describe('imágenes: diferidas o prioritarias a propósito', () => {
  it.each(paginas)('%s: ningún <img> a mano se descarga de entrada', async (_ruta, render) => {
    const html = renderToStaticMarkup(await render())
    expect(imgManualesSinDiferir(html)).toEqual([])
  })

  it.each(paginas)('%s: precarga como máximo una foto (la principal)', async (_ruta, render) => {
    const html = renderToStaticMarkup(await render())
    const precargadas = fotosPrecargadas(html)
    expect(precargadas.length, `precargadas: ${JSON.stringify(precargadas)}`).toBeLessThanOrEqual(1)
  })

  it('las reglas distinguen cada caso', () => {
    expect(imgManualesSinDiferir('<img src="/images/torre.webp" alt="">')).toEqual(['/images/torre.webp'])
    expect(imgManualesSinDiferir('<img src="/a.webp" loading="lazy" alt="">')).toEqual([])
    expect(imgManualesSinDiferir('<img src="/hero.webp" fetchPriority="high" alt="">')).toEqual([])
    expect(fotosPrecargadas('<img data-nimg="fill" src="/a.webp"><img data-nimg="fill" src="/a.webp">')).toEqual(['/a.webp'])
    expect(fotosPrecargadas('<img data-nimg="fill" src="/a.webp"><img data-nimg="1" loading="lazy" src="/b.webp">')).toEqual(['/a.webp'])
  })
})
