"use client";
import React from "react";

import ProductPrecioDescuento from "../product/product-card/product-precio-descuento";
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

}
export default function ProductInfo({
  dataProduct,

}: props) {
  return (
    <div className="group z-10 text-sm px-2 flex flex-col justify-between h-full">
      {/* <div className="h-5">
        <CantidadProduct stock={products?.stock} sku={dataProduct?.sku} />
      </div> */}
      <div className="flex items-center justify-between mt-1  text-xs text-blue-gray-800 dark:text-white">
        <h2 className="font-medium capitalize text-xs">
          {dataProduct?.genero}{" "}
        </h2>
        <h5 className="  font-medium">{dataProduct.sku}</h5>
      </div>
      <div className="flex justify-between w-full items-start flex-col">
        <h3 className="mt-2 text-sm font-bold capitalize  xl:text-sm 2xl:text-sm w-full">
          {dataProduct?.name}
        </h3>
        <div className="mt-2 flex xl:justify-start justify-end items-end w-full">
          <ProductPrecioDescuento dataProduct={dataProduct} />
        </div>
      </div>
    </div>
  );
}
