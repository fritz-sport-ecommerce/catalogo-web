"use client";
import React from "react";
import Product from "@/components/product/product-card/product";

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
    }, { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, [fetchMore]);

  return (
    <div className="flex flex-col w-full">
      {items.length === 0 ? (
        <div className="mx-auto grid h-40 w-full place-items-center rounded-md border-2 border-dashed bg-gray-50 py-10 text-center dark:bg-gray-900">
          <div className="mx-auto h-10 w-10 rounded-full bg-gray-200" />
          <h1 className="mt-2 p-5 text-xl font-bold tracking-tight text-gray-500 dark:text-gray-200">
            No se encontraron productos
          </h1>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 xl:gap-x-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 lg:gap-x-8">
            {items.map((product, i) => (
              <div key={`${product._id}-${i}`} className="relative">
                {/* <div className="absolute left-2 top-2 z-10 bg-black/80 text-white text-xs font-semibold rounded px-2 py-1">#{i + 1}</div> */}
                <Product products={product} />
              </div>
            ))}
          </div>
          <div ref={sentinelRef} className="h-12" />
          {loading && (
            <div className="py-4 text-center text-sm text-gray-500">Cargando...</div>
          )}
          {!hasMore && items.length > 0 && (
            <div className="py-4 text-center text-xs text-gray-400">Has visto todo</div>
          )}
        </>
      )}
    </div>
  );
}
