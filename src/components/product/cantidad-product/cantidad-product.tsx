import React, { useEffect, useState } from "react";

interface Props {
  stock: number;
  sku: string;
}

export default function CantidadProduct({ stock, sku }: Props) {
  const [cantidadP, setCantidadP] = useState(0);
  //cantidad de stock en productos
  useEffect(() => {
    setCantidadP(stock);
  }, [sku]);
  return (
    <div>
      {cantidadP != 0 && (
        <div className="text-xs xl:text-sm mt-1 text-red-300">
          {" "}
          {cantidadP <= 20 &&
            `Solo ${cantidadP === 1 ? "queda" : "quedan"} ${cantidadP} ${
              cantidadP === 1 ? "unidad" : "unidades"
            } `}{" "}
        </div>
      )}
    </div>
  );
}
