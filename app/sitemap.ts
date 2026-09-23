import type { MetadataRoute } from 'next'
import { getProductos } from '@/lib/catalogo'
import { generarSitemap, resolverUrlSitio } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return generarSitemap(resolverUrlSitio(), await getProductos())
}
