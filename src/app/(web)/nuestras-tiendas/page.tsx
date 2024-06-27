import { client } from "@/sanity/lib/client"

import NuestrasTiendas from "@/components/nuestras-tiendas/nuestras-tiendas"

import { groq } from "next-sanity"

export const metadata = {
  title: "Nuestras Tiendas Fritz Sport Perú Tienda oficial | Zapatillas y ropa deportiva",
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
}

export default async function page() {
  const nuestrasTiendas = await client.fetch(
    groq`*[_type == "nuestrastiendas"]`
  )
  return (
    <div>
      <NuestrasTiendas nuestrasTiendas={nuestrasTiendas[0]} />
    </div>
  )
}