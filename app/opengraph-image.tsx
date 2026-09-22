import { ImageResponse } from 'next/og'
import { comprimirTarjeta, fotoParaTarjeta } from '@/lib/og'

/* Tarjeta 1200×630 de la marca, para todas las páginas que no son un producto.
   Se genera en el build como JPEG liviano. Aubergine de fondo, Warm White en el
   texto, Peach y Lilac como acentos, con la foto de la mesa dulce a la derecha. */

export const alt = 'Giuliett Pâtisserie · Pastelería francesa en Mendoza'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/jpeg'

export default async function Image() {
  const foto = await fotoParaTarjeta('/images/cierre-mesa-dulce.webp', 540, 630)

  return comprimirTarjeta(
    new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#51375C', color: '#FFF8E9' }}>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: '64px 72px' }}>
          <div style={{ fontSize: 26, letterSpacing: 6, textTransform: 'uppercase', color: '#BFB4DC' }}>Depuis 2018 · Mendoza</div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.02, marginTop: 18 }}>Giuliett Pâtisserie</div>
          <div style={{ fontSize: 34, marginTop: 24, color: '#E1B0AC' }}>Pastelería francesa artesanal</div>
          <div style={{ fontSize: 26, marginTop: 'auto', color: '#BFB4DC' }}>Tortas · Macarons · Galletas con tu marca · Mesas dulces</div>
        </div>
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} width={540} height={630} alt="" style={{ width: 540, height: 630, objectFit: 'cover' }} />
        ) : null}
      </div>
      ),
      { ...size },
    ),
  )
}
