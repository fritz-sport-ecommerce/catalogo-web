"use client";
import React from "react";
import Product from "@/components/product/product-card/product";
import ProductCardWithLazyPrices from "./ProductCardWithLazyPrices";
import ProductGridSkeleton from "./ProductGridSkeleton";

type Product = any;

export default function InfiniteProductGrid({
  initial,
  total,
  pageSize,
  useQuickEndpoint = false,
}: {
  initial: Product[];
  total: number;
  pageSize: number;
  useQuickEndpoint?: boolean;
}) {
  const [items, setItems] = React.useState<Product[]>(initial);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(initial.length < total);
  const [loadingError, setLoadingError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  // Debug logs
  React.useEffect(() => {
    console.log('📋 InfiniteProductGrid - Props recibidos:', {
      initialLength: initial.length,
      total,
      pageSize,
      useQuickEndpoint,
      firstProduct: initial[0] ? {
        _id: initial[0]._id,
        sku: initial[0].sku,
        name: initial[0].name
      } : null
    });
  }, [initial, total, pageSize, useQuickEndpoint]);

  React.useEffect(() => {
    console.log('📋 InfiniteProductGrid - Estado actual:', {
      itemsLength: items.length,
      total,
      loading,
      hasMore
    });
  }, [items, total, loading, hasMore]);

  const fetchMore = React.useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setLoadingError(null);
    
    try {
      const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      params.set("page", String(page + 1));
      params.set("limit", String(pageSize));
      
      // Usar endpoint rápido si está habilitado
      const endpoint = useQuickEndpoint ? "/api/busca-tu-taba/quick" : "/api/busca-tu-taba";
      
      // Timeout más corto para paginación (15 segundos)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const res = await fetch(`${endpoint}?${params.toString()}`, { 
        cache: "no-store",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await res.json();
      
      if (data?.ok) {
        const next = data.products as Product[];
        setItems((prev) => [...prev, ...next]);
        setPage((p) => p + 1);
        const loaded = (page + 1) * pageSize;
        setHasMore(loaded < data.total);
        setRetryCount(0); // Reset retry count on success
      } else {
        throw new Error(data?.error || 'Error al cargar más productos');
      }
    } catch (error) {
      console.error('Error fetching more products:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        setLoadingError('La carga tardó demasiado. Intenta de nuevo.');
      } else if (error instanceof Error) {
        setLoadingError(error.message);
      } else {
        setLoadingError('Error inesperado al cargar más productos');
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize, useQuickEndpoint]);

  // Función para reintentar la carga
  const handleRetry = React.useCallback(() => {
    setRetryCount(prev => prev + 1);
    setLoadingError(null);
    fetchMore();
  }, [fetchMore]);

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchMore();
        }
      });
    }, { rootMargin: "400px" }); // Cargar cuando esté a 400px del final
    io.observe(el);
    return () => io.disconnect();
  }, [fetchMore]);

  return (
    <div className="flex flex-col w-full">
      {items.length === 0 ? (
        <div className="mx-auto grid h-64 w-full place-items-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-12 text-center">
          <div>
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="mt-4 text-xl md:text-2xl font-bold tracking-tight text-gray-700 dark:text-gray-200">
              No se encontraron productos
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Intenta ajustar tus filtros para ver más resultados
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Mostrando <span className="font-semibold text-gray-900 dark:text-white">{items.length}</span> de <span className="font-semibold text-gray-900 dark:text-white">{total}</span> productos
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
            {items.map((product, i) => (
              <div key={`${product._id}-${i}`} className="relative">
                {useQuickEndpoint ? (
                  <ProductCardWithLazyPrices product={product} />
                ) : (
                  <Product products={product} />
                )}
              </div>
            ))}
          </div>
          <div ref={sentinelRef} className="h-20" />
          
          {/* Estado de carga mejorado */}
          {loading && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Cargando más productos...
                </span>
              </div>
              <ProductGridSkeleton count={6} />
            </div>
          )}
          
          {/* Estado de error con botón de reintento */}
          {loadingError && !loading && (
            <div className="mt-8 py-8 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Error al cargar más productos</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {loadingError}
                </p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reintentar {retryCount > 0 && `(${retryCount})`}
                </button>
              </div>
            </div>
          )}
          
          {/* Estado final - todos los productos cargados */}
          {!hasMore && items.length > 0 && !loading && !loadingError && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Has visto todos los productos</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
