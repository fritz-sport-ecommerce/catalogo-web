import { SanityProduct } from "@/config/inventory";

export function FiltroProducts(
  products: SanityProduct,
  razonsocial = "fritzsport"
) {
  const productFilter = `_type == "product" && imgcatalogomain != undefined && name match "${products?.name}*"  && genero == "${products?.genero}" `;

  return productFilter;
}

export function FiltroGlobal(razonsocial = "fritzsport") {
  const productFilter = `_type == "product" &&  imgcatalogomain != undefined && empresa != fz_premium`;

  return productFilter;
}
interface Props {
  slug?: string;
  id?: string;
}
export function FiltroViewProduct(params: Props, razonsocial = "fritzsport") {
  const productFilter = `*[_type == "product"  && slug.current == "${params?.slug}" && sku == "${params?.id}" &&  imgcatalogomain != undefined && empresa != fz_premium][0]`;

  return productFilter;
}
