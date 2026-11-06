// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { IMAGEN_COMPARTIR_HOME, metadataPagina } from '@/lib/seo'

/**
 * La imagen que aparece al compartir el link de la home (WhatsApp, redes). Giu pidió cambiar la tarjeta
 * generada por una que hizo Marco: él la subió a su repo el 6-11-2026 apuntando al dominio, pero el dominio
 * sale del Vercel de Adrián y ahí no existía (404). Acá se fija que la home la use y que el archivo esté.
 */

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useRouter: () => ({ push: () => {}, replace: () => {}, prefetch: () => {}, back: () => {} }),
}))

import { metadata as metadataHome } from '@/app/page'

type ImagenOg = { url: string; width: number; height: number; alt: string }
const primeraImagen = (m: { openGraph?: unknown }) => (m.openGraph as { images: ImagenOg[] }).images[0]

/** Ancho y alto reales de un JPEG (marcador SOF0/SOF2). */
function medidasJpeg(datos: Buffer): { ancho: number; alto: number } {
  let i = 2
  while (i < datos.length) {
    const marcador = datos[i + 1]
    const largo = datos.readUInt16BE(i + 2)
    if (marcador === 0xc0 || marcador === 0xc2) return { alto: datos.readUInt16BE(i + 5), ancho: datos.readUInt16BE(i + 7) }
    i += 2 + largo
  }
  throw new Error('No es un JPEG con medidas')
}

const BASE = 'https://giuliett.example'

describe('imagen para compartir', () => {
  it('la home usa la imagen de Marco, con sus medidas', () => {
    const imagen = primeraImagen(metadataHome)
    expect(imagen.url.endsWith('/images/giuliett-og-2026.jpg')).toBe(true)
    expect(imagen.width).toBe(1600)
    expect(imagen.height).toBe(900)
  })

  it('el archivo está en public y mide lo que dice la metadata', () => {
    const datos = readFileSync(join(process.cwd(), 'public', IMAGEN_COMPARTIR_HOME.ruta))
    expect(medidasJpeg(datos)).toEqual({ ancho: IMAGEN_COMPARTIR_HOME.ancho, alto: IMAGEN_COMPARTIR_HOME.alto })
    // WhatsApp descarta las imágenes muy pesadas para la vista previa (la referencia habitual es 300 KB).
    expect(datos.length).toBeLessThan(300 * 1024)
  })

  it('con imagen propia, la URL es absoluta al dominio', () => {
    const meta = metadataPagina({ titulo: 'Inicio', ruta: '/', descripcion: 'x', base: BASE, imagen: IMAGEN_COMPARTIR_HOME })
    expect(primeraImagen(meta)).toMatchObject({ url: `${BASE}/images/giuliett-og-2026.jpg`, width: 1600, height: 900 })
  })

  it('las demás páginas siguen con la tarjeta generada de 1200×630', () => {
    const meta = metadataPagina({ titulo: 'Eventos', ruta: '/eventos', descripcion: 'x', base: BASE })
    expect(primeraImagen(meta)).toMatchObject({ url: `${BASE}/opengraph-image`, width: 1200, height: 630 })
  })
})
