"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function useURLState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "") {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    params.delete("page"); // reset pagination when filtering
    // Navegar con los nuevos parámetros sin hacer scroll
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
    { key: "tops", label: "Tops", emoji: "👚" },
  ],
  accesorios: [
    { key: "mochilas", label: "Mochilas", emoji: "🎒" },
    { key: "gorras", label: "Gorras", emoji: "🧢" },
    { key: "bolsos", label: "Bolsos", emoji: "👜" },
    { key: "pelotas", label: "Pelotas", emoji: "⚽" },
    { key: "guantes", label: "Guantes", emoji: "🧤" },
    { key: "canillera", label: "Canilleras", emoji: "🦵" },
    { key: "tomatodos", label: "Toma Todo", emoji: "🍶" },
    { key: "morral", label: "Morral", emoji: "🎒" },
  ],
};

const ROWS_NUEVOS: RowItem[] = [
  { key: "nuevos", label: "Nuevos ingresos", emoji: "🆕" },
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
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [minPrice, maxPrice] = useMemo(() => {
    if (!activeRango) return [0, 1000] as const;
    const [min, max] = activeRango.split("-").map(Number);
    return [min || 0, max || 1000] as const;
  }, [activeRango]);

  const hasTipo = Boolean(activeTipo);
  const hasGenero = Boolean(activeGenero);
  const hasStyleSelected = Boolean(
    activeCategory || searchParams?.get("fecha") === "desc"
  );
  const hasMarca = Boolean(activeMarca);
  const hasRango = Boolean(activeRango);

  // Steps: 1 Tipo, 2 Género, 3 Estilo, 4 Marca, 5 Precio
  const currentStep = !hasTipo ? 1 : !hasGenero ? 2 : !hasStyleSelected ? 3 : !hasMarca ? 4 : !hasRango ? 5 : 6;
  const maxStepAvailable = Math.min(currentStep, 5);
  const [activeStep, setActiveStep] = useState<number>(Math.min(currentStep, 5));

  // Mantener el step activo dentro de los límites disponibles cuando cambian los filtros
  useEffect(() => {
    setActiveStep((prev) => Math.min(prev, maxStepAvailable));
  }, [maxStepAvailable]);
  const stepLabel = currentStep === 1
    ? "Paso 1 de 5: Selecciona el tipo de producto"
    : currentStep === 2
    ? "Paso 2 de 5: Selecciona género"
    : currentStep === 3
    ? "Paso 3 de 5: Elige un estilo"
    : currentStep === 4
    ? "Paso 4 de 5: Elige la marca"
    : currentStep === 5
    ? "Paso 5 de 5: Define tu presupuesto"
    : "Listo: mostrando productos";

  const [localMin, setLocalMin] = useState<string>(String(minPrice));
  const [localMax, setLocalMax] = useState<string>(String(maxPrice));

  useEffect(() => {
    setLocalMin(String(minPrice));
    setLocalMax(String(maxPrice));
  }, [minPrice, maxPrice]);

  const isRowActive = (key: string) => {
    if (key === "nuevos") return activeFecha === "desc";
    return activeCategory.split(".").includes(key);
  };

  const onRowClick = (key: string) => {
    if (key === "nuevos") {
      setParams({ fecha: activeFecha === "desc" ? null : "desc" });
      // Si selecciona nuevos, considera paso 3 cumplido
      setActiveStep(4);
      return;
    }
    // Para cualquier categoría
    const current = activeCategory ? activeCategory.split(".") : [];
    let next: string[];
    if (current.includes(key)) {
      next = current.filter((v) => v !== key);
    } else {
      next = [...current, key];
    }
    setParams({ category: next.length ? next.join(".") : null });
    // Avanzar a paso 4 si hay al menos un estilo
    if (next.length > 0) setActiveStep(4);
  };

  const onTipoClick = (tipo: string) => {
    const current = activeTipo ? activeTipo.split(".") : [];
    let next: string[];
    if (current.includes(tipo)) {
      next = current.filter((v) => v !== tipo);
    } else {
      next = [...current, tipo];
    }
    setParams({ tipo: next.length ? next.join(".") : null });
    if (next.length > 0) setActiveStep(2);
  };

  const onGeneroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setParams({ genero: value || null });
    if (value) setActiveStep(3);
  };

  const applyPrice = () => {
    // Permitir entradas vacías temporalmente; al aplicar normalizamos
    const minNum = parseFloat(localMin || '0');
    const maxNum = parseFloat(localMax || '0');
    if (isNaN(minNum) && isNaN(maxNum)) return; // no aplicar si ambos vacíos
    const a = isNaN(minNum) ? 0 : minNum;
    const b = isNaN(maxNum) ? a : maxNum; // si max vacío, igual a min
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    setParams({ rangoPrecio: `${Math.floor(min)}-${Math.floor(max)}` });
  };

  const resetAll = () => {
    setParams({ category: null, tipo: null, fecha: null, genero: null, marca: null, rangoPrecio: null, search: null });
    setActiveStep(1);
    setLocalMin('0');
    setLocalMax('1000');
  };

  const FiltersContent = () => (
    <>
      {/* Stepper superior */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-lg">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 md:gap-3">
          {[1,2,3,4,5].map((step) => {
            const enabled = step <= maxStepAvailable;
            const completed = step < currentStep;
            const isActive = activeStep === step;
            const label = `Paso ${step}`;
            const sub = step === 1 ? "Tipo" : step === 2 ? "Género" : step === 3 ? "Estilo" : step === 4 ? "Marca" : "Precio";
            return (
              <button
                key={step}
                onClick={() => enabled && setActiveStep(step)}
                disabled={!enabled}
                className={`flex flex-col items-center gap-2 md:gap-3 w-full text-center rounded-xl px-3 py-4 md:py-5 border-2 transition-all ${
                  isActive ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-md scale-105" : "border-gray-200 dark:border-gray-700"
                } ${
                  !enabled ? "opacity-50 cursor-not-allowed" : "hover:border-yellow-300 hover:shadow-md"
                }`}
              >
                <span className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full text-base md:text-lg font-bold transition-all ${
                  completed ? "bg-green-500 text-white" : isActive ? "bg-yellow-500 text-black" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}>
                  {completed ? "✓" : step}
                </span>
                <span className="flex flex-col">
                  <span className="text-xs md:text-sm font-semibold">{label}</span>
                  <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">{sub}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 text-center text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">{stepLabel}</div>
      </div>

      {/* Filtros activos (cuando 5 pasos completos) - Mejorado */}
      {currentStep >= 6 && (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">✨ Filtros Activos</h4>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveStep(1)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                aria-label="Cambiar de categoría (volver al paso 1)"
              >
                🔄 Cambiar
              </button>
              <button
                onClick={resetAll}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                aria-label="Borrar todos los filtros"
              >
                🗑️ Limpiar
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from(searchParams?.entries() || [])
              .filter(([key]) => key !== "page")
              .map(([key, value]) => {
                const labels: Record<string, string> = {
                  tipo: '📦 Tipo',
                  genero: '👤 Género',
                  category: '🎯 Estilo',
                  marca: '🏷️ Marca',
                  rangoPrecio: '💰 Precio'
                };
                return (
                  <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{labels[key] || key}</div>
                    <div className="flex flex-wrap gap-2">
                      {value.split(".").map((val, idx) => (
                        <span
                          key={`${key}-${val}-${idx}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-sm"
                        >
                          <span className="capitalize">{val}</span>
                          <button
                            onClick={() => {
                              const currentValues = searchParams?.get(key);
                              if (!currentValues) return;
                              const valuesArray = currentValues.split(".");
                              const filteredValues = valuesArray.filter((v) => v !== val);
                              setParams({ [key]: filteredValues.length ? filteredValues.join(".") : null });
                            }}
                            className="ml-2 font-bold text-gray-900 hover:text-red-600 transition-colors"
                            aria-label={`Quitar ${key} ${val}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Paso 1: Tipo de producto */}
      {activeStep === 1 && (
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b-2 border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">Tipo de producto</h3>
            <button onClick={resetAll} className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 hover:underline">Limpiar</button>
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
                    active ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-md scale-105" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-yellow-300"
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
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-lg">
        <h3 className="text-base md:text-xl font-bold mb-5 text-gray-900 dark:text-white">Selecciona el género</h3>
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {[{value:'hombre',label:'Hombre',emoji:'👨'},{value:'mujer',label:'Mujer',emoji:'👩'},{value:'unisex',label:'Unisex',emoji:'👥'},{value:'niños',label:'Niños',emoji:'🧒'}].map(opt => {
            const active = activeGenero === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onGeneroChange({ target: { value: opt.value } } as any)}
                className={`rounded-xl border-2 px-5 py-5 md:px-6 md:py-6 text-base md:text-lg font-semibold transition-all hover:shadow-lg flex flex-col items-center gap-2 ${
                  active ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-md scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'
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
        // Obtener las categorías según el tipo seleccionado
        const tipoSeleccionado = activeTipo.split('.')[0]; // Tomar solo el primer tipo si hay múltiples
        const categorias = CATEGORY_OPTIONS[tipoSeleccionado] || [];
        const todasLasCategorias = [...categorias, ...ROWS_NUEVOS];
        
        return (
          <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b-2 border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">
                Explora por estilo {tipoSeleccionado && `(${tipoSeleccionado})`}
              </h3>
              <button onClick={resetAll} className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 hover:underline">Limpiar</button>
            </div>
            <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {todasLasCategorias.map((row) => {
                const active = isRowActive(row.key);
                return (
                  <button
                    key={row.key}
                    onClick={() => onRowClick(row.key)}
                    className={`flex items-center justify-between rounded-xl border-2 px-4 py-4 md:px-5 md:py-5 transition-all hover:shadow-lg ${
                      active ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-md scale-105" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-yellow-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="text-2xl md:text-3xl" aria-hidden>{row.emoji}</div>
                      <span className={`text-sm md:text-base ${active ? "font-bold" : "font-semibold"}`}>{row.label}</span>
                    </div>
                    {active && (
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}


      {/* Paso 4: Marca (solo cuando hay género y estilo) */}
      {activeStep === 4 && hasTipo && hasGenero && hasStyleSelected && (
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-lg">
        <h3 className="text-base md:text-xl font-bold mb-5 text-gray-900 dark:text-white">Elige tu marca favorita</h3>
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {[{value:'adidas',label:'Adidas',emoji:'⚽'},{value:'nike',label:'Nike',emoji:'🏃'},{value:'reebok',label:'Reebok',emoji:'👟'},{value:'fritzsport',label:'Fritz Sport',emoji:'⭐'}].map(opt => {
            const isActiveMarca = activeMarca.split('.')?.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => {
                  // simple toggle single-select
                  const next = isActiveMarca ? '' : opt.value;
                  setParams({ marca: next || null });
                  if (next) setActiveStep(5);
                }}
                className={`rounded-xl border-2 px-5 py-5 md:px-6 md:py-6 text-base md:text-lg font-semibold transition-all hover:shadow-lg flex flex-col items-center gap-2 ${
                  isActiveMarca ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-md scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'
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

      {/* Paso 5: Precio (solo cuando hay género, estilo y marca) - Mejorado */}
      {activeStep === 5 && hasTipo && hasGenero && hasStyleSelected && hasMarca && (
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-xl">💰</div>
          <div>
            <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">Define tu presupuesto</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Selecciona un rango o personaliza tu búsqueda</p>
          </div>
        </div>
        
        {/* Rangos predefinidos - Mejorado */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <span className="text-lg">🎯</span> Rangos populares
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'S/ 0 - 200', min: 0, max: 200, emoji: '💵' },
              { label: 'S/ 200 - 400', min: 200, max: 400, emoji: '💵' },
              { label: 'S/ 400 - 600', min: 400, max: 600, emoji: '💶' },
              { label: 'S/ 600 - 800', min: 600, max: 800, emoji: '💶' },
              { label: 'S/ 800 - 1000', min: 800, max: 1000, emoji: '💷' },
              { label: 'S/ 1000+', min: 1000, max: 10000, emoji: '💎' }
            ].map((rango, idx) => {
              const isActive = rango.min !== null && activeRango === `${rango.min}-${rango.max}`;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (rango.min !== null && rango.max !== null) {
                      setParams({ rangoPrecio: `${rango.min}-${rango.max}` });
                    }
                  }}
                  className={`group relative rounded-xl border-2 px-4 py-4 text-sm md:text-base font-semibold transition-all hover:scale-105 ${
                    isActive 
                      ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 shadow-lg scale-105' 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-yellow-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{rango.emoji}</span>
                    <span className={isActive ? 'text-yellow-700 dark:text-yellow-300' : ''}>{rango.label}</span>
                  </div>
                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs personalizados - Mejorado */}
        <div className="border-t-2 border-gray-100 dark:border-gray-800 pt-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <span className="text-lg">✏️</span> Personaliza tu rango
          </p>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span>💵</span> Precio Mínimo
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold text-lg">S/</span>
                  <input
                    inputMode="numeric"
                    type="text"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-lg font-bold pl-12 pr-4 py-3.5 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 dark:focus:ring-yellow-900/50 transition-all shadow-sm hover:shadow-md"
                    min={0}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span>💰</span> Precio Máximo
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold text-lg">S/</span>
                  <input
                    inputMode="numeric"
                    type="text"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-lg font-bold pl-12 pr-4 py-3.5 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 dark:focus:ring-yellow-900/50 transition-all shadow-sm hover:shadow-md"
                    min={0}
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={applyPrice}
              className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black text-base md:text-lg font-bold rounded-xl px-5 py-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>🔍</span> Ver productos
            </button>
          </div>
        </div>
      </div>
      )}

      {/* CTA para ir a productos en mobile */}
      {variant !== "onboarding" && (
        <a
          href="#productos"
          className="md:hidden block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-base font-bold rounded-xl px-5 py-4 shadow-lg hover:shadow-xl transition-all"
        >
          Ver productos
        </a>
      )}
    </>
  );

  return (
    <>
      {/* Desktop: Sidebar normal */}
      {variant === "onboarding" ? (
        <aside className="space-y-8 w-full">
          <FiltersContent />
        </aside>
      ) : (
        <>
          <aside className="hidden lg:block space-y-6">
            <FiltersContent />
          </aside>

          {/* Mobile: Botón flotante para abrir filtros */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center gap-2"
            aria-label="Abrir filtros"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm">Filtros</span>
          </button>

          {/* Drawer Mobile */}
          {isMobileOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={() => setIsMobileOpen(false)}
              />
              
              {/* Drawer Panel */}
              <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md">
                  <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-black">Filtros</h2>
                      <button
                        onClick={() => setIsMobileOpen(false)}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
                        aria-label="Cerrar filtros"
                      >
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-4 py-6 space-y-6">
                      <FiltersContent />
                    </div>

                    {/* Footer con botón de aplicar */}
                    <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-4">
                      <button
                        onClick={() => setIsMobileOpen(false)}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black text-base font-bold rounded-xl px-5 py-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        <span>✓</span> Aplicar filtros
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
