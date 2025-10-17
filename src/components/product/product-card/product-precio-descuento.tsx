import React from "react";

export default function ProductPrecioDescuento({
  dataProduct,
  carrito = false,
}: any) {
  // Obtener precios con fallbacks correctos
  const retail = Number(dataProduct?.priceecommerce || dataProduct?.precio_retail || 0);
  const emprendedor = Number(dataProduct?.priceemprendedor || dataProduct?.precio_emprendedor || 0);
  const mayorista = Number(
    dataProduct?.pricemayorista || 
    dataProduct?.mayorista_cd || 
    dataProduct?.precio_mayorista || 
    0
  );

  // Calcular el porcentaje de descuento
  const calcularPorcentajeDescuento = () => {
    if (!mayorista || !dataProduct?.precio_original) return 0;

    const descuento =
      ((dataProduct.precio_original - mayorista) /
        dataProduct.precio_original) *
      100;
    return Math.round(descuento);
  };

  const porcentajeDescuento = calcularPorcentajeDescuento();

  return (
    <div className="w-full">
      {/* Precios en formato horizontal compacto */}
      <div className="grid grid-cols-3 gap-2 text-[10px] xl:text-xs">
        {/* Precio Mayorista */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 dark:text-gray-400 mb-0.5">Mayorista</span>
          <div className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-xs xl:text-sm w-full text-center">
            S/{mayorista > 0 ? mayorista.toFixed(2) : "0.00"}
          </div>
        </div>
        
        {/* Precio Emprendedor */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 dark:text-gray-400 mb-0.5">Emprendedor</span>
          <div className="text-gray-700 dark:text-gray-300 font-semibold text-xs xl:text-sm border border-gray-300 dark:border-gray-600 px-2 py-1 rounded w-full text-center">
            S/{emprendedor > 0 ? emprendedor.toFixed(2) : "0.00"}
          </div>
        </div>
        
        {/* Precio Retail */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 dark:text-gray-400 mb-0.5">Retail</span>
          <div className="text-gray-700 dark:text-gray-300 font-semibold text-xs xl:text-sm border border-gray-300 dark:border-gray-600 px-2 py-1 rounded w-full text-center">
            S/{retail > 0 ? retail.toFixed(2) : "0.00"}
          </div>
        </div>
      </div>
      
      {/* Descuento si existe */}
      {porcentajeDescuento > 0 && (
        <div className="text-center mt-2">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
            -{porcentajeDescuento}% OFF
          </span>
        </div>
      )}
    </div>
  );
}
