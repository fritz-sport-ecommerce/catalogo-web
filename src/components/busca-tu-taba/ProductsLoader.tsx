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
          setData({
            products: quickResult.products,
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

  return (
    <InfiniteProductGrid
      initial={data.products}
      total={data.total}
      pageSize={itemsPerPage}
      useQuickEndpoint={true}
    />
  );
}
