"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import InfiniteProductGrid from "./InfiniteProductGrid";
import FetchingSkeleton from "./FetchingSkeleton";

interface ProductsLoaderProps {
  searchParams: Record<string, string | undefined>;
  itemsPerPage: number;
}

export default function ProductsLoader({ searchParams, itemsPerPage }: ProductsLoaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const urlParams = useSearchParams();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [data, setData] = useState<{ products: any[]; total: number } | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingInitial(true);
      setProgress(0);
      
      // Simular progreso mientras carga
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) {
            return prev + Math.random() * 15 + 5;
          }
          return prev;
        });
      }, 300);
      
      try {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
        params.set("page", "1");
        params.set("limit", String(itemsPerPage));

        // Usar el endpoint quick optimizado
        const quickResponse = await fetch(`/api/busca-tu-taba/quick?${params.toString()}`, {
          cache: "no-store",
        });
        const quickResult = await quickResponse.json();

        clearInterval(progressInterval);
        setProgress(100);

        if (quickResult.ok) {
          // Ordenar por más nuevos primero si el filtro de nuevos está activo
          const shouldSortByNew = (searchParams?.fecha === 'desc');
          const products = Array.isArray(quickResult.products) ? [...quickResult.products] : [];
          if (shouldSortByNew) {
            products.sort((a: any, b: any) => {
              const ad = new Date((a?.fecha_cuando_aparece as string) || (a?._createdAt as string) || 0).getTime();
              const bd = new Date((b?.fecha_cuando_aparece as string) || (b?._createdAt as string) || 0).getTime();
              return bd - ad; // descendente
            });
          }
          setData({
            products,
            total: quickResult.total,
          });
          
          // Pequeña pausa para mostrar 100%
          setTimeout(() => {
            setLoadingInitial(false);
          }, 300);
        } else {
          setLoadingInitial(false);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        clearInterval(progressInterval);
        setLoadingInitial(false);
      }
    };

    fetchProducts();
  }, [searchParams, itemsPerPage]);

  if (loadingInitial || !data) {
    return <FetchingSkeleton progress={progress} />;
  }

  // Estado vacío: sugerir ampliar rango de precios
  if ((data.total ?? 0) === 0) {
    const handleSuggestPriceRange = () => {
      const params = new URLSearchParams(urlParams?.toString());
      params.set("rangoPrecio", "0-1000");
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };
    const handleClearFilters = () => {
      const params = new URLSearchParams(urlParams?.toString());
      ["tipo","genero","category","marca","rangoPrecio","fecha","search","page"].forEach((k) => params.delete(k));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-2xl border-gray-200 dark:border-gray-700">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">No se encontraron productos</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Prueba ampliando el rango de precios a 0 - 1000 para ver más resultados.</p>
        <button
          onClick={handleSuggestPriceRange}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black text-white px-5 py-3 text-sm font-semibold shadow-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all"
        >
          Aplicar rango 0 - 1000
        </button>
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">O bien</div>
        <button
          onClick={handleClearFilters}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          Limpiar filtros
        </button>
      </div>
    );
  }

  return (
    <InfiniteProductGrid
      initial={data.products}
      total={data.total}
      pageSize={itemsPerPage}
      useQuickEndpoint={true}
    />
  );
}
