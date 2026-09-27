// @vitest-environment node
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ContactForm } from '@/components/giuliett/contact-form'

/**
 * "Hacé tu pedido" tiene que verse igual al de Marco (regla 8). Los arreglos del 26-09-2026 solo suman atributos
 * que no se ven: `aria-required` en los cuatro campos con asterisco y el teclado de email en el celular.
 * Referencia: el HTML que generaba el formulario de Marco antes de los arreglos (fixtures/contacto-formulario-marco.html).
 */
const html = renderToStaticMarkup(<ContactForm />)
const marco = readFileSync(new URL('./fixtures/contacto-formulario-marco.html', import.meta.url), 'utf8').trim()
const sinLoAgregado = (h: string) => h.replace(/ aria-required="true"| inputMode="email"| autoCapitalize="none"/g, '')

describe('formulario "Hacé tu pedido"', () => {
  it('se ve igual al de Marco: mismo HTML, salvo los atributos invisibles agregados', () => {
    expect(sinLoAgregado(html)).toBe(marco)
  })

  it('los cuatro campos con asterisco les avisan a los lectores de pantalla que son obligatorios', () => {
    const obligatorios = [...html.matchAll(/<(?:input|select)\b[^>]*aria-required="true"[^>]*>/g)].map((m) => m[0])
    expect(obligatorios.map((c) => c.match(/autoComplete="([^"]+)"/)?.[1] ?? c.slice(1, 7))).toEqual(['name', 'email', 'tel', 'select'])
  })

  it('el email abre el teclado de email en el celular y no pone mayúscula al principio', () => {
    const email = html.match(/<input\b[^>]*autoComplete="email"[^>]*>/)?.[0] ?? ''
    expect(email).toMatch(/inputMode="email"/)
    expect(email).toMatch(/autoCapitalize="none"/)
  })
})
