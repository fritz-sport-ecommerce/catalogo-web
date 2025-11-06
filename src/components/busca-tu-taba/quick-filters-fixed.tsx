"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useTallasDisponibles } from "@/hooks/useTallasDisponibles";
import { useOpcionesDisponibles } from "@/hooks/useOpcionesDisponibles";
import SkeletonLoader, { LoadingState } from "./SkeletonLoader";

// Función para convertir talla EU a USA aproximada (inversa)
function convertEUToUSAApprox(tallaEU: string, genero: string): string {
  const eu = parseFloat(tallaEU);
  if (isNaN(eu)) return tallaEU;
  
  // Conversión aproximada según género
  if (genero === 'hombre') {
    // Hombre: EU - 33 = USA aproximadamente
    const usa = eu - 33;
    return usa % 1 === 0 ? usa.toString() : usa.toFixed(1);
  } else if (genero === 'mujer') {
    // Mujer: EU - 30.5 = USA aproximadamente
    const usa = eu - 30.5;
    return usa % 1 === 0 ? usa.toString() : usa.toFixed(1);
  } else {
    // Unisex/Niños: usar conversión de hombre
    const usa = eu - 33;
    return usa % 1 === 0 ? usa.toString() : usa.toFixed(1);
  }
}

function useURLState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const setParams = useCallback((updates: Record<string, string | null | undefined>, immediate = false) => {
    const applyChanges = () => {
      const params = new URLSearchParams(searchParams?.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === undefined || val === "") {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (immediate) {
      if (debounceTimer) clearTimeout(debounceTimer);
      applyChanges();
    } else {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(applyChanges, 500);
      setDebounceTimer(timer);
    }
  }, [router, pathname, searchParams, debounceTimer]);

  return { searchParams, setParams };
}

type RowItem = {
  key: string;
  label: string;
  emoji: string;
};

// Categorías dinámicas según el tipo de producto
const CATEGORY_OPTIONS: Record<string, RowItem[]> = {
  calzado: [
    { key: "chimpunes", label: "Chimpunes", emoji: "⚽" },
    { key: "urbano", label: "Urbano", emoji: "👟" },
    { key: "running", label: "Running", emoji: "🏃" },
    { key: "tenis", label: "Tenis", emoji: "🎾" },
    { key: "basquet", label: "Básket", emoji: "🏀" },
    { key: "training", label: "Training", emoji: "💪" },
    { key: "sandalias", label: "Sandalias", emoji: "🩴" },
    { key: "skateboarding", label: "Skateboarding", emoji: "🛹" },
  ],
  ropa: [
    { key: "polos", label: "Polos", emoji: "👕" },
    { key: "camisetas", label: "Camisetas", emoji: "👔" },
    { key: "casacas", label: "Casacas", emoji: "🧥" },
    { key: "shorts", label: "Shorts", emoji: "🩳" },
    { key: "pantalon", label: "Pantalones", emoji: "👖" },
    { key: "buzos", label: "Buzos", emoji: "🧥" },
    { key: "leggins", label: "Leggins", emoji: "👗" },
    { key: "poleras", label: "Poleras", emoji: "👚" },
    { key: "medias", label: "Medias", emoji: "🧦" },
  ],
  accesorios: [
    { key: "mochilas", label: "Mochilas", emoji: "🎒" },
    { key: "gorras", label: "Gorras", emoji: "🧢" },
    { key: "bolsos", label: "Bolsos", emoji: "👜" },
    { key: "morral", label: "Morral", emoji: "🎒" },
    { key: "pelotas", label: "Pelotas", emoji: "⚽" },
    { key: "guantes", label: "Guantes", emoji: "🧤" },
    { key: "canillera", label: "Canilleras", emoji: "🦵" },
    { key: "tomatodos", label: "Toma Todo", emoji: "🍶" },
    { key: "maletin", label: "Maletín", emoji: "👜" },
  ],
};

// Definición de tallas
const TALLAS_ROPA = [
  { value: "2XS", label: "2XS" },
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "2XL", label: "2XL" },
  { value: "3XL", label: "3XL" },
  { value: "4XL", label: "4XL" },
];

const TALLAS_CALZADO_EU = [
  { value: "36", label: "36" },
  { value: "36.5", label: "36.5" },
  { value: "37", label: "37" },
  { value: "37.5", label: "37.5" },
  { value: "38", label: "38" },
  { value: "38.5", label: "38.5" },
  { value: "39", label: "39" },
  { value: "39.5", label: "39.5" },
  { value: "40", label: "40" },
  { value: "40.5", label: "40.5" },
  { value: "41", label: "41" },
  { value: "41.5", label: "41.5" },
  { value: "42", label: "42" },
  { value: "42.5", label: "42.5" },
  { value: "43", label: "43" },
  { value: "43.5", label: "43.5" },
  { value: "44", label: "44" },
  { value: "44.5", label: "44.5" },
  { value: "45", label: "45" },
  { value: "45.5", label: "45.5" },
  { value: "46", label: "46" },
  { value: "47", label: "47" },
  { value: "48", label: "48" },
];

const TALLAS_NINOS = [
  { value: "3K", label: "3K" },
  { value: "4K", label: "4K" },
  { value: "5K", label: "5K" },
  { value: "6K", label: "6K" },
  { value: "7K", label: "7K" },
  { value: "8K", label: "8K" },
  { value: "9K", label: "9K" },
  { value: "10K", label: "10K" },
  { value: "11K", label: "11K" },
  { value: "12K", label: "12K" },
  { value: "13K", label: "13K" },
];

interface QuickFiltersProps {
  variant?: "onboarding" | "sidebar";
}

export default function QuickFilters({ variant = "sidebar" }: QuickFiltersProps) {
  const { searchParams, setParams } = useURLState();
  const activeCategory = searchParams?.get("category") || "";
  const activeFecha = searchParams?.get("fecha") || "";
  const activeGenero = searchParams?.get("genero") || "";
  const activeMarca = searchParams?.get("marca") || "";
  const activeRango = searchParams?.get("rangoPrecio") || "";
  const activeTipo = searchParams?.get("tipo") || "";
  const activeTalla = searchParams?.get("talla") || "";
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasTipo = Boolean(activeTipo);
  const hasGenero = Boolean(activeGenero);
  const hasStyleSelected = Boolean(activeCategory);
  const hasTalla = Boolean(activeTalla);
  const hasMarca = Boolean(activeMarca);
  const hasRango = Boolean(activeRango);

  // Verificar si el tipo seleccionado requiere talla (calzado o ropa)
  const tipoRequiereTalla = activeTipo.split('.').some(tipo => tipo === 'calzado' || tipo === 'ropa');

  // Steps: 1 Tipo, 2 Género, 3 Estilo, 4 Talla (solo para calzado/ropa), 5 Marca, 6 Precio
  const currentStep = !hasTipo ? 1 
    : !hasGenero ? 2 
    : !hasStyleSelected ? 3 
    : (tipoRequiereTalla && !hasTalla) ? 4
    : !hasMarca ? (tipoRequiereTalla ? 5 : 4)
    : !hasRango ? (tipoRequiereTalla ? 6 : 5) 
    : (tipoRequiereTalla ? 7 : 6);

  const maxStepAvailable = Math.min(currentStep, tipoRequiereTalla ? 6 : 5);
  const [activeStep, setActiveStep] = useState<number>(Math.min(currentStep, tipoRequiereTalla ? 6 : 5));

  // Mantener el step activo dentro de los límites disponibles cuando cambian los filtros
  useEffect(() => {
    setActiveStep((prev) => Math.min(prev, maxStepAvailable));
  }, [maxStepAvailable]);

  // IMPORTANTE: Llamar TODOS los hooks al nivel superior (no condicionalmente)
  // Hook para estilos disponibles (Paso 3)
  const { opciones: opcionesEstilos, totalProductos: totalEstilos, loading: loadingEstilos } = useOpcionesDisponibles({
    tipo: activeTipo,
    genero: activeGenero
  });

  // Hook para tallas disponibles (Paso 4)
  const { tallasDisponibles, loading: loadingTallas } = useTallasDisponibles({
    tipo: activeTipo,
    genero: activeGenero,
    category: activeCategory,
    marca: activeMarca,
    rangoPrecio: activeRango
  });

  // Hook para marcas disponibles (Paso 5)
  const { opciones: opcionesMarcas, totalProductos: totalMarcas, loading: loadingMarcas } = useOpcionesDisponibles({
    tipo: activeTipo,
    genero: activeGenero,
    category: activeCategory
  });

  // Hook para precios disponibles (Paso 6)
  const { opciones: opcionesPrecios, totalProductos: totalPrecios, loading: loadingPrecios } = useOpcionesDisponibles({
    tipo: activeTipo,
    genero: activeGenero,
    category: activeCategory,
    marca: activeMarca
  });

  const isRowActive = (key: string) => {
    return activeCategory.split(".").includes(key);
  };

  const onRowClick = (key: string) => {
    const current = activeCategory ? activeCategory.split(".") : [];
    let next: string[];
    if (current.includes(key)) {
      next = current.filter((v) => v !== key);
    } else {
      next = [...current, key];
    }
    setParams({ category: next.length ? next.join(".") : null }, true);
  };

  const onTipoClick = (tipo: string) => {
    const current = activeTipo ? activeTipo.split(".") : [];
    let next: string[];
    if (current.includes(tipo)) {
      next = current.filter((v) => v !== tipo);
    } else {
      next = [...current, tipo];
    }
    setParams({ tipo: next.length ? next.join(".") : null }, true);
  };

  const onTallaClick = (talla: string) => {
    const current = activeTalla ? activeTalla.split(".") : [];
    let next: string[];
    if (current.includes(talla)) {
      next = current.filter((v) => v !== talla);
    } else {
      next = [...current, talla];
    }
    setParams({ talla: next.length ? next.join(".") : null }, true);
  };

  const resetAll = () => {
    setParams({ category: null, tipo: null, fecha: null, genero: null, marca: null, talla: null, rangoPrecio: null, search: null });
    setActiveStep(1);
  };

  // Determinar si mostrar el botón flotante o el contenido directo
  const allFiltersComplete = currentStep > (tipoRequiereTalla ? 6 : 5);
  
  // Debug
  console.log('🔍 QuickFilters Debug:', {
    currentStep,
    tipoRequiereTalla,
    allFiltersComplete,
    hasTipo,
    hasGenero,
    hasStyleSelected,
    hasTalla,
    hasMarca,
    hasRango
  });
  
  // Contenido de los filtros
  const filtersContent = (
    <>
      {/* Paso 1: Tipo de producto */}
      {activeStep === 1 && (
        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b-2 border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">Tipo de producto</h3>
            <button onClick={resetAll} className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline">Limpiar</button>
          </div>
          <div className="p-5 md:p-6 grid grid-cols-3 gap-3 md:gap-4">
            {[
              { value: 'calzado', label: 'Calzado', emoji: '👟' },
              { value: 'ropa', label: 'Ropa', emoji: '👕' },
              { value: 'accesorios', label: 'Accesorios', emoji: '🎒' }
            ].map((tipo) => {
              const active = activeTipo.split('.').includes(tipo.value);
              return (
                <button
                  key={tipo.value}
                  onClick={() => onTipoClick(tipo.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 md:px-5 md:py-6 transition-all hover:shadow-lg ${
                    active ? "border-orange-600 bg-orange-50 dark:bg-orange-900/20 shadow-md scale-105" : "border-gray-200 dark:border-gray-700 hover:border-orange-400"
                  }`}
                >
                  <div className="text-3xl md:text-4xl" aria-hidden>{tipo.emoji}</div>
                  <span className={`text-sm md:text-base ${active ? "font-bold" : "font-semibold"}`}>{tipo.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Paso 2: Género */}
      {activeStep === 2 && hasTipo && (
        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-lg">
          <h3 className="text-base md:text-xl font-bold mb-5 text-gray-900 dark:text-white">Selecciona el género</h3>
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {[{value:'hombre',label:'Hombre',emoji:'👨'},{value:'mujer',label:'Mujer',emoji:'👩'},{value:'unisex',label:'Unisex',emoji:'👥'},{value:'niños',label:'Niños',emoji:'🧒'}].map(opt => {
              const active = activeGenero.split('.').includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    const current = activeGenero ? activeGenero.split('.') : [];
                    const next = current.includes(opt.value)
                      ? current.filter(v => v !== opt.value)
                      : [...current, opt.value];
                    setParams({ genero: next.length ? next.join('.') : null }, true);
                  }}
                  className={`rounded-xl border-2 px-5 py-5 md:px-6 md:py-6 text-base md:text-lg font-semibold transition-all hover:shadow-lg flex flex-col items-center gap-2 ${
                    active ? 'border-black dark:border-white bg-black dark:bg-black shadow-md scale-105' : 'border-gray-800 dark:border-white hover:border-black dark:hover:border-white'
                  }`}
                >
                  <span className="text-3xl md:text-4xl">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Paso 3: Estilos dinámicos según el tipo */}
      {activeStep === 3 && hasTipo && hasGenero && (() => {
        const tiposSeleccionados = activeTipo.split('.');
        const todasLasCategorias: RowItem[] = [];
        
        tiposSeleccionados.forEach(tipo => {
          const categorias = CATEGORY_OPTIONS[tipo] || [];
          categorias.forEach(categoria => {
            if (!todasLasCategorias.find(c => c.key === categoria.key)) {
              todasLasCategorias.push(categoria);
            }
          });
        });

        return (
          <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b-2 border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">
                Explora por estilo ({tiposSeleccionados.join(', ')})
                {totalEstilos > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({totalEstilos} productos)
                  </span>
                )}
              </h3>
              <button onClick={resetAll} className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline">Limpiar</button>
            </div>
            <div className="p-5 md:p-6 relative">
              {loadingEstilos && (
                <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="text-5xl mb-3 animate-bounce">🔍</div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                    </div>
                    <div className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Verificando estilos disponibles
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 ${loadingEstilos ? 'opacity-40 pointer-events-none' : ''}`}>
                {todasLasCategorias.map((row) => {
                  const active = isRowActive(row.key);
                  const disponible = !opcionesEstilos.categorias.length || opcionesEstilos.categorias.includes(row.key);
                  
                  return (
                    <button
                      key={row.key}
                      onClick={() => disponible && onRowClick(row.key)}
                      disabled={!disponible}
                      className={`flex items-center justify-between rounded-xl border-2 px-4 py-4 md:px-5 md:py-5 transition-all hover:shadow-lg group relative ${
                        active 
                          ? "border-black dark:border-white bg-gray-800 dark:bg-gray-800 shadow-md scale-105" 
                          : disponible
                          ? "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`text-2xl md:text-3xl transition-transform group-hover:scale-110 ${active ? 'animate-bounce' : ''} ${!disponible ? 'grayscale' : ''}`} aria-hidden>
                          {row.emoji}
                        </div>
                        <span className={`text-sm md:text-base transition-colors ${
                          active 
                            ? "font-bold text-white" 
                            : disponible
                            ? "font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                            : "font-semibold text-gray-400 line-through"
                        }`}>
                          {row.label}
                        </span>
                      </div>
                      {active && disponible && (
                        <svg className="w-5 h-5 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                      {!disponible && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-red-500 text-xl">✕</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Paso 4: Talla (solo para calzado y ropa) */}
      {activeStep === 4 && hasTipo && hasGenero && hasStyleSelected && tipoRequiereTalla && (() => {
        const tipoSeleccionado = activeTipo.split('.')[0];
        const generoSeleccionado = activeGenero.split('.')[0];
        
        let tallasBase: { value: string; label: string }[] = [];
        if (tipoSeleccionado === 'calzado') {
          if (generoSeleccionado === 'niños') {
            tallasBase = TALLAS_NINOS;
          } else {
            tallasBase = TALLAS_CALZADO_EU;
          }
        } else if (tipoSeleccionado === 'ropa') {
          tallasBase = TALLAS_ROPA;
        }

        return (
          <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b-2 border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">
                Selecciona tu talla {tipoSeleccionado === 'calzado' ? '(EU)' : ''}
              </h3>
              <button onClick={resetAll} className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline">Limpiar</button>
            </div>
            <div className="p-5 md:p-6 relative">
              {loadingTallas && (
                <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="text-5xl mb-3 animate-bounce">👟</div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    <div className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Verificando tallas disponibles
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className={`grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 ${loadingTallas ? 'opacity-40 pointer-events-none' : ''}`}>
                {tallasBase.map((talla) => {
                  const active = activeTalla.split('.').includes(talla.value);
                  const tallaInfo = tallasDisponibles.find(t => t.talla === talla.value);
                  // Solo disponible si existe en tallasDisponibles Y está marcada como disponible
                  const disponible = tallasDisponibles.length === 0 ? false : (tallaInfo?.disponible ?? false);
                  const stock = tallaInfo?.stock ?? 0;
                  
                  const tallaUSA = tipoSeleccionado === 'calzado' ? convertEUToUSAApprox(talla.value, generoSeleccionado) : null;
                  
                  return (
                    <button
                      key={talla.value}
                      onClick={() => disponible && onTallaClick(talla.value)}
                      disabled={!disponible}
                      className={`rounded-lg border-2 px-3 py-3 text-sm font-semibold transition-all relative flex flex-col items-center gap-1 ${
                        active 
                          ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-md scale-105" 
                          : disponible
                          ? "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md"
                          : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                      title={disponible ? `Talla EU ${talla.label}${tallaUSA ? ` (USA ${tallaUSA})` : ''}${stock > 0 ? ` - ${stock} en stock` : ''}` : `Talla ${talla.label} no disponible`}
                    >
                      <span className={`text-base font-bold ${!disponible ? 'line-through opacity-50' : ''}`}>
                        {talla.label}
                      </span>
                      {tallaUSA && disponible && (
                        <span className={`text-xs ${active ? 'text-white/70 dark:text-black/70' : 'text-gray-500 dark:text-gray-400'}`}>
                          USA {tallaUSA}
                        </span>
                      )}
                      {!disponible && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
                          <span className="text-red-500 text-2xl font-bold">✕</span>
                        </div>
                      )}
                      {disponible && stock > 0 && !active && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 space-y-3">
                {tipoSeleccionado === 'calzado' && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">👟</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          Tallas en formato Europeo (EU)
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Debajo de cada talla EU encontrarás su equivalente en USA. Puedes seleccionar múltiples tallas.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Paso 5/4: Marca */}
      {((tipoRequiereTalla && activeStep === 5) || (!tipoRequiereTalla && activeStep === 4)) && hasTipo && hasGenero && hasStyleSelected && (!tipoRequiereTalla || hasTalla) && (() => {
        return (
          <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-lg relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">
                Elige tu marca favorita
                {totalMarcas > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({totalMarcas} productos)
                  </span>
                )}
              </h3>
              <button onClick={resetAll} className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline">Limpiar</button>
            </div>
            
            {loadingMarcas && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="text-5xl mb-3 animate-bounce">🏷️</div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
                  </div>
                  <div className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Verificando marcas disponibles
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`grid grid-cols-2 gap-4 md:gap-5 ${loadingMarcas ? 'opacity-40 pointer-events-none' : ''}`}>
              {[
                { value: 'adidas', label: 'Adidas', imageUrl: 'https://cdn.sanity.io/images/ibvmpbc1/production/ee995528aa127d0552dd5316aa8847ffe79adc8b-196x196.png' },
                { value: 'nike', label: 'Nike', imageUrl: 'https://cdn.sanity.io/images/ibvmpbc1/production/c4f4c571a1e591fa12e147037f7b4fcf33dea577-196x196.png' },
                { value: 'frizsport', label: 'Friz Sport', imageUrl: 'https://cdn.sanity.io/images/ibvmpbc1/production/4a5cdee84967d0d4fa665fcde4263e8128a52909-196x196.png' },
                { value: 'reebok', label: 'Reebok', imageUrl: 'https://cdn.sanity.io/images/ibvmpbc1/production/9bc79d5239ce2e4b60d2da9936fafd69e38242c5-1089x296.png' },
              ].map((marca) => {
                const isActiveMarca = activeMarca.split('.')?.includes(marca.value);
                const disponible = !opcionesMarcas.marcas.length || opcionesMarcas.marcas.includes(marca.value);
                
                return (
                  <button
                    key={marca.value}
                    onClick={() => disponible && (() => {
                      const current = activeMarca ? activeMarca.split('.') : [];
                      const next = current.includes(marca.value)
                        ? current.filter(v => v !== marca.value)
                        : [...current, marca.value];
                      setParams({ marca: next.length ? next.join('.') : null }, true);
                    })()}
                    disabled={!disponible}
                    className={`rounded-xl bg-black border-2 px-5 py-5 md:px-6 md:py-6 text-base md:text-lg font-semibold transition-all hover:shadow-lg flex flex-col items-center gap-2 relative ${
                      isActiveMarca 
                        ? 'border-black dark:border-white bg-gray-600 dark:bg-gray-800 shadow-md scale-105' 
                        : disponible
                        ? 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {marca.imageUrl ? (
                      <img
                        src={marca.imageUrl}
                        alt={marca.label}
                        className={`w-16 h-16 object-contain ${!disponible ? 'grayscale' : ''}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-bold text-white">
                        {marca.label}
                      </div>
                    )}
                    <span className={`text-sm text-white ${!disponible ? 'line-through' : ''}`}>
                      {marca.label}
                    </span>
                    {!disponible && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-red-500 text-2xl">✕</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Paso 6/5: Precio */}
      {((tipoRequiereTalla && activeStep === 6) || (!tipoRequiereTalla && activeStep === 5)) && hasTipo && hasGenero && hasStyleSelected && hasMarca && (!tipoRequiereTalla || hasTalla) && (() => {
        return (
          <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-lg relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-xl">💰</div>
              <div>
                <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">Define tu presupuesto</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {totalPrecios > 0 ? `${totalPrecios} productos disponibles` : 'Selecciona un rango de precios'}
                </p>
              </div>
            </div>
            
            {loadingPrecios && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="text-5xl mb-3 animate-bounce">💰</div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
                  </div>
                  <div className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Analizando precios disponibles
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${loadingPrecios ? 'opacity-40 pointer-events-none' : ''}`}>
              {(opcionesPrecios.rangosPrecios.length > 0 ? opcionesPrecios.rangosPrecios : [
                { label: 'Hasta S/ 100', min: 0, max: 100, emoji: '💵', count: 0 },
                { label: 'S/ 100 - 200', min: 100, max: 200, emoji: '💵', count: 0 },
                { label: 'S/ 200 - 300', min: 200, max: 300, emoji: '💵', count: 0 },
                { label: 'S/ 300 - 400', min: 300, max: 400, emoji: '💶', count: 0 },
                { label: 'S/ 400 - 500', min: 400, max: 500, emoji: '💶', count: 0 },
                { label: 'S/ 500 - 600', min: 500, max: 600, emoji: '�', count: 0 },
                { label: 'S/ 600 - 800', min: 600, max: 800, emoji: '💷', count: 0 },
                { label: 'S/ 800 - 1000', min: 800, max: 1000, emoji: '💷', count: 0 },
                { label: 'Más de S/ 1000', min: 1000, max: 999999, emoji: '💎', count: 0 },
              ]).map((rango, idx) => {
                const isActive = activeRango === `${rango.min}-${rango.max}`;
                const disponible = opcionesPrecios.rangosPrecios.length === 0 || rango.count > 0;
                
                return (
                  <button
                    key={idx}
                    onClick={() => disponible && setParams({ rangoPrecio: `${rango.min}-${rango.max}` })}
                    disabled={!disponible}
                    className={`group relative rounded-xl border-2 px-4 py-4 text-sm md:text-base font-semibold transition-all hover:scale-105 ${
                      isActive 
                        ? 'border-black dark:border-white bg-gray-100 dark:bg-gray-800 shadow-lg scale-105' 
                        : disponible
                        ? 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                    }`}
                    title={disponible ? `${rango.count > 0 ? `${rango.count} productos` : 'Rango disponible'}` : 'Sin productos en este rango'}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-2xl ${!disponible ? 'grayscale' : ''}`}>{rango.emoji}</span>
                      <span className={`${isActive ? 'font-bold text-black dark:text-white' : ''} ${!disponible ? 'line-through' : ''}`}>
                        {rango.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {rango.count > 0 ? `${rango.count} productos` : 'Sin productos'}
                      </span>
                    </div>
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                    )}
                    {!disponible && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-red-500 text-2xl">✕</span>
                      </div>
                    )}
                    {disponible && rango.count > 0 && !isActive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
            

          </div>
        );
      })()}

      {/* Vista de resumen cuando todos los filtros están completos */}
      {currentStep > (tipoRequiereTalla ? 6 : 5) && (
        <div className="border-2 border-green-500 dark:border-green-400 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
          <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-100 to-white dark:from-green-900/30 dark:to-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div>
                <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">
                  Filtros Aplicados
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Mostrando productos más nuevos primero
                </p>
              </div>
            </div>
            <button 
              onClick={resetAll} 
              className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline"
            >
              Reiniciar
            </button>
          </div>
          
          <div className="p-5 md:p-6 space-y-4">
            {/* Resumen de filtros */}
            <div className="grid grid-cols-1 gap-3">
              {activeTipo && (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {activeTipo.includes('calzado') ? '👟' : activeTipo.includes('ropa') ? '👕' : '🎒'}
                    </span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tipo</p>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">
                        {activeTipo.split('.').join(', ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setParams({ tipo: null });
                      setActiveStep(1);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {activeGenero && (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {activeGenero.includes('hombre') ? '👨' : activeGenero.includes('mujer') ? '👩' : activeGenero.includes('niños') ? '🧒' : '👥'}
                    </span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Género</p>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">
                        {activeGenero.split('.').join(', ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setParams({ genero: null });
                      setActiveStep(2);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {activeCategory && (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Estilo</p>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">
                        {activeCategory.split('.').join(', ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setParams({ category: null });
                      setActiveStep(3);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {activeTalla && (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📏</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Talla</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {activeTalla.split('.').join(', ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setParams({ talla: null });
                      setActiveStep(4);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {activeMarca && (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏷️</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Marca</p>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">
                        {activeMarca.split('.').join(', ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setParams({ marca: null });
                      setActiveStep(tipoRequiereTalla ? 5 : 4);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {activeRango && (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Precio</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        S/ {activeRango.replace('-', ' - ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setParams({ rangoPrecio: null });
                      setActiveStep(tipoRequiereTalla ? 6 : 5);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            
            {/* Botón para modificar filtros */}
            <button
              onClick={() => setActiveStep(1)}
              className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-semibold text-gray-900 dark:text-white transition-colors flex items-center justify-center gap-2"
            >
              <span>✏️</span>
              Modificar Filtros
            </button>
          </div>
        </div>
      )}
    </>
  );

  // Renderizado para desktop (siempre visible)
  return (
    <>
      {/* Desktop: Mostrar filtros directamente */}
      <div className="hidden lg:block">
        {filtersContent}
      </div>

      {/* Mobile: Mostrar directamente durante onboarding, botón flotante después */}
      <div className="lg:hidden w-full">
        {/* Durante el onboarding: Mostrar filtros directamente en la página */}
        {!allFiltersComplete && (
          <div className="space-y-6 w-full">
            {filtersContent}
          </div>
        )}

        {/* Después de completar: Botón flotante + Drawer */}
        {allFiltersComplete && (
          <>
            {/* Botón flotante */}
            {!showMobileFilters && (
              <button
                onClick={() => setShowMobileFilters(true)}
                className="fixed bottom-6 right-6 z-50 bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 active:scale-95 flex items-center gap-3 group"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="font-semibold text-sm pr-1 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300">
                  Filtros
                </span>
              </button>
            )}

            {/* Drawer de filtros */}
            {showMobileFilters && (
              <>
                {/* Overlay */}
                <div 
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
                  onClick={() => setShowMobileFilters(false)}
                />
                
                {/* Drawer */}
                <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto transition-transform duration-300 translate-y-0">
                  {/* Header del drawer */}
                  <div className="sticky top-0 z-10 bg-black dark:bg-white px-6 py-4 rounded-t-3xl border-b-2 border-gray-800 dark:border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white dark:bg-black rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white dark:text-black">Filtros</h2>
                          <p className="text-xs text-gray-300 dark:text-gray-600">
                            Modifica tus filtros
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="w-10 h-10 bg-white dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Contenido del drawer */}
                  <div className="p-6 space-y-6">
                    {filtersContent}
                  </div>

                  {/* Footer con botón de aplicar */}
                  <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 p-4">
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                      Ver Productos
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}