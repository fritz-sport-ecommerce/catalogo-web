// export const fetchCache = "force-no-store";
// export const revalidate = 0; // seconds
// export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import { SanityProduct } from "@/config/inventory";
import DetectProvinciaAnalytics from "./DetectProvinciaAnalytics";
import { Metadata } from "next";

import DescargarPdf from "@/components/pdf/DescargarPdf";

export const metadata: Metadata = {
  title: "Fritz Sport Perú Sitio Web ofical | Zapatillas y ropa deportiva",
  description:
    "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra Nuestro catalogo digital de zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
  openGraph: {
    title: " Fritz Sport Perú Sitio Web ofical | Zapatillas y ropa deportiva",
    description:
      "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra Nuestro catalogo digital de zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
    url: `${process.env.URL_DOMINIO}`,
    siteName: "Fritz Sport",
    images: [
      {
        url: `${process.env.URL_DOMINIO}/ecommerce-share.jpg`,
        width: 800,
        height: 600,
        alt: `Fritz Sport share Imagen`,
      },
      {
        url: `${process.env.URL_DOMINIO}/ecommerce-share.jpg`,

        width: 1200,
        height: 630,
        alt: `Fritz Sport share Imagen`,
      },
    ],
  },
};
export default async function Page() {
  // console.log(productos);

  const catalogoProvincias = await client.fetch<SanityProduct[]>(
    groq`*[_type == "catalogo"]{portadas_catalogo}[0].portadas_catalogo`
  );
  const catalogo = await client.fetch<SanityProduct[]>(
    groq`*[_type == "catalogo"]{catalogospdf,catalogospdf_emprendedor}[0]`
  );

  // const getUrlFromId = () => {
  //   // Example ref: file-207fd9951e759130053d37cf0a558ffe84ddd1c9-mp3
  //   // We don't need the first part, unless we're using the same function for files and images
  //   const [_file, id, extension] = pdf.split('-');
  //   return `https://cdn.sanity.io/files/ibvmpbc1/production/${id}.${extension}`
  // }

  // console.log(getUrlFromId());
  // console.log(catalogoProvincias);

  return (
    <div>
      {/* <object className='w-[100vw] h-[100vh]' data={getUrlFromId()} type="application/pdf"></object> */}
     <DetectProvinciaAnalytics />
      <div>
        {/* <MainPdf catalogo={catalogo} items={products} /> */}
        <main className=" w-full px-6">
          <section
            aria-labelledby="products-heading"
            className="flex pb-24 pt-6"
          >
            {/* Product grid */}
            <DescargarPdf catalogo={catalogo} />
          </section>
        </main>
      </div>
    </div>
  );
}
