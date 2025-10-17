import { fetchProductosPrecios } from "./fetchProductosPrecios";
import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";

interface ProductoInput {
  sku: string;
  // Campos básicos de Sanity
  _id?: string;
  _createdAt?: string | Date;
  name?: string;
  empresa?: string;
  genero?: string;
  marca?: string;
  tipo?: string;
  activo?: boolean;
  ninos_talla_grande?: boolean;
  fecha_cuando_aparece?: string | null;
  color?: string;
  description?: string;
  subgenero?: string;
  subgenero_ninos?: string;
  categories?: string[];
  slug?: string;
  
  // ✅ CAMPOS DE IMÁGENES - CRÍTICOS
  images?: any[];
  imgcatalogomain?: any;
  imagescatalogo?: any[];
  
  // Otros campos opcionales
  precio_manual?: any;
  preciomanual?: any;
  fechaIngreso?: string;
  [key: string]: any; // Para permitir otros campos dinámicos
}

/**
 * Función principal que obtiene productos con precios y tallas de la API
 * y los procesa con la lógica de productos-traidos-sistema
 */
export async function fetchProductosConPreciosYTallas(
  productos: ProductoInput[],
  tipoproducto?: string,
  provincia?: string,
  razonsocial?: string,
  ninos_talla_grande?: string,
  almacenesOverride?: string[]
): Promise<any[]> {
  try {
    // 1. Obtener precios y tallas de la API (SIN FALLBACK)
    const productosConPrecios = await fetchProductosPrecios(
      productos,
      provincia,
      almacenesOverride
    );

    console.log("🔍 DEBUG - Productos de API:", {
      recibidos: productosConPrecios.length,
      enviados: productos.length
    });

    // 2. Si no hay productos de la API, devolver array vacío
    if (!Array.isArray(productosConPrecios) || productosConPrecios.length === 0) {
      console.log("❌ DEBUG - No se recibieron productos de la API");
      return [];
    }

    // 3. Combinar datos de API con Sanity CORRECTAMENTE
    // Solo procesar productos que existen en Sanity
    const productosCombinados = productosConPrecios
      .filter((productoAPI) => {
        const productoSanity = productos.find(p => p.sku === productoAPI.sku);
        return !!productoSanity; // Solo productos que están en Sanity
      })
      .map((productoAPI) => {
        const productoSanity = productos.find(p => p.sku === productoAPI.sku);

        // COMBINAR CORRECTAMENTE: Sanity como base, solo campos específicos de API
        return {
          ...productoSanity, // Base: todos los datos de Sanity (imágenes, marca, genero, etc.)
          
          // SOLO sobrescribir campos específicos de la API
          sku: productoAPI.sku,
          tallascatalogo: productoAPI.tallascatalogo,
          priceecommerce: productoAPI.priceecommerce,
          priceemprendedor: productoAPI.priceemprendedor,
          // Bench y PDFs consumen pricemayorista; mapear desde API y dejar fallback a mayorista_cd
          pricemayorista: (
            productoAPI.precio_mayorista ??
            productoAPI.pricemayorista ??
            productoAPI.mayorista_cd ??
            0
          ),
          mayorista_cd: productoAPI.mayorista_cd,
          stock: productoAPI.stockDisponible || productoAPI.stock || 0,
          stockDisponible: productoAPI.stockDisponible || productoAPI.stock || 0,
          
          // MANTENER campos importantes de Sanity (NO sobrescribir)
          marca: productoSanity?.marca, // ✅ Mantener marca de Sanity
          genero: productoSanity?.genero, // ✅ Mantener genero de Sanity
          tipo: productoSanity?.tipo, // ✅ Mantener tipo de Sanity
          
          // MANTENER datos importantes de Sanity
          activo: productoSanity?.activo !== undefined ? productoSanity.activo : true,
          _createdAt: typeof productoSanity?._createdAt === 'string' 
            ? productoSanity?._createdAt 
            : productoSanity?._createdAt?.toISOString() || new Date().toISOString(),
        };
      });

    console.log("🔍 DEBUG - Productos combinados:", {
      total: productosCombinados.length,
      conImagenes: productosCombinados.filter(p => p.imgcatalogomain || p.images?.length > 0).length,
      conPrecios: productosCombinados.filter(p => p.priceecommerce > 0).length,
      conTallas: productosCombinados.filter(p => p.tallascatalogo && p.tallascatalogo.length > 0).length
    });

    // Verificar algunos productos combinados
    if (productosCombinados.length > 0) {
      const ejemplo = productosCombinados[0];
      console.log("🔍 DEBUG - Ejemplo de producto combinado:", {
        sku: ejemplo.sku,
        tieneImagen: !!(ejemplo.imgcatalogomain || ejemplo.images?.length > 0),
        tienePrecio: ejemplo.priceecommerce > 0,
        tieneTallas: !!(ejemplo.tallascatalogo && ejemplo.tallascatalogo.length > 0),
        tieneNombre: !!ejemplo.name,
        tieneGenero: !!ejemplo.genero
      });
    }

    // 4. Procesar con productos-traidos-sistema
    const productosFinales = productosTraidosSistemaFritzSport(
      productosCombinados,
      tipoproducto,
      provincia,
      razonsocial,
      ninos_talla_grande
    );

    console.log("🔍 DEBUG - Productos finales:", {
      total: productosFinales.length,
      filtrados: productosCombinados.length - productosFinales.length
    });

    return productosFinales;

  } catch (error) {
    console.error("❌ DEBUG - Error en fetchProductosConPreciosYTallas:", error);
    return [];
  }
}

/**
 * Función simplificada para obtener solo precios y tallas por SKUs
 */
export async function fetchPreciosYTallasPorSKUs(
  skus: string[],
  almacenesOverride?: string[]
): Promise<any[]> {
  const productos = skus.map(sku => ({ sku }));
  return fetchProductosPrecios(productos, undefined, almacenesOverride);
}