"use client";
import { useState } from "react";
import ModalDesk from "../modal/Modal";
import Link from "next/link";

import { MapPin, Clock, Store, Map } from "lucide-react";

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
  const [selectedSedeName, setSelectedSedeName] = useState<string | null>(null);
  const [selectedHorarios, setSelectedHorarios] = useState<string[] | null>(
    null
  );
  
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
    <div className="min-h-screen bg-gradient-to-br  ">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-black via-gray-800 to-black py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            Nuestras Tiendas
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Descubre nuestras ubicaciones <br />y encuentra la tienda más cercana a ti
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filtros Section */}
        <div className="max-w-4xl mx-auto mb-12">
          {/* Botones de filtro */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            <button
              className={`group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                tipoTienda === "retail"
                  ? "bg-black text-white shadow-lg shadow-black/25 border-2 border-black"
                  : "bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white"
              }`}
              onClick={() => setTipoTienda("retail")}
            >
              <Store className="inline-block mr-2 h-5 w-5" />
              Tiendas Retail
            </button>
            <button
              className={`group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                tipoTienda === "mayorista"
                  ? "bg-black text-white shadow-lg shadow-black/25 border-2 border-black"
                  : "bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white"
              }`}
              onClick={() => setTipoTienda("mayorista")}
            >
              <Store className="inline-block mr-2 h-5 w-5" />
              Tiendas Mayoristas
            </button>
          </div>

          {/* Filtro por provincia */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4  rounded-xl p-6 shadow-lg">
            <label className="font-semibold text-black dark:text-white flex items-center gap-2">
              <Map className="h-5 w-5" />
              Selecciona un Departamento:
            </label>
            <select
              className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-white bg-white dark:bg-gray-700 focus:border-black dark:focus:border-white focus:outline-none transition-colors duration-200 min-w-[200px]"
              onChange={(e) => setProvinciaSeleccionada(e.target.value)}
            >
              <option value="">Todas las ubicaciones</option>
              {tiendas.map((provincia) => (
                <option key={provincia.nombre} value={provincia.nombre}>
                  {provincia.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video Principal */}
        {videoPrincipal.activeVideo && (
          <div className="max-w-6xl mx-auto mb-16">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {videoPrincipal.videoPrincipalDesk && (
                <video
                  className="w-full h-[70vh] xl:block hidden object-cover"
                  autoPlay
                  loop
                  muted
                  src={videoPrincipal.videoPrincipalDesk}
                ></video>
              )}

              {videoPrincipal.videoPrincipalMob && (
                <video
                  className="w-full h-[50vh] xl:hidden md:hidden block object-cover"
                  autoPlay
                  loop
                  muted
                  src={videoPrincipal.videoPrincipalMob}
                ></video>
              )}

              {videoPrincipal.videoPrincipalTablet && (
                <video
                  className="w-full h-[60vh] xl:hidden md:block hidden object-cover"
                  autoPlay
                  loop
                  muted
                  src={videoPrincipal.videoPrincipalTablet}
                ></video>
              )}
            </div>
          </div>
        )}

        {/* Renderizado de las sedes */}
        <div className="space-y-16">
          {tiendas
            .filter(
              (provincia) =>
                !provinciaSeleccionada ||
                provincia.nombre === provinciaSeleccionada
            )
            .map((provincia) => (
              <div key={provincia.nombre} className="animate-fade-in">
                {/* Header de Provincia */}
                <div className="text-center mb-12">
                  <div className="inline-block">
                                         <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4 relative">
                       {provincia.nombre}
                       <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-black dark:bg-white rounded-full"></div>
                     </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {provincia.sedes.length} ubicación{provincia.sedes.length !== 1 ? 'es' : ''} disponible{provincia.sedes.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Grid de Tiendas */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {provincia.sedes.map((el, index) => (
                    <>
                      {el.dataSede.map((sede: Sede, i: number) => (
                                                <div
                          key={`${index}-${i}`}
                          className="group  rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full"
                        >
                          {/* Header de la tienda */}
                          <div className="bg-black dark:bg-white p-6 text-white dark:text-black text-center">
                            <h3 className="text-xl font-bold uppercase tracking-wide">
                              {sede.nombre}
                            </h3>
                          </div>

                          {/* Video */}
                          {sede.video && (
                            <div className="relative overflow-hidden">
                              <video
                                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                autoPlay
                                loop
                                muted
                                src={sede.video}
                              ></video>
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                            </div>
                          )}

                          {/* Contenido principal */}
                          <div className="flex-1 p-6 flex flex-col">
                            {/* Dirección */}
                            <div className="flex items-start gap-3 mb-6">
                              <MapPin className="h-6 w-6 text-black dark:text-white mt-1 flex-shrink-0" />
                              <p className="text-black dark:text-white text-lg leading-relaxed">
                                {sede.direccion}
                              </p>
                            </div>

                            {/* Espaciador para empujar botones hacia abajo */}
                            <div className="flex-1"></div>

                            {/* Botones - siempre en la parte inferior */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                              <button
                                onClick={() => {
                                  setSelectedSedeName(sede.nombre);
                                  setSelectedHorarios(sede.horarios || null);
                                  setActiveVerHorarios(true);
                                }}
                                className="flex-1 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border-2 border-black dark:border-white"
                              >
                                <Clock className="h-5 w-5" />
                                {sede.botonHorarios}
                              </button>
                              <Link
                                href={sede?.urlubicacion ? sede?.urlubicacion : ""}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                              >
                                <button className="w-full bg-white dark:bg-black text-black dark:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border-2 border-black dark:border-white">
                                  <MapPin className="h-5 w-5" />
                                  {sede?.ubicanosboton}
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal de Horarios */}
      <ModalDesk
        isOpen={activeVerHorarios}
        onClose={() => {
          setActiveVerHorarios(false);
          setSelectedHorarios(null);
          setSelectedSedeName(null);
        }}
      >
        <div className="p-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-white dark:text-black" />
            </div>
            <h4 className="text-2xl font-bold text-black dark:text-white mb-2">
              Horarios de Atención
            </h4>
            {selectedSedeName && (
              <p className="text-black/70 dark:text-white/70 mb-4">
                {selectedSedeName}
              </p>
            )}
            <div className="space-y-3">
              {selectedHorarios?.map((horario: string, idx: number) => (
                <div
                  key={`horario-${idx}`}
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-left border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-black dark:text-white font-medium">
                    {horario}
                  </p>
                </div>
              ))}
              {!selectedHorarios?.length && (
                <p className="text-black dark:text-white">
                  No hay horarios disponibles.
                </p>
              )}
            </div>
          </div>
        </div>
      </ModalDesk>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TiendasComponent;
