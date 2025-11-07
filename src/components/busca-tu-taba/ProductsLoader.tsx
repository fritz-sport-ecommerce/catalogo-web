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
  const [data, setData] = useState<{ products: any[]; total: number; suggestions?: any[] } | null>(null);
  const [progress, setProgress] = useState(0);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  console.log('📋 ProductsLoader - Componente montado con:', {
    searchParamsKeys: Object.keys(searchParams),
    itemsPerPage,
    hasSearchParams: !!searchParams
  });

  useEffect(() => {
    const fetchProducts = async () => {
      // Evitar múltiples requests simultáneos
      if (isRequestInProgress) {
        console.log('🚫 Evitando request duplicado');
        return;
      }
      
      setIsRequestInProgress(true);
      setLoadingInitial(true);
      setProgress(0);
      setError(null);
      setIsEmpty(false);
      
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
        params.set("limit", String(itemsPerPage)); // Usar el itemsPerPage completo

        console.log('📋 ProductsLoader - Iniciando request a:', `/api/busca-tu-taba/quick?${params.toString()}`);

        // Usar el endpoint quick optimizado con timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout (aumentado de 15s)
        
        const quickResponse = await fetch(`/api/busca-tu-taba/quick?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        const quickResult = await quickResponse.json();

        clearInterval(progressInterval);
        setProgress(100);

        if (quickResult.ok) {
          // Ordenar por más nuevos primero si el filtro de nuevos está activo
          const shouldSortByNew = (searchParams?.fecha === 'desc');
          const products = Array.isArray(quickResult.products) ? [...quickResult.products] : [];
          
          const suggestions = Array.isArray(quickResult.suggestions) ? quickResult.suggestions : [];
          
          console.log('📋 ProductsLoader - Datos recibidos:', {
            total: quickResult.total,
            productos: products.length,
            sugerencias: suggestions.length,
            shouldSort: shouldSortByNew,
            quickResultOk: quickResult.ok,
            quickResultStructure: Object.keys(quickResult)
          });
          
          if (shouldSortByNew && products.length > 0) {
            products.sort((a: any, b: any) => {
              const ad = new Date((a?.fecha_cuando_aparece as string) || (a?._createdAt as string) || 0).getTime();
              const bd = new Date((b?.fecha_cuando_aparece as string) || (b?._createdAt as string) || 0).getTime();
              return bd - ad; // descendente
            });
          }
          
          // Verificar si hay productos
          if (products.length === 0 || quickResult.total === 0) {
            setIsEmpty(true);
            setProgress(100);
            setTimeout(() => {
              setLoadingInitial(false);
            }, 500);
            return;
          }
          
          setData({
            products,
            total: quickResult.total,
            suggestions: suggestions.length > 0 ? suggestions : undefined,
          });
          
          console.log('📋 ProductsLoader - Data actualizada:', {
            products: products.length,
            total: quickResult.total,
            suggestions: suggestions.length
          });
          
          // Pequeña pausa para mostrar 100%
          setTimeout(() => {
            setLoadingInitial(false);
            console.log('📋 ProductsLoader - Loading finalizado');
          }, 300);
        } else {
          console.log('📋 ProductsLoader - Respuesta no exitosa:', quickResult);
          setError(quickResult.error || 'Error al cargar los productos');
          setProgress(0);
          setLoadingInitial(false);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        clearInterval(progressInterval);
        setProgress(0);
        
        // Mostrar error más específico
        if (error instanceof Error && error.name === 'AbortError') {
          setError('El servidor tardó demasiado en responder. Intenta de nuevo.');
          console.error("Request timeout - servidor sobrecargado");
        } else if (error instanceof Error) {
          setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
        } else {
          setError('Error inesperado. Intenta de nuevo.');
        }
        
        setLoadingInitial(false);
      } finally {
        setIsRequestInProgress(false);
      }
    };

    // Debounce para evitar requests excesivos
    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchParams, itemsPerPage]); // Remover isRequestInProgress de dependencias

  // Función para reintentar
  const handleRetry = () => {
    setError(null);
    setIsEmpty(false);
    setData(null);
    // El useEffect se ejecutará automáticamente debido a las dependencias
  };

  console.log('📋 ProductsLoader - Estado actual:', {
    loadingInitial,
    hasData: !!data,
    dataTotal: data?.total,
    dataProducts: data?.products?.length,
    error,
    isEmpty
  });

  if (loadingInitial || !data) {
    return (
      <FetchingSkeleton 
        progress={progress} 
        error={error}
        isEmpty={isEmpty}
        onRetry={handleRetry}
        isLoading={loadingInitial}
      />
    );
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
      initialSuggestions={data.suggestions}
    />
  );
}
