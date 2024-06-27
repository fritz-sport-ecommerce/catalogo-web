"use client";
import { FiltroProducts } from "@/utilits/filtro-products";
import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { groq } from "next-sanity";

export default function ProductSimilares({ products, relacionados }) {
  const [hoverImage, setHoverImage] = useState(
    urlForImage(products.images[0].asset._ref).url()
  );
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const productFilter = FiltroProducts(products);

    const filter = `*[${productFilter}]`;
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
      preciomanual,
      "slug":slug.current
    }`
      )
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [products.sku]);
  return (
    <>
      {relacionados && (
        <div className="mt-2 flex gap-1">
          {/* {data?.map((el) => (
            <Link key={el.id} href={`/products/${el.slug}/${el.sku}`}>
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
                src={urlForImage(el.images[0].asset._ref).url()}
                alt=""
              />
            </Link>
          ))} */}
        </div>
      )}
    </>
  );
}
