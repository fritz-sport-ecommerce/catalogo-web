import { SanityProduct } from "@/config/inventory";

export function FiltroProducts(
  products: SanityProduct,
  razonsocial = "fritzsport"
) {
  const productFilter = `_type == "product"   && categories != "originals" && images != undefined && name match "${products.name}*" && sku != "${products.sku}" && genero == "${products.genero}"`;

  return productFilter;
}

export function FiltroGlobal(razonsocial = "fritzsport") {
  const productFilter = `_type == "product" && genero != undefined  && categories != "originals" && images != undefined  && images != null `;

  return productFilter;
}
interface Props {
  slug?: string;
  id?: string;
}
export function FiltroViewProduct(params: Props, razonsocial = "fritzsport") {
  const productFilter = `*[_type == "product"   && categories != "originals" && slug.current == "${params.slug}" && sku == "${params.id}"][0]`;

  return productFilter;
}
