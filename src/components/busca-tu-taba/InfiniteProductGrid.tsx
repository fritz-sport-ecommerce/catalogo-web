"use client";
import React from "react";
import Product from "@/components/product/product-card/product";
import ProductGridSkeleton from "./ProductGridSkeleton";

type Product = any;

export default function InfiniteProductGrid({
  initial,
  total,
  pageSize,
}: {
  initial: Product[];
  total: number;
  pageSize: number;
}) {
  const [items, setItems] = React.useState<Product[]>(initial);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(initial.length < total);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  const fetchMore = React.useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      params.set("page", String(page + 1));
      params.set("limit", String(pageSize));
      const res = await fetch(`/api/busca-tu-taba?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (data?.ok) {
        const next = data.products as Product[];
        setItems((prev) => [...prev, ...next]);
        setPage((p) => p + 1);
        const loaded = (page + 1) * pageSize;
        setHasMore(loaded < data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize]);

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
                <Product products={product} />
              </div>
            ))}
          </div>
          <div ref={sentinelRef} className="h-20" />
          {loading && (
            <div className="mt-8">
              <ProductGridSkeleton count={6} />
            </div>
          )}
          {!hasMore && items.length > 0 && (
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
