import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { groq } from "next-sanity";

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
  return {
    openGraph: {
      title: `Producto:-${product.name}`,
      description: `${product.name}-${product.slug}-${product.sku}`,
      url: `${process.env.URL_DOMINIO}/products/${product.slug}/${el.slug}`,
      siteName: "Fritz Sport",
      images: [
        {
          url: `${urlForImage(product.images[0].asset._ref).url()}`,
          width: 800,
          height: 600,
          alt: `${product.name} Imagen`,
        },
        {
          url: `${urlForImage(product.images[0].asset._ref).url()}`,

          width: 1800,
          height: 1600,
          alt: `${product.name} Imagen`,
        },
      ],
    },
  };
}
