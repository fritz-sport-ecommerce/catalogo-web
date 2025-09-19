"use client";

import Link from "next/link";
import { Breadcrumbs } from "@material-tailwind/react";

import { SanityProduct } from "@/config/inventory";

interface Props {
  product: SanityProduct;
}
export function BreadcrumbsDefault({ product }: Props) {
  return (
    <Breadcrumbs
      nonce={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
      className="bg-transparent  capitalize "
    >
      <Link
        href="/"
        className="border-b-[1px]  border-black text-black dark:border-white xl:dark:text-white dark:text-white"
      >
        inicio
      </Link>
      <Link
        href={`/tienda?genero=${product?.genero}`}
        className="border-b-[1px] border-black text-black  dark:border-white  xl:dark:text-white dark:text-white"
      >
        {product.genero}
      </Link>
      <Link
        href={`/tienda?genero=${product.genero}&tipo=${product?.tipo}`}
        className="border-b-[1px] border-black text-black dark:border-white xl:dark:text-white dark:text-white"
      >
        {product?.tipo}
      </Link>
    </Breadcrumbs>
  );
}
