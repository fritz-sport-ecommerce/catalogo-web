import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { groq } from "next-sanity";
import { generateProductMetadata } from "@/config/seo-config";

export async function metadataPage({ params }) {
  const product = await client.fetch(
    groq`*[_type == "product" && slug.current == "${params.slug}"][0] {
  _id,
  _createAt,
  "id":_id,
  name,
  sku,
  marca,
  images,
  priceecommerce,
  currency,
  description,
  sizes,
  categories,
  colors,
  genero,
  tipo,
  descuento,
  tallas,
  "slug":slug.current
}`
  );

  // Usar la función centralizada para generar metadata
  return generateProductMetadata(product);
}
