"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function PriceRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Cargar valores existentes del URL
  useEffect(() => {
    const rangoPrecio = searchParams.get("rangoPrecio");
    if (rangoPrecio) {
      const [min, max] = rangoPrecio.split("-");
      setMinPrice(min || "");
      setMaxPrice(max || "");
    } else {
      setMinPrice("");
      setMaxPrice("");
    }
  }, [searchParams]);

  const applyPriceFilter = useCallback(() => {
    if (!minPrice && !maxPrice) return;
    
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || 999999;
    
    // Validar que el mínimo no sea mayor que el máximo
    if (min > max) {
      alert("El precio mínimo no puede ser mayor que el máximo");
      return;
    }
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (minPrice || maxPrice) {
      params.set("rangoPrecio", `${min}-${max}`);
    } else {
      params.delete("rangoPrecio");
    }
    
    // Resetear página a 1
    params.delete("page");
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [minPrice, maxPrice, searchParams, pathname, router, startTransition]);

  const clearPriceFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("rangoPrecio");
    params.delete("page");
    
    setMinPrice("");
    setMaxPrice("");
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router, startTransition]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyPriceFilter();
    }
  };

  const isOutlet = pathname === "/outlet";
  const hasActiveFilter = searchParams.get("rangoPrecio");

  return (
    <div className="relative space-y-4">
      {/* Loader overlay cuando se está aplicando el filtro */}
      {isPending && (
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex justify-center items-center z-50 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Aplicando filtro de precios...
            </span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="min-price" className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Precio mín.
          </Label>
          <Input
            id="min-price"
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isPending}
            className="mt-1"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="max-price" className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Precio máx.
          </Label>
          <Input
            id="max-price"
            type="number"
            placeholder="999999"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isPending}
            className="mt-1"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={applyPriceFilter}
          disabled={isPending || (!minPrice && !maxPrice)}
          size="sm"
          className={`flex-1 text-xs ${
            isOutlet
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } disabled:opacity-50`}
        >
          {isPending ? "Aplicando..." : "Aplicar"}
        </Button>
        
        {hasActiveFilter && (
          <Button
            onClick={clearPriceFilter}
            disabled={isPending}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Limpiar
          </Button>
        )}
      </div>

      {/* Rangos de precio predefinidos */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Rangos populares:
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "S/ 0 - 100", min: "0", max: "100" },
            { label: "S/ 100 - 200", min: "100", max: "200" },
            { label: "S/ 200 - 300", min: "200", max: "300" },
            { label: "S/ 300 - 500", min: "300", max: "500" },
            { label: "S/ 500 - 800", min: "500", max: "800" },
            { label: "S/ 800+", min: "800", max: "999999" },
          ].map((range) => (
            <Button
              key={range.label}
              onClick={() => {
                setMinPrice(range.min);
                setMaxPrice(range.max === "999999" ? "" : range.max);
                // Auto-aplicar el filtro
                setTimeout(() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("rangoPrecio", `${range.min}-${range.max}`);
                  params.delete("page");
                  startTransition(() => {
                    router.replace(`${pathname}?${params.toString()}`);
                  });
                }, 100);
              }}
              disabled={isPending}
              size="sm"
              variant="outline"
              className={`text-xs h-8 ${
                hasActiveFilter === `${range.min}-${range.max}`
                  ? isOutlet
                    ? "bg-red-100 border-red-300 text-red-700"
                    : "bg-blue-100 border-blue-300 text-blue-700"
                  : ""
              }`}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {hasActiveFilter && (
        <div className={`text-xs p-2 rounded ${
          isOutlet
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-blue-50 text-blue-700 border border-blue-200"
        }`}>
          <strong>Filtro activo:</strong> S/ {hasActiveFilter.replace("-", " - ")}
        </div>
      )}
    </div>
  );
}