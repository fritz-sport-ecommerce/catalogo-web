"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";


// import LoveFollow from "../love-follow/love-follow";

export default function Product({
  products,
  generoSku = false,
  relacionados = true,
  descuentos,
  outlet = false,
}) {
  const [stock, setStock] = useState();

  const [hoverImage, setHoverImage] = useState(
    products?.images[0]?.asset
      ? urlForImage(products.images[0]?.asset._ref).url()
      : "http://via.placeholder.com/2000x2000"
  );

  useEffect(() => {
    if (!products.tallas) {
      setStock(false);
    } else {
      setStock(products.tallas.every((el) => el.stock === 0));
    }
  }, []);

  useEffect(() => {
    setHoverImage(
      products.images[0]?.asset
        ? urlForImage(products.images[0]?.asset._ref).url()
        : "http://via.placeholder.com/2000x2000"
    );
  }, [products.sku]);

  const [data, setData] = useState(null);

  return (
    <>
      <div className=" flex h-full flex-col justify-around   border-[1px] p-2 border-blue-gray-300  dark:border-none ">
        <div className="aspect-h-1 aspect-w-1  overflow-hidden  rounded-md    group-hover:opacity-75 ">
          <Link
            key={products.id}
            href={`/products/${products.slug}/${products.sku}`}
            className="group z-10 text-sm"
          >
            {products?.images && (
              <img
                onMouseEnter={() =>
                  setHoverImage(
                    products?.images[1] && products?.images[1]?.asset
                      ? urlForImage(products?.images[1]?.asset._ref).url()
                      : urlForImage(products?.images[0]?.asset._ref).url()
                  )
                }
                onMouseLeave={() =>
                  setHoverImage(
                    products?.images[0]
                      ? urlForImage(products?.images[0]?.asset._ref).url()
                      : urlForImage(products?.images[1]?.asset._ref).url()
                  )
                }
                width={2000}
                height={2000}
                className="relative "
                src={hoverImage}
                alt=""
              />
            )}
          </Link>
          {/* <LoveFollow product={products} /> */}
        </div>

        <>
          <div className="mt-2 xl:flex gap-1 hidden ">
            {data?.map((el, i) => (
              <Link key={i} href={`/products/${el.slug}/${el.sku}`}>
                <img
                  onMouseEnter={() =>
                    setHoverImage(urlForImage(el.images[0].asset._ref).url())
                  }
                  onMouseLeave={() =>
                    setHoverImage(
                      urlForImage(products.images[0].asset._ref).url()
                    )
                  }
                  width={50}
                  height={50}
                  className="relative"
                  src={
                    el.images[0].asset &&
                    urlForImage(el.images[0].asset._ref).url()
                  }
                  alt=""
                />
              </Link>
            ))}
          </div>
        </>

        <Link
          key={products.id}
          href={`/products/${products.slug}/${products.sku}`}
          className="group z-10 text-sm"
        >
          {!generoSku && (
            <div className="flex items-center justify-between ">
              <h2 className="mt-4 font-medium capitalize">
                {products.marca} - {products.genero}
              </h2>
              <h5 className="mt-4 text-xs font-medium">Sku: {products.sku}</h5>
            </div>
          )}
          <h3 className="mt-2 text-sm font-semibold uppercase xl:text-lg 2xl:text-xl ">
            {products.name}
          </h3>
          <h3 className="mt-2 text-sm font-semibold uppercase xl:text-lg 2xl:text-xl ">
            {products?.razonsocial}
          </h3>
          <div className="border-t-[1px] border-blue-gray-300 mt-2">
            <div className="mt-2 text-sm font-semibold uppercase xl:text-sm 2xl:text-lg ">
              <span className="font-medium">Precio Retail:</span> S/
              {products?.priceecommerce?.toFixed(2)}
            </div>
            <div className="mt-2 text-sm font-semibold uppercase xl:text-sm 2xl:text-lg ">
              <span className="font-medium">Precio Emprendedor:</span> S/
              {products?.priceemprendedor?.toFixed(2)}
            </div>
            {products.tipoproducto === "web" ? (
              <></>
            ) : (
              <div className="mt-2 text-xs font-semibold uppercase xl:text-sm 2xl:text-lg ">
                <span className="font-medium">Precio Mayorista:</span> S/
                {products?.pricemayorista?.toFixed(2)}
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* <p className="mt-2 font-medium">S/{products.descuento}</p> */}

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
