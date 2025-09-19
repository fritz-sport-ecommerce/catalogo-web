import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import PaginaEmprende from "@/components/emprende/emprende";

export const metadata = {
  title:
    "Emprende con Fritz Sport Perú Sitio Web ofical | Zapatillas y ropa deportiva",
  description:
    "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra Nuestro catalogo digital de zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
  openGraph: {
    title: " Fritz Sport Perú Sitio Web ofical | Zapatillas y ropa deportiva",
    description:
      "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra Nuestro catalogo digital de zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
    url: `${process.env.URL_DOMINIO || "https://fritzsport.pe"}`,
    siteName: "Fritz Sport",
    images: [
      {
        url: `${process.env.URL_DOMINIO || "https://fritzsport.pe"}/images/ecommerce-share.jpg`,
        width: 800,
        height: 600,
        alt: `Fritz Sport share Imagen`,
      },
      {
        url: `${process.env.URL_DOMINIO || "https://fritzsport.pe"}/images/ecommerce-share.jpg`,

        width: 1200,
        height: 630,
        alt: `Fritz Sport share Imagen`,
      },
    ],
  },
};

export default async function page() {
  //
  const emprende = await client.fetch(groq`*[_type == "emprende"]`);
  return (
    <>
      <PaginaEmprende emprende={emprende[0]} />
    </>
  );
}
