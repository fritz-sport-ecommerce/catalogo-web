import { SanityProduct } from "@/config/inventory";

export function FiltroProducts(
  products: SanityProduct,
  razonsocial = "fritzsport"
) {
  const productFilter = `_type == "product" && priceecommerce != undefined && priceecommerce != null && categories != "originals" && images != undefined  && name match "${products.name}*"  && genero == "${products.genero}" && pricemayorista != undefined && priceemprendedor != undefined && pricemayorista != 0 && priceemprendedor != 0`;

  return productFilter;
}

export function FiltroGlobal(razonsocial = "fritzsport") {
  const productFilter = `_type == "product"`;

  return productFilter;
}
interface Props {
  slug?: string;
  id?: string;
}
export function FiltroViewProduct(params: Props, razonsocial = "fritzsport") {
  const productFilter = `*[_type == "product" && priceecommerce != undefined && priceecommerce != null && categories != "originals"  && slug.current == "${params.slug}" && sku == "${params.id}" && pricemayorista != undefined && priceemprendedor != undefined][0]`;

  return productFilter;
}
