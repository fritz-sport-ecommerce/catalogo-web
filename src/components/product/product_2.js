"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { groq } from "next-sanity";

import { precioProduct } from "@/config/precio-product";
import LoveFollow from "../love-follow/love-follow";
import { FiltroProducts } from "@/utilits/filtro-products";
import CantidadProduct from "@/components/product/cantidad-product/cantidad-product";

// import LoveFollow from "../love-follow/love-follow";

export default function Product_2({
  products,
  generoSku = false,
  relacionados = true,
  descuentos,
  outlet = false,
}) {
  const [stock, setStock] = useState();

  const [hoverImage, setHoverImage] = useState(
    products.images[0]?.asset
      ? urlForImage(products.images[0]?.asset._ref).url()
      : "http://via.placeholder.com/640x360"
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
        : "http://via.placeholder.com/640x360"
    );
  }, [products.sku]);

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const productFilter = FiltroProducts(products);

    const filter = `*[${productFilter}][0..5]`;
    client
      .fetch(
        groq`${filter} {
      _id,
      _createdAt,
      name,
      sku,
      images,
      currency,
      priceecommerce,
      description,
      genero,
      categories,
      marca,
      tallas,
      stock,
      descuento,
      razonsocial,
      preciomanual,
      descuentosobred,
      "slug":slug.current
    }`
      )
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [products.sku]);
  let descuentoSobreD = products?.descuentosobred;
  console.log(descuentoSobreD);
  return (
    <>
      <div className=" flex h-full flex-col justify-around   border-[1px] p-2 border-blue-gray-300  dark:border-none ">
        <div className="aspect-h-1 aspect-w-1  overflow-hidden  rounded-md    group-hover:opacity-75 ">
          <Link
            key={products.id}
            href={`${
              products.razonsocial === "fritzsport"
                ? `/products/${products.slug}/${products.sku}`
                : `https://www.fritzsportoutlet.pe/products/${products.slug}/${products.sku}`
            } `}
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
          <LoveFollow product={products} />
          {descuentos.descuentofritzsport ||
          descuentos.descuentofritzsport > 0 ||
          descuentoSobreD > 0 ? (
            <div className="absolute right-0 top-4 z-10 ">
              <div className=" mt-1 text-xs text-white ">
                <div className="flex flex-col">
                  <>
                    {!products.preciomanual || descuentoSobreD > 0 ? (
                      <span className="flex justify-center bg-black px-3 py-1">
                        {" "}
                        {(!stock && descuentos.descuentofritzsport) ||
                        descuentoSobreD > 0
                          ? `-${
                              descuentos.descuentofritzsport && !descuentoSobreD
                                ? descuentos.descuentofritzsport
                                : descuentoSobreD
                            }%`
                          : "Agotado"}
                      </span>
                    ) : (
                      <></>
                    )}
                    {(descuentos.descuentofritzsport &&
                      !products.preciomanual) ||
                    descuentoSobreD ? (
                      <span className="mt-1 bg-red-500 px-3 py-1 uppercase">
                        oferta
                      </span>
                    ) : (
                      <></>
                    )}
                  </>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute right-0 top-4 z-10 ">
              <div className=" mt-1 text-xs text-white ">
                <div className="flex flex-col">
                  <>
                    {stock && (
                      <span className="flex justify-center bg-black px-3 py-1">
                        Agotado
                      </span>
                    )}

                    {descuentos.descuento && !products.preciomanual ? (
                      <span className="mt-1 hidden bg-red-500 px-3 py-1 uppercase">
                        oferta
                      </span>
                    ) : (
                      <></>
                    )}
                  </>
                </div>
              </div>
            </div>
          )}
        </div>
        {relacionados && (
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
        )}

        <Link
          key={products.id}
          href={`/products/${products.slug}/${products.sku}`}
          className="group z-10 text-sm"
        >
          {!generoSku && (
            <div>
              <CantidadProduct tallas={products?.tallas} sku={products?.sku} />
              <div className="flex items-center justify-between ">
                <h2 className="mt-1 font-medium capitalize">
                  {products.marca} - {products?.genero}{" "}
                  {products?.subgenero_ninos &&
                    `${
                      products?.subgenero_ninos === "ninonina"
                        ? "- Niño/Niña"
                        : `- ${products?.subgenero_ninos}`
                    }`}
                </h2>
                <h5 className="mt-4 text-xs font-medium">
                  Sku: {products.sku}
                </h5>
              </div>
            </div>
          )}
          <h3 className="mt-2 text-sm font-medium uppercase xl:text-lg 2xl:text-xl ">
            {products.name}
          </h3>

          <div className="flex">
            {descuentos.descuentofritzsport > 0 ||
            products.descuento ||
            descuentoSobreD ? (
              <>
                {(descuentos.descuentofritzsport && !products.preciomanual) ||
                descuentoSobreD ? (
                  <span className="mr-2 mt-2 font-semibold text-[#767677] line-through">
                    S/{products.priceecommerce}
                  </span>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            <p className="mt-2 font-semibold">
              S/
              {precioProduct(
                products.descuento,
                products.priceecommerce,
                products.preciomanual,
                descuentos,
                descuentoSobreD,
                (outlet = false)
              )}
            </p>
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
