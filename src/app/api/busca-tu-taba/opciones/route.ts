import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { fetchProductosPrecios } from "@/lib/fetchProductosPrecios";
import productosTraidosSistemaFritzSport from "@/config/productos-sistema-busca-tu-taba";

// Cache para opciones disponibles
const opcionesCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minuto

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Generar cache key
    const cacheKey = `opciones-${searchParams.toString()}`;
    const cached = opcionesCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const date = searchParams.get("fecha") || undefined;
    const color = searchParams.get("color") || undefined;
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const genero = searchParams.get("genero") || undefined;
    const coleccion = searchParams.get("coleccion") || undefined;
    const marca = searchParams.get("marca") || undefined;
    const tipo = searchParams.get("tipo") || undefined;
    const talla = searchParams.get("talla") || undefined;
    const priceRange = searchParams.get("rangoPrecio") || undefined;
    const populares = searchParams.get("populares") || undefined;

    // Construir filtros
    const productFilter = "_type == 'product'";
    const colorFilter = color
      ? `&& (${color.split(".").map((c) => `color match "${c}"`).join(" || ")})`
      : "";
    const tipoFilter = tipo
      ? `&& (${tipo.split(".").map((t) => `tipo match "${t}"`).join(" || ")})`
      : "";
    const marcaFilter = marca
      ? `&& (${marca.split(".").map((m) => `marca match "${m}"`).join(" || ")})`
      : "";
    const categoryFilter = category
      ? `&& (${category.split(".").map((c) => `"${c}" match categories`).join(" || ")})`
      : "";
    const generoFilter = genero
      ? `&& (${genero.split(".").map((g) => `genero == "${g}"`).join(" || ")} || genero == "unisex")`
      : "";
    const searchFilter = search
      ? `&& (name match "${search}" || sku match "${search}" || genero match "${search}" || marca match "${search}" || tipo match "${search}" || category match "${search}" || color match "${search}" || coleccion match "${search}")`
      : "";
    const popularesFilter = populares === "true" ? "&& popularidad > 1" : "";

    const filter = `*[${productFilter}${generoFilter}${colorFilter}${categoryFilter}${searchFilter}${marcaFilter}${tipoFilter}${popularesFilter} && empresa == "fritz_sport"][0...200]`;

    // Obtener productos de Sanity
    const productsRaw = await client.fetch(
      groq`${filter} {
        _id,
        name,
        sku,
        genero,
        tipo,
        marca,
        categories,
        popularidad,
        activo
      }`
    );

    // Obtener precios y stock del sistema
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
      productosSistema = productsRaw.map((producto: any) => ({
        ...producto,
        priceecommerce: 0,
        stock: 0,
        tallas: [],
        tallascatalogo: ""
      }));
    }

    // Combinar datos
    const skusVistos = new Set<string>();
    const productosCombinados = productosSistema
      .map((productoSistema: any) => {
        const productoSanity = productsRaw.find((p: any) => p.sku === productoSistema.sku);
        return {
          ...productoSanity,
          priceecommerce: productoSistema.priceecommerce,
          stock: productoSistema.stock,
          tallas: productoSistema.tallas,
          tallascatalogo: productoSistema.tallascatalogo
        };
      })
      .filter((producto: any) => {
        if (!producto.sku || skusVistos.has(producto.sku)) return false;
        skusVistos.add(producto.sku);
        // Solo productos con precio Y stock > 0
        return (producto.priceecommerce || 0) > 0 && (producto.stock || 0) > 0;
      });

    // Filtrar por talla si se especifica
    let productosConStock = productosCombinados;
    if (talla) {
      const tallasArray = talla.split('.');
      productosConStock = productosConStock.filter((producto: any) => {
        const enTallas = producto.tallas && producto.tallas.some((t: any) => 
          tallasArray.includes(String(t.talla))
        );
        const enCatalogo = producto.tallascatalogo && tallasArray.some((tallaFiltro: string) => 
          producto.tallascatalogo.split(',').map((t: string) => t.trim()).includes(tallaFiltro)
        );
        return enTallas || enCatalogo;
      });
    }

    // Filtrar por rango de precio si se especifica
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      productosConStock = productosConStock.filter((producto: any) => {
        const precio = producto.priceecommerce || 0;
        return precio >= minPrice && precio <= maxPrice;
      });
    }

    // Extraer opciones disponibles
    const tiposDisponibles = Array.from(new Set(productosConStock.map(p => p.tipo).filter(Boolean)));
    const generosDisponibles = Array.from(new Set(productosConStock.map(p => p.genero).filter(Boolean)));
    const marcasDisponibles = Array.from(new Set(productosConStock.map(p => p.marca).filter(Boolean)));
    
    // Categorías disponibles (aplanar arrays de categorías)
    const categoriasDisponibles = Array.from(new Set(
      productosConStock
        .flatMap(p => p.categories || [])
        .filter(Boolean)
    ));

    // Tallas disponibles
    const tallasDisponibles = new Map<string, { stock: number; productos: number }>();
    productosConStock.forEach(producto => {
      // De tallas detalladas
      if (producto.tallas && Array.isArray(producto.tallas)) {
        producto.tallas.forEach((tallaObj: any) => {
          const talla = String(tallaObj.talla || tallaObj);
          const stock = tallaObj.stock || 0;
          if (tallasDisponibles.has(talla)) {
            const existing = tallasDisponibles.get(talla)!;
            tallasDisponibles.set(talla, {
              stock: existing.stock + stock,
              productos: existing.productos + 1
            });
          } else {
            tallasDisponibles.set(talla, { stock, productos: 1 });
          }
        });
      }
      
      // De tallascatalogo
      if (producto.tallascatalogo) {
        const tallas = producto.tallascatalogo.split(',').map((t: string) => t.trim()).filter(Boolean);
        tallas.forEach((talla :string ) => {
          if (tallasDisponibles.has(talla)) {
            const existing = tallasDisponibles.get(talla)!;
            tallasDisponibles.set(talla, {
              stock: existing.stock,
              productos: existing.productos + 1
            });
          } else {
            tallasDisponibles.set(talla, { stock: 0, productos: 1 });
          }
        });
      }
    });

    const result = {
      ok: true,
      totalProductos: productosConStock.length,
      opciones: {
        tipos: tiposDisponibles.sort(),
        generos: generosDisponibles.sort(),
        marcas: marcasDisponibles.sort(),
        categorias: categoriasDisponibles.sort(),
        tallas: Array.from(tallasDisponibles.entries()).map(([talla, info]) => ({
          talla,
          stock: info.stock,
          productos: info.productos,
          disponible: info.stock > 0 || info.productos > 0
        })).sort((a, b) => {
          // Ordenar tallas numéricamente si es posible
          const aNum = parseFloat(a.talla);
          const bNum = parseFloat(b.talla);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
          }
          return a.talla.localeCompare(b.talla);
        })
      }
    };

    // Guardar en cache
    opcionesCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unexpected error" }, { status: 500 });
  }
}