import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    console.log('Testing popularity stats API...');
    
    // Prueba simple: contar productos
    const totalProducts = await client.fetch(`count(*[_type == "product"])`);
    console.log('Total products:', totalProducts);
    
    // Prueba: obtener algunos productos con popularidad
    const productsWithPopularity = await client.fetch(`
      *[_type == "product" && defined(popularidad) && popularidad > 0] | order(popularidad desc)[0...5] {
        _id,
        name,
        sku,
        popularidad
      }
    `);
    console.log('Products with popularity:', productsWithPopularity);
    
    // Prueba: obtener productos sin popularidad
    const productsWithoutPopularity = await client.fetch(`
      *[_type == "product" && (!defined(popularidad) || popularidad <= 0)] | order(_createdAt desc)[0...5] {
        _id,
        name,
        sku,
        popularidad
      }
    `);
    console.log('Products without popularity:', productsWithoutPopularity);
    
    return NextResponse.json({
      success: true,
      test: {
        totalProducts,
        productsWithPopularity: productsWithPopularity.length,
        productsWithoutPopularity: productsWithoutPopularity.length,
        sampleWithPopularity: productsWithPopularity,
        sampleWithoutPopularity: productsWithoutPopularity
      }
    });
    
  } catch (error) {
    console.error("Error en test popularity-stats:", error);
    return NextResponse.json(
      { 
        error: "Error en test",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 