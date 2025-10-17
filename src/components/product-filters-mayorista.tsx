"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ProductFiltersMayorista({ mayorista }: { mayorista: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname() || "";
  const [loaded, setLoaded] = useState(false);

  const [selectedLinea, setSelectedLinea] = useState<string | null>(() => {
    const razonsocial = searchParams?.get("razonsocial") ?? "";
    const tipoproducto = searchParams?.get("tipoproducto") ?? "";

    if (razonsocial === "fritzsport" && tipoproducto === "catalogo") {
      return "catalogo";
    } else if (razonsocial === "fritzduran" && tipoproducto === "catalogo") {
      return "liquidacion";
    }
    return null;
  });

  // 🔹 Apagar loader cuando cambia la URL
  useEffect(() => {
    setLoaded(false);
  }, [pathname, searchParams]);

  const handleLineaFilter = (linea: string | null) => {
    setLoaded(true);
    setSelectedLinea(linea);

    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (linea === "catalogo") {
      params.set("razonsocial", "fritzsport");
      params.set("tipoproducto", "catalogo");
      params.delete("linea");
    } else if (linea === "liquidacion") {
      params.set("razonsocial", "fritzduran");
      params.set("tipoproducto", "catalogo");
      params.delete("linea");
    } else {
      params.delete("razonsocial");
      params.delete("tipoproducto");
      params.delete("linea");
    }

    params.delete("page");

    const queryString = params.toString();
    router.push(
      `/${mayorista ? "tienda-mayorista" : "tienda"}${
        queryString ? `?${queryString}` : ""
      }`
    );
  };

  const clearFilters = () => {
    setSelectedLinea(null);
    router.push(`/${mayorista ? "tienda-mayorista" : "tienda"}`);
  };

  const hasActiveFilters = selectedLinea !== null;

  return (
    <div className="sticky top-16  space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Filtros Mayorista
        </h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Loader o Filtros */}
      {loaded ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-600 dark:text-blue-300 font-medium ">
            Cargando...
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
            Tipo de Producto
          </h4>
          <div className="space-y-3">
            <button
              onClick={() => handleLineaFilter(null)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                selectedLinea === null
                  ? "bg-blue-500 text-white border-blue-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-blue-400"
              }`}
            >
              📦 Todos los productos
            </button>
            <button
              onClick={() => handleLineaFilter("catalogo")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                selectedLinea === "catalogo"
                  ? "bg-green-500 text-white border-green-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:border-green-300 hover:bg-green-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-green-400"
              }`}
            >
              🏷️ Línea Regular
            </button>
            <button
              onClick={() => handleLineaFilter("liquidacion")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                selectedLinea === "liquidacion"
                  ? "bg-red-500 text-white border-red-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:border-red-300 hover:bg-red-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-red-400"
              }`}
            >
              🔥 Liquidación
            </button>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>
            • <strong>Línea Regular:</strong> Productos de temporada actual
          </p>
          <p>
            • <strong>Liquidación:</strong> Productos en oferta especial
          </p>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedLinea && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {selectedLinea === "catalogo"
                ? "Línea Regular"
                : "Liquidación"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
