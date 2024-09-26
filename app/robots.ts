import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
    const defaultUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/account',
    },
    sitemap: defaultUrl + '/sitemap.xml',
  }
}