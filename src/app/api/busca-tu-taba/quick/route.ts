import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { fetchProductosPrecios } from "@/lib/fetchProductosPrecios";
import productosTraidosSistemaFritzSport from "@/config/productos-sistema-busca-tu-taba";

// Cache simple en memoria (en producción usar Redis)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30000; // 30 segundos (reducido)

// Limpiar cache viejo cada 5 minutos
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(cache.entries());
  for (const [key, value] of entries) {
    if (now - value.timestamp > CACHE_TTL * 2) {
      cache.delete(key);
    }
  }
}, 300000);

// Endpoint optimizado - obtiene precios del sistema y filtra por stock > 0
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const itemsPerPage = Math.min(Number(searchParams.get("limit") || "6"), 12); // Máximo 12 items
    
    // Generar cache key simple y efectivo
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.delete('page'); // No cachear por página
    const cacheKey = `quick-${urlParams.toString()}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('📋 Cache hit para:', cacheKey.substring(0, 100));
      return NextResponse.json(cached.data);
    }

    const date = searchParams.get("fecha") || undefined;
    const precio = searchParams.get("precio") || undefined;
    const price = searchParams.get("price") || undefined;
    const color = searchParams.get("color") || undefined;
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const genero = searchParams.get("genero") || undefined;
    const coleccion = searchParams.get("coleccion") || undefined;
    const marca = searchParams.get("marca") || undefined;
    const tipo = searchParams.get("tipo") || undefined;
    const talla = searchParams.get("talla") || undefined;
    const priceRange = searchParams.get("rangoPrecio") || undefined;
    const tipoproducto = searchParams.get("tipoproducto") || undefined;
    const populares = searchParams.get("populares") || undefined;

    // Order criteria
    const priceSort = price || precio || undefined;
    const priceOrder = priceSort ? `priceecommerce ${priceSort}` : "";
    // Preferir fecha declarada por contenido si existe, con fallback a _createdAt
    const dateDir = date === 'asc' || date === 'desc' ? date : 'desc';
    const dateOrder = `coalesce(fecha_cuando_aparece, _createdAt) ${dateDir}`;
    const orderCriteria = [
      'select(marca == "fritzsport" => 1, 0) desc',
      "select(popularidad > 1 => 1, 0) desc",
      priceOrder,
      dateOrder,
    ]
      .filter(Boolean)
      .join(", ");
    const order = `| order(${orderCriteria})`;

    // Filters
    const productFilter = "_type == 'product'";
    const colorFilter = color
      ? `&& (${color
          .split(".")
          .map((c) => `color match "${c}"`)
          .join(" || ")})`
      : "";
    const tipoFilter = tipo
      ? `&& (${tipo
          .split(".")
          .map((t) => `tipo match "${t}"`)
          .join(" || ")})`
      : "";
    const marcaFilter = marca
      ? `&& (${marca
          .split(".")
          .map((m) => `marca match "${m}"`)
          .join(" || ")})`
      : "";
    const categoryFilter = category
      ? `&& (${category
          .split(".")
          .map((c) => `"${c}" match categories`)
          .join(" || ")})`
      : "";
    const generoFilter = genero
      ? `&& (${genero
          .split(".")
          .map((g) => `genero == "${g}"`)
          .join(" || ")} || genero == "unisex")`
      : "";
    const coleccionFilter = coleccion
      ? `&& (${coleccion
          .split(".")
          .map((c) => `coleccion match "${c}"`)
          .join(" || ")})`
      : "";
    const searchFilter = search
      ? `&& (name match "${search}" || sku match "${search}" || genero match "${search}" || marca match "${search}" || tipo match "${search}" || category match "${search}" || color match "${search}" || coleccion match "${search}")`
      : "";
    const tipoProductoFilter = tipoproducto ? `&& tipoproducto == "${tipoproducto}"` : "";
    const popularesFilter = populares === "true" ? "&& popularidad > 1" : "";

    const filter = `*[${productFilter}${generoFilter}${colorFilter}${categoryFilter}${searchFilter}${marcaFilter}${coleccionFilter}${tipoFilter}${tipoProductoFilter}${popularesFilter} && empresa == "fritz_sport"][0...150] `; // Límite de 150 productos

    // 1. Fetch datos de Sanity con estructura de imágenes compatible
    const productsRaw = await client.fetch(
      groq`${filter} ${order} {
        _id,
        _createdAt,
        fecha_cuando_aparece,
        name,
        sku,
        imgcatalogomain {
          asset-> {
            _id,
            url
          }
        },
        images[] {
          asset-> {
            _id,
            url
          }
        },
        genero,
        tipo,
        marca,
        categories,
        popularidad,
        activo,
        "slug": slug.current
      }`
    );

    // 2. Obtener precios y stock del sistema
    let productosSistema: any[] = [];
    try {
      const productosConPrecios = await fetchProductosPrecios(productsRaw, "01");
      productosSistema = productosTraidosSistemaFritzSport(
        productosConPrecios,
        undefined,
        "LIMA",
        undefined,
        undefined
      );
    } catch (error) {
      console.error("Error fetching productos from sistema:", error);
    }

    // 3. Combinar Sanity + Sistema y eliminar duplicados por SKU
    const skusVistos = new Set<string>();
    const productosCombinados = productosSistema
      .map((productoSistema: any) => {
        const productoSanity = productsRaw.find((p: any) => p.sku === productoSistema.sku);
        
        const combined = {
          ...productoSanity,
          // Preservar imágenes de Sanity explícitamente
          imgcatalogomain: productoSanity?.imgcatalogomain,
          images: productoSanity?.images,
          // Datos del sistema
          priceecommerce: productoSistema.priceecommerce,
          precio_retail: productoSistema.precio_retail,
          priceemprendedor: productoSistema.priceemprendedor,
          precio_emprendedor: productoSistema.precio_emprendedor,
          mayorista_cd: productoSistema.mayorista_cd,
          precio_mayorista: productoSistema.precio_mayorista,
          stock: productoSistema.stock,
          stockDisponible: productoSistema.stockDisponible,
          tallas: productoSistema.tallas,
          tallascatalogo: productoSistema.tallascatalogo,
          talla_sistema: productoSistema.talla_sistema,
          provincias: productoSistema.provincias,
        };
        
        // Debug: verificar imágenes en el primer producto
        if (productosCombinados.length === 0) {
          console.log('🖼️ DEBUG - Primer producto combinado:', {
            sku: combined.sku,
            tieneImgCatalogo: !!combined.imgcatalogomain?.asset?.url,
            tieneImages: !!(combined.images && combined.images.length > 0),
            imgUrl: combined.imgcatalogomain?.asset?.url || combined.images?.[0]?.asset?.url
          });
        }
        
        return combined;
      })
      .filter((producto: any) => {
        // Eliminar duplicados por SKU
        if (!producto.sku || skusVistos.has(producto.sku)) {
          return false;
        }
        skusVistos.add(producto.sku);
        return true;
      });

    // 4. FILTRAR por precios válidos (relajar filtro de stock)
    let productosConStock = productosCombinados.filter((p: any) => {
      const hasValidPrices = 
        (p.priceecommerce || 0) > 0 &&
        (p.mayorista_cd || 0) > 0 &&
        (p.priceemprendedor || 0) > 0;
      return hasValidPrices; // No filtrar por stock aquí
    });
    
    console.log('📋 DEBUG - Productos después de filtro:', {
      conPrecios: productosConStock.length,
      conStock: productosConStock.filter(p => (p.stock || 0) > 0).length
    });

    // 5. Filtrar por talla si se especifica
    if (talla) {
      productosConStock = productosConStock.filter((producto: any) => {
        return producto.tallas && producto.tallas.some((t: any) => String(t.talla) === talla);
      });
    }

    // 6. Filtrar por rango de precio si se especifica
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      productosConStock = productosConStock.filter((producto: any) => {
        const precio = producto.priceecommerce || 0;
        return precio >= minPrice && precio <= maxPrice;
      });
    }

    // 7. Ordenar productos
    const priceSortDir = priceSort as "asc" | "desc" | undefined;
    const sortedProducts = productosConStock.sort((a: any, b: any) => {
      // Ordenar SIEMPRE por fecha (nuevos primero por defecto), respetando asc/desc si se pasó 'fecha'
      const ad = new Date((a?.fecha_cuando_aparece as string) || (a?._createdAt as string) || 0).getTime();
      const bd = new Date((b?.fecha_cuando_aparece as string) || (b?._createdAt as string) || 0).getTime();
      if (dateDir === 'desc') {
        if (bd !== ad) return bd - ad;
      } else {
        if (ad !== bd) return ad - bd;
      }
      // Priorizar con stock
      if (a.stock > 0 && b.stock === 0) return -1;
      if (a.stock === 0 && b.stock > 0) return 1;
      // Luego precio si se pidió
      if (priceSortDir === "asc") return (a.priceecommerce || 0) - (b.priceecommerce || 0);
      if (priceSortDir === "desc") return (b.priceecommerce || 0) - (a.priceecommerce || 0);
      return 0;
    });

    // 8. Paginación
    const totalProducts = sortedProducts.length;
    const start = (page - 1) * itemsPerPage;
    const pageItems = sortedProducts.slice(start, start + itemsPerPage);

    const result = {
      ok: true,
      total: totalProducts,
      page,
      pageSize: itemsPerPage,
      products: pageItems,
    };
    
    // Guardar en cache
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    console.log('📋 Cache guardado:', cacheKey, '| productos:', result.products.length, '| total:', result.total);
    
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
