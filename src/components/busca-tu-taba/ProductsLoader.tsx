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
  const [retryTrigger, setRetryTrigger] = useState(0); // Nuevo: trigger para forzar retry

  console.log('📋 ProductsLoader - Componente montado con:', {
    searchParamsKeys: Object.keys(searchParams),
    itemsPerPage,
    hasSearchParams: !!searchParams
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchProducts = async () => {
      // Evitar múltiples requests simultáneos (excepto en retry)
      if (isRequestInProgress && retryTrigger === 0) {
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

        // Usar el endpoint quick optimizado con timeout de 35s (Vercel Pro tiene 30s en el backend)
        const timeoutId = setTimeout(() => controller.abort(), 35000);
        
        const quickResponse = await fetch(`/api/busca-tu-taba/quick?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!isMounted) return;
        
        // Verificar si la respuesta es válida antes de parsear JSON
        if (!quickResponse.ok) {
          throw new Error(`Error ${quickResponse.status}: ${quickResponse.statusText}`);
        }
        
        const quickResult = await quickResponse.json();

        clearInterval(progressInterval);
        
        if (!isMounted) return;
        
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
          
          // SIEMPRE mostrar productos, incluso si son pocos
          // Combinar productos + sugerencias para asegurar mínimo 6 items
          const MIN_PRODUCTS = 6;
          const totalItems = products.length + suggestions.length;
          
          console.log('📋 ProductsLoader - Verificando mínimo de productos:', {
            productos: products.length,
            sugerencias: suggestions.length,
            total: totalItems,
            minimo: MIN_PRODUCTS
          });
          
          // Si hay menos de MIN_PRODUCTS, las sugerencias se mostrarán automáticamente
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
            if (isMounted) {
              setLoadingInitial(false);
              console.log('📋 ProductsLoader - Loading finalizado');
            }
          }, 300);
        } else {
          console.log('📋 ProductsLoader - Respuesta no exitosa:', quickResult);
          if (isMounted) {
            setError(quickResult.error || 'Error al cargar los productos');
            setProgress(0);
            setLoadingInitial(false);
          }
        }
      } catch (error) {
        clearInterval(progressInterval);
        
        if (!isMounted) return;
        
        console.error("Error loading products:", error);
        setProgress(0);
        
        // Mostrar error más específico
        if (error instanceof Error && error.name === 'AbortError') {
          setError('La búsqueda tardó más de 35 segundos. Intenta reducir los filtros o recarga la página.');
          console.error("Request timeout - servidor sobrecargado");
        } else if (error instanceof Error) {
          // Detectar errores 504
          if (error.message.includes('504') || error.message.includes('Gateway')) {
            setError('El servidor está sobrecargado (504). Intenta de nuevo en unos segundos.');
          } else if (error.message.includes('JSON')) {
            setError('Error al procesar la respuesta. El servidor puede estar sobrecargado.');
          } else {
            setError(`Error: ${error.message}`);
          }
        } else {
          setError('Error inesperado. Intenta de nuevo.');
        }
        
        setLoadingInitial(false);
      } finally {
        if (isMounted) {
          setIsRequestInProgress(false);
        }
      }
    };

    // Debounce para evitar requests excesivos
    const timeoutId = setTimeout(fetchProducts, 300);
    
    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [searchParams, itemsPerPage, retryTrigger]); // Agregar retryTrigger a dependencias

  // Función para reintentar - ahora fuerza un nuevo fetch
  const handleRetry = () => {
    console.log('🔄 Reintentando carga de productos...');
    setError(null);
    setIsEmpty(false);
    setData(null);
    setRetryTrigger(prev => prev + 1); // Incrementar para forzar useEffect
  };

  console.log('📋 ProductsLoader - Estado actual:', {
    loadingInitial,
    hasData: !!data,
    dataTotal: data?.total,
    dataProducts: data?.products?.length,
    dataSuggestions: data?.suggestions?.length,
    error,
    isEmpty
  });

  // Si hay error pero tenemos datos en cache, mostrar los datos
  if (error && !data) {
    // Solo mostrar error si no hay datos en absoluto
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

  if (loadingInitial || !data) {
    return (
      <FetchingSkeleton 
        progress={progress} 
        error={null} // No mostrar error durante carga inicial
        isEmpty={isEmpty}
        onRetry={handleRetry}
        isLoading={loadingInitial}
      />
    );
  }

  // Si no hay productos pero hay sugerencias, mostrarlas
  // NO mostrar mensaje de "no encontrado" si hay sugerencias
  const totalItems = (data.products?.length || 0) + (data.suggestions?.length || 0);
  
  if (totalItems === 0) {
    // Solo mostrar mensaje si realmente no hay nada
    const handleSuggestPriceRange = () => {
      const params = new URLSearchParams(urlParams?.toString());
      params.set("rangoPrecio", "0-999999");
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
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Prueba ampliando el rango de precios para ver más resultados.</p>
        <button
          onClick={handleSuggestPriceRange}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black text-white px-5 py-3 text-sm font-semibold shadow-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all"
        >
          Ver todos los precios
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
