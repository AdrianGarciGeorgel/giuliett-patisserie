import { z } from 'zod'
import { crearClienteAdmin } from '@/lib/supabase/admin'

/* POST /api/consultas/:id/whatsapp — marca que el usuario sí abrió WhatsApp.
   Sirve para saber cuántas consultas guardadas siguieron la charla. Es lo
   único que se puede tocar sin sesión, y solo sabiendo el uuid. */

export async function POST(_request: Request, contexto: { params: Promise<{ id: string }> }) {
  const { id } = await contexto.params
  if (!z.uuid().safeParse(id).success) {
    return new Response(null, { status: 400 })
  }

  try {
    const supabase = crearClienteAdmin()
    await supabase.from('consultas').update({ abrio_whatsapp: true }).eq('id', id)
  } catch {
    // Es un dato de seguimiento: si falla, no molestamos al usuario.
  }

  return new Response(null, { status: 204 })
}
