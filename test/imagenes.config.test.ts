import { describe, expect, it } from 'vitest'
import configNext from '../next.config.mjs'

/**
 * Decisión de Adrián (26-09-2026): las fotos se sirven como los archivos ORIGINALES de Marco, tal cual,
 * sin redimensionar ni recomprimir — igual que en su versión (images.unoptimized: true).
 *
 * Contexto: la Fase A las había pasado a WebP q82 y Next las volvía a comprimir al servir; se veían
 * empastadas. Se evaluó servirlas redimensionadas a calidad 100 (casi idénticas y mucho más livianas)
 * y se eligió igual la fidelidad total, sabiendo que la web pesa más en celulares.
 * Si esto cambia, que sea una decisión explícita: este test lo hace visible.
 */
describe('next.config: fotos originales de Marco, sin procesar', () => {
  it('images.unoptimized está activo', () => {
    expect(configNext.images?.unoptimized).toBe(true)
  })

  it('las fotos no se empaquetan dentro de las funciones del servidor (límite de 12 funciones en Hobby)', () => {
    expect(configNext.outputFileTracingExcludes?.['*']).toContain('public/**/*')
  })
})
