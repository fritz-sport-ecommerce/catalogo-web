import organizarProductos from "@/utils/organizar-precios-productos";

interface Producto {
  sku: string;
}

export interface BatchProgress {
  currentBatch: number;
  totalBatches: number;
  batchSize: number;
  processedProducts: number;
  totalProducts: number;
}

export type ProgressCallback = (progress: BatchProgress) => void;

// Nueva búsqueda por SKUs usando la nueva API con retry
async function buscarPorSKU(
  productos: Producto[],
  codAlmacenes: string[] = ["A02"],
  retryCount = 0
): Promise<any[]> {
  const MAX_RETRIES = 2;
  const TIMEOUT_MS = 20000; // Reducido a 20s
  
  try {
    // Crear controller por llamada para evitar abortos cruzados
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

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
    console.error(`❌ DEBUG - Error en lote (intento ${retryCount + 1}/${MAX_RETRIES + 1}):`, {
      error: error.message,
      isTimeout: error.name === 'AbortError',
      skuCount: productos.length
    });
    
    // Retry logic
    if (retryCount < MAX_RETRIES && error.name !== 'AbortError') {
      console.log(`🔄 Reintentando lote en ${(retryCount + 1) * 2}s...`);
      await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
      return buscarPorSKU(productos, codAlmacenes, retryCount + 1);
    }
    
    return [];
  }
}

export async function fetchProductosPrecios(
  productos: Producto[],
  provincia?: string,
  almacenesOverride?: string[],
  onProgress?: ProgressCallback
): Promise<any[]> {
  try {
    // 1) Buscar productos por SKUs con la nueva API
    const codAlmacenes = almacenesOverride || ["A02"]; // Por defecto A02 (CD - IQUITOS)

    console.log("🔍 DEBUG - Procesando productos en lotes:", {
      totalProductos: productos.length,
    });

    // Procesar en lotes más pequeños para mejor rendimiento
    const BATCH_SIZE = 150; // Reducido de 200 a 150
    const PARALLEL_BATCHES = 2; // Reducido de 3 a 2 para menos carga
    const totalBatches = Math.ceil(productos.length / BATCH_SIZE);
    const todosLosResultados: any[] = [];

    // Procesar lotes en paralelo
    for (let i = 0; i < totalBatches; i += PARALLEL_BATCHES) {
      const batchPromises = [];
      
      // Crear promesas para procesar múltiples lotes en paralelo
      for (let j = 0; j < PARALLEL_BATCHES && (i + j) < totalBatches; j++) {
        const batchIndex = i + j;
        const start = batchIndex * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, productos.length);
        const lote = productos.slice(start, end);

        console.log(
          `🔄 Procesando lote ${batchIndex + 1}/${totalBatches} (${lote.length} SKUs)`
        );

        batchPromises.push(
          buscarPorSKU(lote, codAlmacenes).then(resultado => ({
            batchIndex,
            resultado,
            end
          }))
        );
      }

      // Esperar a que todos los lotes paralelos terminen
      const resultados = await Promise.all(batchPromises);

      // Procesar resultados y reportar progreso
      for (const { batchIndex, resultado, end } of resultados) {
        if (Array.isArray(resultado)) {
          todosLosResultados.push(...resultado);
        }

        // Reportar progreso si hay callback
        if (onProgress) {
          onProgress({
            currentBatch: batchIndex + 1,
            totalBatches,
            batchSize: resultado?.length || 0,
            processedProducts: end,
            totalProducts: productos.length,
          });
        }
      }

      // Pequeña pausa entre grupos de lotes paralelos
      if (i + PARALLEL_BATCHES < totalBatches) {
        await new Promise((resolve) => setTimeout(resolve, 50));
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
