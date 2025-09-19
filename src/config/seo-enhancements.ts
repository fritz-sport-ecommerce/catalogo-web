import { Metadata } from "next";

// Configuraciones adicionales para mejorar el SEO

export const enhancedOpenGraph = {
  type: "website",
  locale: "es_PE",
  siteName: "Fritz Sport Perú",
  images: [
    {
      url: `${process.env.URL_DOMINIO || "https://fritzsport.pe"}/images/ecommerce-share.jpg`,
      width: 1200,
      height: 630,
      alt: "Fritz Sport Perú - Zapatillas originales y ropa deportiva de calidad premium",
    },
    {
      url: `${process.env.URL_DOMINIO || "https://fritzsport.pe"}/images/hero-1.jpeg`,
      width: 800,
      height: 600,
      alt: "Fritz Sport Perú - Los mejores modelos de zapatillas",
    },
  ],
};

export const enhancedTwitterCard = {
  card: "summary_large_image",
  site: "@fritzsport",
  creator: "@fritzsport",
  images: [`${process.env.URL_DOMINIO || "https://fritzsport.pe"}/images/ecommerce-share.jpg`],
};

export const generateEnhancedMetadata = (customMetadata: Partial<Metadata>): Metadata => {
  return {
    ...customMetadata,
    openGraph: {
      ...enhancedOpenGraph,
      ...customMetadata.openGraph,
    },
    twitter: {
      ...enhancedTwitterCard,
      ...customMetadata.twitter,
    },
    other: {
      "google-site-verification": "tu-codigo-de-verificacion",
      "msvalidate.01": "tu-codigo-bing",
      "yandex-verification": "tu-codigo-yandex",
      "theme-color": "#000000",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": "Fritz Sport Perú",
      "application-name": "Fritz Sport Perú",
      "msapplication-TileColor": "#000000",
      "msapplication-config": "/browserconfig.xml",
    },
  };
};

// Configuración para páginas de productos específicos
export const generateProductEnhancedMetadata = (product: any): Metadata => {
  const productTitle = `${product?.name} | Fritz Sport Perú`;
  const productDescription = `${product?.name} - ${product?.marca} original. ${product?.description || 'Zapatilla deportiva de calidad premium'}. Envío gratis a todo Perú. Garantía de autenticidad.`;
  
  return generateEnhancedMetadata({
    title: productTitle,
    description: productDescription,
    keywords: [
      product?.name,
      product?.marca,
      "zapatillas originales",
      "Fritz Sport",
      "calzado deportivo",
      "zapatillas deportivas",
      "Perú",
      "Adidas original",
      "Nike original",
      "ropa deportiva",
    ],
    openGraph: {
      type: "website", // Changed from "product" to "website" for Next.js compatibility
      title: productTitle,
      description: productDescription,
      images: product?.images?.map((img: any) => ({
        url: img?.asset?._ref ? `https://cdn.sanity.io/images/ibvmpbc1/production/${img.asset._ref}` : `${process.env.URL_DOMINIO || "https://fritzsport.pe"}/images/ecommerce-share.jpg`,
        width: 800,
        height: 600,
        alt: `${product?.name} - Fritz Sport Perú`,
      })) || [
        {
          url: `${process.env.URL_DOMINIO || "https://fritzsport.pe"}/images/ecommerce-share.jpg`,
          width: 800,
          height: 600,
          alt: `${product?.name} - Fritz Sport Perú`,
        },
      ],
    },
    twitter: {
      title: productTitle,
      description: productDescription,
      images: product?.images?.[0]?.asset?._ref 
        ? [`https://cdn.sanity.io/images/ibvmpbc1/production/${product.images[0].asset._ref}`]
        : [`${process.env.URL_DOMINIO || "https://fritzsport.pe"}/images/ecommerce-share.jpg`],
    },
  });
};

// Configuración para páginas de categorías
export const generateCategoryMetadata = (category: string): Metadata => {
  const categoryTitle = `${category} | Fritz Sport Perú`;
  const categoryDescription = `Encuentra los mejores ${category} originales en Fritz Sport Perú. Garantía de autenticidad y envíos a todo Perú.`;
  
  return generateEnhancedMetadata({
    title: categoryTitle,
    description: categoryDescription,
    keywords: [
      category,
      "zapatillas originales",
      "Fritz Sport",
      "Perú",
      "ropa deportiva",
      "calzado deportivo",
    ],
    openGraph: {
      title: categoryTitle,
      description: categoryDescription,
    },
    twitter: {
      title: categoryTitle,
      description: categoryDescription,
    },
  });
};

// Configuración para páginas de búsqueda
export const generateSearchMetadata = (searchTerm: string): Metadata => {
  const searchTitle = `Búsqueda: ${searchTerm} | Fritz Sport Perú`;
  const searchDescription = `Resultados de búsqueda para "${searchTerm}" en Fritz Sport Perú. Encuentra zapatillas originales y ropa deportiva.`;
  
  return generateEnhancedMetadata({
    title: searchTitle,
    description: searchDescription,
    keywords: [
      searchTerm,
      "búsqueda",
      "zapatillas originales",
      "Fritz Sport",
      "Perú",
    ],
    openGraph: {
      title: searchTitle,
      description: searchDescription,
    },
    twitter: {
      title: searchTitle,
      description: searchDescription,
    },
  });
};
