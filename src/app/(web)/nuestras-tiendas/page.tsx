export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

import NuestrasTiendas from "@/components/nuestras-sede/nuestras-sede";
import { client } from "@/sanity/lib/client";
import getSanityFileUrl from "@/utils/get-url-video";
import { Metadata } from "next";
import { storesMetadata } from "@/config/seo-config";

import { groq } from "next-sanity";

export const metadata: Metadata = storesMetadata;
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
    <div>
      <NuestrasTiendas
        sedes={sedes}
        sedes_mayorista={sedes_mayorista}
        videoPrincipal={videoPrincipal}
      />
    </div>
  );
}
