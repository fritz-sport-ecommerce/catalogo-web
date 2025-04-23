import { SanityProduct } from "@/config/inventory";
import { urlForImage } from "@/sanity/lib/image";
import React from "react";
interface Props {
  product: SanityProduct;
}
export default function ImageReplaceEcommerceCatalogo({ products }: any) {
  return (
    <img
      width={2000}
      height={2000}
      className="w-full h-auto"
      src={
        products?.images?.asset?._ref || products.imgcatalogomain?.asset
          ? products?.images && products?.images[0]?.asset
            ? products.images[0]?.asset?._ref
              ? urlForImage(products.images[0]?.asset?._ref).url()
              : "https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png"
            : urlForImage(products.imgcatalogomain?.asset?._ref).url()
          : "https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png"
      }
      alt={`Imagen del producto ${products?.name}`}
    />
  );
}
