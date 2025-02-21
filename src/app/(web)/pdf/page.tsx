export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import { SanityProduct } from "@/config/inventory";

import { Metadata } from "next";

import DescargarPdf from "@/components/pdf/DescargarPdf";

export const metadata: Metadata = {
  title: "Fritz Sport Perú Tienda oficial | Zapatillas y ropa deportiva",
  description:
    "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra en esta tienda online zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
  openGraph: {
    title: " Fritz Sport Perú Tienda oficial | Zapatillas y ropa deportiva",
    description:
      "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra en esta tienda online zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
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

  const catalogo = await client.fetch<SanityProduct[]>(
    groq`*[_type == "catalogo"] {
    catalogospdf
    }[0].catalogospdf`
  );

  // const getUrlFromId = () => {
  //   // Example ref: file-207fd9951e759130053d37cf0a558ffe84ddd1c9-mp3
  //   // We don't need the first part, unless we're using the same function for files and images
  //   const [_file, id, extension] = pdf.split('-');
  //   return `https://cdn.sanity.io/files/ibvmpbc1/production/${id}.${extension}`
  // }

  console.log(catalogo);

  // console.log(getUrlFromId());

  return (
    <div>
      {/* <object className='w-[100vw] h-[100vh]' data={getUrlFromId()} type="application/pdf"></object> */}

      <div>
        <div className="flex justify-center w-full 2xl:text-2xl xl:text-2xl mt-10 text-xl font-semibold">
          CATALOGO
        </div>
        {/* <MainPdf catalogo={catalogo} items={products} /> */}
        <main className=" w-full px-6">
          <section
            aria-labelledby="products-heading"
            className="flex pb-24 pt-6"
          >
            {/* Product grid */}
            <DescargarPdf catalogo={catalogo}></DescargarPdf>
          </section>
        </main>
      </div>
    </div>
  );
}
