import React from "react";

export default function ProductPrecioDescuentoDark({ dataProduct, carrito = false }: any) {
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
    <div className="flex flex-col-reverse items-end justify-center">
      <div className="w-full xl:flex flex-col mb-2 hidden">
        <div
          className={`${carrito && "text-center"} ${
            porcentajeDescuento > 0 ? "text-red-400" : "text-white"
          } font-bold text-base`}
        >
          S/
          {dataProduct?.priceecommerce
            ? dataProduct?.priceecommerce.toFixed(2)
            : "----"}
        </div>
        <div className="text-gray-400 font-normal text-xs mr-2 mt-1 h-4">
          {porcentajeDescuento > 0 && (
            <>
              S/{dataProduct?.precio_original.toFixed(2)} Precio original
              <span className="text-red-400 ml-1">-{porcentajeDescuento}%</span>
            </>
          )}
        </div>
      </div>
      {/* mobile */}
      <div className="w-full flex xl:hidden justify-between items-center xl:mb-2 ml-2">
        {dataProduct?.precio_original && porcentajeDescuento > 0 && (
          <div className="flex items-center">
            <div className="text-gray-400 font-normal line-through xl:text-sm text-xs mr-0">
              S/{dataProduct?.precio_original.toFixed(0)}
            </div>
            <span className="text-red-400 ml-1 text-xs">-{porcentajeDescuento}%</span>
          </div>
        )}
        <div
          className={`${
            porcentajeDescuento > 0 ? "text-red-400" : "text-white"
          } font-bold text-sm`}
        >
          S/
          {dataProduct?.priceecommerce
            ? dataProduct?.priceecommerce.toFixed(2)
            : "----"}
        </div>
      </div>
    </div>
  );
}