import React from "react";
import Link from "next/link";
import ImageReplaceEcommerceCatalogo from "../../imageReplaceEcommerceCatalogo";
import { LimitarTexto } from "@/utils/limitarTexto";
import { ProductNameText } from "@/components/ui/texto-responsive";

export default function OutletProductCard({ product }) {
  console.log("Renderizando producto:", product?.name, "Stock:", product?.stock);

  if (!product) {
    return (
      <div className="p-4 bg-red-100 rounded">
        <p>Producto no válido</p>
      </div>
    );
  }

  // Función para formatear precio
  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `S/ ${price.toFixed(2)}`;
  };

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

  const specialBadge = getSpecialBadge(product.porcentajeDescuento);

  return (
    <Link
      href={`/products/${product?.slug}/${product?.sku}`}
      className="group relative block text-sm border border-gray-700 rounded-lg xl:p-3  xl:hover:shadow-2xl transition-all duration-300 xl:hover:scale-105  shadow-lg"
    >
      {/* Container de la imagen */}
      <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100 group-hover:opacity-90 transition-opacity">
        <ImageReplaceEcommerceCatalogo products={product} />

        {/* Badge de descuento principal */}
        {/* <div
          className={`absolute top-2 left-2 z-20 bg-gradient-to-r ${getBadgeColor(
            product.porcentajeDescuento
          )} text-white px-3 py-1 rounded-lg font-black text-sm shadow-lg animate-pulse`}
        >
          -{product.porcentajeDescuento}%
        </div> */}

        {/* Badge de SUPER OUTLET o AGOTADO */}
        <div className={`absolute top-2 right-2 z-20 ${
          product.stock === 0 || product.stock === null || product.stock === undefined 
            ? 'bg-black' 
            : 'bg-red-500'
        } text-white xl:px-2 xl:py-1 px-1 rounded-md xl:text-xs text-[10px] font-black shadow-md`}>
          {product.stock === 0 || product.stock === null || product.stock === undefined 
            ? 'AGOTADO' 
            : 'OUTLET'
          }
        </div>

        {/* Badge especial para descuentos muy altos */}
        {specialBadge && (
          <div
            className={`absolute bottom-2 left-2 z-10 ${specialBadge.color} text-white px-2 py-1 rounded-md text-[11px] xl:text-xs font-bold shadow-md animate-bounce`}
          >
            -{product.porcentajeDescuento}%
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="mt-3 space-y-2 p-1">
        {/* Género y SKU */}
        <div className="flex justify-between items-center text-xs ">
          <span className="capitalize font-medium">{product?.genero}</span>
          <span className="font-mono">{product?.sku}</span>
        </div>

        {/* Nombre del producto */}
        <div className="font-semibold  xl:text-lg text-xs leading-tight xl:min-h-[2.5rem] flex items-center">
          <ProductNameText className="font-semibold  xl:text-lg text-xs">
            {product?.name}
          </ProductNameText>
        </div>

        {/* Marca */}
        <div className="xl:text-xs text-[11px]  uppercase font-medium">
          {product?.marca}
        </div>

        {/* Precios */}
        <div className="space-y-1">
          {/* Precio original tachado */}
          <div className="xl:block flex justify-between">
              {product.precio && (
                <div className="xl:text-sm text-sm text-gray-400 line-through">
                  {formatPrice(product.precio)}
                </div>
              )}

              {/* Precio con descuento */}
              {product.precioConDescuento && (
                <div className="xl:text-lg text-sm font-bold text-red-400">
                  {formatPrice(product.precioConDescuento)}
                </div>
              )}

          </div>

          {/* Ahorro */}
          {product.ahorroEnPesos && (
            <div className="text-xs text-green-400 font-medium">
              Ahorras: S/ {product.ahorroEnPesos.toFixed(2)}
            </div>
          )}
        </div>

        {/* Indicador de stock o urgencia */}
        <div className="xl:flex items-center justify-between hidden">
          <div className="text-xs text-orange-400 font-medium">
            ⏰ Oferta limitada
          </div>
          <div className="text-xs text-gray-600">
            🔥 {Math.floor(Math.random() * 10) + 1} vendidos hoy
          </div>
        </div>
      </div>

      {/* Efecto de brillo dark theme */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none"></div>

      {/* Borde brillante en hover */}
      <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-gray-600 transition-all duration-300 pointer-events-none"></div>
    </Link>
  );
}
