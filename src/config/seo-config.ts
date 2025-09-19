import { Metadata } from "next";
import { generateEnhancedMetadata } from "./seo-enhancements";

// Configuración base para SEO
export const baseSEOConfig = {
  siteName: "Fritz Sport Perú",
  baseUrl: process.env.URL_DOMINIO || "https://fritzsport.pe",
  defaultImage: "/images/ecommerce-share.jpg",
  twitterHandle: "@fritzsport",
  locale: "es_PE",
  type: "website",
};

// Metadata base para todas las páginas
export const baseMetadata: Metadata = {
  metadataBase: new URL(baseSEOConfig.baseUrl),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "tu-google-verification-code",
    yandex: "tu-yandex-verification-code",
    yahoo: "tu-yahoo-verification-code",
  },
  alternates: {
    canonical: baseSEOConfig.baseUrl,
  },
};

// Metadata específica para la página principal
export const homeMetadata: Metadata = generateEnhancedMetadata({
  title: "Fritz Sport Perú | Los Mejores Modelos de Zapatillas Originales y Ropa Deportiva del Perú",
  description: "Fritz Sport Perú - Tienda líder en zapatillas originales Adidas, Nike y ropa deportiva. Los mejores modelos exclusivos con garantía de autenticidad. Envíos a todo Perú. ¡Descubre la calidad premium!",
  keywords: [
    "Fritz Sport Perú",
    "zapatillas originales",
    "Adidas original",
    "Nike original",
    "ropa deportiva Perú",
    "zapatillas deportivas",
    "tienda deportiva online",
    "zapatillas exclusivas",
    "calzado deportivo original",
    "Fritz Sport",
    "deportes Perú",
    "zapatillas premium",
  ],
  openGraph: {
    type: "website",
    url: baseSEOConfig.baseUrl,
    title: "Fritz Sport Perú | Los Mejores Modelos de Zapatillas Originales y Ropa Deportiva del Perú",
    description: "Descubre la mejor selección de zapatillas originales Adidas, Nike y ropa deportiva en Perú. Garantía de autenticidad y envíos nacionales. ¡Calidad premium garantizada!",
    siteName: baseSEOConfig.siteName,
    images: [
      {
        url: `${baseSEOConfig.baseUrl}${baseSEOConfig.defaultImage}`,
        width: 1200,
        height: 630,
        alt: "Fritz Sport Perú - Zapatillas originales y ropa deportiva de calidad premium",
      },
    ],
    locale: baseSEOConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: "Fritz Sport Perú | Zapatillas Originales y Ropa Deportiva Premium",
    description: "Los mejores modelos de zapatillas originales Adidas, Nike y ropa deportiva en Perú. Calidad premium garantizada.",
    images: [`${baseSEOConfig.baseUrl}${baseSEOConfig.defaultImage}`],
    creator: baseSEOConfig.twitterHandle,
  },
});

// Metadata para página de tienda/catálogo
export const storeMetadata: Metadata = generateEnhancedMetadata({
  title: "Tienda Fritz Sport | tienda deportiva online y Ropa Deportiva",
  description: "Explora nuestro tienda deportiva online Adidas, Nike y ropa deportiva. Filtra por marca, talla, género y encuentra las mejores ofertas. Envíos a todo Perú.",
  keywords: [

    "tienda deportiva online",
    "zapatillas Adidas",
    "zapatillas Nike",
    "ropa deportiva",
    "calzado deportivo",
    "Fritz Sport catálogo",
    "zapatillas originales Perú",
  ],
  openGraph: {
    type: "website",
    url: `${baseSEOConfig.baseUrl}/tienda`,
    title: "Tienda Fritz Sport | tienda deportiva online",
    description: "Navega por nuestro extenso catálogo de zapatillas originales y ropa deportiva. Encuentra tu estilo perfecto con garantía de autenticidad.",
    siteName: baseSEOConfig.siteName,
    images: [
      {
        url: `${baseSEOConfig.baseUrl}${baseSEOConfig.defaultImage}`,
        width: 1200,
        height: 630,
        alt: "Catálogo Fritz Sport - Zapatillas originales y ropa deportiva",
      },
    ],
  },
});

// Metadata para página de producto individual
export const generateProductMetadata = (product: any): Metadata => {
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
    ],
    openGraph: {
      type: "website", // Changed from "product" to "website" for Next.js compatibility
      url: `${baseSEOConfig.baseUrl}/products/${product?.slug}`,
      title: productTitle,
      description: productDescription,
      siteName: baseSEOConfig.siteName,
      images: product?.images?.map((img: any) => ({
        url: img?.asset?._ref ? `https://cdn.sanity.io/images/ibvmpbc1/production/${img.asset._ref}` : baseSEOConfig.defaultImage,
        width: 800,
        height: 600,
        alt: `${product?.name} - Fritz Sport Perú`,
      })) || [
        {
          url: `${baseSEOConfig.baseUrl}${baseSEOConfig.defaultImage}`,
          width: 800,
          height: 600,
          alt: `${product?.name} - Fritz Sport Perú`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: productTitle,
      description: productDescription,
      images: product?.images?.[0]?.asset?._ref 
        ? [`https://cdn.sanity.io/images/ibvmpbc1/production/${product.images[0].asset._ref}`]
        : [`${baseSEOConfig.baseUrl}${baseSEOConfig.defaultImage}`],
    },
  });
};

// Metadata para página de carrito
export const cartMetadata: Metadata = generateEnhancedMetadata({
  title: "Carrito de Compras | Fritz Sport Perú",
  description: "Revisa tu carrito de compras en Fritz Sport Perú. Zapatillas originales y ropa deportiva de calidad premium. Envíos seguros a todo Perú.",
  openGraph: {
    type: "website",
    url: `${baseSEOConfig.baseUrl}/carrito`,
    title: "Carrito de Compras | Fritz Sport Perú",
    description: "Tu carrito de compras con los mejores productos deportivos originales.",
    siteName: baseSEOConfig.siteName,
  },
});

// Metadata para página de pago
export const paymentMetadata: Metadata = generateEnhancedMetadata({
  title: "Pago Seguro | Fritz Sport Perú",
  description: "Proceso de pago seguro para zapatillas originales y ropa deportiva. Múltiples métodos de pago disponibles. Envíos garantizados a todo Perú.",
  openGraph: {
    type: "website",
    url: `${baseSEOConfig.baseUrl}/pagar`,
    title: "Pago Seguro | Fritz Sport Perú",
    description: "Paga de forma segura tus zapatillas originales y ropa deportiva.",
    siteName: baseSEOConfig.siteName,
  },
});

// Metadata para página de éxito
export const successMetadata: Metadata = generateEnhancedMetadata({
  title: "Compra Exitosa | Fritz Sport Perú",
  description: "¡Gracias por tu compra! Tu pedido de zapatillas originales y ropa deportiva ha sido procesado exitosamente. Te enviaremos actualizaciones por email.",
  openGraph: {
    type: "website",
    url: `${baseSEOConfig.baseUrl}/exito`,
    title: "Compra Exitosa | Fritz Sport Perú",
    description: "Tu pedido ha sido procesado exitosamente.",
    siteName: baseSEOConfig.siteName,
  },
});

// Metadata para página de autenticación
export const authMetadata: Metadata = generateEnhancedMetadata({
  title: "Iniciar Sesión | Fritz Sport Perú",
  description: "Accede a tu cuenta Fritz Sport Perú. Gestiona tus pedidos, favoritos y datos personales. Zapatillas originales y ropa deportiva premium.",
  openGraph: {
    type: "website",
    url: `${baseSEOConfig.baseUrl}/auth`,
    title: "Iniciar Sesión | Fritz Sport Perú",
    description: "Accede a tu cuenta para gestionar tus compras.",
    siteName: baseSEOConfig.siteName,
  },
});

// Metadata para página de favoritos
export const favoritesMetadata: Metadata = generateEnhancedMetadata({
  title: "Mis Favoritos | Fritz Sport Perú",
  description: "Revisa tus productos favoritos en Fritz Sport Perú. Zapatillas originales y ropa deportiva que has guardado para comprar más tarde.",
  openGraph: {
    type: "website",
    url: `${baseSEOConfig.baseUrl}/follows`,
    title: "Mis Favoritos | Fritz Sport Perú",
    description: "Tus productos favoritos guardados.",
    siteName: baseSEOConfig.siteName,
  },
});

// Metadata para página de nuestras tiendas
export const storesMetadata: Metadata = generateEnhancedMetadata({
  title: "Nuestras Tiendas | Fritz Sport Perú",
  description: "Encuentra nuestras tiendas físicas Fritz Sport en Perú. Zapatillas originales y ropa deportiva premium. Horarios y ubicaciones.",
  openGraph: {
    type: "website",
    url: `${baseSEOConfig.baseUrl}/nuestras-tiendas`,
    title: "Nuestras Tiendas | Fritz Sport Perú",
    description: "Ubicaciones de nuestras tiendas físicas.",
    siteName: baseSEOConfig.siteName,
  },
});

// Metadata para términos y condiciones
export const termsMetadata: Metadata = generateEnhancedMetadata({
  title: "Términos y Condiciones | Fritz Sport Perú",
  description: "Términos y condiciones de Fritz Sport Perú. Políticas de compra, envíos, devoluciones y garantías para zapatillas originales y ropa deportiva.",
  openGraph: {
    type: "website",
    url: `${baseSEOConfig.baseUrl}/tyc`,
    title: "Términos y Condiciones | Fritz Sport Perú",
    description: "Políticas y términos de nuestra tienda.",
    siteName: baseSEOConfig.siteName,
  },
});

// Metadata para política de privacidad
export const privacyMetadata: Metadata = generateEnhancedMetadata({
  title: "Política de Privacidad | Fritz Sport Perú",
  description: "Política de privacidad de Fritz Sport Perú. Cómo protegemos tus datos personales al comprar zapatillas originales y ropa deportiva.",
  openGraph: {
    type: "website",
    url: `${baseSEOConfig.baseUrl}/pyp`,
    title: "Política de Privacidad | Fritz Sport Perú",
    description: "Cómo protegemos tu información personal.",
    siteName: baseSEOConfig.siteName,
  },
});

// Metadata para página de mantenimiento
export const maintenanceMetadata: Metadata = generateEnhancedMetadata({
  title: "Sitio en Mantenimiento | Fritz Sport Perú",
  description: "Fritz Sport Perú está en mantenimiento. Pronto volveremos con mejoras para ofrecerte la mejor experiencia de compra de zapatillas originales.",
  openGraph: {
    type: "website",
    url: `${baseSEOConfig.baseUrl}/mantenimiento`,
    title: "Sitio en Mantenimiento | Fritz Sport Perú",
    description: "Estamos mejorando nuestro sitio para ti.",
    siteName: baseSEOConfig.siteName,
  },
});
