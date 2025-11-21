"use client";
import { urlForImage } from "@/sanity/lib/image";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
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

  const getMarcaLogo = (marca) => {
    const marcaLower = marca?.toLowerCase();
    if (marcaLower === "adidas") {
      return "https://cdn.sanity.io/images/ibvmpbc1/production/ee995528aa127d0552dd5316aa8847ffe79adc8b-196x196.png";
    } else if (marcaLower === "nike") {
      return "https://cdn.sanity.io/images/ibvmpbc1/production/c4f4c571a1e591fa12e147037f7b4fcf33dea577-196x196.png";
    } else if (marcaLower === "umbro") {
      return "https://cdn.sanity.io/images/ibvmpbc1/production/9d0a222c5b91f8b28240fbee5f87dbf4b7bb949e-510x330.png";
    } else if (marcaLower === "fritzsport") {
      return "https://cdn.sanity.io/images/ibvmpbc1/production/1f88bc3407a18b080e2d40b1a560cdede9aba9c5-1080x1080.png";
    } else if (marcaLower === "reebok") {
      return "https://cdn.sanity.io/images/ibvmpbc1/production/9bc79d5239ce2e4b60d2da9936fafd69e38242c5-1089x296.png";
    }
    return "https://cdn.sanity.io/images/ibvmpbc1/production/4a5cdee84967d0d4fa665fcde4263e8128a52909-196x196.png";
  };

  const getBadgeInfo = (titulo) => {
    const tituloLower = titulo?.toLowerCase() || '';
    if (tituloLower.includes('liquidacion') || tituloLower.includes('liquidación')) {
      return { text: 'Liquidación', color: 'bg-red-600 text-white' };
    } else if (tituloLower.includes('linea') || tituloLower.includes('línea')) {
      return { text: 'Línea', color: 'bg-blue-600 text-white' };
    }
    return { text: 'Destacado', color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' };
  };

  const getBrandsToShow = (titulo, marca) => {
    const tituloLower = titulo?.toLowerCase() || '';
    
    // Catálogo Nike Mayorista - solo Nike
    if (tituloLower.includes('nikemayorista') || tituloLower.includes('nike mayorista')) {
      return ['nike'];
    }
    
    // Lo más nuevo - 4 marcas
    if (tituloLower.includes('lo mas nuevo') || tituloLower.includes('lo más nuevo') || tituloLower.includes('nuevo')) {
      return ['fritzsport', 'adidas', 'nike', 'reebok'];
    }
    
    // Peloteras, ropa, tallas grandes, accesorios - Adidas y Nike
    if (tituloLower.includes('peloteras') || 
        tituloLower.includes('ropa') || 
        tituloLower.includes('tallas grandes') || 
        tituloLower.includes('accesorios')) {
      return ['adidas', 'nike'];
    }
    
    // Por defecto, mostrar la marca del catálogo
    return [marca];
  };

  const getApproximateTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.floor(minutes / 5) * 5;
    const approximateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), roundedMinutes);
    return approximateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
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
      <div className="text-center w-full text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 py-8">
        Catálogo {provinciaSeleccionada.charAt(0).toUpperCase() + provinciaSeleccionada.slice(1)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-6 gap-x-1 gap-y-6">
        {dataCatalogo.map((el, idx) => (
          <a
            key={el._key}
            href={getUrlFromId(el.asset?._ref)}
            target="_blank"
            onClick={() => handleViewClick(el)}
            className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-900 border cursor-pointer block ${
              idx === 0
                ? "ring-[1px] ring-black dark:ring-white border-black dark:border-white"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            {idx === 0 && (() => {
              const badge = getBadgeInfo(el?.titulo);
              return (
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-semibold z-10 uppercase tracking-wider ${badge.color}`}>
                  {badge.text}
                </span>
              );
            })()}

            {/* Imagen principal - ocupa todo el ancho */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={urlForImage(el?.imgdw?.asset?._ref).url()}
                alt={el?.titulo || "Catalogo"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              

            </div>

            {/* Contenido inferior */}
            <div className="p-6">
              {/* Título */}
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
                {el?.titulo}
              </h3>

              {/* Marca con logo */}
              {(() => {
                const brands = getBrandsToShow(el?.titulo, el?.marca);
                const isMultipleBrands = brands.length > 1;
                
                return (
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {brands.map((brand, index) => (
                      <div 
                        key={index}
                        className="w-10 h-10 bg-black rounded-md p-1.5 flex items-center justify-center border border-gray-100 dark:border-gray-700"
                      >
                        <img 
                          src={getMarcaLogo(brand)} 
                          alt={brand}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                    {!isMultipleBrands && (
                      <span className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">
                        {brands[0]}
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* Separador */}
              <div className="h-px bg-gray-200 dark:bg-gray-700 mb-4"></div>

              {/* Información */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Periodo</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white capitalize">
                    {el?.mes || new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Última actualización</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">
                      {getApproximateTime()}
                    </span>
                  </span>
                </div>
              </div>

              {/* Call to action minimalista */}
              <div className="flex items-center justify-center gap-2 pt-2 text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                <FaEye className="text-sm" />
                <span>Ver catálogo</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
