"use client";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaDownload, FaEye, FaStar } from "react-icons/fa";
import { Button } from "../ui/button";
import { track } from '@vercel/analytics';
export default function DescargarPdf({ catalogo }) {
  const [provinciaSeleccionada] = useState("mayorista");
  const [dataCatalogo, setDataCatalogo] = useState(
    catalogo?.catalogospdf?.filter(el => el?.asset?._ref) || []
  );

  const getUrlFromId = (pdf) => {
    if (!pdf) return "";
    const [_file, id, extension] = pdf.split("-");
    return `https://cdn.sanity.io/files/ibvmpbc1/production/${id}.${extension}`;
  };

  useEffect(() => {
    const catalogoData = provinciaSeleccionada === "mayorista" 
      ? catalogo.catalogospdf 
      : catalogo.catalogospdf_emprendedor;
    
    // Filtrar solo los PDFs que tengan asset válido
    const catalogosFiltrados = catalogoData?.filter(el => el?.asset?._ref) || [];
    setDataCatalogo(catalogosFiltrados);
  }, [provinciaSeleccionada, catalogo]);

  const handleDownloadClick = (el) => {
    track('Descargar Catalogo', {
      titulo: el.titulo,
      mes: el.mes,
      marca: el.marca,
      tipo: provinciaSeleccionada
    });
  };

  const handleViewClick = (el) => {
    track('Ver Catalogo', {
      titulo: el.titulo,
      mes: el.mes,
      marca: el.marca,
      tipo: provinciaSeleccionada
    });
  };

  // Si no hay catálogos, no mostrar nada
  if (!dataCatalogo || dataCatalogo.length === 0) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="text-center w-full text-xl sm:text-2xl font-bold uppercase tracking-wide text-gray-800 dark:text-gray-100 py-5">
        CATALOGO {provinciaSeleccionada}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {dataCatalogo.map((el, idx) => (
          <section
            key={el._key}
            className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-white dark:bg-gray-900 border ${
              idx === 0
                ? "ring-4 ring-yellow-400 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {idx === 0 && (
              <span
                className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10 animate-pulse
                  bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-yellow-500 text-black"
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontWeight: 900,
                  letterSpacing: '0.5px',
                  boxShadow: '0 0 20px rgba(255, 214, 0, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4em',
                }}
              >
                <FaStar style={{ filter: 'drop-shadow(0 0 4px #FFD600)' }} />
                <span>Destacado</span>
              </span>
            )}

            {/* Imagen principal - ocupa todo el ancho */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-300 dark:border-gray-600">
              <div className="absolute inset-0 border-4 border-white/20 dark:border-black/30 pointer-events-none z-10"></div>
              <img
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                src={urlForImage(el?.imgdw?.asset?._ref).url()}
                alt={el?.titulo || "Catalogo"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Título sobre la imagen */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-bold uppercase tracking-wide drop-shadow-lg">
                  {el?.titulo}
                </h3>
              </div>
            </div>

            {/* Contenido inferior */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                  {provinciaSeleccionada}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {el?.marca}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                <span className="font-semibold uppercase">{el?.mes || new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                <span className="text-[10px]">
                  {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} • {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <a
                  href={getUrlFromId(el.asset?._ref)}
                  target="_blank"
                  onClick={() => handleDownloadClick(el)}
                  className="flex-1"
                >
                  <Button className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-yellow-400 hover:to-yellow-500 focus:ring-yellow-300 rounded-lg text-sm px-4 py-2.5 shadow-md transition-all hover:shadow-lg">
                    <FaDownload /> Descargar
                  </Button>
                </a>

                <Link
                  href={getUrlFromId(el.asset?._ref)}
                  target="_blank"
                  onClick={() => handleViewClick(el)}
                  className="flex-1"
                >
                  <Button className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:ring-blue-300 rounded-lg text-sm px-4 py-2.5 shadow-md transition-all">
                    <FaEye /> Ver
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
