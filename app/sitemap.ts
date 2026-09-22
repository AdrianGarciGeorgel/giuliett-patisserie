import type { MetadataRoute } from 'next'
import { PRODUCTS } from '@/lib/products'
import { generarSitemap, resolverUrlSitio } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return generarSitemap(resolverUrlSitio(), PRODUCTS)
}
