import React from "react";

export default function ProductPrecioDescuento({
  dataProduct,
  carrito = false,
}: any) {
  // Calcular el porcentaje de descuento
  const calcularPorcentajeDescuento = () => {
    if (!dataProduct?.pricemayorista || !dataProduct?.precio_original) return 0;

    const descuento =
      ((dataProduct.precio_original - dataProduct.pricemayorista) /
        dataProduct.precio_original) *
      100;
    return Math.round(descuento); // Redondeamos al entero más cercano
  };

  const porcentajeDescuento = calcularPorcentajeDescuento();

  return (
    <div className="flex flex-col items-end justify-center">
      {/* Desktop - Mostrar los tres precios */}
      <div className="w-full xl:flex flex-col mb-2 hidden">
        {/* Precio Mayorista - RESALTADO */}
        <div className="flex items-center justify-end mb-1">
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">Mayorista:</span>
          <div className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-sm">
            S/{dataProduct?.pricemayorista ? dataProduct.pricemayorista.toFixed(2) : "----"}
          </div>
        </div>
        
        
        {/* Precio Emprendedor */}
        <div className="flex items-center justify-end">
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">Emprendedor:</span>
          <div className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
            S/{dataProduct?.priceemprendedor ? dataProduct.priceemprendedor.toFixed(2) : "----"}
          </div>
        </div>
        {/* Precio Retail */}
        <div className="flex items-center justify-end mb-1 mt-1">
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">Retail:</span>
          <div className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
            S/{dataProduct?.priceecommerce ? dataProduct.priceecommerce.toFixed(2) : "----"}
          </div>
        </div>
        
        {/* Descuento si existe */}
        {porcentajeDescuento > 0 && (
          <div className="text-gray-500 font-normal text-xs mr-2 mt-1 h-4">
            <span className="text-red-300">-{porcentajeDescuento}%</span>
          </div>
        )}
      </div>
      
      {/* Mobile - Mostrar los tres precios */}
      <div className="w-full flex xl:hidden flex-col items-end ml-2">
        {/* Precio Mayorista - RESALTADO */}
        <div className="flex items-center justify-end mb-1">
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">Mayorista:</span>
          <div className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-xs">
            S/{dataProduct?.pricemayorista ? dataProduct.pricemayorista.toFixed(2) : "----"}
          </div>
        </div>
        
        {/* Precio Retail */}
        <div className="flex items-center justify-end mb-1">
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">Retail:</span>
          <div className="text-gray-700 dark:text-gray-300 font-semibold text-xs">
            S/{dataProduct?.priceecommerce ? dataProduct.priceecommerce.toFixed(2) : "----"}
          </div>
        </div>
        
        {/* Precio Emprendedor */}
        <div className="flex items-center justify-end">
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">Emprendedor:</span>
          <div className="text-gray-700 dark:text-gray-300 font-semibold text-xs">
            S/{dataProduct?.priceemprendedor ? dataProduct.priceemprendedor.toFixed(2) : "----"}
          </div>
        </div>
        
        {/* Descuento si existe */}
        {porcentajeDescuento > 0 && (
          <div className="text-red-300 text-xs mt-1">
            -{porcentajeDescuento}%
          </div>
        )}
      </div>
    </div>
  );
}
