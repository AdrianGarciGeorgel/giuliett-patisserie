import { describe, expect, it } from 'vitest'
import { BANDA_CENTRAL, bajarSegundaFoto, mostrarSegundaFoto } from '@/lib/foto-alterna'

/**
 * Catálogo de productos en el celular (pedido de Giu vía Adrián, 26-09-2026): en la compu la segunda foto aparece
 * al pasar el mouse; en el celular la foto quedaba quieta. Ahora cambia al desplazarse: la foto que pasa por el
 * medio de la pantalla muestra la segunda, con el mismo fundido que el mouse.
 */
const enElMedio = { tactil: true, movimientoReducido: false, desplazado: true, enBanda: true, cargada: true }

describe('mostrarSegundaFoto', () => {
  it('en el celular, la foto que pasa por el medio de la pantalla muestra la segunda', () => {
    expect(mostrarSegundaFoto(enElMedio)).toBe(true)
  })

  it('en la compu no: ahí la muestra el mouse, como lo diseñó Marco', () => {
    expect(mostrarSegundaFoto({ ...enElMedio, tactil: false })).toBe(false)
  })

  it('no cambia hasta que la persona empieza a desplazarse', () => {
    expect(mostrarSegundaFoto({ ...enElMedio, desplazado: false })).toBe(false)
  })

  it('fuera del medio de la pantalla vuelve a la primera', () => {
    expect(mostrarSegundaFoto({ ...enElMedio, enBanda: false })).toBe(false)
  })

  it('espera a que la segunda foto haya bajado, para no fundirse a un hueco', () => {
    expect(mostrarSegundaFoto({ ...enElMedio, cargada: false })).toBe(false)
  })

  it('con "reducir movimiento" la foto queda quieta', () => {
    expect(mostrarSegundaFoto({ ...enElMedio, movimientoReducido: true })).toBe(false)
  })
})

describe('bajarSegundaFoto', () => {
  const desplazandose = { tactil: true, movimientoReducido: false, desplazado: true, enBanda: false, vista: true, principalCargada: false }
  const alAbrir = { ...desplazandose, desplazado: false }

  it('mientras la persona se desplaza, se descarga la de cada tarjeta que aparece en pantalla, y no las otras', () => {
    expect(bajarSegundaFoto(desplazandose)).toBe(true)
    expect(bajarSegundaFoto({ ...desplazandose, vista: false })).toBe(false)
  })

  it('al abrir, solo la fila que ya está en el medio, y después de ver su foto principal', () => {
    expect(bajarSegundaFoto({ ...alAbrir, enBanda: true, principalCargada: true })).toBe(true)
    expect(bajarSegundaFoto({ ...alAbrir, enBanda: true, principalCargada: false })).toBe(false)
    expect(bajarSegundaFoto({ ...alAbrir, enBanda: false, principalCargada: true })).toBe(false)
  })

  it('en la compu y con "reducir movimiento" no se toca: queda como está', () => {
    expect(bajarSegundaFoto({ ...desplazandose, tactil: false })).toBe(false)
    expect(bajarSegundaFoto({ ...desplazandose, movimientoReducido: true })).toBe(false)
    expect(bajarSegundaFoto({ ...alAbrir, enBanda: true, principalCargada: true, tactil: false })).toBe(false)
  })
})

describe('BANDA_CENTRAL', () => {
  const [arriba, , abajo] = BANDA_CENTRAL.split(' ').map((v) => -Number.parseFloat(v))

  it('es una franja angosta: cambia más o menos una fila por vez', () => {
    const alto = 100 - arriba - abajo
    expect(alto).toBeGreaterThanOrEqual(5)
    expect(alto).toBeLessThanOrEqual(20)
  })

  it('alcanza a la primera fila al abrir y a la última al final de la página, también en los celulares altos', () => {
    // Medido en iPhone SE, 13 y 14 Pro Max y Pixel 7: la primera fila al abrir termina entre el 45 % y el 55 % del
    // alto; la última, al final de la página, empieza entre el 34 % y el 46 %.
    expect(arriba).toBeLessThan(45)
    expect(100 - abajo).toBeGreaterThan(46)
  })
})
