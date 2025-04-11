"use client";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function DescargarPdf({ catalogo }) {
  console.log(catalogo);

  const [provinciaSeleccionada, setProvinciaSeleccionada] =
    useState("mayorista");

  const [dataCatalogo, setDataCatalogo] = useState(catalogo.catalogospdf);
  const getUrlFromId = (pdf) => {
    // Example ref: file-207fd9951e759130053d37cf0a558ffe84ddd1c9-mp3
    // We don't need the first part, unless we're using the same function for files and images
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

  return (
    <div>
      <div className="flex justify-center w-full 2xl:text-2xl xl:text-2xl py-5 text-xl font-semibold uppercase">
        CATALOGO {provinciaSeleccionada}
      </div>
      <div className="mb-4 xl:flex flex flex-col items-center justify-center xl:flex-row">
        <label className="font-bold">Selecciona un Tipo:</label>
        <select
          className="ml-2 p-2 border rounded text-black"
          onChange={(e) => setProvinciaSeleccionada(e.target.value)}
        >
          <option value={"mayorista"}>mayorista</option>
          <option value={"emprendedor"}>emprendedor</option>
        </select>
      </div>
      <div className="flex justify-center w-full">
        <div className="grid md:gap-x-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-x-10 gap-y-5 ">
          {dataCatalogo?.map((el) => (
            <section
              key={el._key}
              className=" px-5 py-5 border-[1px] dark:border-blue-gray-500 border-blue-gray-600 rounded-xl"
            >
              <div className="text-center xl:text-lg uppercase py-2">
                {el?.titulo}
              </div>
              <div className="flex justify-center items-center">
                <div className="text-xs">Catalogo: </div>
                <span className="text-sm">{provinciaSeleccionada}</span>
              </div>
              <div className="flex justify-between py-2 uppercase text-xs ">
                <div> {el?.mes}</div>
                <div>{el?.marca}</div>
              </div>
              <img
                className=""
                src={urlForImage(el?.imgdw?.asset?._ref).url()}
                alt=""
              />

              <div className="w-full flex justify-center py-3">
                <a href={getUrlFromId(el.asset?._ref)} target="_blank">
                  <button
                    type="button"
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  >
                    Descargar
                  </button>
                </a>
                <Link href={getUrlFromId(el.asset?._ref)} target="_blank">
                  <button
                    type="button"
                    className="text-white  bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  >
                    Ver
                  </button>
                </Link>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
