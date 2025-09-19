"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

import { ChevronDown, Filter } from "lucide-react";
import { Separator } from "./ui/separator";

const discountRanges = [
  { label: "30% - 39%", value: "30-39" },
  { label: "40% - 49%", value: "40-49" },
  { label: "50% - 59%", value: "50-59" },
  { label: "60% - 69%", value: "60-69" },
  { label: "70% o más", value: "70-100" },
];

const brands = [
  { label: "Adidas", value: "adidas" },
  { label: "Nike", value: "nike" },
  { label: "Puma", value: "puma" },
  { label: "New Balance", value: "new-balance" },
  { label: "Converse", value: "converse" },
];

const categories = [
  { label: "Calzado", value: "calzado" },
  { label: "Ropa", value: "ropa" },
];

const genders = [
  { label: "Hombre", value: "hombre" },
  { label: "Mujer", value: "mujer" },
  { label: "Niños", value: "niños" },
  { label: "Unisex", value: "unisex" },
];

export function ProductFiltersOutlet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentDiscount = searchParams.get("discount");
  const currentMarca = searchParams.get("marca");
  const currentTipo = searchParams.get("tipo");
  const currentGenero = searchParams.get("genero");

  const filterCount = [currentDiscount, currentMarca, currentTipo, currentGenero].filter(Boolean).length;

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // Reset page when filtering
    params.delete("page");
    
    startTransition(() => {
      router.push(`/outlet?${params.toString()}`);
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push("/outlet");
    });
  };

  const hasActiveFilters = currentDiscount || currentMarca || currentTipo || currentGenero;

  return (
    <div className="w-full relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex justify-center items-center z-50 rounded-lg min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-t-red-500 border-gray-300 rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Aplicando filtros...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Esto puede tomar unos segundos
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <span className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filtros Outlet {filterCount > 0 && `(${filterCount})`}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Filters */}
      <div className={`space-y-6 ${isOpen ? "block" : "hidden lg:block"}`}>
        {/* Clear filters */}
        {hasActiveFilters && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Filtros activos ({filterCount})
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                disabled={isPending}
                className="text-red-600 hover:text-red-800 hover:bg-red-100 disabled:opacity-50"
              >
                Limpiar todos
              </Button>
            </div>
          </div>
        )}

        {/* Discount Range Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-600">🔥 Nivel de Descuento</h3>
          <div className="space-y-2">
            {discountRanges.map((range) => (
              <Button
                key={range.value}
                variant={currentDiscount === range.value ? "default" : "ghost"}
                size="sm"
                onClick={() => updateFilter("discount", range.value)}
                disabled={isPending}
                className={`w-full justify-start disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentDiscount === range.value 
                    ? "bg-red-500 hover:bg-red-600 text-white" 
                    : "hover:bg-red-50"
                }`}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Brand Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Marca</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <Button
                key={brand.value}
                variant={currentMarca === brand.value ? "default" : "ghost"}
                size="sm"
                onClick={() => updateFilter("marca", brand.value)}
                disabled={isPending}
                className="w-full justify-start disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {brand.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Categoría</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={currentTipo === category.value ? "default" : "ghost"}
                size="sm"
                onClick={() => updateFilter("tipo", category.value)}
                disabled={isPending}
                className="w-full justify-start disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Gender Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Género</h3>
          <div className="space-y-2">
            {genders.map((gender) => (
              <Button
                key={gender.value}
                variant={currentGenero === gender.value ? "default" : "ghost"}
                size="sm"
                onClick={() => updateFilter("genero", gender.value)}
                disabled={isPending}
                className="w-full justify-start disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gender.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Outlet Info */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-800 mb-2">ℹ️ Información Outlet</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {/* <li>• Solo productos Fritz Sport</li> */}
            <li>• Descuentos mínimos del 30%</li>
            <li>• Stock limitado</li>
            <li>• Ofertas por tiempo limitado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}