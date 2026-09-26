import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Las fotos del sitio son las ORIGINALES de Marco, tal cual las envió (decisión de Adrián,
 * 26-09-2026: "la calidad tiene que ser la misma que nos pasó Marco, no la bajes"). Este test
 * vigila que cada /images/... del código exista con el nombre EXACTO: Windows no distingue
 * mayúsculas y Vercel sí, así que un error de mayúsculas acá pasa desapercibido y allá es un 404.
 */

const listar = (d: string): string[] =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? listar(join(d, e.name)) : [join(d, e.name)]))

const archivosPublicos = new Set(listar('public/images').map((f) => '/' + relative('public', f).split(sep).join('/')))
const codigo = ['app', 'components', 'lib'].flatMap(listar).filter((f) => /\.(ts|tsx)$/.test(f))
const patron = /\/images\/[^"'`\n]+?\.(?:webp|png|jpe?g|svg|gif|avif)/g

describe('referencias a /images en el código', () => {
  const referencias = codigo.flatMap((archivo) => [...readFileSync(archivo, 'utf8').matchAll(patron)].map((m) => ({ ref: m[0], archivo })))

  it('hay referencias para revisar', () => {
    expect(referencias.length).toBeGreaterThan(50)
  })

  it('cada una existe en public/ con el nombre exacto (mayúsculas incluidas)', () => {
    const rotas = referencias.filter(({ ref }) => !archivosPublicos.has(ref)).map(({ ref, archivo }) => `${ref} (${archivo})`)
    expect(rotas).toEqual([])
  })
})
