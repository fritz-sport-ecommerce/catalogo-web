"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useState,
  useEffect,
  useTransition,
  useMemo,
  useCallback,
} from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

import { FilterX } from "lucide-react";
import Loader from "./loader/loader";
import { PriceRangeFilter } from "./price-range-filter";

// Definición de tallas
const tallasRopa = [
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

const tallasCalzadoEuropeas = [
  { value: "36", label: "36 EU" },
  { value: "36.5", label: "36.5 EU" },
  { value: "37", label: "37 EU" },
  { value: "38", label: "38 EU" },
  { value: "38.5", label: "38.5 EU" },
  { value: "39", label: "39 EU" },
  { value: "40", label: "40 EU" },
  { value: "40.5", label: "40.5 EU" },
  { value: "41", label: "41 EU" },
  { value: "42", label: "42 EU" },
  { value: "42.5", label: "42.5 EU" },
  { value: "43", label: "43 EU" },
  { value: "44", label: "44 EU" },
  { value: "44.5", label: "44.5 EU" },
  { value: "45", label: "45 EU" },
  { value: "46", label: "46 EU" },
  { value: "47", label: "47 EU" },
  { value: "48", label: "48 EU" },
];

const tallasCalzadoUSA = [
  { value: "4", label: "4 US" },
  { value: "4.5", label: "4.5 US" },
  { value: "5", label: "5 US" },
  { value: "5.5", label: "5.5 US" },
  { value: "6", label: "6 US" },
  { value: "6.5", label: "6.5 US" },
  { value: "7", label: "7 US" },
  { value: "7.5", label: "7.5 US" },
  { value: "8", label: "8 US" },
  { value: "8.5", label: "8.5 US" },
  { value: "9", label: "9 US" },
  { value: "9.5", label: "9.5 US" },
  { value: "10", label: "10 US" },
  { value: "10.5", label: "10.5 US" },
  { value: "11", label: "11 US" },
  { value: "11.5", label: "11.5 US" },
  { value: "12", label: "12 US" },
  { value: "12.5", label: "12.5 US" },
  { value: "13", label: "13 US" },
  { value: "14", label: "14 US" },
  { value: "15", label: "15 US" },
];

const tallasNinos = [
  { value: "3K", label: "3K" },
  { value: "4K", label: "4K" },
  { value: "5K", label: "5K" },
  { value: "5.5K", label: "5.5K" },
  { value: "6K", label: "6K" },
  { value: "6.5K", label: "6.5K" },
  { value: "7K", label: "7K" },
  { value: "7.5K", label: "7.5K" },
  { value: "8K", label: "8K" },
  { value: "8.5K", label: "8.5K" },
  { value: "9K", label: "9K" },
  { value: "9.5K", label: "9.5K" },
  { value: "10K", label: "10K" },
  { value: "10.5K", label: "10.5K" },
  { value: "11K", label: "11K" },
  { value: "11.5K", label: "11.5K" },
  { value: "12K", label: "12K" },
  { value: "12.5K", label: "12.5K" },
  { value: "13K", label: "13K" },
  { value: "13.5K", label: "13.5K" },
];

// Filtros específicos para outlet
const outletFilters = [
  {
    id: "discount",
    name: "🔥 Nivel de Descuento",
    options: [
      { label: "30% - 39%", value: "30-39" },
      { label: "40% - 49%", value: "40-49" },
      { label: "50% - 59%", value: "50-59" },
      { label: "60% - 69%", value: "60-69" },
      { label: "70% o más", value: "70-100" },
    ],
  },
];

const filters = [
  {
    id: "tipo",
    name: "Tipo",
    options: [
      { value: "ropa", label: "Ropa" },
      { value: "calzado", label: "Calzado" },
      { value: "accesorios", label: "Accesorios" },
    ],
  },
  // {
  //   id: "search",
  //   name: "Colección",
  //   options: [
  //     { label: "Adidas Superstar", value: "superstar" },
  //     { label: "Adidas Rivalry", value: "rivalry" },
  //     { label: "Adidas Forum", value: "forum" },
  //     { label: "Adidas Stan Smith", value: "stan-smith" },
  //     { label: "Adidas Samba", value: "samba" },
  //     { label: "Adidas Gazelle", value: "gazelle" },
  //     { label: "Adidas Campus", value: "campus" },
  //     { label: "Adidas Rivalry", value: "rivalry" },
  //     { label: "Adidas Spezial", value: "spezial" },
  //     { label: "Adidas Adi2000", value: "adi2000" },
  //     { label: "Adidas Adilette", value: "adilette" },
  //     { label: "Adidas Falcon", value: "falcon" },
  //     { label: "Adidas Adimatic", value: "adimatic" },
  //     { label: "Adidas Adicolor", value: "adicolor" },
  //     { label: "Adidas Adventure", value: "adventure" },
  //     { label: "Adidas TREFOIL ESSENTIALS", value: "trefoil-essentials" },
  //     { label: "Nike Air Max Excee", value: "air-max-excee" },
  //     { label: "Nike Air Force 1", value: "air-force" },
  //     { label: "Nike Air Max SC", value: "air-max-sc" },
  //     { label: "Nike Air Max 90", value: "air-max-90" },
  //     { label: "Nike Air Jordan", value: "air-jordan" },
  //     { label: "Nike Dunk", value: "dunk" },
  //   ],
  // },
  {
    id: "genero",
    name: "Género",
    options: [
      { value: "hombre", label: "Hombre" },
      { value: "mujer", label: "Mujer" },
      { value: "unisex", label: "Unisex" },
      { value: "niños", label: "Niños" },
    ],
  },
  {
    id: "category",
    name: "Categoría",
    options: [
      { label: "Chimpunes", value: "chimpunes" },
      { label: "Plataforma", value: "plataforma" },
      { label: "Tenis", value: "tenis" },
      { label: "Running", value: "running" },
      { label: "Trail Running", value: "trail-running" },
      { label: "Sandalias", value: "sandalias" },
      { label: "Básket", value: "basquet" },
      { label: "Training", value: "training" },
      { label: "Hiking", value: "hiking" },
      { label: "Skateboarding", value: "skateboarding" },
      { label: "Sportswear", value: "sportswear" },
      { label: "Bicicleta", value: "bicicleta" },
      { label: "Senderismo", value: "senderismo" },
      { label: "Terrex", value: "terrex" },
      { label: "Urbano", value: "urbano" },
      { label: "Escolar", value: "escolar" },
      { label: "Polos", value: "polos" },
      { label: "Camisetas", value: "camisetas" },
      { label: "Casacas", value: "casacas" },
      { label: "Leggins", value: "leggins" },
      { label: "Tops", value: "tops" },
      { label: "Shorts", value: "shorts" },
      { label: "Falda", value: "falda" },
      { label: "Body", value: "body" },
      { label: "Pantalón", value: "pantalon" },
      { label: "Poleras", value: "poleras" },
      { label: "Buzos", value: "buzos" },
      { label: "Bvd", value: "bvd" },
      { label: "Medias", value: "medias" },
      { label: "Medias", value: "medias" },
      { label: "Chalecos", value: "chalecos" },
      { label: "Mochilas", value: "mochilas" },
        { label: "Muñequera", value: "munequera" },
    { label: "Maletín", value: "maletin" },
    { label: "Muñequera", value: "munequera" },
    { label: "Morral", value: "morral" },
    { label: "Canguro", value: "canguro" },
    { label: "Bolsos", value: "bolsos" },
    { label: "Toma todo", value: "tomatodos" },
    { label: "Vinchas", value: "vinchas" },
    { label: "Canillera", value: "canillera" },
    { label: "Pelotas", value: "pelotas" },
    { label: "Gorras", value: "gorras" },
    { label: "Guantes", value: "guantes" },
    { label: "Kik de Limpieza", value: "kik_limpieza" },
    ],
  },
  {
    id: "marca",
    name: "Marca",
    options: [
      { value: "adidas", label: "Adidas " },
      { value: "nike", label: "Nike" },
      { value: "reebok", label: "Reebok" },

      { value: "fritzsport", label: "Fritz Sport" },
    ],
  },
  {
    id: "color",
    name: "Color",
    options: [
      { value: "blanco", label: "Blanco" },
      { value: "negro", label: "Negro" },
      { value: "azul", label: "Azul" },
      { value: "verde", label: "Verde" },
      { value: "rosa", label: "Rosa" },
      { value: "gris", label: "Gris" },
      { value: "naranja", label: "Naranja" },
      { value: "celeste", label: "Celeste" },
      { value: "amarillo", label: "Amarillo" },
    ],
  },
];

const subFiltersNiños = [
  { value: "bebe", label: "Bebés" },
  { value: "joven", label: "Jóvenes" },
  { value: "ninonina", label: "Niño/Niña" },
];

export const FilterActions = (): any => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filterCount = useMemo(() => {
    return Array.from(searchParams.entries()).filter(([key]) => key !== "page")
      .length;
  }, [searchParams]);

  const clearFilters = (e: any) => {
    e.preventDefault();
    const currentPage = searchParams.get("page");
    const newParams = new URLSearchParams();

    if (currentPage) {
      newParams.set("page", currentPage);
    }

    startTransition(() => {
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    });
  };

  const isOutlet = pathname === "/outlet";

  return (
    <>
      {isPending && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex justify-center items-center z-50 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Actualizando filtros...
            </span>
          </div>
        </div>
      )}
      {filterCount > 0 && (
        <div
          className={`flex items-center justify-between text-black mb-4 p-3 rounded-lg border ${
            isOutlet
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          }`}
        >
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Filtros activos ({filterCount})
          </span>
          <button
            onClick={clearFilters}
            disabled={isPending}
            className={`ml-2 text-white px-3 py-1 text-sm rounded-md transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
              isOutlet
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <FilterX className="w-4 h-4" />
            Limpiar todos
          </button>
        </div>
      )}
    </>
  );
};

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNiñosSelected, setIsNiñosSelected] = useState(false);
  const [isCalzadoSelected, setIsCalzadoSelected] = useState(false);
  const [isRopaSelected, setIsRopaSelected] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isRemovingFilter, setIsRemovingFilter] = useState(false);
  const searchParams = useSearchParams();
  const searchValues = useMemo(
    () => Array.from(searchParams.entries()),
    [searchParams]
  );

  const isOutlet = pathname === "/outlet";

  // Detectar tipo de producto seleccionado
  useEffect(() => {
    const tipo = searchParams.get("tipo");
    const tipoValues = tipo ? tipo.split(".") : [];
    setIsCalzadoSelected(tipoValues.includes("calzado"));
    setIsRopaSelected(tipoValues.includes("ropa"));

    const genero = searchParams.get("genero");
    const generoValues = genero ? genero.split(".") : [];
    setIsNiñosSelected(generoValues.includes("niños"));
  }, [searchParams]);


  const handleFilterChange = useCallback(
    (sectionId: string, optionValue: string, checked: boolean) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (checked) {
        // Si está marcado, remover este valor
        const currentValues = newParams.get(sectionId);
        if (currentValues) {
          const valuesArray = currentValues.split(".");
          const filteredValues = valuesArray.filter((v) => v !== optionValue);

          if (filteredValues.length > 0) {
            newParams.set(sectionId, filteredValues.join("."));
          } else {
            newParams.delete(sectionId);
          }
        }
      } else {
        // Si no está marcado, agregar este valor
        const currentValues = newParams.get(sectionId);
        if (currentValues) {
          const valuesArray = currentValues.split(".");
          if (!valuesArray.includes(optionValue)) {
            valuesArray.push(optionValue);
            newParams.set(sectionId, valuesArray.join("."));
          }
        } else {
          newParams.set(sectionId, optionValue);
        }
      }

      // Resetear página a 1 cuando se cambian filtros
      newParams.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${newParams.toString()}`);
      });
    },
    [router, searchParams, pathname]
  );

  const handleSubFilterChange = useCallback(
    (optionValue: string, checked: boolean) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (checked) {
        // Si está marcado, remover este valor
        const currentValues = newParams.get("subgenero");
        if (currentValues) {
          const valuesArray = currentValues.split(".");
          const filteredValues = valuesArray.filter((v) => v !== optionValue);

          if (filteredValues.length > 0) {
            newParams.set("subgenero", filteredValues.join("."));
          } else {
            newParams.delete("subgenero");
          }
        }
      } else {
        // Si no está marcado, agregar este valor
        const currentValues = newParams.get("subgenero");
        if (currentValues) {
          const valuesArray = currentValues.split(".");
          if (!valuesArray.includes(optionValue)) {
            valuesArray.push(optionValue);
            newParams.set("subgenero", valuesArray.join("."));
          }
        } else {
          newParams.set("subgenero", optionValue);
        }
      }

      // Resetear página a 1 cuando se cambian filtros
      newParams.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${newParams.toString()}`);
      });
    },
    [router, searchParams, pathname]
  );

  // Combinar filtros base con filtros específicos de outlet
  const allFilters = useMemo(() => {
    if (isOutlet) {
      return [outletFilters[0], ...filters]; // Poner descuentos primero en outlet
    }
    return filters;
  }, [isOutlet]);

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex justify-center items-center z-50 rounded-lg min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
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

      {/* Header específico para outlet */}
      {isOutlet && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6">
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
            🔥 Super Outlet
          </h3>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            <li>• Descuentos mínimos del 30%</li>
            <li>• Stock limitado</li>
            <li>• Ofertas por tiempo limitado</li>
          </ul>
        </div>
      )}

      <form className="sticky top-20" onSubmit={(e) => e.preventDefault()}>
        <h3 className="sr-only">Categories</h3>
        <FilterActions />

        {/* Mostrar filtros activos de manera visual */}
        {Array.from(searchParams.entries()).filter(([key]) => key !== "page")
          .length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border relative">
            {isRemovingFilter && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex justify-center items-center z-10 rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-3 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Eliminando filtro...
                  </span>
                </div>
              </div>
            )}
            <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
              Filtros Activos (
              {Array.from(searchParams.entries())
                .filter(([key]) => key !== "page")
                .reduce(
                  (acc, [key, value]) => acc + value.split(".").length,
                  0
                )}
              ):
            </h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(searchParams.entries())
                .filter(([key]) => key !== "page")
                .map(([key, value]) => (
                  <div key={key} className="flex flex-wrap gap-1">
                    {value.split(".").map((val, idx) => (
                      <span
                        key={`${key}-${val}-${idx}`}
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                          isOutlet
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        }`}
                      >
                        <span className="capitalize">{key}:</span>
                        <span className="ml-1 font-semibold">{val}</span>
                        <button
                          onClick={() => {
                            setIsRemovingFilter(true);
                            const newParams = new URLSearchParams(
                              searchParams.toString()
                            );
                            const currentValues = newParams.get(key);
                            if (currentValues) {
                              const valuesArray = currentValues.split(".");
                              const filteredValues = valuesArray.filter(
                                (v) => v !== val
                              );

                              if (filteredValues.length > 0) {
                                newParams.set(key, filteredValues.join("."));
                              } else {
                                newParams.delete(key);
                              }
                            }
                            newParams.delete("page");

                            startTransition(() => {
                              router.push(
                                `${pathname}?${newParams.toString()}`
                              );
                              setTimeout(() => setIsRemovingFilter(false), 300);
                            });
                          }}
                          disabled={isRemovingFilter}
                          className={`ml-1 font-bold transition-colors hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isOutlet
                              ? "text-red-600 hover:text-red-800"
                              : "text-blue-600 hover:text-blue-800"
                          }`}
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

        {allFilters.map((section, i) => (
          <Accordion key={i} type="single" collapsible>
            <AccordionItem value={`item-${i}`}>
              <AccordionTrigger>
                <span
                  className={
                    section.id === "discount" ? "text-red-600 font-bold" : ""
                  }
                >
                  {section.name}
                  <span className="ml-1 text-xs font-extrabold uppercase">
                    {searchParams.get(section.id) ? (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {searchParams.get(section.id)?.split(".").length}{" "}
                        seleccionados
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {section.options.map((option, optionIdx) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`filter-${section.id}-${optionIdx}`}
                        checked={searchValues.some(
                          ([key, value]) =>
                            key === section.id &&
                            (value === option.value ||
                              value.split(".").includes(option.value))
                        )}
                        onClick={(event) => {
                          const checked =
                            event.currentTarget.dataset.state === "checked";
                          handleFilterChange(section.id, option.value, checked);
                        }}
                      />
                      <label
                        htmlFor={`filter-${section.id}-${optionIdx}`}
                        className={`text-sm font-medium uppercase leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${
                          section.id === "discount" ? "text-red-600" : ""
                        } ${
                          searchValues.some(
                            ([key, value]) =>
                              key === section.id &&
                              (value === option.value ||
                                value.split(".").includes(option.value))
                          )
                            ? "text-blue-600 font-bold"
                            : ""
                        }`}
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Mostrar subfiltro si Niños está activado */}
            {section.id === "genero" && isNiñosSelected && (
              <div className="ml-6 mt-2">
                <h4 className="text-sm font-medium uppercase mb-2">
                  Subfiltro Niños
                </h4>
                <div className="space-y-2">
                  {subFiltersNiños.map((subOption, subIdx) => (
                    <div
                      key={subOption.value}
                      className="flex items-center space-x-2 py-1 uppercase"
                    >
                      <Checkbox
                        id={`subgenero-${subIdx}`}
                        checked={searchValues.some(
                          ([key, value]) =>
                            key === "subgenero" &&
                            (value === subOption.value ||
                              value.split(".").includes(subOption.value))
                        )}
                        onClick={(event) => {
                          const checked =
                            event.currentTarget.dataset.state === "checked";
                          handleSubFilterChange(subOption.value, checked);
                        }}
                      />
                      <label
                        htmlFor={`subgenero-${subIdx}`}
                        className="text-sm font-medium leading-none"
                      >
                        {subOption.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Accordion>
        ))}

        {/* Filtro de rango de precios */}
        <Accordion type="single" collapsible>
          <AccordionItem value="price-range">
            <AccordionTrigger>
              <span>
                💰 Rango de Precios
                <span className="ml-1 text-xs font-extrabold uppercase">
                  {searchParams.get("rangoPrecio") ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Activo
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <PriceRangeFilter />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Filtro de tallas dinámico */}
        <Accordion type="single" collapsible>
          <AccordionItem value="tallas">
            <AccordionTrigger>
              <span>Tallas</span>
            </AccordionTrigger>
            <AccordionContent>
              {isCalzadoSelected ? (
                <>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium uppercase mb-2">
                      Tallas Europeas
                    </h4>
                    <div className="space-y-4">
                      {tallasCalzadoEuropeas.map((talla, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Checkbox
                            id={`talla-eu-${idx}`}
                            checked={searchValues.some(
                              ([key, value]) =>
                                key === "talla" &&
                                (value === talla.value ||
                                  value.split(".").includes(talla.value))
                            )}
                            onClick={(event) => {
                              const checked =
                                event.currentTarget.dataset.state === "checked";
                              handleFilterChange("talla", talla.value, checked);
                            }}
                          />
                          <label
                            htmlFor={`talla-eu-${idx}`}
                            className="text-sm font-medium uppercase leading-none"
                          >
                            {talla.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium uppercase mb-2">
                      Tallas USA
                    </h4>
                    <div className="space-y-4">
                      {tallasCalzadoUSA.map((talla, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Checkbox
                            id={`talla-us-${idx}`}
                            checked={searchValues.some(
                              ([key, value]) =>
                                key === "talla" &&
                                (value === talla.value ||
                                  value.split(".").includes(talla.value))
                            )}
                            onClick={(event) => {
                              const checked =
                                event.currentTarget.dataset.state === "checked";
                              handleFilterChange("talla", talla.value, checked);
                            }}
                          />
                          <label
                            htmlFor={`talla-us-${idx}`}
                            className="text-sm font-medium uppercase leading-none"
                          >
                            {talla.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : isRopaSelected ? (
                <div className="space-y-4">
                  {tallasRopa.map((talla, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox
                        id={`talla-ropa-${idx}`}
                        checked={searchValues.some(
                          ([key, value]) =>
                            key === "talla" &&
                            (value === talla.value ||
                              value.split(".").includes(talla.value))
                        )}
                        onClick={(event) => {
                          const checked =
                            event.currentTarget.dataset.state === "checked";
                          handleFilterChange("talla", talla.value, checked);
                        }}
                      />
                      <label
                        htmlFor={`talla-ropa-${idx}`}
                        className="text-sm font-medium uppercase leading-none"
                      >
                        {talla.label}
                      </label>
                    </div>
                  ))}
                </div>
              ) : isNiñosSelected ? (
                <div className="space-y-4">
                  {tallasNinos.map((talla, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox
                        id={`talla-ninos-${idx}`}
                        checked={searchValues.some(
                          ([key, value]) =>
                            key === "talla" &&
                            (value === talla.value ||
                              value.split(".").includes(talla.value))
                        )}
                        onClick={(event) => {
                          const checked =
                            event.currentTarget.dataset.state === "checked";
                          handleFilterChange("talla", talla.value, checked);
                        }}
                      />
                      <label
                        htmlFor={`talla-ninos-${idx}`}
                        className="text-sm font-medium uppercase leading-none"
                      >
                        {talla.label}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Selecciona un tipo de producto para ver las tallas disponibles
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </div>
  );
}
