"use client";

import { Key, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { groq } from "next-sanity";

import { SanityProduct } from "@/config/inventory";
import { precioProduct } from "@/config/precio-product";

import ProductAddToCart from "./product-add-to-cart";
import { FiltroProducts } from "@/utils/filtro-products-slider-home";
import RoleContext from "@/context/roleContext";

interface Props {
  product: SanityProduct;
  descuentos: any;
}

export function ProductInfo({ product, descuentos }: Props) {
  const [data, setData] = useState<SanityProduct[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const productFilter = FiltroProducts(product);

    const filter = `*[${productFilter}][0..5]`;
    client
      .fetch(
        groq`${filter} {
          _id,
      
          sku,
          images,
        
          "slug": slug.current
        }`
      )
      .then((fetchedData) => {
        // Filtrar productos que tengan el mismo SKU que el producto principal
        const uniqueProducts = fetchedData.filter(
          (relatedProduct: any) => relatedProduct.sku !== product.sku
        );

        setData(uniqueProducts);
        setLoading(false);
      });
  }, [product?.sku]);

  const descuentoSobreD = product?.descuentosobred;
  const { userRole } = useContext(RoleContext);
  return (
    <div className="h-full w-full px-5 lg:mt-0 lg:px-2 xl:mt-0 xl:px-3 2xl:sticky 2xl:top-44 2xl:mt-0 2xl:max-w-lg 2xl:px-5">
      <div className="w-full">
        <div className="">
          <h1 className="hidden text-3xl font-bold uppercase w-full tracking-tight xl:block">
            {product?.name} - {product?.genero}
          </h1>
          <div className="mt-3 hidden xl:block">
            l<h2 className="sr-only">Product information</h2>
            <div className="mb-3 flex items-center justify-between w-ful gap-x-2">
              {userRole === "emprendedor"
                ? "PRECIO EMPRENDEDOR:"
                : "PRECIO MAYORISTA:"}

              <p
                className={`text-3xl tracking-tight ${
                  userRole === "emprendedor"
                    ? "text-black dark:text-white "
                    : "text-red-500"
                } font-semibold `}
              >
                S/
                {userRole === "emprendedor"
                  ? product?.priceemprendedor
                  : product?.pricemayorista}
              </p>
            </div>
            <div className="mb-5 flex items-center justify-between gap-x-2">
              PRECIO RETAIL:
              <p className="text-2xl tracking-tight ">
                S/
                {product?.priceecommerce?.toFixed()}
              </p>
            </div>
          </div>

          <h6 className="text-md tracking-tight">Marca: {product?.marca}</h6>
          <h5 className="text-md tracking-tight">Sku: {product?.sku}</h5>

          {data.length > 0 && <div className="mt-5 font-bold">Colores:</div>}
          <div className="mt-2 flex gap-1">
            {data?.map(
              (el: {
                id: Key | null | undefined;
                slug: any;
                sku: any;
                images: any;
              }) => (
                <Link key={el.id} href={`/products/${el.slug}/${el.sku}`}>
                  {el.images && el.images[0] && el.images[0]?.asset && (
                    <img
                      width={70}
                      height={70}
                      className="relative"
                      src={urlForImage(el.images[0]?.asset._ref).url()}
                      alt=""
                    />
                  )}
                </Link>
              )
            )}
          </div>
        </div>
        <ProductAddToCart product={product} descuentos={descuentos} />
      </div>
    </div>
  );
}
