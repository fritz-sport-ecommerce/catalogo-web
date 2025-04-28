import { SanityProduct } from "@/config/inventory";

export default function filterProduct(
  razonsocial: string,
  productos: SanityProduct[]
) {
  const filtrosValidos = ["fritzsport", "fritzduran"];

  if (filtrosValidos.includes(razonsocial)) {
    return productos.filter((item) => item?.razonsocial === razonsocial);
  }

  return productos; // Si no es uno de los filtros válidos, devolver todos
}
