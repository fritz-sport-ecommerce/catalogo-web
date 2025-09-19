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

export async function fetchProductosPrecios(
  productos: Producto[],
  provincia: string | undefined
): Promise<any[]> {
  // TODOS LOS ALMACENES DISPONIBLES
  const ALMACENES: string[] = [
    "0002", // Tienda Grau
    "0009", // Almacen Iquitos
    "4001", // Fritz Sport Los Olivos
    "2001", // Aguas Verdes
    "0006", // Huánuco
  ];

  console.log(`🔍 fetchProductosPrecios - Buscando en ${ALMACENES.length} almacenes:`, ALMACENES);

  try {
    let productosEncontrados: any[] = [];
    const skusEncontrados = new Set<string>();
    let productosFaltantes = [...productos];

    // Usamos Promise.all para paralelizar las búsquedas en todos los almacenes
    const resultados = await Promise.all(
      ALMACENES.map((almacen) => buscarEnAlmacen(productosFaltantes, almacen))
    );

    // Procesamos todos los resultados
    resultados.forEach((data, index) => {
      console.log(`📦 Almacén ${ALMACENES[index]}: ${data?.length || 0} productos encontrados`);
      productosEncontrados.push(...data);
      data.forEach((p: any) => skusEncontrados.add(p.sku));
    });

    console.log(`✅ Total productos encontrados: ${productosEncontrados.length}`);

    return productosEncontrados.length > 0
      ? organizarProductos(productosEncontrados)
      : [];
  } catch (error) {
    console.error("Error en fetchProductosPrecios:", error);
    return [];
  }
}
