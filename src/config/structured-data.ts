// Configuración de datos estructurados JSON-LD para SEO

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fritz Sport Perú",
    "url": process.env.URL_DOMINIO || "https://fritzsport.pe",
    "logo": `${process.env.URL_DOMINIO || "https://fritzsport.pe"}/images/ecommerce-share.jpg`,
    "description": "Tienda líder en zapatillas originales Adidas, Nike y ropa deportiva en Perú. Los mejores modelos exclusivos con garantía de autenticidad.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PE",
      "addressLocality": "Lima",
      "addressRegion": "Lima"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Spanish"
    },
    "sameAs": [
      "https://www.facebook.com/fritzsport",
      "https://www.instagram.com/fritzsport",
      "https://www.tiktok.com/@fritzsport"
    ]
  };
};

export const generateWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fritz Sport Perú",
    "url": process.env.URL_DOMINIO || "https://fritzsport.pe",
    "description": "Tienda online de zapatillas originales y ropa deportiva en Perú",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.URL_DOMINIO || "https://fritzsport.pe"}/tienda?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
};

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generateProductSchema = (product: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product?.name,
    "description": product?.description,
    "brand": {
      "@type": "Brand",
      "name": product?.marca
    },
    "sku": product?.sku,
    "category": product?.categories?.join(", "),
    "image": product?.images?.map((img: any) => 
      img?.asset?._ref ? `https://cdn.sanity.io/images/ibvmpbc1/production/${img.asset._ref}` : ""
    ).filter(Boolean),
    "offers": {
      "@type": "Offer",
      "price": product?.priceecommerce,
      "priceCurrency": product?.currency || "PEN",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Fritz Sport Perú"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    }
  };
};

export const generateStoreSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Fritz Sport Perú",
    "description": "Tienda de zapatillas originales y ropa deportiva",
    "url": process.env.URL_DOMINIO || "https://fritzsport.pe",
    "telephone": "+51-1-123-4567",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Miguel Grau 231",
      "addressLocality": "Lima",
      "addressRegion": "Lima",
      "postalCode": "15001",
      "addressCountry": "PE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -12.0464,
      "longitude": -77.0428
    },
    "openingHours": "Mo-Sa 09:00-18:00",
    "paymentAccepted": "Cash, Credit Card, Debit Card",
    "currenciesAccepted": "PEN"
  };
};

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};
