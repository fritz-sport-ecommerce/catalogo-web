import organizarProductos from "@/utils/organizar-precios-productos";

interface Producto {
  sku: string;
}

// const ALMACENES: string[] = ["0009", "0002", "2001"]; // Agrega aquí todos los almacenes disponibles
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 20000);
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
      codigosGrupo: Array.from(new Set(skusTransformados)), // Eliminar duplicados
    };

    const response = await fetch(
      `${process.env.URL_API_FRITZ_SPORT}/api/productos-precios/grupos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(solicitud),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
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
  productos: Producto[],
  provincia: string | undefined
): Promise<any[]> {
  // const ALMACENES = ["0009", "0002", "2001"];
  let provinciaT = provincia ? provincia : "LIMA";

  let ALMACENES: string[] = [];

  switch (provinciaT) {
    case "LIMA":
      ALMACENES = ["0009"];
      break;
    case "TUMBES":
      ALMACENES = ["2001"];
      break;
    case "HUANUCO":
      ALMACENES = ["0002"];
      break;
  }

  try {
    let productosEncontrados: any[] = [];
    const skusEncontrados = new Set<string>();
    let productosFaltantes = [...productos];

    // Buscar en cada almacén
    for (const almacen of ALMACENES) {
      if (productosFaltantes.length === 0) break; // Si ya se encontraron todos, salir del loop

      const data = await buscarEnAlmacen(productosFaltantes, almacen);
      productosEncontrados.push(...data);
      data.forEach((p: any) => skusEncontrados.add(p.sku));

      // Filtrar los productos que aún no se han encontrado
      productosFaltantes = productos.filter(
        ({ sku }) => !skusEncontrados.has(sku)
      );
    }

    // Si no se encontró ningún producto, devolver []
    if (productosEncontrados.length === 0) {
      return [];
    }

    // Organizar y devolver los productos encontrados
    return organizarProductos(productosEncontrados);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}
