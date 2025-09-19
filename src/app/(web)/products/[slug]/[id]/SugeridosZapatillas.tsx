import CarouselProduct from "@/components/carousel-product/carousel-product";
import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";
import { client } from "@/sanity/lib/client";
import { FiltroGlobal } from "@/utils/filtro-products-slider-home";

export default async function SugeridosZapatillas({
  product,
}: {
  product: any;
}) {
  const order = `| order(_id) [0...20]`; // Aumentamos a 30 para tener más opciones después del filtrado
  const productFilter = FiltroGlobal();
  const generoFilterHombre = product?.genero
    ? ` && genero in ["${product?.genero}","unisex"] && tipo in ["calzado","accesorios"]  && sku != "${product?.sku?.trim()}" && empresa == "fritz_sport" `
    : "";
  const filter = `*[${productFilter}${generoFilterHombre}]`;
  const products = await client.fetch(`${filter} ${order} {
    _id,
    _createdAt,
    name,
    sku,
    images,
    marca,
    empresa,
    description,
    descuento,
    linea_liquidacion,
    imgcatalogomain,
    tipo,
    genero,
    detalles,
    descuento,
    preciomanual,
    popularidad,
    "slug":slug.current
  }`);
  
  const productosConPrecio = await productosTraidosSistemaFritzSport(products, "LIMA");
  
  // Filtrar productos: priorizar los que tienen stock, pero incluir algunos agotados al final
  const productosConStock = productosConPrecio.filter((p: any) => p.stock > 0);
  const productosAgotados = productosConPrecio.filter((p: any) => p.stock <= 0);
  
  // Combinar: primero los que tienen stock, luego algunos agotados (máximo 2)
  const productosFinales = [
    ...productosConStock.slice(0, 18), // Máximo 18 con stock
    ...productosAgotados.slice(0, 2)   // Máximo 2 agotados
  ].slice(0, 20); // Limitar a 20 productos totales
  
  return <CarouselProduct products={productosFinales} />;
}
