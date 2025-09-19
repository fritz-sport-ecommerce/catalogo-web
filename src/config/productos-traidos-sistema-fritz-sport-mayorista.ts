import { fetchProductosPreciosAlmacen } from "@/lib/fetchProductosPreciosAlmacen";
import determinarRazonSocial from "@/utils/calcular-razon-social";
import convertUSSizeToEuropean from "@/utils/convertir-talla-usa-eu";
import determinarSubgeneroPorTalla from "@/utils/determinar-subgenero-ninos";
import { calcularPrecioConDescuento } from "./descuento-fz-premium";

import { client } from "@/sanity/lib/client";

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

/**
 * Aplica el descuento de stock por talla a un array de productos según el objeto stockDescontado.
 * @param productos Array de productos (cada uno con propiedad tallas y stock)
 * @param stockDescontado Objeto { [sku]: { [talla]: cantidadDescontada } }
 * @returns Nuevo array de productos con tallas y stock descontados
 */
export function aplicarDescuentoStockPorTalla(productos: any[], stockDescontado: Record<string, Record<string, number>>) {
  return productos.map((producto) => {
    let tallasConvertidas = producto.tallas;
    let stockGeneral = producto.stock;
    if (stockDescontado[producto?.sku]) {
      // Descontar del stock general
      const totalDescontado = Object.values(stockDescontado[producto.sku]).reduce((a, b) => a + b, 0);
      stockGeneral = Math.max(0, stockGeneral - totalDescontado);
      // Descontar por talla
      tallasConvertidas = tallasConvertidas.map((tallaObj: any) => {
        if (typeof tallaObj === "object" && tallaObj.talla) {
          const descuento = stockDescontado[producto.sku][tallaObj.talla] || 0;
          return {
            ...tallaObj,
            stock: Math.max(0, (tallaObj.stock ?? 0) - descuento),
          };
        }
        if (typeof tallaObj === "string") {
          return { talla: tallaObj, stock: 0, _id: "" };
        }
        return tallaObj;
      });
    }
    return {
      ...producto,
      stock: stockGeneral,
      tallas: tallasConvertidas,
    };
  });
}

/**
 * Aplica el descuento de stock por talla a un solo producto según el objeto stockDescontado.
 * @param producto Producto individual (con propiedad tallas y stock)
 * @param stockDescontado Objeto { [sku]: { [talla]: cantidadDescontada } }
 * @returns Producto con tallas y stock descontados
 */
export function aplicarDescuentoStockPorTallaUnitario(producto: any, stockDescontado: Record<string, Record<string, number>>) {
  let tallasConvertidas = producto.tallas;
  let stockGeneral = producto.stock;
  if (stockDescontado[producto?.sku]) {
    // Descontar del stock general
    const totalDescontado = Object.values(stockDescontado[producto.sku]).reduce((a, b) => a + b, 0);
    stockGeneral = Math.max(0, stockGeneral - totalDescontado);
    // Descontar por talla
    tallasConvertidas = tallasConvertidas.map((tallaObj: any) => {
      if (typeof tallaObj === "object" && tallaObj.talla) {
        const descuento = stockDescontado[producto.sku][tallaObj.talla] || 0;
        return {
          ...tallaObj,
          stock: Math.max(0, (tallaObj.stock ?? 0) - descuento),
        };
      }
      if (typeof tallaObj === "string") {
        return { talla: tallaObj, stock: 0, _id: "" };
      }
      return tallaObj;
    });
  }
  return {
    ...producto,
    stock: stockGeneral,
    tallas: tallasConvertidas,
  };
}

export default async function productosTraidosSistemaFritzSportMayorista(
  productos: any[] = [],
  provincia: string | undefined,
  razonsocial: string | undefined = undefined
) {
  console.log(`🔄 productosTraidosSistemaFritzSportMayorista - Iniciando procesamiento (SOLO ALMACÉN 0009)`);
  console.log(`📊 Productos recibidos: ${productos?.length || 0}`);
  console.log(`🌍 Provincia: ${provincia}`);
  console.log(`🏢 Razón social: ${razonsocial}`);
  
  if (!Array.isArray(productos) || productos.length === 0 ) {
    console.error("❌ Error: No hay productos para procesar.");
    return [];
  }

  const SkuProducts = productos?.map((el) => ({ sku: el?.sku }));
  console.log(`🔢 SKUs a buscar: ${SkuProducts?.length || 0}`);

  let precioDeProductos: any[] = [];
  try {
    // SOLO buscar en el almacén 0009 (Iquitos)
    precioDeProductos = await fetchProductosPreciosAlmacen(SkuProducts, "0009");
    console.log(`💰 Precios obtenidos del almacén 0009: ${precioDeProductos?.length || 0}`);
    if (!Array.isArray(precioDeProductos))
      throw new Error("Datos inválidos recibidos.");
  } catch (error) {
    console.error("❌ Error en fetchProductosPreciosAlmacen:", error);
    return [];
  }

  // --- NUEVO: Consultar pedidos pagados en Sanity y calcular stock descontado ---
  // Traer todos los pedidos pagados
  let pedidosPagados = [];
  try {
    pedidosPagados = await client.fetch(
      `*[_type == "pedidos" && estado == "pagado"]{ productos[] }`
    );
  } catch (error) {
    console.error("❌ Error al obtener pedidos pagados de Sanity:", error);
    pedidosPagados = [];
  }

  // Crear un mapa para saber cuántos productos se han vendido por SKU y talla  /
  const stockDescontado: Record<string, Record<string, number>> = {};
  for (const pedido of pedidosPagados) {
    if (!pedido.productos) continue;
    for (const prod of pedido.productos) {
      if (!prod.sku || !prod.talla || !prod.cantidad) continue;
      if (!stockDescontado[prod.sku]) stockDescontado[prod.sku] = {};
      if (!stockDescontado[prod.sku][prod.talla]) stockDescontado[prod.sku][prod.talla] = 0;
      stockDescontado[prod.sku][prod.talla] += prod.cantidad;
    }
  }

  // Generar nuevo array con precios asignados (sin descontar stock por talla aún)
  const productosConPrecio = productos.map((producto) => {
    const precio = precioDeProductos.find((p) => p.sku === producto.sku);
    // Descontar stock general (pero NO por talla ni pedidos aún)
    let stockGeneral = precio?.stockDisponible ?? 0;
    // 1. Convertir tallas a formato europeo (o el que corresponda)
    let tallasConvertidas = convertUSSizeToEuropean(
      precio?.tallas,
      producto?.genero,
      producto?.marca,
      producto?.genero === "niños"
        ? determinarSubgeneroPorTalla(
            precio?.tallas_catalogo,
            producto?.marca,
            producto?.tipo
          )
        : undefined,
      producto?.tipo
    );
    // NO descontar stock por talla aquí
    return {
      ...producto,
      razonsocial: determinarRazonSocial(
        precio?.precio_retail,
        precio?.precio_mayorista,
        producto?.marca
      ),
      images: producto?.images,
      subgenero_ninos:
        producto?.genero === "niños"
          ? determinarSubgeneroPorTalla(
              precio?.tallas_catalogo,
              producto?.marca,
              producto?.tipo
            )
          : undefined,
      tipoproducto: stockGeneral > 6 ? "catalogo" : "web",
      stock: stockGeneral,
      talla_sistema: precio?.tallas_catalogo?.filter(Boolean).join(", ") || "",
      precio_original: precio?.precio_retail ,
      tallas: tallasConvertidas,
      priceecommerce: precio?.precio_retail ?? null,
      priceemprendedor: precio?.precio_emprendedor ?? null,
      pricemayorista:  precio?.precio_mayorista ?? null ,
      provincias: precio?.provincias || [],
    };
  });

  // Filtrar productos válidos (sin ordenar por stock aquí)
  console.log(`🔍 Productos con precio asignado: ${productosConPrecio?.length || 0}`);
  
  let productosOrdenadosConPrecio = productosConPrecio
    .filter(
      (el) =>
        el.pricemayorista !== undefined &&
        el.priceemprendedor !== undefined &&
        el.priceecommerce !== undefined &&
        el.pricemayorista !== null &&
        el.priceemprendedor !== null &&
        el.priceecommerce !== null &&
        el.empresa! &&
        el.empresa === "fritz_sport" &&
        el.priceecommerce > 0 &&
        el.tipoproducto === "catalogo"
    );
    
  console.log(`✅ Productos válidos después del filtrado: ${productosOrdenadosConPrecio?.length || 0}`);

  // Ahora SÍ: aplicar descuento de stock SOLO al stock general según pedidos pagados SOLO a los productos filtrados
  productosOrdenadosConPrecio = productosOrdenadosConPrecio.map((producto) => {
    let stockGeneral = producto.stock;
    if (stockDescontado[producto?.sku]) {
      // Descontar del stock general
      const totalDescontado = Object.values(stockDescontado[producto.sku]).reduce((a, b) => a + b, 0);
      stockGeneral = Math.max(0, stockGeneral - totalDescontado);
    }
    return {
      ...producto,
      stock: stockGeneral,
      // tallas: producto.tallas, // No modificar tallas
    };
  });

  // (opcional) console.log(productosOrdenadosConPrecio.filter(el=>el.sku == "ID2056")[0]?.tallas);

  // Eliminar productos duplicados por SKU (mantener solo el primero encontrado)
  const productosUnicos = productosOrdenadosConPrecio.reduce((acc, producto) => {
    if (!acc.find((p: any) => p.sku === producto.sku)) {
      acc.push(producto);
    }
    return acc;
  }, [] as any[]);

  console.log(`🎯 Productos únicos finales (ALMACÉN 0009): ${productosUnicos?.length || 0}`);
  console.log(`🏁 productosTraidosSistemaFritzSportMayorista - Procesamiento completado`);
  
  return productosUnicos;
}