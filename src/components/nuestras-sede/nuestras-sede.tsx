"use client";
import { useState } from "react";
import ModalDesk from "../modal/Modal";
import Link from "next/link";
import getSanityFileUrl from "@/utilits/get-url-video";
import { MapPin } from "lucide-react";

interface Sede {
  nombre: string;
  direccion: string;
  provincia: string;
  video?: string;
  ubicacion: string; // URL de Google Maps
  horarios: string[];
  dataSede: Sede[];
  botonHorarios: string;
  ubicanosboton: string;
  urlubicacion: string;
}

interface Provincia {
  nombre: string;
  sedes: Sede[];
}
interface videoPrincipal {
  activeVideo: boolean;
  videoPrincipalDesk: string | null;
  videoPrincipalMob: string | null;
  videoPrincipalTablet: string | null;
}

interface Props {
  sedes: Sede[];
  sedes_mayorista: Sede[];
  videoPrincipal: videoPrincipal;
}

const TiendasComponent: React.FC<Props> = ({
  sedes,
  sedes_mayorista,
  videoPrincipal,
}) => {
  const [tipoTienda, setTipoTienda] = useState<"retail" | "mayorista">(
    "retail"
  );
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<
    string | null
  >(null);
  const [activeVerHorarios, setActiveVerHorarios] = useState(false);
  // Función para agrupar sedes por provincia
  const agruparPorProvincia = (listaSedes: Sede[]) => {
    const provincias: Record<string, Provincia> = {};
    listaSedes.forEach((sede) => {
      if (!provincias[sede.provincia]) {
        provincias[sede.provincia] = { nombre: sede.provincia, sedes: [] };
      }
      provincias[sede.provincia].sedes.push(sede);
    });
    return Object.values(provincias);
  };

  // Seleccionar el tipo de sedes a mostrar
  const tiendas =
    tipoTienda === "retail"
      ? agruparPorProvincia(sedes)
      : agruparPorProvincia(sedes_mayorista);

  return (
    <div className="p-4">
      <div className="flex justify-center flex-col w-full items-center">
        {/* Botones de filtro */}
        <div className="flex gap-4 mb-4">
          <button
            className={`xl:px-4 px-3  py-2 rounded ${
              tipoTienda === "retail"
                ? "bg-black dark:border-white border-[1px] text-white "
                : "bg-gray-200 dark:text-black"
            }`}
            onClick={() => setTipoTienda("retail")}
          >
            Tiendas Retail
          </button>
          <button
            className={`xl:px-4 px-3 rounded ${
              tipoTienda === "mayorista"
                ? "bg-black dark:border-white border-[1px] text-white "
                : "bg-gray-200 dark:text-black"
            }`}
            onClick={() => setTipoTienda("mayorista")}
          >
            Tiendas Mayoristas
          </button>
        </div>

        {/* Filtro por provincia */}
        <div className="mb-4 xl:flex flex flex-col items-center justify-center xl:flex-row">
          <label className="font-bold">Selecciona un Departamento:</label>
          <select
            className="ml-2 p-2 border rounded text-black"
            onChange={(e) => setProvinciaSeleccionada(e.target.value)}
          >
            <option value="">Todas</option>
            {tiendas.map((provincia) => (
              <option key={provincia.nombre} value={provincia.nombre}>
                {provincia.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Renderizado de las sedes */}
      <div>
        {videoPrincipal.activeVideo && (
          <>
            {videoPrincipal.videoPrincipalDesk && (
              <video
                className="w-full rounded h-[70vh] xl:block hidden"
                autoPlay
                loop
                muted
                src={videoPrincipal.videoPrincipalDesk}
              ></video>
            )}

            {videoPrincipal.videoPrincipalMob && (
              <video
                className="w-full rounded xl:hidden md:hidden block"
                autoPlay
                loop
                muted
                src={videoPrincipal.videoPrincipalMob}
              ></video>
            )}

            {videoPrincipal.videoPrincipalTablet && (
              <video
                className="w-full rounded xl:hidden md:block hidden"
                autoPlay
                loop
                muted
                src={videoPrincipal.videoPrincipalTablet}
              ></video>
            )}
          </>
        )}
        {tiendas
          .filter(
            (provincia) =>
              !provinciaSeleccionada ||
              provincia.nombre === provinciaSeleccionada
          )
          .map((provincia) => (
            <div key={provincia.nombre} className="my-6">
              <h3 className="text-2xl font-bold text-center uppercase">
                {provincia.nombre}
              </h3>

              <ul className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 2xl:mx-auto 2xl:px-20 px-0 gap-y-20 xl:gap-y-0 lg:grid-cols-2 xl:grid-cols-3 2xl:gap-6  mt-6">
                {provincia.sedes.map((el, index) => (
                  <>
                    {el.dataSede.map((sede: Sede, i: number) => (
                      <li
                        key={index}
                        className="p-4 border rounded shadow bg-gray-100 dark:bg-black flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="text-xl font-bold text-center uppercase">
                            {sede.nombre}
                          </h3>
                          {/* <p className="text-center mt-2 text-sm">{sede.direccion}</p> */}
                        </div>

                        {/* Video */}
                        {sede.video && (
                          <div className="flex justify-center">
                            <video
                              className="max-h-[35rem] mt-4 rounded 2xl:max-h-[35rem]"
                              autoPlay
                              loop
                              muted
                              src={sede.video}
                            ></video>
                          </div>
                        )}
                        <div className="flex justify-center w-full items-center py-4 ">
                          <p className="xl:text-lg text-md text-center">
                            {sede.direccion}
                          </p>
                        </div>

                        {/* Ubicación */}
                        <div className=" flex justify-around">
                          <div className="mt-3">
                            <button
                              onClick={() => setActiveVerHorarios(true)}
                              className="bg-black text-white dark:border-white dark:border-[1px] px-4 py-2 rounded"
                            >
                              {sede.botonHorarios}
                            </button>
                          </div>
                          <div className="mt-3">
                            <Link
                              href={
                                sede?.urlubicacion ? sede?.urlubicacion : ""
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button className="bg-black flex justify-center gap-2 text-white dark:border-white dark:border-[1px] px-4 py-2 rounded">
                                {sede?.ubicanosboton}
                                <MapPin className="text-green-400" />
                              </button>
                            </Link>
                          </div>
                        </div>
                        <ModalDesk
                          isOpen={activeVerHorarios}
                          onClose={() => setActiveVerHorarios(false)}
                        >
                          <div className="p-4 flex items-center w-full justify-center">
                            <div>
                              <h4 className="text-lg md:mb-3 mb-2 xl:text-xl md:text-xl font-semibold text-center">
                                Horarios de Atención
                              </h4>
                              <ul className="list-none">
                                {sede?.horarios?.map(
                                  (el: string, i: number) => (
                                    <li
                                      key={i}
                                      className="text-lg xl:text-xl md:text-lg py-2"
                                    >
                                      {el}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </ModalDesk>
                      </li>
                    ))}
                  </>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TiendasComponent;
