"use client";

import React from "react";
import { urlForImage } from "@/sanity/lib/image";
import { SanityProduct } from "@/config/inventory";

interface props {
  id: Number;
  open: Number;
}
interface Props {
  product: SanityProduct;
}
function Icon({ id, open }: props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export function AccordionDetails({ product }: Props) {
  return (
    <>
      <div className="mb-16 flex flex-col justify-center">
        <div>
          <div className="px-10 text-black dark:text-white">
            <div className="grid grid-flow-row gap-y-2 xl:grid-cols-2 xl:gap-4 xl:text-base">
              {product.detalles?.map((el: string) => (
                <li key={el}>{el}</li>
              ))}
              {/* <li>Sistema de amarre de pasadores</li>
              <li>Parte superior de gamiza y currentColor</li>
              <li>Forro interior sintético</li>
              <li>Suela tipo cupsole de caucho</li>
              <li>Color del artículo: Preloved Green / Core Black / Gum</li>
              <li>Número de artículo: {product.sku}</li> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
