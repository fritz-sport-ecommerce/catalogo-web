import { SanityProduct } from "@/config/inventory";

export function FiltroProducts(products: SanityProduct) {
  const productFilter = `_type == "product" && imgcatalogomain != null && name match "${products?.name}*" && genero == "${products?.genero}" `;

  return productFilter;
}

export function FiltroGlobal() {
  const productFilter = `_type == "product" &&  imgcatalogomain != null && empresa != fz_premium`;

  return productFilter;
}
interface Props {
  slug?: string;
  id?: string;
}
export function FiltroViewProduct(params: Props) {
  const productFilter = `*[_type == "product"  && slug.current == "${params?.slug}" && sku == "${params?.id}" &&  imgcatalogomain != null && empresa != fz_premium][0]`;

  return productFilter;
}
