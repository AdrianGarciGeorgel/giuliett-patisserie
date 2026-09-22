import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CLIENTS, CONTACT, EVENTOS, REASONS } from '@/lib/giuliett'
import { PRODUCTS, PRODUCT_CATEGORY_OPTIONS } from '@/lib/products'
import { PRODUCT_CATEGORIES } from '@/types/product'

/* Punto 4 del checklist de Marco, como test: datos completos, slugs únicos,
   imágenes que existen, ningún src vacío. Así lo del manifiesto-manos no
   vuelve a pasar sin que la suite lo cante. */

const PUBLIC = join(process.cwd(), 'public')
const existe = (ruta: string) => existsSync(join(PUBLIC, ruta))

describe('catálogo de productos', () => {
  it('tiene productos', () => {
    expect(PRODUCTS.length).toBeGreaterThan(0)
  })

  it('cada slug y cada id son únicos', () => {
    const slugs = PRODUCTS.map((p) => p.slug)
    const ids = PRODUCTS.map((p) => p.id)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('cada slug es apto para URL (minúsculas, números y guiones)', () => {
    for (const p of PRODUCTS) expect(p.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  })

  it('cada producto tiene nombre, precio positivo, categoría válida y descripción', () => {
    const categorias = new Set<string>(Object.values(PRODUCT_CATEGORIES))
    for (const p of PRODUCTS) {
      expect(p.name.trim().length, p.slug).toBeGreaterThan(0)
      expect(p.price, p.slug).toBeGreaterThan(0)
      expect(categorias.has(p.category), `${p.slug}: categoría ${p.category}`).toBe(true)
      expect((p.description ?? '').trim().length, `${p.slug}: sin descripción`).toBeGreaterThan(0)
    }
  })

  it('cada categoría del catálogo tiene su etiqueta para la UI', () => {
    const conEtiqueta = new Set(PRODUCT_CATEGORY_OPTIONS.map((o) => o.value))
    for (const c of Object.values(PRODUCT_CATEGORIES)) expect(conEtiqueta.has(c), c).toBe(true)
  })

  it('ninguna imagen viene vacía y todas existen en public/', () => {
    for (const p of PRODUCTS) {
      const rutas = [p.imagePrimary, p.imageSecondary, ...(p.gallery ?? [])]
      for (const ruta of rutas) {
        expect(ruta, `${p.slug}: src vacío`).toBeTruthy()
        expect(existe(ruta), `${p.slug}: no existe ${ruta}`).toBe(true)
      }
    }
  })

  it('las imágenes son WebP (regla de performance)', () => {
    for (const p of PRODUCTS) {
      for (const ruta of [p.imagePrimary, p.imageSecondary, ...(p.gallery ?? [])]) {
        expect(ruta, p.slug).toMatch(/\.webp$/)
      }
    }
  })
})

describe('datos de contacto oficiales (brochure B2B)', () => {
  it('teléfono, email e Instagram son los del brochure', () => {
    expect(CONTACT.phoneRaw).toBe('5492617137765')
    expect(CONTACT.email).toBe('hola@giuliettpatisserie.com')
    expect(CONTACT.instagramHandle).toBe('@giuliettpatisserie')
  })
})

describe('catálogo de eventos, clientes y razones', () => {
  it('cada foto de eventos existe y tiene alt', () => {
    for (const [grupo, fotos] of Object.entries(EVENTOS)) {
      expect(fotos.length, grupo).toBeGreaterThan(0)
      for (const foto of fotos) {
        expect(existe(foto.src), `${grupo}: no existe ${foto.src}`).toBe(true)
        expect(foto.alt.trim().length, `${grupo}: alt vacío en ${foto.src}`).toBeGreaterThan(0)
      }
    }
  })

  it('los logos de clientes y las imágenes de razones existen', () => {
    for (const c of CLIENTS) expect(existe(c.Image), c.id).toBe(true)
    for (const r of REASONS) expect(existe(r.Image), r.id).toBe(true)
  })
})
