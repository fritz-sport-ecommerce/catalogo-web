import organizarProductos from "@/utils/organizar-precios-productos";

interface Producto {
  sku: string;
}

async function buscarEnAlmacen(
  productos: Producto[],
  codigoAlmacen: string
): Promise<any[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const skusTransformados = productos.flatMap((p) => {
      const sku = String(p.sku);
      return sku.includes("-") ? [sku, sku.replace(/-/g, " ")] : [sku];
    });

    const solicitud = {
      codigoAlmacen,
      codigosGrupo: Array.from(new Set(skusTransformados)),
    };

    // URL con timestamp para evitar caché
    const apiUrl = new URL(
      `${process.env.URL_API_FRITZ_SPORT}/api/productos-precios/grupos`
    );
    apiUrl.searchParams.append("_t", Date.now().toString());

    const response = await fetch(apiUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      body: JSON.stringify(solicitud),
      signal: controller.signal,
      cache: "no-store", // Esto es clave para Next.js fetch
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al obtener productos de ${codigoAlmacen}:`, error);
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchProductosPreciosAlmacen(
  productos: Producto[],
  codigoAlmacen: string = "0009"
): Promise<any[]> {
  console.log(`🔍 fetchProductosPreciosAlmacen - Buscando en almacén: ${codigoAlmacen}`);

  try {
    const data = await buscarEnAlmacen(productos, codigoAlmacen);
    console.log(`📦 Almacén ${codigoAlmacen}: ${data?.length || 0} productos encontrados`);

    return data.length > 0 ? organizarProductos(data) : [];
  } catch (error) {
    console.error("Error en fetchProductosPreciosAlmacen:", error);
    return [];
  }
}