"use client";

import React, { useState } from "react";
import { MapPin, Package, ChevronDown, ChevronUp, Store } from "lucide-react";
import { obtenerNombreAlmacen, obtenerProvinciaAlmacen } from "@/utils/mapear-almacenes";

interface AlmacenInfo {
  almacen: string;
  codigoAlmacen: string;
  nombreAlmacen: string;
  provincia: string;
  stock: number;
}

interface Talla {
  talla: string;
  stock: number;
  almacenes: AlmacenInfo[];
}

interface DisponibilidadAlmacenSimpleProps {
  tallas: Talla[];
  className?: string;
}

export default function DisponibilidadAlmacenSimple({ 
  tallas, 
  className = "" 
}: DisponibilidadAlmacenSimpleProps) {
  const [tallaExpandida, setTallaExpandida] = useState<string | null>(null);

  const toggleTalla = (talla: string) => {
    setTallaExpandida(tallaExpandida === talla ? null : talla);
  };

  // Filtrar solo tallas con stock > 0 y procesar almacenes únicos
  const tallasConStock = tallas.filter(talla => talla.stock > 0).map(talla => {
    // Agrupar almacenes por código para evitar duplicados
    const almacenesUnicos = new Map();
    
    talla.almacenes.forEach(almacen => {
      // Filtrar almacenes con stock > 0 y que tengan un código de almacén válido
      if (almacen.stock > 0 && almacen.codigoAlmacen && 
          !almacen.nombreAlmacen.includes("Desconocido") && 
          !almacen.nombreAlmacen.includes("Almacén 4")) {
        
        // Usar solo el código de almacén como clave para evitar duplicados
        const key = almacen.codigoAlmacen;
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
      almacenes: Array.from(almacenesUnicos.values())
    };
  }).filter(talla => talla.almacenes.length > 0); // Solo mostrar tallas que tengan almacenes válidos

  if (tallasConStock.length === 0) {
    return (
      <div className={`text-center py-4 text-gray-500 dark:text-gray-400 ${className}`}>
        <Package className="w-6 h-6 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No hay stock disponible</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Disponibilidad por Almacén
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Stock disponible en nuestros almacenes
        </p>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="space-y-3">
          {tallasConStock.map((talla, index) => (
            <div 
              key={index} 
              className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
            >
              {/* Header de la talla */}
              <div 
                className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                onClick={() => toggleTalla(talla.talla)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Talla {talla.talla}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {talla.stock} unidades disponibles
                        </span>
                        <div className="text-xs bg-green-100 flex dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                          <div className="mr-1">
                            {talla.almacenes.length}
                          </div>
                          <div className="ml-1">
                            almacén{talla.almacenes.length !== 1 ? 'es' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {talla.almacenes.length > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {tallaExpandida === talla.talla ? 'Ocultar' : 'Ver'} 
                      </span>
                      {tallaExpandida === talla.talla ? (
                        <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Detalles de almacenes */}
              {talla.almacenes.length > 1 && tallaExpandida === talla.talla && (
                <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="pt-3 space-y-2">
                    {talla.almacenes.map((almacen, almIndex) => (
                      <div 
                        key={almIndex} 
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {almacen.nombreAlmacen}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {obtenerProvinciaAlmacen(almacen.codigoAlmacen, almacen.almacen)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {almacen.stock} unid.
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Si solo hay un almacén, mostrarlo directamente */}
              {talla.almacenes.length === 1 && (
                <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="pt-3">
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {talla.almacenes[0].nombreAlmacen}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {obtenerProvinciaAlmacen(talla.almacenes[0].codigoAlmacen, talla.almacenes[0].almacen)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {talla.almacenes[0].stock} unid.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


