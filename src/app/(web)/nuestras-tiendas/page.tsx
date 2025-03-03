export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

import NuestrasTiendas from "@/components/nuestras-sede/nuestras-sede";
import { client } from "@/sanity/lib/client";
import getSanityFileUrl from "@/utilits/get-url-video";

import { groq } from "next-sanity";

export const metadata = {
  title:
    "Nuestras Tiendas Fritz Sport Perú Sitio Web ofical | Zapatillas y ropa deportiva",
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
// test
export default async function page() {
  const nuestrasTiendas = await client.fetch(
    groq`*[_type == "nuestrastiendas"][0]`
  );
  const videoPrincipal = {
    activeVideo: nuestrasTiendas.activarVideo,
    videoPrincipalDesk: nuestrasTiendas.videohomedesk?.asset?._ref
      ? getSanityFileUrl(nuestrasTiendas.videohomedesk?.asset?._ref)
      : "",
    videoPrincipalMob: nuestrasTiendas.videohomemob?.asset?._ref
      ? getSanityFileUrl(nuestrasTiendas.videohomemob?.asset?._ref)
      : "",
    videoPrincipalTablet: nuestrasTiendas.videohometablet?.asset?._ref
      ? getSanityFileUrl(nuestrasTiendas.videohometablet?.asset?._ref)
      : "",
  };
  const sedes = nuestrasTiendas.sedes.map((sede: any) => ({
    dataSede: sede.sedes.map((el: any) => ({
      nombre: el.titulosede,
      provincia: sede.provincia,
      direccion: el.direccion,
      video: el?.videosede?.asset?._ref
        ? getSanityFileUrl(el.videosede.asset._ref)
        : "",
      urlubicacion: el.urlubicacion,
      ubicanosboton: el.ubicanosboton,
      botonHorarios: el.boton,

      horarios: el.horarios,
    })),
    provincia: sede.provincia,
  }));

  const sedes_mayorista = nuestrasTiendas.sedes_mayorista.map((sede: any) => ({
    dataSede: sede.sedes.map((el: any) => ({
      nombre: el.titulosede,
      provincia: sede.provincia,
      direccion: el.direccion,
      video: el?.videosede?.asset?._ref
        ? getSanityFileUrl(el.videosede.asset._ref)
        : "",
      urlubicacion: el.urlubicacion,
      ubicanosboton: el.ubicanosboton,
      botonHorarios: el.boton,

      horarios: el.horarios,
    })),
    provincia: sede.provincia,
  }));

  return (
    <div className="p-4 animate-pulse">
      <div className="flex justify-center flex-col w-full items-center">
        <div className="flex gap-4 mb-4">
          <div className="xl:px-4 px-3 py-2 rounded bg-gray-300 w-32 h-10"></div>
          <div className="xl:px-4 px-3 rounded bg-gray-300 w-32 h-10"></div>
        </div>
        <div className="mb-4 xl:flex flex flex-col items-center justify-center xl:flex-row">
          <div className="font-bold w-40 h-6 bg-gray-300"></div>
          <div className="ml-2 p-2 border rounded bg-gray-300 w-32 h-10"></div>
        </div>
      </div>
      <div>
        <div className="w-full rounded h-[70vh] bg-gray-300"></div>
        <div className="my-6">
          <div className="text-2xl font-bold text-center uppercase w-20 h-6 bg-gray-300 mx-auto"></div>
          <ul className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 2xl:mx-auto 2xl:px-20 px-0 gap-y-20 xl:gap-y-0 lg:grid-cols-2 xl:grid-cols-3 2xl:gap-6 mt-6">
            <li className="p-4 border rounded shadow bg-gray-100 dark:bg-black flex flex-col justify-between">
              <div className="text-xl font-bold text-center uppercase w-40 h-6 bg-gray-300 mx-auto"></div>
              <div className="flex justify-center">
                <div className="max-h-[35rem] mt-4 rounded 2xl:max-h-[35rem] bg-gray-300 w-full h-96"></div>
              </div>
              <div className="flex justify-center w-full items-center py-4">
                <div className="xl:text-lg text-md text-center w-48 h-6 bg-gray-300"></div>
              </div>
              <div className="flex justify-around">
                <div className="mt-3 w-20 h-10 bg-gray-300 rounded"></div>
                <div className="mt-3 w-32 h-10 bg-gray-300 rounded"></div>
              </div>
            </li>
            <li className="p-4 border rounded shadow bg-gray-100 dark:bg-black flex flex-col justify-between">
              <div className="text-xl font-bold text-center uppercase w-40 h-6 bg-gray-300 mx-auto"></div>
              <div className="flex justify-center">
                <div className="max-h-[55rem] mt-4 rounded 2xl:max-h-[35rem] bg-gray-300 w-full h-96"></div>
              </div>
              <div className="flex justify-center w-full items-center py-4">
                <div className="xl:text-lg text-md text-center w-48 h-6 bg-gray-300"></div>
              </div>
              <div className="flex justify-around">
                <div className="mt-3 w-20 h-10 bg-gray-300 rounded"></div>
                <div className="mt-3 w-32 h-10 bg-gray-300 rounded"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
