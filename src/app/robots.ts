import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.URL_DOMINIO || 'https://fritzsport.pe'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/private/',
        '/_next/',
        '/static/',
        '/carrito',
        '/pagar',
        '/exito',
        '/auth',
        '/follows',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
