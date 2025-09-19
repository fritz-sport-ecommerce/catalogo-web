import MainTab from "@/components/tabs-home-genero/main-tab";
import { fetchProducts } from "@/config/productos-por-limite";
import React, { Suspense } from "react";

const LoadingTab = () => {
  return (
    <div className="grid w-full grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  xl:gap-4 xl:container-fluid xl:justify-center gap-2">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="group z-10 text-sm xl:px-2   "
      >
        <div className="flex h-full flex-col justify-center border border-blue-gray-300 dark:border-blue-gray-800">
          <div className="w-full h-[320px] bg-gray-200 dark:bg-gray-700"></div>

          <div className="px-2 mt-4 space-y-2">
            <div className="hidden xl:block h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>

            <div className="flex items-center justify-between text-xs text-blue-gray-800 dark:text-white">
              <div className="h-3 w-14 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-3 w-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>

            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>

            <div className="flex flex-col-reverse items-end justify-center">
              <div className="hidden xl:flex flex-col mb-2 w-full space-y-1">
                <div className="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>

              <div className="flex xl:hidden justify-between items-center mb-2 w-full">
                <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
  );
};
export default async function CarouselHomeTabs() {
  const dataCabeceraTab = [
    { id: "566", titulo: "All" },
    { id: "566a", titulo: "Hombre" },
    { id: "5s66", titulo: "Mujer" },
    { id: "5266", titulo: "Niños" },
  ];

  // Solo carga los datos iniciales (All)s
  const initialData = {
    productosAll: await fetchProducts({ limit: 8, gender: "unisex" }),
    // Los demás se cargarán bajo demanda
    productosHombre: null,
    productosMujer: null,
    productosNinos: null,
  };

  return (
    <Suspense fallback={<LoadingTab />}>
      <MainTab dataCabeceraTab={dataCabeceraTab} initialData={initialData} />
    </Suspense>
  );
}
