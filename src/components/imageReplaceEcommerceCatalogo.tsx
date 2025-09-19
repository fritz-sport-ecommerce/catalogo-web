import { SanityProduct } from "@/config/inventory";
import { urlForImage } from "@/sanity/lib/image";
import React from "react";

interface Props {
  product: SanityProduct;
}
export default function ImageReplaceEcommerceCatalogo({ products }: any) {
  // Determinar la URL de la imagen principal
  const imageUrl = products?.images && products?.images[0]?.asset
    ? urlForImage(products.images[0]?.asset?._ref).url()
    : products.imgcatalogomain?.asset
      ? urlForImage(products.imgcatalogomain?.asset?._ref).url()
      : "https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png";

  return (
    <img
      src={imageUrl}
      alt={`Imagen del producto ${products?.name}`}
      width={350}
      height={350}
      className="w-full h-auto object-contain"
      loading="lazy"
      decoding="async"
      style={{ background: '#fff' }}
    />
  );
}
