import CarouselProductRelacionados from "./carousel-product-relacionados";
import { fetchProducts } from "@/config/productos-por-limite";

export default async function NuevosIngresos() {
  const productosAll = await fetchProducts({
    limit: 18,
    gender: "unisex",
  });

  // Filtrar productos que NO tengan descuento
  let productosAll2 = productosAll.filter((el: any) => {
    if (!(el as any).precio_original || !(el as any).pricemayorista) return true;
    return (el as any).pricemayorista >= (el as any).precio_original;
  });

  if (productosAll2.length === 0) {
    productosAll2 = productosAll;
  }

  return <CarouselProductRelacionados products={productosAll2} />;
}
