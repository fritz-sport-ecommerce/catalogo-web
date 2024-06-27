"use client";

import { useState } from "react";
import { XCircle } from "lucide-react";

import { SanityProduct } from "@/config/inventory";

import Product from "./product/product";

interface Props {
  products: SanityProduct[];
  generoSku: boolean;
  outlet: boolean | undefined;
  descuentos: any;
}

export function ProductGrid({
  products,
  generoSku,
  outlet = false,
  descuentos,
}: Props) {
  const articlesShown = 8;
  const [loadMore, setLoadMore] = useState(articlesShown);
  const showMoreArticles = () => {
    setLoadMore(loadMore + articlesShown);
  };

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
    <div className="flex flex-col">
      <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 lg:col-span-3 lg:gap-x-8">
        {products.slice(0, loadMore).map((product, i) => (
          <Product
            key={i}
            outlet={outlet}
            products={product}
            generoSku={false}
            descuentos={descuentos}
          />
        ))}
      </div>
      <div className="flex justify-center mt-5">
        {loadMore < products?.length ? (
          <button
            type="button"
            className="group relative overflow-hidden  bg-white px-2 py-3 text-sm md:text-base "
            onClick={showMoreArticles}
          >
            <div className="duration-[350ms] absolute inset-0  w-3  bg-blue-gray-900   transition-all ease-out group-hover:w-full"></div>
            <span className="relative uppercase text-black group-hover:text-white md:text-sm">
              Ver Mas Productos
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="cursor-not-allowed  uppercase dark:bg-white bg-black px-2 py-3 text-sm text-[#FFF] dark:text-black opacity-80 md:text-sm"
            onClick={showMoreArticles}
            disabled
          >
            Todos los productos cargados
          </button>
        )}
      </div>
      <div className="mt-5 flex justify-center">
        {loadMore > products?.length ? products?.length : loadMore} de{" "}
        {products?.length} Productos
      </div>
    </div>
  );
}
