"use client";

import { useEffect, useState } from "react";
import InfiniteProductGrid from "./InfiniteProductGrid";
import FetchingSkeleton from "./FetchingSkeleton";

interface ProductsLoaderProps {
  searchParams: Record<string, string | undefined>;
  itemsPerPage: number;
}

export default function ProductsLoader({ searchParams, itemsPerPage }: ProductsLoaderProps) {
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [data, setData] = useState<{ products: any[]; total: number } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingInitial(true);
      try {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
        params.set("page", "1");
        params.set("limit", String(itemsPerPage));

        // FASE 1: Cargar datos rápidos de Sanity (sin precios del sistema)
        const quickResponse = await fetch(`/api/busca-tu-taba/quick?${params.toString()}`, {
          cache: "no-store",
        });
        const quickResult = await quickResponse.json();

        if (quickResult.ok) {
          // Mostrar productos inmediatamente con datos de Sanity
          setData({
            products: quickResult.products,
            total: quickResult.total,
          });
          setLoadingInitial(false);

          // FASE 2: Cargar precios completos en segundo plano (opcional, para scroll infinito)
          // Los precios individuales se cargarán por producto con ProductCardWithLazyPrices
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setLoadingInitial(false);
      }
    };

    fetchProducts();
  }, [searchParams, itemsPerPage]);

  if (loadingInitial || !data) {
    return <FetchingSkeleton />;
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
