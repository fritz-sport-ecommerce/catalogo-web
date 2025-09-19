import React from "react";
interface props {
  descuento: number;
  descuentoSobreD: number;
  products: {
    preciomanual: number;
  };
  stock: number;
}
export default function ProductOfertStyle({
  descuento,
  stock,
}: props) {
  return (
    <>
      {descuento || descuento > 0  ? (
        <div className="absolute right-0 top-4 z-10 ">
          <div className=" mt-1 text-xs text-white ">
            <div className="flex flex-col">
              <>
                {/* {!products.preciomanual || descuentoSobreD > 0 ? (
                      <span className="flex justify-center bg-red-500 px-3 py-1">
                        {" "}
                        {!stock && descuento || descuentoSobreD >0
                          ? `-${descuento && !descuentoSobreD ? descuento.toFixed(0) : descuentoSobreD.toFixed(0)}%`
                          : "Agotado"}
                      </span>
                    ):(<></>)} */}
                {/* {descuentos.descuentofritzsport &&
                    !products.preciomanual || descuentoSobreD? (
                      <span className="mt-1 bg-red-500 px-3 py-1 uppercase">
                        oferta
                      </span>
                    ) : (
                      <></>
                    )} */}
              </>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute right-0 top-4 z-10 ">
          <div className=" mt-1 text-xs text-white ">
            <div className="flex flex-col">
              <>
                {stock === 0 && (
                  <span className="flex justify-center xl:text-xs text-[10px] bg-black xl:px-3 px-2 py-1">
                    Agotado
                  </span>
                )}
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
