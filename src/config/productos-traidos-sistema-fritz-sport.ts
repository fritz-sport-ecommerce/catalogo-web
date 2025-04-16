import { fetchProductosPrecios } from "@/lib/fetchProductosPrecios";
import determinarRazonSocial from "@/utils/calcular-razon-social";
import convertUSSizeToEuropean from "@/utils/convertir-talla-usa-eu";
import determinarSubgeneroPorTalla from "@/utils/determinar-subgenero-ninos";

// Función para obtener el stock total en Lima
function obtenerStockEnLima(
  provincias: any[] = [],
  provincia: string = "LIMA"
): number {
  return provincias
    .filter(
      (p) => p?.provincia?.toLocaleUpperCase() === provincia.toLocaleUpperCase()
    )
    .reduce((total, p) => total + (p.stock ?? 0), 0);
}

export default async function productosTraidosSistemaFritzSport(
  productos: any[] = [],
  provincia: string | undefined
) {
  if (!Array.isArray(productos) || productos.length === 0) {
    console.error("❌ Error: No hay productos para procesar.");
    return [];
  }

  const SkuProducts = productos
    .map((el) => ({ sku: el.sku }))
    .filter((el: any) => el.empresa != "fz_premium");

  let precioDeProductos: any[] = [];
  try {
    precioDeProductos = await fetchProductosPrecios(SkuProducts, provincia);
    if (!Array.isArray(precioDeProductos))
      throw new Error("Datos inválidos recibidos.");
  } catch (error) {
    console.error("❌ Error en fetchProductosPrecios:", error);
    return [];
  }

  // Generar nuevo array con precios asignados
  const productosConPrecio = productos.map((producto) => {
    const precio = precioDeProductos.find((p) => p.sku === producto.sku);

    return {
      ...producto,
      razonsocial: determinarRazonSocial(
        precio?.precio_retail,
        precio?.precio_mayorista,
        producto?.marca
      ),
      images: producto?.images,
      subgenero_ninos:
        producto.genero === "niños"
          ? determinarSubgeneroPorTalla(
              precio?.tallas_catalogo,
              producto?.marca,
              producto?.tipo
            )
          : undefined,
      tipoproducto: precio?.stockDisponible > 6 ? "catalogo" : "web",
      stock: precio?.stockDisponible ?? 0,
      talla_sistema: precio?.tallas_catalogo?.filter(Boolean).join(", ") || "",
      tallascatalogo: precio?.tallas_catalogo
        ? convertUSSizeToEuropean(
            precio?.tallas_catalogo,
            producto?.genero,
            producto?.marca,
            producto.genero === "niños"
              ? determinarSubgeneroPorTalla(
                  precio?.tallas_catalogo,
                  producto?.marca,
                  producto?.tipo
                )
              : undefined,
            producto?.tipo
          )
        : "",
      tallas: precio?.tallas || [],
      priceecommerce: precio?.precio_retail ?? null,
      priceemprendedor: precio?.precio_emprendedor ?? null,
      pricemayorista: precio?.precio_mayorista ?? null,
      provincias: precio?.provincias || [],
    };
  });

  // Ordenar por _createdAt y filtrar
  const productosOrdenadosConPrecio = productosConPrecio
    .sort(
      (a, b) =>
        new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
    )
    // .filter(
    //   (el) =>
    //     el.subgenero_ninos !== "Categoría no determinada" &&
    //     // obtenerStockEnLima(el.provincias, provincia) > 10 &&
    //     el.talla_sistema !== "" &&
    //     // el.stock > 10 &&
    //     el.tallascatalogo !== ""
    // )
    .filter(
      (el) =>
        el.pricemayorista !== undefined &&
        el.priceemprendedor !== undefined &&
        el.priceecommerce !== undefined &&
        el.pricemayorista !== null &&
        el.priceemprendedor !== null &&
        el.priceecommerce !== null
    );

  return productosOrdenadosConPrecio;
}
