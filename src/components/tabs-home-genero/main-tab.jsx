"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import Cabecera from "./cabecera";
import { ProductGridTab } from "./product-grid-tab";

const GENDER_MAP = {
  Hombre: { gender: "hombre", key: "productosHombre" },
  Mujer: { gender: "mujer", key: "productosMujer" },
  Niños: { gender: "niños", key: "productosNinos" },
  All: { gender: "unisex", key: "productosAll" },
};

export default function MainTab({ dataCabeceraTab, initialData }) {
  const [activeTab, setActiveTab] = useState({
    data: initialData.productosAll,
    genero: "tienda",
    loading: false,
  });

  const handleTabChange = useCallback(async (value) => {
    const config = GENDER_MAP[value] || GENDER_MAP.All;

    setActiveTab((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const response = await fetch(
        `/api/products?limit=24&gender=${config.gender}`
      );
      const data = await response.json();

      setActiveTab({
        data,
        genero: config.gender === "unisex" ? "tienda" : config.gender,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      setActiveTab((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);

  const verMasHref = useMemo(() => {
    if (!activeTab.genero) return "/tienda";
    return `/tienda${activeTab.genero === "tienda" ? "" : `?genero=${activeTab.genero}`}`;
  }, [activeTab.genero]);

  return (
    <div className="mt-10  h-full w-full ">
      <div className="flex flex-col ">
        <Cabecera dataCabeceraTab={dataCabeceraTab} handler={handleTabChange} />

        {activeTab.loading ? (
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
        ) : (
          <ProductGridTab products={activeTab.data} />
        )}

        {verMasHref && (
          <div className="mt-5 flex w-full justify-center">
            <Link href={verMasHref}>
              <Button className="uppercase rounded-none">Ver Más</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
