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
    // Navegar con los nuevos parámetros
    router.push(`${pathname}?${params.toString()}`);
  };

  return { searchParams, setParams };
}

type RowItem = {
  key: "urbano" | "running" | "chimpunes" | "nuevos";
  label: string;
  emoji: string; // miniatura simple para prototipo
};

const ROWS: RowItem[] = [
  { key: "urbano", label: "Urbano", emoji: "👟" },
  { key: "running", label: "Running", emoji: "🏃" },
  { key: "chimpunes", label: "Chimpunes", emoji: "🥅" },
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

  const [minPrice, maxPrice] = useMemo(() => {
    if (!activeRango) return [0, 500] as const;
    const [min, max] = activeRango.split("-").map(Number);
    return [min || 0, max || 500] as const;
  }, [activeRango]);

  const hasStyleSelected = Boolean(
    activeCategory || searchParams?.get("tipo") || searchParams?.get("fecha") === "desc"
  );
  const hasGenero = Boolean(activeGenero);
  const hasMarca = Boolean(activeMarca);
  const hasRango = Boolean(activeRango);

  // Steps: 1 Estilo, 2 Género, 3 Marca, 4 Precio
  const currentStep = !hasStyleSelected ? 1 : !hasGenero ? 2 : !hasMarca ? 3 : !hasRango ? 4 : 5;
  const maxStepAvailable = Math.min(currentStep, 4);
  const [activeStep, setActiveStep] = useState<number>(Math.min(currentStep, 4));

  // Mantener el step activo dentro de los límites disponibles cuando cambian los filtros
  useEffect(() => {
    setActiveStep((prev) => Math.min(prev, maxStepAvailable));
  }, [maxStepAvailable]);
  const stepLabel = currentStep === 1
    ? "Paso 1 de 4: Elige un estilo"
    : currentStep === 2
    ? "Paso 2 de 4: Selecciona género"
    : currentStep === 3
    ? "Paso 3 de 4: Elige la marca"
    : currentStep === 4
    ? "Paso 4 de 4: Define tu presupuesto"
    : "Listo: mostrando productos";

  const [localMin, setLocalMin] = useState<string>(String(minPrice));
  const [localMax, setLocalMax] = useState<string>(String(maxPrice));

  useEffect(() => {
    setLocalMin(String(minPrice));
    setLocalMax(String(maxPrice));
  }, [minPrice, maxPrice]);

  const isRowActive = (key: RowItem["key"]) => {
    if (key === "nuevos") return activeFecha === "desc";
    if (key === "urbano" || key === "running" || key === "chimpunes") return activeCategory.split(".").includes(key);
    return false;
  };

  const onRowClick = (key: RowItem["key"]) => {
    if (key === "nuevos") {
      setParams({ fecha: activeFecha === "desc" ? null : "desc" });
      // Si selecciona nuevos, considera paso 1 cumplido
      setActiveStep(2);
      return;
    }
    if (key === "urbano" || key === "running" || key === "chimpunes") {
      // toggle value within category multi-select using dot-separated values
      const current = activeCategory ? activeCategory.split(".") : [];
      let next: string[];
      if (current.includes(key)) {
        next = current.filter((v) => v !== key);
      } else {
        next = [...current, key];
      }
      // Also enforce tipo=calzado as per tienda filters
      const currentTipo = searchParams?.get("tipo") || "";
      const tipoValues = currentTipo ? currentTipo.split(".") : [];
      const ensureTipo = tipoValues.includes("calzado") ? tipoValues : [...tipoValues, "calzado"];
      setParams({ category: next.length ? next.join(".") : null, tipo: ensureTipo.length ? ensureTipo.join(".") : null });
      // Avanzar a paso 2 si hay al menos un estilo
      if (next.length > 0) setActiveStep(2);
      return;
    }
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
    setLocalMax('500');
  };

  return (
    <aside className={variant === "onboarding" ? "space-y-6  w-full" : "space-y-6"}>
      {/* Stepper superior */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 md:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
          {[1,2,3,4].map((step) => {
            const enabled = step <= maxStepAvailable;
            const completed = step < currentStep;
            const isActive = activeStep === step;
            const label = `Paso ${step}`;
            const sub = step === 1 ? "Elige estilo" : step === 2 ? "Género" : step === 3 ? "Marca" : "Precio";
            return (
              <button
                key={step}
                onClick={() => enabled && setActiveStep(step)}
                disabled={!enabled}
                className={`flex items-center gap-2 md:gap-3 w-full text-left rounded-lg px-3 py-2 md:py-3 border transition ${
                  isActive ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "border-transparent"
                } ${
                  !enabled ? "opacity-50 cursor-not-allowed" : "hover:border-yellow-300"
                }`}
              >
                <span className={`flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full text-xs md:text-sm font-bold ${
                  completed ? "bg-green-500 text-white" : isActive ? "bg-yellow-500 text-black" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}>
                  {completed ? "✓" : step}
                </span>
                <span className="hidden md:flex flex-col">
                  <span className="text-xs md:text-sm font-semibold">{label}</span>
                  <span className="text-[11px] md:text-xs text-gray-600 dark:text-gray-400">{sub}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">{stepLabel}</div>
      </div>

      {/* Filtros activos (cuando 4 pasos completos) */}
      {currentStep >= 5 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Filtros activos</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveStep(1)}
                className="text-xs text-blue-600 hover:underline"
                aria-label="Cambiar de categoría (volver al paso 1)"
              >
                Cambiar categoría
              </button>
              <button
                onClick={resetAll}
                className="text-xs text-red-600 hover:underline"
                aria-label="Borrar todos los filtros"
              >
                Borrar todo
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from(searchParams?.entries() || [])
              .filter(([key]) => key !== "page")
              .map(([key, value]) => (
                <div key={key} className="flex flex-wrap gap-1">
                  {value.split(".").map((val, idx) => (
                    <span
                      key={`${key}-${val}-${idx}`}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      <span className="capitalize">{key}:</span>
                      <span className="ml-1 font-semibold">{val}</span>
                      <button
                        onClick={() => {
                          const currentValues = searchParams?.get(key);
                          if (!currentValues) return;
                          const valuesArray = currentValues.split(".");
                          const filteredValues = valuesArray.filter((v) => v !== val);
                          setParams({ [key]: filteredValues.length ? filteredValues.join(".") : null });
                        }}
                        className="ml-1 font-bold text-blue-600 hover:text-blue-800"
                        aria-label={`Quitar ${key} ${val}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Paso 1: Estilo */}
      {activeStep === 1 && (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm md:text-base font-semibold">Explora por estilo</h3>
          <button onClick={resetAll} className="text-xs text-yellow-600 hover:underline">Limpiar</button>
        </div>
        <div className="p-3 md:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
          {ROWS.map((row) => {
            const active = isRowActive(row.key);
            return (
              <button
                key={row.key}
                onClick={() => onRowClick(row.key)}
                className={`flex items-center justify-between rounded-lg border px-4 py-4 md:px-6 md:py-5 transition ${
                  active ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-2xl md:text-3xl" aria-hidden>{row.emoji}</div>
                  <span className={`text-sm md:text-base ${active ? "font-semibold" : ""}`}>{row.label}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 md:w-6 md:h-6 text-gray-400"
                  aria-hidden
                >
                  <path fillRule="evenodd" d="M8.47 4.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06L13.94 12 8.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Paso 2: Género (solo cuando hay estilo) */}
      {activeStep === 2 && hasStyleSelected && (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <h3 className="text-sm md:text-base font-semibold mb-3">Género</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[{value:'hombre',label:'Hombre'},{value:'mujer',label:'Mujer'},{value:'unisex',label:'Unisex'},{value:'niños',label:'Niños'}].map(opt => {
            const active = activeGenero === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onGeneroChange({ target: { value: opt.value } } as any)}
                className={`rounded-lg border px-4 py-3 md:px-5 md:py-4 text-sm md:text-base transition ${
                  active ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 font-semibold' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Paso 3: Marca (solo cuando hay género) */}
      {activeStep === 3 && hasStyleSelected && hasGenero && (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <h3 className="text-sm md:text-base font-semibold mb-3">Marca</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[{value:'adidas',label:'Adidas'},{value:'nike',label:'Nike'},{value:'reebok',label:'Reebok'},{value:'fritzsport',label:'Fritz Sport'}].map(opt => {
            const isActiveMarca = activeMarca.split('.')?.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => {
                  // simple toggle single-select
                  const next = isActiveMarca ? '' : opt.value;
                  setParams({ marca: next || null });
                  if (next) setActiveStep(4);
                }}
                className={`rounded-lg border px-4 py-3 md:px-5 md:py-4 text-sm md:text-base transition ${
                  isActiveMarca ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 font-semibold' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Paso 4: Precio (solo cuando hay género y marca) */}
      {activeStep === 4 && hasStyleSelected && hasGenero && hasMarca && (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-3">Precio</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Mín</label>
            <input
              inputMode="numeric"
              type="text"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 py-2"
              min={0}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Máx</label>
            <input
              inputMode="numeric"
              type="text"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 py-2"
              min={0}
            />
          </div>
        </div>
        <button
          onClick={applyPrice}
          className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-semibold rounded-md px-3 py-2"
        >
          Aplicar
        </button>
      </div>
      )}

      {/* CTA para ir a productos en mobile */}
      {variant !== "onboarding" && (
        <a
          href="#productos"
          className="md:hidden block w-full text-center bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md px-4 py-3"
        >
          Ver productos
        </a>
      )}
    </aside>
  );
}
