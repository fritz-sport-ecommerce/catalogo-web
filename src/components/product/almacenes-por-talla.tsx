"use client";

import React, { useState } from "react";
import { MapPin, Package, ChevronDown, ChevronUp } from "lucide-react";
import { obtenerNombreAlmacen, obtenerProvinciaAlmacen } from "@/utils/mapear-almacenes";

interface AlmacenInfo {
  almacen: string;
  codigoAlmacen: string;
  nombreAlmacen: string;
  provincia: string;
  stock: number;
}

interface TallaConAlmacenes {
  talla: string;
  stock: number;
  almacenes: AlmacenInfo[];
}

interface AlmacenesPorTallaProps {
  tallas: TallaConAlmacenes[];
  className?: string;
}

export default function AlmacenesPorTalla({ tallas, className = "" }: AlmacenesPorTallaProps) {
  const [tallaExpandida, setTallaExpandida] = useState<string | null>(null);

  const toggleTalla = (talla: string) => {
    setTallaExpandida(tallaExpandida === talla ? null : talla);
  };

  // Filtrar solo tallas con stock > 0 y procesar almacenes únicos
  const inputTallas: TallaConAlmacenes[] = Array.isArray(tallas) ? tallas : [];
  const tallasConStock = inputTallas.filter(talla => (talla?.stock ?? 0) > 0).map(talla => {
    // Agrupar almacenes por código para evitar duplicados
    const almacenesUnicos = new Map();
    
    const almacenes: AlmacenInfo[] = Array.isArray(talla.almacenes) ? talla.almacenes : [];
    almacenes.forEach(almacen => {
      // Filtrar almacenes con stock > 0 y que tengan un código de almacén válido
      if ((almacen?.stock ?? 0) > 0 && almacen?.codigoAlmacen && 
          !(almacen?.nombreAlmacen || "").includes("Desconocido") && 
          !(almacen?.nombreAlmacen || "").includes("Almacén 4")) {
        
        // Usar solo el código de almacén como clave para evitar duplicados
        const key = String(almacen.codigoAlmacen);
        if (almacenesUnicos.has(key)) {
          // Si ya existe, sumar el stock
          almacenesUnicos.get(key).stock += almacen.stock;
        } else {
          // Si no existe, agregarlo con el nombre basado en código de almacén
          almacenesUnicos.set(key, { 
            ...almacen,
            nombreAlmacen: obtenerNombreAlmacen(almacen.codigoAlmacen, almacen.almacen)
          });
        }
      }
    });

    return {
      ...talla,
      almacenes: Array.from(almacenesUnicos.values()) as AlmacenInfo[]
    };
  }).filter(talla => Array.isArray(talla.almacenes) && talla.almacenes.length > 0); // Solo mostrar tallas que tengan almacenes válidos

  if (tallasConStock.length === 0) {
    return (
      <div className={`text-center py-4 text-gray-500 dark:text-gray-400 ${className}`}>
        <Package className="w-6 h-6 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No hay tallas disponibles</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
        <MapPin className="w-4 h-4 mr-2" />
        Disponibilidad por Almacén
      </h4>
      
      {tallasConStock.map((talla) => (
        <div key={talla.talla} className="border border-gray-200 dark:border-gray-600 rounded-lg">
          {/* Header de la talla */}
          <button
            onClick={() => toggleTalla(talla.talla)}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white mr-2">
                Talla {talla.talla}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({talla.stock} disponibles)
              </span>
            </div>
            {Array.isArray(talla.almacenes) && talla.almacenes.length > 1 && (
              <div className="flex items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                  {talla.almacenes.length} almacenes
                </span>
                {tallaExpandida === talla.talla ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </div>
            )}
          </button>

          {/* Contenido expandible */}
          {tallaExpandida === talla.talla && Array.isArray(talla.almacenes) && (
            <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-600">
              <div className="space-y-2 pt-3">
                {talla.almacenes.map((almacen, index) => (
                  <div
                    key={`${talla.talla}-${almacen.codigoAlmacen}-${index}`}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-gray-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {obtenerNombreAlmacen(almacen.codigoAlmacen, almacen.almacen)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {obtenerProvinciaAlmacen(almacen.codigoAlmacen, almacen.almacen)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {almacen.stock}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        unidades
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vista compacta para una sola talla o cuando no está expandida */}
          {Array.isArray(talla.almacenes) && talla.almacenes.length === 1 && (
            <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded mt-3">
                <div className="flex items-center">
                  <Package className="w-4 h-4 text-gray-500 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {obtenerNombreAlmacen(talla.almacenes[0].codigoAlmacen, talla.almacenes[0].almacen)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {obtenerProvinciaAlmacen(talla.almacenes[0].codigoAlmacen, talla.almacenes[0].almacen)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {talla.almacenes[0].stock}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    unidades
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
