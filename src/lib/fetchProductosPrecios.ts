import organizarProductos from "@/utils/organizar-precios-productos";

interface Producto {
  sku: string;
}

// Nueva búsqueda por SKUs usando la nueva API
async function buscarPorSKU(
  productos: Producto[],
  codAlmacenes: string[] = ["A02"]
): Promise<any[]> {
  try {
    // Crear controller por llamada para evitar abortos cruzados
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const skusTransformados = productos.flatMap((p) => {
      const sku = String(p.sku);
      return sku.includes("-") ? [sku, sku.replace(/-/g, " ")] : [sku];
    });

    const solicitud = {
      rucE: "20602090117",
      tipoBusqueda: "SKU",
      codigos: Array.from(new Set(skusTransformados)),
      codAlmacenes: codAlmacenes,
    };

    // DEBUG: Mostrar qué estamos enviando
    console.log("🔍 DEBUG - Solicitud a API:", {
      url: "https://fritz.ngrok.app/api/productos/precio-stock-por-almacenes",
      totalSKUs: solicitud.codigos.length,
      primerosSkus: solicitud.codigos.slice(0, 5),
      almacenes: solicitud.codAlmacenes,
      rucE: solicitud.rucE,
    });

    const url =
      "https://fritz.ngrok.app/api/productos/precio-stock-por-almacenes";

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(solicitud),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!resp.ok) {
      const errorBody = await resp.text().catch(() => "");
      console.error("❌ DEBUG - Error de API:", {
        status: resp.status,
        statusText: resp.statusText,
        errorBody: errorBody.slice(0, 500),
      });
      return [];
    }

    const data = await resp.json();
    console.log("✅ DEBUG - Respuesta exitosa de API:", {
      itemsRecibidos: Array.isArray(data) ? data.length : 0,
      primerItem:
        Array.isArray(data) && data.length > 0
          ? {
              sku: data[0].ca01,
              talla: data[0].ca02,
              precios: data[0].precios?.length || 0,
              stocks: data[0].stocks?.length || 0,
            }
          : null,
    });

    return data;
  } catch (error: any) {
    return [];
  }
}

export async function fetchProductosPrecios(
  productos: Producto[],
  provincia?: string,
  almacenesOverride?: string[]
): Promise<any[]> {
  try {
    // 1) Buscar productos por SKUs con la nueva API
    const codAlmacenes = almacenesOverride || ["A02"]; // Por defecto A02 (CD - IQUITOS)

    console.log("🔍 DEBUG - Procesando productos en lotes:", {
      totalProductos: productos.length,
    });

    // Procesar en lotes de 200 SKUs para evitar sobrecarga
    const BATCH_SIZE = 200;
    const totalBatches = Math.ceil(productos.length / BATCH_SIZE);
    const todosLosResultados: any[] = [];

    for (let i = 0; i < totalBatches; i++) {
      const start = i * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, productos.length);
      const lote = productos.slice(start, end);

      console.log(
        `🔄 Procesando lote ${i + 1}/${totalBatches} (${lote.length} SKUs)`
      );

      const resultadoLote = await buscarPorSKU(lote, codAlmacenes);

      if (Array.isArray(resultadoLote)) {
        todosLosResultados.push(...resultadoLote);
      }

      // Pequeña pausa entre lotes para no sobrecargar la API
      if (i < totalBatches - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(
      `✅ Procesamiento completo: ${todosLosResultados.length} items de ${totalBatches} lotes`
    );

    const respuestaApi = todosLosResultados;

    if (!Array.isArray(respuestaApi) || respuestaApi.length === 0) {
      return [];
    }

    // 2) Transformar al formato esperado por organizarProductos
    const mapPrecio = (precios: any[], nombre: string): number => {
      const p = precios?.find(
        (x: any) => String(x?.nombrePrecio || "").toUpperCase() === nombre
      );
      return typeof p?.precioFinal === "number" ? p.precioFinal : 0;
    };

    const productosMapeados = respuestaApi.map((item: any) => {
      // Calcular stock total de todos los almacenes solicitados
      const stockDisponible = (item?.stocks || []).reduce(
        (acc: number, s: any) =>
          acc + (typeof s?.stockAlmacen === "number" ? s.stockAlmacen : 0),
        0
      );

      const precioRetail = mapPrecio(item?.precios || [], "RETAIL");
      const precioEmprendedor = mapPrecio(item?.precios || [], "EMPRENDEDOR");
      const precioMayorista = mapPrecio(item?.precios || [], "MAYORISTA");
      const precioMayoristaCD = mapPrecio(item?.precios || [], "MAYORISTA_CD");

      return {
        // Campos esperados por organizarProductos
        almacenTabla: "A02", // Usar el código real del almacén
        codigoAlmacen: "A02",
        codigoArticulo: String(item?.cdProd || ""),
        nombreArticulo: String(
          item?.descrip || item?.nombre2 || item?.nombre1 || ""
        ),
        stockDisponible,
        marca: "",
        grupo: String(item?.ca01 || ""), // SKU
        talla: String(item?.ca02 || ""),
        precio1: precioRetail,
        precio2: precioRetail, // fallback
        precio3: precioEmprendedor,
        precio6: precioMayoristaCD || precioMayorista, // Priorizar MAYORISTA_CD
        // Agregar todos los precios disponibles para mayor flexibilidad
        precioRetail,
        precioEmprendedor,
        precioMayorista,
        precioMayoristaCD,
        // Información adicional de la API
        stocks: item?.stocks || [],
        precios: item?.precios || [],
      };
    });

    console.log("🔍 DEBUG - Antes de organizarProductos:", {
      productosMapeados: productosMapeados.length,
      skusUnicos: new Set(productosMapeados.map((p) => p.grupo)).size,
    });

    // 3) Organizar y devolver
    const productosOrganizados = organizarProductos(productosMapeados);

    console.log("🔍 DEBUG - Después de organizarProductos:", {
      productosOrganizados: productosOrganizados.length,
      conTallascatalogo: productosOrganizados.filter(
        (p: any) => p.tallascatalogo && p.tallascatalogo.length > 0
      ).length,
    });

    return productosOrganizados;
  } catch (error) {
    return [];
  }
}
