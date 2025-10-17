"use client";

import { useEffect, useState } from "react";
import InfiniteProductGrid from "./InfiniteProductGrid";
import FetchingSkeleton from "./FetchingSkeleton";

interface ProductsLoaderProps {
  searchParams: Record<string, string | undefined>;
  itemsPerPage: number;
}

export default function ProductsLoader({ searchParams, itemsPerPage }: ProductsLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ products: any[]; total: number } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
        params.set("page", "1");
        params.set("limit", String(itemsPerPage));

        const response = await fetch(`/api/busca-tu-taba?${params.toString()}`, {
          cache: "no-store",
        });
        const result = await response.json();

        if (result.ok) {
          setData({
            products: result.products,
            total: result.total,
          });
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, itemsPerPage]);

  if (loading || !data) {
    return <FetchingSkeleton />;
  }

  return (
    <InfiniteProductGrid
      initial={data.products}
      total={data.total}
      pageSize={itemsPerPage}
    />
  );
}
