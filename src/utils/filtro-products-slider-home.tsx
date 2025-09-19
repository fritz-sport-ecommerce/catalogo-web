import { SanityProduct } from "@/config/inventory";

export function FiltroProducts(products: SanityProduct) {
  const productFilter = `_type == "product" && name match "${products?.name}*" && genero == "${products?.genero}"   `;

  return productFilter;
}

export function FiltroGlobal() {
  const productFilter = `_type == "product"`;

  return productFilter;
}
interface Props {
  slug?: string;
  id?: string;
}
export function FiltroViewProduct(params: Props) {
  const productFilter = `*[_type == "product"  && slug.current == "${params?.slug}" && sku == "${params?.id}" && empresa == "fritz_sport" ][0]`;

  return productFilter;
}
