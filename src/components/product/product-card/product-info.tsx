"use client";
import React from "react";
import ProductPrecioDescuento from "./product-precio-descuento";

interface props {
  dataProduct: {
    slug?: string;
    sku?: string;
    stock?: number;
    tallas?: [];
    name?: string;
    subgenero_ninos?: string | undefined;
    descuento?: number;
    priceecommerce?: number;
    pricemayorista?: number;
    mayorista_cd?: number;
    priceemprendedor?: number;
    razonsocial?: string;
    preciomanual?: number;
    marca?: string;
    precio_original?: number | null;
    genero?: string;
    precio_retail?: number;
    precio_emprendedor?: number;
    precio_mayorista?: number;
  };
  descuento?: number;
  products?: {
    preciomanual?: number;
    priceecommerce?: number;
  };
  descuentos?: {};
  descuentoSobreD?: number;
  outlet?: boolean;
}

export default function ProductInfo({
  dataProduct,
}: props) {
  return (
    <ProductPrecioDescuento dataProduct={dataProduct} />
  );
}
