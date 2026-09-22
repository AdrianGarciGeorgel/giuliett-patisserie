import 'server-only'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { resolverUrlSitio } from '@/lib/seo'

/**
 * Foto de `public/` lista para una tarjeta Open Graph: recortada al tamaño
 * pedido y convertida a JPEG en base64. El generador de tarjetas (Satori) no
 * decodifica WebP, y todas nuestras fotos son WebP.
 *
 * Primero intenta el disco (build y desarrollo); en Vercel `public/` no viaja
 * a las funciones, así que cae a pedirla por HTTP al propio sitio.
 * Si nada funciona devuelve null y la tarjeta sale sin foto, nunca rota.
 */
export async function fotoParaTarjeta(rutaPublica: string, ancho: number, alto: number): Promise<string | null> {
  const original = (await leerDeDisco(rutaPublica)) ?? (await leerPorHttp(rutaPublica))
  if (!original) return null
  try {
    const jpeg = await sharp(original).resize(ancho, alto, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer()
    return `data:image/jpeg;base64,${jpeg.toString('base64')}`
  } catch {
    return null
  }
}

/**
 * El generador devuelve PNG, que con una foto pesa ~550 KB; WhatsApp suele no
 * previsualizar imágenes de más de ~300 KB. Se recomprime a JPEG (~80-120 KB).
 * Si algo falla, se devuelve el PNG original: mejor pesada que rota.
 */
export async function comprimirTarjeta(respuesta: Response): Promise<Response> {
  try {
    const png = Buffer.from(await respuesta.arrayBuffer())
    const jpeg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer()
    return new Response(new Uint8Array(jpeg), {
      headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' },
    })
  } catch {
    return respuesta
  }
}

async function leerDeDisco(rutaPublica: string): Promise<Buffer | null> {
  try {
    return await readFile(join(process.cwd(), 'public', rutaPublica))
  } catch {
    return null
  }
}

async function leerPorHttp(rutaPublica: string): Promise<Buffer | null> {
  try {
    const respuesta = await fetch(`${resolverUrlSitio()}${rutaPublica}`, { cache: 'force-cache' })
    if (!respuesta.ok) return null
    return Buffer.from(await respuesta.arrayBuffer())
  } catch {
    return null
  }
}
