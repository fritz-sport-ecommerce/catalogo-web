import React from "react";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

export default function ProductRelacionados({
  products,
  nuevo = false,
  generoSku = true,
  descuentos,
  outlet = false,
}) {
  let razonsocial;
  if (outlet) {
    razonsocial = descuentos.descuentooutlet;
  } else {
    razonsocial = descuentos.descuentofritzsport;
  }

  let descuentoSobreD = products?.descuentosobred;

  return (
    <>
      <Link
        key={products.id}
        href={`/products/${products.slug}/${products.sku}`}
        className="group z-10 text-sm  border-y-[1px] border-l-[1px]  p-2 border-blue-gray-300 dark:border-none"
      >
        <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md  group-hover:opacity-75 ">
          {products.images && products.images[0] ? (
            <img
              width={800}
              height={800}
              className="relative "
              src={
                products.images[0].asset &&
                urlForImage(products.images[0].asset._ref).url()
              }
              alt=""
            />
          ) : (
            <></>
          )}

          {/* <LoveFollow /> */}
          {/* {products.descuento ? (
         
          ) : (
            <>
              <div className="absolute right-0 top-4 bg-black px-3 py-1">
                <h4 className=" mt-1 text-xs text-white ">
                  {`-${products.descuento}%`}
                </h4>
              </div>
            </>
          )} */}
          {nuevo && (
            <div className="absolute left-0 xl:top-4 top-1 bg-black px-2 py-1">
              <h4 className=" xl:text-xs text-white ">new</h4>
            </div>
          )}
        </div>
        <div className=" flex flex-col justify-around h-2/6">
          {generoSku && (
            <h3 className="xl:mt-4 font-medium capitalize  text-xs">
              {products.marca} - {products.genero}
            </h3>
          )}
          <h3 className="mt-2 font-semibold uppercase  xl:text-sm text-sm">
            {products.name} {products.genero}
          </h3>

          <div className="flex w-full h-full flex-col mt-3 items-end justify-start xl:justify-center 2xl:gap-y-2 ">
            <div className="flex items-center justify-between w-full">
              <div>Precio Mayorista:</div>
              <div className="xl:text-lg font-bold text-[#B73228]">
                S/
                {products?.pricemayorista?.toFixed()}
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div>Precio Emprendedor:</div>
              <div className="xl:text-base font-bold ">
                S/
                {products?.priceemprendedor?.toFixed()}
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div>Precio Retail:</div>
              <div className="xl:text-base font-bold ">
                S/
                {products?.priceecommerce?.toFixed()}
              </div>
            </div>
          </div>
        </div>
        {/* <p className="mt-2 font-medium">S/{products.descuento}</p> */}
      </Link>
      {/* <button
        onClick={() => alert("producto")}
        className="button-0 absolute z-50 flex items-center justify-center rounded-full  text-center"
      >
        <svg
          className=" icon icon--plus"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clip-rule="evenodd"
            d="M9.125 10.875V18H10.375V10.875H18V9.625H10.375V2H9.125V9.625H2V10.875H9.125Z"
          ></path>
        </svg>
      </button> */}
    </>
  );
}
