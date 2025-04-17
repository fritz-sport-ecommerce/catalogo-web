"use client";

import { useState, useEffect, useRef } from "react";
import { XCircle } from "lucide-react";

import { SanityProduct } from "@/config/inventory";
import Product from "./product/product-card/product";


interface Props {
  products: SanityProduct[];
  generoSku: boolean;
  outlet: boolean | undefined;
  descuentos: any;
}
function Loading() {
  return (
<div className="flex flex-col xl:py-20 py-10  px-0">
  <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4   lg:col-span-3 lg:gap-x-8">
  {Array.from({ length: 8 }).map((_, index) => (
    <div
      key={index}
      className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-4 animate-pulse"
    >
      <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded-md mb-4"></div>
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-md mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4"></div>
    </div>
  ))}
</div>
</div>
  );
}
export function ProductGrid({
  products,
  generoSku,
  outlet = false,
  descuentos,
}: Props) {
  const articlesShown = 16;
  const [loadMore, setLoadMore] = useState(articlesShown);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  const showMoreArticles = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => { // Simulating a delay for loading more products
      setLoadMore((prev) => Math.min(prev + articlesShown, products.length));
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isLoading && loadMore < products.length) {
        showMoreArticles();
      }
    };

    observer.current = new IntersectionObserver(callback, { threshold: 1.0 });
    if (lastProductRef.current) {
      observer.current.observe(lastProductRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isLoading, loadMore, products.length]);

  if (products.length === 0) {
    return (
      <div className="mx-auto grid h-40 w-full place-items-center rounded-md border-2 border-dashed bg-gray-50 py-10 text-center dark:bg-gray-900">
        <div>
          <XCircle className="mx-auto h-10 w-10 text-gray-500 dark:text-gray-200" />
          <h1 className="mt-2 p-5 text-xl font-bold tracking-tight text-gray-500 dark:text-gray-200 sm:text-2xl">
            No se encontraron productos
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  lg:col-span-3 lg:gap-x-8">

        {products.slice(0, loadMore).map((product, i) => (
          <div key={i} ref={i === loadMore - 1 ? lastProductRef : null}>
            <Product
              outlet={outlet}
              products={product}
         
              descuentos={descuentos}
            />
          </div>
        ))}
      </div>
      {isLoading && <Loading />}
      <div className="mt-5 flex justify-center">
        {loadMore > products.length ? products.length : loadMore} de {products.length} Productos
      </div>
    </div>
  );
}
