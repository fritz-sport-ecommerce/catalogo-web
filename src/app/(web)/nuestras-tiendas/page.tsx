import NuestrasTiendas from "@/components/nuestras-sede/nuestras-sede";
import { client } from "@/sanity/lib/client";
import getSanityFileUrl from "@/utilits/get-url-video";


import { groq } from "next-sanity";

export const metadata = {
  title:
    "Nuestras Tiendas Fritz Sport Perú Tienda oficial | Zapatillas y ropa deportiva",
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
  const sedes = 
    nuestrasTiendas.sedes.map((sede: any) => ({
      dataSede: sede.sedes.map((el: any) => ({
        nombre: el.titulosede,
        provincia: sede.provincia,
        direccion: el.direccion,
        video:     el?.videosede?.asset?._ref
        ? getSanityFileUrl(el.videosede.asset._ref)
        : "",
        urlubicacion: el.urlubicacion,
        ubicanosboton: el.ubicanosboton,
        botonHorarios: el.boton,
  
          horarios: el.horarios,
      })),
      provincia: sede.provincia,
    }))
  
  
  const sedes_mayorista = 
  nuestrasTiendas.sedes_mayorista.map((sede: any) => ({
    dataSede: sede.sedes.map((el: any) => ({
      nombre: el.titulosede,
      provincia: sede.provincia,
      direccion: el.direccion,
      video:     el?.videosede?.asset?._ref
      ? getSanityFileUrl(el.videosede.asset._ref)
      : "",
      urlubicacion: el.urlubicacion,
      ubicanosboton: el.ubicanosboton,
      botonHorarios: el.boton,

        horarios: el.horarios,
    })),
    provincia: sede.provincia,
    }))



  return (
    <div>
      <NuestrasTiendas
       sedes={sedes} sedes_mayorista={sedes_mayorista} videoPrincipal={videoPrincipal}
      />
    </div>
  );
}