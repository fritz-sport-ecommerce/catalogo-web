import organizarProductos from "@/utilits/organizar-precios-productos";

interface Producto {
  sku: string;
}
async function buscarEnAlmacen(
  productos: Producto[],
  codigoAlmacen: string
): Promise<any[]> {
  try {
    const skusTransformados = productos.flatMap((p) => {
      const sku = String(p.sku); // Asegurar que sea string
      return sku.includes("-") ? [sku, sku.replace(/-/g, " ")] : [sku];
    });

    const solicitud = {
      codigoAlmacen,
      codigosGrupo: Array.from(new Set(skusTransformados)) // Eliminar duplicados
    };

    const response = await fetch(
      `${process.env.URL_API_FRITZ_SPORT}/api/productos-precios/grupos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(solicitud),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      console.error(
        `Error en la solicitud (${codigoAlmacen}): ${response.statusText}`
      );
      return [];
    }
  } catch (error) {
    console.error(`Error al obtener productos de ${codigoAlmacen}:`, error);
    return [];
  }
}

export async function fetchProductosPrecios(
  productos: Producto[]
): Promise<any[]> {
  try {
    let productosEncontrados: any[] = [];
    const skusEncontrados = new Set<string>();

    // Buscar en el almacén "0009"
    let data = await buscarEnAlmacen(productos, "0009");
    productosEncontrados.push(...data);
    data.forEach((p: any) => skusEncontrados.add(p.sku));

    // Filtrar productos no encontrados
    let productosFaltantes = productos.filter(
      ({ sku }) => !skusEncontrados.has(sku)
    );

    // Si hay productos no encontrados, buscarlos en el almacén "0002"
    if (productosFaltantes.length > 0) {
      data = await buscarEnAlmacen(productosFaltantes, "0002");
      productosEncontrados.push(...data);
      data.forEach((p: any) => skusEncontrados.add(p.sku));

      // Actualizar productos faltantes después de buscar en "0002"
      productosFaltantes = productos.filter(
        ({ sku }) => !skusEncontrados.has(sku)
      );
    }

    // Si no se encontró ningún producto después de ambas búsquedas, devolver []
    if (productosEncontrados.length === 0 && productosFaltantes.length > 0) {
      return [];
    }

    // Organizar y devolver los productos encontrados
    return organizarProductos(productosEncontrados);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}
