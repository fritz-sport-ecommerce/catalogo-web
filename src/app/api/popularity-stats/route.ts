import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const sku = searchParams.get('sku');

    console.log('Popularity stats request:', { limit, sku });

    let query = `*[_type == "product" && defined(popularidad) && popularidad > 0] | order(popularidad desc)[0...${limit}]{
      _id,
      name,
      sku,
      popularidad,
      cantidadVendidos,
      "slug": slug.current
    }`;

    // Si se proporciona un SKU específico, buscar solo ese producto
    if (sku) {
      query = `*[_type == "product" && sku == $sku][0]{
        _id,
        name,
        sku,
        popularidad,
        cantidadVendidos,
        "slug": slug.current
      }`;
    }

    console.log('Executing products query:', query);
    const products = await client.fetch(query, sku ? { sku } : {});
    console.log('Products result:', products);

    // Obtener estadísticas generales usando GROQ correcto
    // Primero obtener todos los productos con popularidad
    const productsWithPopularity = await client.fetch(`
      *[_type == "product" && defined(popularidad) && popularidad > 0] {
        popularidad,
        cantidadVendidos
      }
    `);
    
    // Obtener total de productos
    const totalProducts = await client.fetch(`count(*[_type == "product"])`);
    
    // Calcular estadísticas manualmente
    const productsWithPopularityCount = productsWithPopularity.length;
    const popularities = productsWithPopularity.map((p: { popularidad: number }) => p.popularidad);
    const cantidadesVendidas = productsWithPopularity.map((p: { cantidadVendidos: number }) => p.cantidadVendidos || 0);
    
    const stats = {
      totalProducts,
      productsWithPopularity: productsWithPopularityCount,
      averagePopularity: productsWithPopularityCount > 0 ? 
        popularities.reduce((a: number, b: number) => a + b, 0) / productsWithPopularityCount : 0,
      maxPopularity: productsWithPopularityCount > 0 ? Math.max(...popularities) : 0,
      minPopularity: productsWithPopularityCount > 0 ? Math.min(...popularities) : 0,
      totalUnidadesVendidas: cantidadesVendidas.reduce((a: number, b: number) => a + b, 0),
      averageCantidadVendidos: productsWithPopularityCount > 0 ? 
        cantidadesVendidas.reduce((a: number, b: number) => a + b, 0) / productsWithPopularityCount : 0,
      maxCantidadVendidos: cantidadesVendidas.length > 0 ? Math.max(...cantidadesVendidas) : 0
    };
    
    console.log('Stats result:', stats);

    const response = {
      success: true,
      data: {
        products: Array.isArray(products) ? products : [products],
        stats
      }
    };

    console.log('Final response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("Error en popularity-stats:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 