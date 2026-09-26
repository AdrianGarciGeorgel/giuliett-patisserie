import { describe, expect, it } from 'vitest'
import {
  DESCANSO_TRAS_INTERACCION_MS,
  INTERVALO_AUTOPLAY_MS,
  anteriorIndice,
  debeAvanzar,
  esGestoHorizontal,
  siguienteIndice,
  type EstadoAutoplay,
} from '@/lib/carrusel'

/**
 * Carrusel de la home (pedido de Adrián del 26-09-2026, página por página): las fotos avanzan solas,
 * sin botón de pausa, y en la computadora un clic en el costado avanza o retrocede. Nada se mueve si
 * la persona pidió menos movimiento (prefers-reduced-motion).
 */

const base: EstadoAutoplay = {
  habilitado: true,
  movimientoReducido: false,
  visible: true,
  pestanaVisible: true,
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

describe('anteriorIndice', () => {
  it('retrocede de a uno y desde la primera va a la última', () => {
    expect(anteriorIndice(2, 4)).toBe(1)
    expect(anteriorIndice(1, 4)).toBe(0)
    expect(anteriorIndice(0, 4)).toBe(3)
  })

  it('con una sola foto (o ninguna) se queda en 0 y tolera valores raros', () => {
    expect(anteriorIndice(0, 1)).toBe(0)
    expect(anteriorIndice(0, 0)).toBe(0)
    expect(anteriorIndice(Number.NaN, 4)).toBe(3)
    expect(anteriorIndice(9, 4)).toBe(0)
  })
})

describe('debeAvanzar', () => {
  it('avanza en condiciones normales', () => {
    expect(debeAvanzar(base)).toBe(true)
  })

  it.each([
    ['desactivado', { habilitado: false }],
    ['la persona pidió menos movimiento (prefers-reduced-motion)', { movimientoReducido: true }],
    ['el carrusel no está a la vista', { visible: false }],
    ['la pestaña está en segundo plano', { pestanaVisible: false }],
    ['tiene el foco del teclado', { foco: true }],
    ['la persona lo está arrastrando', { arrastrando: true }],
  ] as const)('no avanza si %s', (_motivo, cambio) => {
    expect(debeAvanzar({ ...base, ...cambio })).toBe(false)
  })

  it('después de que la persona lo toca o hace clic en un costado, espera el descanso antes de seguir solo', () => {
    const tocoRecien = { ...base, ultimaInteraccion: base.ahora - DESCANSO_TRAS_INTERACCION_MS + 1 }
    const pasoElDescanso = { ...base, ultimaInteraccion: base.ahora - DESCANSO_TRAS_INTERACCION_MS }
    expect(debeAvanzar(tocoRecien)).toBe(false)
    expect(debeAvanzar(pasoElDescanso)).toBe(true)
  })

  it('los tiempos: 5 s entre fotos, 8 s de descanso después de que la persona lo usa', () => {
    expect(INTERVALO_AUTOPLAY_MS).toBe(5000)
    expect(DESCANSO_TRAS_INTERACCION_MS).toBe(8000)
  })
})

describe('esGestoHorizontal', () => {
  it('solo un gesto de rueda o trackpad horizontal cuenta como usar el carrusel', () => {
    expect(esGestoHorizontal(40, 5)).toBe(true)
    expect(esGestoHorizontal(5, 40)).toBe(false) // bajar por la página no lo frena
    expect(esGestoHorizontal(0, 0)).toBe(false)
  })
})
