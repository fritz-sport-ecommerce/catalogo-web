import { SanityProduct } from "@/config/inventory";

export function FiltroProducts(
  products: SanityProduct,
  razonsocial = "fritzsport"
) {
  const productFilter = `_type == "product" && priceecommerce != undefined && priceecommerce != null && categories != "originals" && images != undefined  && name match "${products.name}*"  && genero == "${products.genero}"`;

  return productFilter;
}

export function FiltroGlobal(razonsocial = "fritzsport") {
  const productFilter = `_type == "product" && priceecommerce != undefined && priceecommerce != null && categories != "originals" && images != undefined   && images != null && tallas != undefined `;

  return productFilter;
}
interface Props {
  slug?: string;
  id?: string;
}
export function FiltroViewProduct(params: Props, razonsocial = "fritzsport") {
  const productFilter = `*[_type == "product" && priceecommerce != undefined && priceecommerce != null && categories != "originals"  && slug.current == "${params.slug}" && sku == "${params.id}"][0]`;

  return productFilter;
}
