"use client";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaDownload, FaEye, FaStar } from "react-icons/fa";
import { Button } from "../ui/button";
import { track } from '@vercel/analytics';
export default function DescargarPdf({ catalogo }) {
  const [provinciaSeleccionada] = useState("mayorista");
  const [dataCatalogo, setDataCatalogo] = useState(catalogo.catalogospdf);

  const getUrlFromId = (pdf) => {
    const [_file, id, extension] = pdf?.split("-");
    return `https://cdn.sanity.io/files/ibvmpbc1/production/${id}.${extension}`;
  };

  useEffect(() => {
    if (provinciaSeleccionada === "mayorista") {
      setDataCatalogo(catalogo.catalogospdf);
    } else {
      setDataCatalogo(catalogo.catalogospdf_emprendedor);
    }
  }, [provinciaSeleccionada]);

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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="text-center w-full text-xl sm:text-2xl font-bold uppercase tracking-wide text-gray-800 dark:text-gray-100 py-5">
        CATALOGO {provinciaSeleccionada}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {dataCatalogo?.map((el, idx) => (
          <section
            key={el._key}
            className={`relative px-4 py-5 border rounded-2xl shadow-md transition-transform duration-200 hover:scale-[1.01] bg-white dark:bg-gray-900 dark:border-blue-gray-500 border-blue-gray-200 ${
              idx === 0
                ? "ring-4 ring-yellow-400 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
                : ""
            }`}
          >
            {idx === 0 && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md z-10">
                <FaStar /> Destacado
              </span>
            )}

            <div className="text-center uppercase font-semibold text-gray-800 dark:text-gray-100 h-12 flex items-center justify-center text-sm sm:text-base truncate">
              {el?.titulo}
            </div>

            <div className="flex justify-center items-center mt-1 mb-2 text-xs text-gray-600 dark:text-gray-300">
              <span>Catálogo: </span>
              <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                {provinciaSeleccionada}
              </span>
            </div>

            <div className="flex justify-between py-1 text-xs uppercase text-gray-500 dark:text-gray-300">
              <div className="font-bold">{el?.mes}</div>
              <div className="font-bold">{el?.marca}</div>
            </div>

            <div className="flex justify-center py-2">
              <img
                className="rounded-lg shadow-md object-cover border border-gray-200 dark:border-gray-700 max-w-full h-auto"
                src={urlForImage(el?.imgdw?.asset?._ref).url()}
                alt={el?.titulo || "Catalogo"}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <a
                href={getUrlFromId(el.asset?._ref)}
                target="_blank"
                onClick={() => handleDownloadClick(el)}
                className="flex-1"
              >
                <Button className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-yellow-400 hover:to-yellow-500 focus:ring-yellow-300 rounded-lg text-sm px-4 py-2.5 shadow-md">
                  <FaDownload /> Descargar
                </Button>
              </a>

              <Link
                href={getUrlFromId(el.asset?._ref)}
                target="_blank"
                onClick={() => handleViewClick(el)}
                className="flex-1"
              >
                <Button className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-r from-blue-700 to-blue-900 hover:from-yellow-400 hover:to-yellow-500 focus:ring-blue-300 rounded-lg text-sm px-4 py-2.5 shadow-md">
                  <FaEye /> Ver
                </Button>
              </Link>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
