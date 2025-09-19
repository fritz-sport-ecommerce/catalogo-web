"use client";
import React from "react";
import CantidadProduct from "../cantidad-product/cantidad-product";
import ProductPrecioDescuento from "./product-precio-descuento";

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
    razonsocial: string;
    preciomanual: number;
    marca: string;
    precio_original: number | null;
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
    <div className="px-2">
      <div className="h-5 xl:block hidden">
        <CantidadProduct stock={dataProduct?.stock} sku={dataProduct?.sku} />
      </div>
      <div className="flex items-center justify-between mt-1  text-xs text-blue-gray-800 dark:text-white">
        <h2 className="font-medium capitalize text-xs">
          {dataProduct?.genero}
        </h2>
        <h5 className="  font-medium">{dataProduct?.sku}</h5>
      </div>
      <div className="flex justify-between w-full items-start mb-2">
        <h3 className=" text-sm font-bold capitalize  xl:text-sm 2xl:text-sm w-full h-10">
          {dataProduct?.name}
        </h3>
      </div>

      <ProductPrecioDescuento dataProduct={dataProduct} />
    </div>
  );
}
