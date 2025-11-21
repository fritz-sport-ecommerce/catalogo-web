export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import { SanityProduct } from "@/config/inventory";
import DetectProvinciaAnalytics from "./DetectProvinciaAnalytics";
import { Metadata } from "next";

import DescargarPdf from "@/components/pdf/DescargarPdf";
import { PhoneCall } from "lucide-react";

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
  const catalogo = await client.fetch<any>(
    groq`*[_type == "catalogo"]{catalogospdf,catalogospdf_emprendedor}[0]`
  );

  // Verificar si existen PDFs en Sanity
  const hasPdfs = catalogo?.catalogospdf?.length > 0 || catalogo?.catalogospdf_emprendedor?.length > 0;

  // Si no hay PDFs, no mostrar nada
  if (!hasPdfs) {
    return null;
  }

  return (
    <div>
     <DetectProvinciaAnalytics />
      <div>
        <main className=" w-full px-6">
          <section
            aria-labelledby="products-heading"
            className="flex pb-24 pt-6"
          >
            <div className="w-full">
              <a
                href="tel:+51983478551"
                className="mb-4 block rounded-md  text-white dark:text-black p-3 hover:bg-neutral-900 transition"
                aria-label="Llamar al Call Center"
              >
                <div className="flex items-center justify-center gap-2 text-black dark:text-white">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <PhoneCall className="h-4 w-4" />
                  </span>
                  <span className="font-medium">Call Center:</span>
                  <span className="ml-1 underline font-semibold tracking-wide">
                    Llamar ahora
                  </span>
                </div>
              </a>
              <DescargarPdf catalogo={catalogo} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}