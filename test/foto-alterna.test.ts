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
  const enPantalla = { tactil: true, movimientoReducido: false, desplazado: true, vista: true }

  it('en el celular, la segunda foto se descarga cuando su tarjeta está en pantalla', () => {
    expect(bajarSegundaFoto(enPantalla)).toBe(true)
    expect(bajarSegundaFoto({ ...enPantalla, vista: false })).toBe(false)
  })

  it('al abrir la página no se descarga nada extra: recién cuando la persona se desplaza', () => {
    expect(bajarSegundaFoto({ ...enPantalla, desplazado: false })).toBe(false)
  })

  it('en la compu y con "reducir movimiento" no se toca: queda como está', () => {
    expect(bajarSegundaFoto({ ...enPantalla, tactil: false })).toBe(false)
    expect(bajarSegundaFoto({ ...enPantalla, movimientoReducido: true })).toBe(false)
  })
})

describe('BANDA_CENTRAL', () => {
  it('es una franja angosta justo en el medio de la pantalla: cambia más o menos una fila por vez', () => {
    const [arriba, , abajo] = BANDA_CENTRAL.split(' ').map((v) => Number.parseFloat(v))
    expect(arriba).toBe(abajo)
    const alto = 100 + arriba + abajo
    expect(alto).toBeGreaterThanOrEqual(5)
    expect(alto).toBeLessThanOrEqual(20)
  })
})
