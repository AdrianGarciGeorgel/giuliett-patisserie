import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getCategorias, getEventos, getProductoPorSlug, getProductos, getProductosPorCategoria } from '@/lib/catalogo'
import { EVENTOS } from '@/lib/giuliett'
import { PRODUCTS } from '@/lib/products'
import { PRODUCT_CATEGORIES } from '@/types/product'

/* Fase D (punto 11 del checklist): la única puerta a los datos del catálogo es
   lib/catalogo.ts. Hoy lee los arrays estáticos; mañana, Supabase. Las páginas
   y componentes no deben saber cuál de las dos. */

describe('lib/catalogo — capa de acceso a datos', () => {
  it('getProductos devuelve el catálogo completo, en el mismo orden', async () => {
    const productos = await getProductos()
    expect(productos.map((p) => p.slug)).toEqual(PRODUCTS.map((p) => p.slug))
  })

  it('getProductoPorSlug encuentra un producto y devuelve null si no existe', async () => {
    expect((await getProductoPorSlug('marquise'))?.name).toBe('Marquise')
    expect(await getProductoPorSlug('no-existe')).toBeNull()
    expect(await getProductoPorSlug('')).toBeNull()
  })

  it('getProductosPorCategoria filtra y no deja categorías vacías en el catálogo actual', async () => {
    for (const categoria of Object.values(PRODUCT_CATEGORIES)) {
      const lista = await getProductosPorCategoria(categoria)
      expect(lista.length, categoria).toBeGreaterThan(0)
      expect(lista.every((p) => p.category === categoria)).toBe(true)
    }
  })

  it('getCategorias devuelve las 4 categorías con etiqueta', () => {
    const categorias = getCategorias()
    expect(categorias.map((c) => c.value).sort()).toEqual(Object.values(PRODUCT_CATEGORIES).sort())
    for (const c of categorias) expect(c.label.length).toBeGreaterThan(0)
  })

  it('getEventos devuelve bodas, empresas y celebraciones con sus fotos', async () => {
    const eventos = await getEventos()
    expect(Object.keys(eventos).sort()).toEqual(Object.keys(EVENTOS).sort())
    expect(eventos.bodas.length).toBe(EVENTOS.bodas.length)
  })
})

describe('regla: nadie fuera de lib/ lee PRODUCTS ni EVENTOS directo', () => {
  const RAIZ = process.cwd()
  const archivos: string[] = []
  const recorrer = (dir: string) => {
    for (const nombre of readdirSync(dir)) {
      const ruta = join(dir, nombre)
      if (statSync(ruta).isDirectory()) recorrer(ruta)
      else if (/\.(ts|tsx)$/.test(nombre)) archivos.push(ruta)
    }
  }
  recorrer(join(RAIZ, 'app'))
  recorrer(join(RAIZ, 'components'))

  it('ningún archivo de app/ o components/ importa PRODUCTS, getProductBySlug ni EVENTOS', () => {
    const violaciones: string[] = []
    for (const ruta of archivos) {
      const texto = readFileSync(ruta, 'utf8')
      const importaProducts = /import\s*\{[^}]*\b(PRODUCTS|getProductBySlug)\b[^}]*\}\s*from\s*'@\/lib\/products'/.test(texto)
      const importaEventos = /import\s*\{[^}]*\bEVENTOS\b[^}]*\}\s*from\s*'@\/lib\/giuliett'/.test(texto)
      if (importaProducts || importaEventos) violaciones.push(ruta.replace(RAIZ, '').replace(/\\/g, '/'))
    }
    expect(violaciones, `Estos archivos tienen que pasar por lib/catalogo.ts: ${violaciones.join(', ')}`).toEqual([])
  })
})
