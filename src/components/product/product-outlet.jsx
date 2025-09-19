"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import ProductPrecioDescuentoDark from "./product-card/product-precio-descuento-dark";
import ImageReplaceEcommerceCatalogo from "../imageReplaceEcommerceCatalogo";
import LoveFollow from "../love-follow/love-follow";
import CantidadProduct from "./cantidad-product/cantidad-product";

export default function ProductOutlet({ products }) {
  const [stock, setStock] = useState();
  console.log("ProductOutlet - Producto:", products?.name, "Stock:", products?.stock, "Stock calculado:", stock);
  const [hoverImage, setHoverImage] = useState(
    products?.images && products?.images[0]?.asset
      ? urlForImage(products.images[0]?.asset._ref).url()
      : "http://via.placeholder.com/2000x2000"
  );

  // Calcular el porcentaje de descuento igual que en ProductPrecioDescuento
  const calcularPorcentajeDescuento = () => {
    if (!products?.pricemayorista || !products?.precio_original) return 0;

    const descuento =
      ((products.precio_original - products.pricemayorista) /
        products.precio_original) *
      100;
    return Math.round(descuento);
  };

  const porcentajeDescuento = calcularPorcentajeDescuento();

  // Función para determinar el color del badge según el descuento
  const getBadgeColor = (descuento) => {
    if (descuento >= 70) return "from-red-600 to-red-700";
    if (descuento >= 60) return "from-orange-500 to-red-500";
    if (descuento >= 50) return "from-yellow-500 to-orange-500";
    if (descuento >= 40) return "from-green-500 to-yellow-500";
    if (descuento >= 30) return "from-blue-500 to-green-500";
    return "from-gray-500 to-blue-500";
  };

  // Función para determinar si mostrar badge especial
  const getSpecialBadge = (descuento) => {
    if (descuento >= 70)
      return { text: "¡SÚPER GANGA!", color: "bg-green-600" };
    if (descuento >= 60)
      return { text: "¡PRECIO LOCO!", color: "bg-purple-600" };
    if (descuento >= 50) return { text: "¡OFERTÓN!", color: "bg-orange-600" };
    if (descuento >= 40) return { text: "¡GRAN OFERTA!", color: "bg-blue-600" };
    if (descuento >= 30) return { text: "¡DESCUENTO!", color: "bg-indigo-600" };
    return null;
  };

  const specialBadge = getSpecialBadge(porcentajeDescuento);

  useEffect(() => {
    if (!products.tallas) {
      setStock(false);
    } else {
      setStock(products.tallas.every((el) => el.stock === 0));
    }
  }, []);

  useEffect(() => {
    setHoverImage(
      products?.images && products.images[0]?.asset
        ? urlForImage(products.images[0]?.asset._ref).url()
        : "http://via.placeholder.com/2000x2000"
    );
  }, [products.sku]);

  return (
    <div className="relative flex h-full flex-col justify-around border-[1px]  border-gray-700 hover:shadow-2xl transition-all duration-300 hover:scale-105  rounded-lg shadow-lg">
      {/* Container de la imagen con badges */}
      <div className="relative aspect-h-1 aspect-w-1 overflow-hidden rounded-md group-hover:opacity-90 transition-opacity">
        <Link
          key={products.id}
          href={`/products/${products.slug}/${products.sku}`}
          className="group z-10 text-sm"
        >
           <LoveFollow product={products} view={true} />
             <ImageReplaceEcommerceCatalogo products={products} />
        </Link>

        {/* Badge de descuento principal */}
        {/* {porcentajeDescuento > 0 && (
          <div
            className={`absolute top-2 left-2 z-20 bg-gradient-to-r ${getBadgeColor(
              porcentajeDescuento
            )} text-white px-3 py-1 rounded-lg font-black text-sm shadow-lg animate-pulse`}
          >
            -{porcentajeDescuento}%
          </div>
        )} */}

        {/* Badge de OUTLET o AGOTADO */}
        <div className={`absolute top-2 right-2 z-10 ${
          products.stock === 0 || products.stock === null || products.stock === undefined || stock === true
            ? 'bg-black' 
            : 'bg-red-500'
        } text-white px-2 py-1 rounded-md text-xs font-black shadow-md`}>
          {products.stock === 0 || products.stock === null || products.stock === undefined || stock === true
            ? 'AGOTADO' 
            : 'OUTLET'
          }
        </div>

        {/* Badge especial para descuentos muy altos */}
        {specialBadge && (
          <div
            className={`absolute bottom-2 left-2 z-20 ${specialBadge.color} text-white px-2 py-1 rounded-md text-xs font-bold shadow-md animate-bounce`}
          >
           -{porcentajeDescuento}%
          </div>
        )}

        {/* Badge de stock bajo */}
      </div>
      <div className="px-2 py-2">
        <CantidadProduct stock={products?.stock} sku={products?.sku} />

      {/* Información del producto */}
      <Link
        key={products.id}
        href={`/products/${products.slug}/${products.sku}`}
        className="group z-10 text-sm mt-3"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium capitalize text-gray-600 text-xs xl:text-sm ">
            {products.marca} - {products.genero}
          </h2>
          <h5 className="text-xs font-medium text-gray-600">
            SKU: {products.sku}
          </h5>
        </div>

        <h3 className="text-sm font-semibold uppercase xl:text-lg 2xl:text-xl  leading-tight">
          {products.name}
        </h3>

        {/* Razón social */}
        {/* {products?.razonsocial && (
          <h4 className="mt-1 text-xs font-medium text-blue-400 uppercase">
            {products.razonsocial}
          </h4>
        )} */}

        {/* Precios con componente especializado dark */}
        <div className="mt-3">
          <ProductPrecioDescuentoDark dataProduct={products} />
        </div>

        {/* Información adicional de outlet */}
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="flex justify-between items-end text-xs">
            {/* <span className="text-green-400 font-medium">
              ✓ Producto Fritz Sport
            </span> */}
          {/* Ahorro calculado */}
          {products?.precio_original && products?.priceecommerce && (
            <div className="mt-1 text-xs text-green-400 font-medium">
              Ahorras: S/{" "}
              {(products.precio_original - products.priceecommerce).toFixed(2)}
            </div>
          )}
            {/* <span className="text-orange-400 font-medium">
              ⏰ Oferta limitada
            </span> */}
          </div>

        </div>
      </Link>

      {/* Efecto de brillo dark theme */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-5 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-all duration-1000 pointer-events-none"></div>

      {/* Borde brillante en hover */}
      <div className="absolute inset-0 rounded-lg border border-transparent hover:border-gray-600 transition-all duration-300 pointer-events-none"></div>

      </div>
    </div>
  );
}
