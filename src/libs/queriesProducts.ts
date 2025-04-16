import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// Tipos TypeScript
interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
}

// Obtener productos paginados
export async function getPaginatedProducts(
  page: number = 1,
  pageSize: number = 8,
  categorySlug?: string
): Promise<{ products: Product[]; total: number }> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const categoryFilter = categorySlug
    ? `&& category->slug.current == "${categorySlug}"`
    : "";

  const query = groq`{
    "products": *[_type == "product" ${categoryFilter}] | order(_createdAt desc) [${start}...${end}] {
      _id,
      name,
      "slug": slug.current,
      price,
      "images": images[].asset->url,
      "category": category->{
        name,
        "slug": slug.current
      }
    },
    "total": count(*[_type == "product" ${categoryFilter}])
  }`;

  return client.fetch(query);
}
