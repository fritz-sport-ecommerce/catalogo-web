"use client";

import { useEffect, useState } from "react";
import ModalDesk from "../modal/Modal";
import getSanityFileUrl from "@/utilits/get-url-video";
import Link from "next/link";

interface Sede {
  titulosede: string;
  videosede: { asset: { _ref: string } };
  direccion: string;
  boton: string;
  horarios: string[];
  ubicanosboton: string;
  urlubicacion: string;
}

interface NuestrasTiendasProps {
  titulosede: string;
  sedes: Sede[];
  sedes_mayorista: Sede[];
  videoPrincipalDesk: any;
  videoPrincipalMob: any;
  videoPrincipalTablet: any;
  activeVideo: boolean;
}

const NuestrasTiendas = ({
  activeVideo,
  titulosede,
  sedes = [],
  sedes_mayorista = [],
  videoPrincipalDesk,
  videoPrincipalMob,
  videoPrincipalTablet,
}: NuestrasTiendasProps) => {
  const [activeTab, setActiveTab] = useState<"sedes" | "sedes_mayorista">(
    "sedes"
  );
  const [provincia, setProvincia] = useState("Lima");

  // const RenderSedes = (sedes: Sede[], provincia: string) => {
  //   const [activeVerHorarios, setActiveVerHorarios] = useState(false);

  //   const filteredSedes = sedes.filter(
  //     (el) => el.provincia.toLowerCase() === provincia.toLowerCase()
  //   );

  //   if (filteredSedes.length === 0) {
  //     return <div>No hay sedes disponibles para esta provincia.</div>;
  //   }

  //   return (
  //     <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-3 mx-auto xl:px-20 lg:grid-cols-3 xl:gap-6 gap-2 mt-6">
  //       {sedes
  //         .filter(
  //           (el) => el.provincia.toLowerCase() === provincia.toLowerCase()
  //         )
  //         .map((sede) => (
  //           <div
  //             key={sede.id} // Usar un identificador único si está disponible
  //             className="border rounded-lg py-4 shadow-lg hover:shadow-xl transition duration-300"
  //           >
  //             <h3 className="text-2xl text-lg font-bold text-center uppercase">
  //               {sede.titulosede}
  //             </h3>
  //             <div className="flex justify-center">
  //               <video
  //                 className="max-h-[35rem] mt-4 rounded 2xl:max-h-[35rem]"
  //                 autoPlay
  //                 loop
  //                 muted
  //                 src={
  //                   sede?.videosede?.asset?._ref
  //                     ? getSanityFileUrl(sede.videosede.asset._ref)
  //                     : ""
  //                 }
  //               ></video>
  //             </div>
  //             <p className="mt-4 xl:text-lg text-md text-center">
  //               {sede.direccion}
  //             </p>
  //             <p className="mt-2 xl:text-lg text-md text-center">
  //               {sede.provincia}
  //             </p>
  //             <div className="mt-2 flex justify-around">
  //               <div className="mt-4">
  //                 <button
  //                   onClick={() => setActiveVerHorarios(true)}
  //                   className="bg-black text-white dark:border-white dark:border-[1px] px-4 py-2 rounded"
  //                 >
  //                   {sede.boton}
  //                 </button>
  //               </div>
  //               <div className="mt-4">
  //                 <Link
  //                   href={sede.urlubicacion}
  //                   target="_blank"
  //                   rel="noopener noreferrer"
  //                 >
  //                   <button className="bg-black text-white dark:border-white dark:border-[1px] px-4 py-2 rounded">
  //                     {sede.ubicanosboton}
  //                   </button>
  //                 </Link>
  //               </div>
  //             </div>
  //             <ModalDesk
  //               isOpen={activeVerHorarios}
  //               onClose={() => setActiveVerHorarios(false)}
  //             >
  //               <div className="p-4 flex items-center w-full justify-center">
  //                 <div>
  //                   <h4 className="text-lg md:mb-3 mb-2 xl:text-xl md:text-xl font-semibold text-center">
  //                     Horarios de Atención
  //                   </h4>
  //                   <ul className="list-none">
  //                     {sede.horarios.map((horario, i) => (
  //                       <li
  //                         key={i}
  //                         className="text-lg xl:text-xl md:text-lg py-2"
  //                       >
  //                         {horario}
  //                       </li>
  //                     ))}
  //                   </ul>
  //                 </div>
  //               </div>
  //             </ModalDesk>
  //           </div>
  //         ))}
  //     </div>
  //   );
  // };

  // const updtateTiendasProvincia = (provinciaUpdate:any) => {
  //   setProvincia(provinciaUpdate);
  // };

  return(
    <div></div>
  )

  // return (
  //   <div>
  //     {activeVideo && (
  //       <>
  //         <video
  //           className="w-full rounded h-[70vh] xl:block hidden"
  //           autoPlay
  //           loop
  //           muted
  //           src={getSanityFileUrl(videoPrincipalDesk?.asset?._ref) || ""}
  //         ></video>
  //         <video
  //           className="w-full rounded xl:hidden block"
  //           autoPlay
  //           loop
  //           muted
  //           src={getSanityFileUrl(videoPrincipalMob?.asset?._ref) || ""}
  //         ></video>
  //         <video
  //           className="w-full rounded xl:hidden md:block hidden"
  //           autoPlay
  //           loop
  //           muted
  //           src={getSanityFileUrl(videoPrincipalTablet?.asset?._ref) || ""}
  //         ></video>
  //       </>
  //     )}

  //     <div className="p-6  mx-auto ">
  //       <h2 className="text-2xl font-bold text-center">{titulosede}</h2>
  //       <div className="flex justify-center mt-6 space-x-4 ">
  //         <div>
  //           <button
  //             className={` container-sedes px-4 py-2 rounded-md 2xl:text-lg  uppercase ${
  //               activeTab === "sedes"
  //                 ? "dark:bg-black bg-blue-gray-200 text-black dark:text-white dark:border-white dark:border-[1px] "
  //                 : "bg-gray-200 text-gray-700"
  //             }`}
  //             onClick={() => setActiveTab("sedes")}
  //           >
  //             TIENDAS
  //           </button>

  //           <button
  //             className={`px-4 py-2 rounded-md 2xl:text-lg  uppercase ${
  //               activeTab === "sedes_mayorista"
  //                 ? "dark:bg-black bg-blue-gray-200 text-black dark:text-white dark:border-white dark:border-[1px] "
  //                 : "bg-gray-200 text-gray-700 "
  //             }`}
  //             onClick={() => setActiveTab("sedes_mayorista")}
  //           >
  //             TIENDAS Mayorista
  //           </button>

  //           <div>
  //             {sedes.map((el, i) => (
  //               <button
  //                 key={i}
  //                 className={`px-4 py-2 rounded-md 2xl:text-lg  uppercase ${
  //                   activeTab === "sedes"
  //                     ? "dark:bg-black bg-blue-gray-200 text-black dark:text-white dark:border-white dark:border-[1px] "
  //                     : "bg-gray-200 text-gray-700"
  //                 }`}
  //                 onClick={() =>
  //                   updtateTiendasProvincia(el.provincia.toLowerCase())
  //                 }
  //               >
  //                 {el.provincia.toLowerCase()}
  //               </button>
  //             ))}
  //           </div>
  //         </div>
  //       </div>
  //       {activeTab === "sedes"
  //         ? sedes.map((el) => RenderSedes(el.sedes, provincia))
  //         : sedes_mayorista.map((el) => RenderSedes(el.sedes, provincia))}
  //     </div>
  //   </div>
  // );
};

export default NuestrasTiendas;
