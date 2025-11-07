import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { fetchProductosPrecios } from "@/lib/fetchProductosPrecios";
import productosTraidosSistemaFritzSport from "@/config/productos-sistema-busca-tu-taba";

// Configuración de runtime para Vercel
export const runtime = 'nodejs';
export const maxDuration = 8; // 8 segundos máximo (reducido de 10)

// Cache para opciones disponibles - MUY AGRESIVO
const opcionesCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutos (muy largo para evitar llamadas)

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(req.url);
    
    // Generar cache key
    const cacheKey = `opciones-${searchParams.toString()}`;
    const cached = opcionesCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('📋 Cache hit para opciones:', cacheKey.substring(0, 50));
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

    const filter = `*[${productFilter}${generoFilter}${colorFilter}${categoryFilter}${searchFilter}${marcaFilter}${tipoFilter}${popularesFilter} && empresa == "fritz_sport"][0...30]`; // Reducido a 30 para evitar timeout

    // Obtener productos de Sanity con timeout
    const sanityTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Sanity fetch timeout')), 5000)
    );
    
    const productsRaw = await Promise.race([
      client.fetch(
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
      ),
      sanityTimeout
    ]) as any[];

    console.log('📋 Opciones - Productos de Sanity:', productsRaw.length);

    // SIMPLIFICADO: NO hacer fetch de precios para evitar timeout
    // Solo retornar opciones básicas de Sanity (super rápido)
    const productosCombinados = productsRaw;

    // No filtrar por talla ni precio en opciones - solo mostrar todas las opciones disponibles
    const productosConStock = productosCombinados;

    // Extraer opciones disponibles
    const tiposDisponibles = Array.from(new Set(productosConStock.map((p: any) => p.tipo).filter(Boolean)));
    const generosDisponibles = Array.from(new Set(productosConStock.map((p: any) => p.genero).filter(Boolean)));
    const marcasDisponibles = Array.from(new Set(productosConStock.map((p: any) => p.marca).filter(Boolean)));
    
    // Categorías disponibles (aplanar arrays de categorías)
    const categoriasDisponibles = Array.from(new Set(
      productosConStock
        .flatMap((p: any) => p.categories || [])
        .filter(Boolean)
    ));

    // Tallas disponibles - simplificado (sin stock, solo lista)
    const tallasSet = new Set<string>();
    // No extraer tallas de productos para evitar procesamiento pesado
    // Las tallas se manejarán en el endpoint principal

    const result = {
      ok: true,
      totalProductos: productosConStock.length,
      opciones: {
        tipos: tiposDisponibles.sort(),
        generos: generosDisponibles.sort(),
        marcas: marcasDisponibles.sort(),
        categorias: categoriasDisponibles.sort(),
        tallas: [] // Simplificado - no retornar tallas para evitar procesamiento pesado
      }
    };

    // Guardar en cache
    opcionesCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ Opciones completadas en ${duration}ms`);
    
    return NextResponse.json(result);
  } catch (e: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error en opciones después de ${duration}ms:`, e?.message || e);
    
    const errorMessage = e?.message || "Error inesperado";
    const isTimeout = errorMessage.includes('Timeout') || errorMessage.includes('timeout');
    
    return NextResponse.json({ 
      ok: false, 
      error: isTimeout 
        ? "El servidor tardó demasiado. Intenta de nuevo." 
        : errorMessage,
      duration 
    }, { 
      status: isTimeout ? 504 : 500 
    });
  }
}