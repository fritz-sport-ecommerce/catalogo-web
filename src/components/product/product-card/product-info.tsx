"use client";
import React from "react";
import CantidadProduct from "../cantidad-product/cantidad-product";
import Link from "next/link";
import { precioProduct } from "@/config/precio-product";
interface props {
  dataProduct: {
    slug: string;
    sku: string;
    stock: number;
    tallas: [];
    name: string;
    subgenero_ninos: string | undefined;
    descuento: number;
    priceecommerce: number;
    pricemayorista: number;
    priceemprendedor: number;

    preciomanual: number;
    marca: string;
    genero: string;
  };
  descuento: number;
  products: {
    preciomanual: number;
    priceecommerce: number;
  };
  descuentos: {};
  descuentoSobreD: number;
  outlet: boolean;
}
export default function ProductInfo({
  dataProduct,
  descuento,
  products,
  descuentos,
  descuentoSobreD,
  outlet,
}: props) {
  return (
    <Link
      href={`/products/${dataProduct?.slug}/${dataProduct?.sku}`}
      className="group z-10 text-sm px-2"
    >
      <div className="h-5">
        <CantidadProduct stock={dataProduct?.stock} sku={dataProduct?.sku} />
      </div>
      <div className="flex items-center justify-between mt-1  text-xs text-blue-gray-800 dark:text-white">
        <h2 className="font-medium capitalize">
          {dataProduct?.marca} - {dataProduct?.genero}{" "}
          {dataProduct?.subgenero_ninos && `- ${dataProduct?.subgenero_ninos}`}
        </h2>
        <h5 className="  font-medium">Sku: {dataProduct?.sku}</h5>
      </div>
      <div className="flex justify-between w-full items-start">
        <h3 className="mt-2 text-sm font-bold capitalize  xl:text-sm 2xl:text-sm w-full h-10">
          {dataProduct?.name}
        </h3>
      </div>

      <div className="flex mt-2 flex-col-reverse items-end justify-center">
        <div className="flex justify-between items-center w-full">
          <div className="uppercase">Precio Retail:</div>
          <div className={`dark:text-white text-black font-bold text-base`}>
            S/
            {dataProduct?.priceecommerce
              ? dataProduct?.priceecommerce?.toFixed(2)
              : "----"}
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="uppercase">Precio Emprendedor:</div>
          <div className={`dark:text-white text-black font-bold text-base`}>
            S/
            {dataProduct?.priceemprendedor
              ? dataProduct?.priceemprendedor?.toFixed(2)
              : "----"}
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="uppercase">Precio Mayorista:</div>
          <div className={` text-red-500 font-bold text-lg`}>
            S/
            {dataProduct?.pricemayorista
              ? dataProduct?.pricemayorista?.toFixed(2)
              : "----"}
          </div>
        </div>
      </div>
    </Link>
  );
}
