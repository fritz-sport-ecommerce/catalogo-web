"use client";

import { XCircle } from "lucide-react";

import { SanityProduct } from "@/config/inventory";

import Product from "../product/product";

interface Props {
  products: SanityProduct[];
  descuentos: any;
}

export function ProductGridTab({ products, descuentos }: Props) {
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
    <div className=" grid w-full grid-cols-2 gap-x-4 gap-y-10 xl:container xl:grid xl:grid-cols-3 xl:justify-center xl:gap-4">
      {products
        // .filter((el) => el.stock > 0)
        .map((product, i) => (
          <Product
            descuentos={descuentos}
            key={i}
            generoSku={true}
            outlet={false}
            products={product}
            relacionados={false}
          />
        ))}
    </div>
  );
}
