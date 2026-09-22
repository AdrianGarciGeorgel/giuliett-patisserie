import type { MetadataRoute } from 'next'
import { generarRobots, resolverUrlSitio } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return generarRobots(resolverUrlSitio())
}
