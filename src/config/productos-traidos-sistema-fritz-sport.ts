import { fetchProductosPrecios } from "@/lib/fetchProductosPrecios";
import determinarRazonSocial from "@/utilits/calcular-razon-social";
import convertUSSizeToEuropean from "@/utilits/convertir-talla-usa-eu";
import determinarSubgeneroPorTalla from "@/utilits/determinar-subgenero-ninos";

export default async function productosTraidosSistemaFritzSport(productos:any) {

  


// console.log(precioDeProductos)
// console.log(products.filter((el) => el.razonsocial === "fritzsport"));
const SkuProducts = productos.map((el: any) => {
  return {
    sku: el.sku,
  };
});

const precioDeProductos = await fetchProductosPrecios(SkuProducts);



// necesito que me crees un nuevo array de objetos apartir de products y precioDeProductos y me dejes personalizar el precio de cada producto con el precio de precioDeProductos
const productosConPrecio = productos.map((producto: any) => {
  const precio = precioDeProductos.find(
    (precio) => precio.sku === producto.sku
  );

  
  return {
    ...producto,
    razonsocial: determinarRazonSocial(
      precio?.precio_retail,
      precio?.precio_mayorista,
      producto?.marca
    ),
    subgenero_ninos:
      producto.genero == "niños" &&
      determinarSubgeneroPorTalla(precio?.tallas_catalogo, producto?.marca, producto?.tipo),
    tipoproducto: precio?.stockDisponible > 20 ? "catalogo" : "web",
    stock: precio?.stockDisponible,
    talla_sistema: precio?.tallas_catalogo  && precio?.tallas_catalogo
      .filter((size: any) => size !== null)
      .join(", "),
    tallascatalogo:
      precio?.tallas_catalogo &&
      convertUSSizeToEuropean(
        precio?.tallas_catalogo,
        producto?.genero,
        producto?.marca,
        producto.genero == "niños"
          ? determinarSubgeneroPorTalla(
              precio?.tallas_catalogo,
              producto?.marca,
              producto?.tipo,
            )
          : undefined,
        producto?.tipo
      ),
      tallas:precio?.tallas,
    priceecommerce: precio?.precio_retail,
    priceemprendedor: precio?.precio_emprendedor,
    pricemayorista: precio?.precio_mayorista,
  };
});
// Ordenar por _createdAt
let productosOrdenadosConPrecio = productosConPrecio
  .sort(
    (a:any, b:any) =>
      new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
  )
  .filter(
    (el:any) =>

      el.subgenero_ninos !== "Categoría no determinada" &&
      el.talla_sistema !== "" && el.stock > 10 && 
      el.tallascatalogo !== ""

  )
  .filter(
    (el:any) =>
      el.pricemayorista != undefined ||
      el.priceemprendedor != undefined ||
      el.priceecommerce != undefined ||
      el.pricemayorista != null ||
      el.priceemprendedor != null ||
      el.priceecommerce != null 
  );
    return productosOrdenadosConPrecio
}

