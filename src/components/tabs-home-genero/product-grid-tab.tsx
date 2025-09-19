"use client";

import { XCircle } from "lucide-react";

import { SanityProduct } from "@/config/inventory";
import Product from "../product/product-card/product";

interface Props {
  products: SanityProduct[];

}

export function ProductGridTab({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="mx-auto grid h-40 w-full place-items-center rounded-md border-2 border-dashed bg-gray-50 py-10 text-center dark:bg-gray-900">
        <div>
          <XCircle className="mx-auto h-10 w-10 text-gray-500 dark:text-gray-200" />
          <h1 className="mt-2 text-xl font-bold tracking-tight text-gray-500 dark:text-gray-200 sm:text-2xl">
            No se encontraron productos
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="grid  w-full grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-3  2xl:grid-cols-4 xl:gap-4 2xl:gap-8">
      {products
        // .filter((el) => el.stock > 0)
        .map((product, i) => (
          <Product key={i} products={product} />
        ))}
    </div>
  );
}
