

import MainPdfAuto from "@/components/pdf-catalogos-cache/MainPdfAuto"





import { SanityProduct } from "@/config/inventory";


import { Metadata } from "next";

import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";
import { fetchSanityCache } from "@/utilits/cacheHandler";



export const metadata: Metadata = {
  openGraph: {
    title: " Fritz Sport Perú Sitio Web ofical | Zapatillas y ropa deportiva",
    description:
      "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra nuestro CATALOGO VIRTUAL de zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
    url: `${process.env.URL_DOMINIO}`,
    siteName: "Fritz Sport",
    images: [
      {
        url: `https://res.cloudinary.com/dmtq82guq/image/upload/v1712332042/fritz_sport/ecommerce_nti3ij.jpg`,
        width: 800,
        height: 600,
        alt: `Fritz Sport share Imagen`,
      },
      {
        url: `https://res.cloudinary.com/dmtq82guq/image/upload/v1712332042/fritz_sport/ecommerce_nti3ij.jpg`,

        width: 1200,
        height: 630,
        alt: `Fritz Sport share Imagen`,
      },
    ],
  },
};

export default async function Page() {

  const filterProducts = {
    razonsocial:"fritzsport",
    genero:"mujer",
    marca:"adidas",
    tipoproducto:"catalogo"

  }
  const CACHE_KEY= `${filterProducts.razonsocial}_${filterProducts.genero}_${filterProducts.marca}_${filterProducts.tipoproducto}`;

  const { productos, catalogo } = await fetchSanityCache(filterProducts,CACHE_KEY);

  console.log(productos.length);


  const filterUniqueDocuments = (
    documents: SanityProduct[]
  ): SanityProduct[] => {
    const seenCategories = new Set<string>();
    const uniqueDocuments: SanityProduct[] = [];

    documents.forEach((doc) => {
      if (!seenCategories.has(doc.sku)) {
        seenCategories.add(doc.sku);
        uniqueDocuments.push(doc);
      }
    });

    return uniqueDocuments;
  };




  const productosNoRepetidos = filterUniqueDocuments(productos);

  const ProductosDeSistema = await productosTraidosSistemaFritzSport(productosNoRepetidos)
  // console.log(productosOrdenadosConPrecio)


 

   
  return (
    <MainPdfAuto  catalogo={catalogo}  productos={ProductosDeSistema} />


     
  );
}

