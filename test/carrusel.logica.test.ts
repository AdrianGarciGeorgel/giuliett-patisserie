import { describe, expect, it } from 'vitest'
import {
  DESCANSO_TRAS_INTERACCION_MS,
  INTERVALO_AUTOPLAY_MS,
  debeAvanzar,
  esGestoHorizontal,
  siguienteIndice,
  type EstadoAutoplay,
} from '@/lib/carrusel'

/**
 * Carruseles que se mueven solos (pedido de Adrián, 26-09-2026). El original de Marco nunca tuvo
 * autoplay. Reglas: avanzar cada 5 s, pero nunca si la persona pidió menos movimiento, lo pausó,
 * lo está mirando/usando o no lo está viendo. Accesibilidad: WCAG 2.2.2 (todo lo que se mueve solo
 * se tiene que poder pausar) y prefers-reduced-motion.
 */

const base: EstadoAutoplay = {
  habilitado: true,
  movimientoReducido: false,
  pausadoPorUsuario: false,
  visible: true,
  pestanaVisible: true,
  mouseEncima: false,
  foco: false,
  arrastrando: false,
  ultimaInteraccion: 0,
  ahora: 100_000,
}

describe('siguienteIndice', () => {
  it('avanza de a uno y vuelve al principio después de la última', () => {
    expect(siguienteIndice(0, 4)).toBe(1)
    expect(siguienteIndice(2, 4)).toBe(3)
    expect(siguienteIndice(3, 4)).toBe(0)
  })

  it('con una sola foto (o ninguna) se queda en 0', () => {
    expect(siguienteIndice(0, 1)).toBe(0)
    expect(siguienteIndice(0, 0)).toBe(0)
  })

  it('tolera valores raros sin romperse', () => {
    expect(siguienteIndice(Number.NaN, 4)).toBe(1)
    expect(siguienteIndice(7, 4)).toBe(0)
  })
})

describe('debeAvanzar', () => {
  it('avanza en condiciones normales', () => {
    expect(debeAvanzar(base)).toBe(true)
  })

  it.each([
    ['desactivado', { habilitado: false }],
    ['la persona pidió menos movimiento (prefers-reduced-motion)', { movimientoReducido: true }],
    ['la persona lo pausó con el botón', { pausadoPorUsuario: true }],
    ['el carrusel no está a la vista', { visible: false }],
    ['la pestaña está en segundo plano', { pestanaVisible: false }],
    ['el mouse está encima (carruseles chicos)', { mouseEncima: true }],
    ['tiene el foco del teclado', { foco: true }],
    ['la persona lo está arrastrando', { arrastrando: true }],
  ] as const)('no avanza si %s', (_motivo, cambio) => {
    expect(debeAvanzar({ ...base, ...cambio })).toBe(false)
  })

  it('después de que la persona lo toca, espera el descanso antes de seguir solo', () => {
    const tocoRecien = { ...base, ultimaInteraccion: base.ahora - DESCANSO_TRAS_INTERACCION_MS + 1 }
    const pasoElDescanso = { ...base, ultimaInteraccion: base.ahora - DESCANSO_TRAS_INTERACCION_MS }
    expect(debeAvanzar(tocoRecien)).toBe(false)
    expect(debeAvanzar(pasoElDescanso)).toBe(true)
  })

  it('los tiempos son los acordados: 5 s entre fotos, 8 s de descanso tras tocarlo', () => {
    expect(INTERVALO_AUTOPLAY_MS).toBe(5000)
    expect(DESCANSO_TRAS_INTERACCION_MS).toBe(8000)
  })
})

describe('esGestoHorizontal', () => {
  it('solo un gesto de rueda/trackpad horizontal cuenta como usar el carrusel', () => {
    expect(esGestoHorizontal(40, 5)).toBe(true)
    expect(esGestoHorizontal(5, 40)).toBe(false) // scrollear la página hacia abajo no lo pausa
    expect(esGestoHorizontal(0, 0)).toBe(false)
  })
})
