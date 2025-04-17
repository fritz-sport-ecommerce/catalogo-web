"use client";
import React from "react";
import CantidadProduct from "@/components/product/cantidad-product/cantidad-product";

import { precioProduct } from "@/config/precio-product";
interface props {
  dataProduct: {
    slug: string;
    sku: string;
    tallas: any;
    name: string;
    subgenero_ninos: string | undefined;
    descuento: number;
    priceecommerce: number;
    preciomanual: number;
    marca: string;
    genero: string;
  };
  descuento: number;
  products: {
    stock: number;
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
    <div className="group z-10 text-sm px-2">
      <div className="h-5">
        <CantidadProduct stock={products?.stock} sku={dataProduct?.sku} />
      </div>
      <div className="flex items-center justify-between mt-1  text-xs text-blue-gray-800 dark:text-white">
        <h2 className="font-medium capitalize">
          {dataProduct.marca} - {dataProduct?.genero}{" "}
          {dataProduct?.subgenero_ninos && `- ${dataProduct?.subgenero_ninos}`}
        </h2>
        <h5 className="  font-medium">Sku: {dataProduct.sku}</h5>
      </div>
      <div className="flex justify-between w-full items-start flex-col">
        <h3 className="mt-2 text-sm font-bold capitalize  xl:text-sm 2xl:text-sm w-full">
          {dataProduct.name}
        </h3>
        <div className="flex mt-2  items-start justify-between w-full">
          {(descuento > 0 &&
            products?.preciomanual != products?.priceecommerce) ||
          dataProduct.descuento ||
          descuentoSobreD ? (
            <span className=" font-light text-xs text-[#818181] dark:text-white mt-1">
              Original: S/{dataProduct.priceecommerce}
            </span>
          ) : (
            <span></span>
          )}
          <p
            className={`${
              (descuento &&
                products?.preciomanual != products?.priceecommerce) ||
              descuentoSobreD
                ? "text-red-400"
                : "dark:text-white text-black"
            } font-bold text-base`}
          >
            S/
            {precioProduct(
              dataProduct.descuento,
              dataProduct.priceecommerce,
              dataProduct.preciomanual,
              descuentos,
              descuentoSobreD,
              outlet
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
