import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { fetchProductosPrecios } from "@/lib/fetchProductosPrecios";
import productosTraidosSistemaFritzSport from "@/config/productos-sistema-busca-tu-taba";

// Endpoint para obtener precios de un producto específico
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sku = searchParams.get("sku");

    if (!sku) {
      return NextResponse.json({ ok: false, error: "SKU is required" }, { status: 400 });
    }

    // Buscar producto en Sanity
    const productsRaw = await client.fetch(
      groq`*[_type == "product" && sku == $sku && empresa == "fritz_sport"] {
        _id,
        sku,
        name,
        genero,
        tipo,
        marca,
        activo,
        ninos_talla_grande
      }`,
      { sku }
    );

    if (!productsRaw || productsRaw.length === 0) {
      return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
    }

    // Obtener precios del sistema
    const productosConPrecios = await fetchProductosPrecios(productsRaw, "01");
    const productosSistema = productosTraidosSistemaFritzSport(
      productosConPrecios,
      undefined,
      "LIMA",
      undefined,
      undefined
    );

    if (productosSistema.length === 0) {
      return NextResponse.json({ ok: false, error: "No prices found" }, { status: 404 });
    }

    const producto = productosSistema[0];

    // Verificar que tenga stock disponible
    const hasStock = producto.stock > 0 || producto.stockDisponible > 0;

    return NextResponse.json({
      ok: true,
      hasStock,
      product: {
        priceecommerce: producto.priceecommerce,
        precio_retail: producto.precio_retail,
        priceemprendedor: producto.priceemprendedor,
        precio_emprendedor: producto.precio_emprendedor,
        mayorista_cd: producto.mayorista_cd,
        precio_mayorista: producto.precio_mayorista,
        stock: producto.stock,
        stockDisponible: producto.stockDisponible,
        tallascatalogo: producto.tallascatalogo,
      },
    });
  } catch (e: any) {
    console.error("Error fetching prices:", e);
    return NextResponse.json({ ok: false, error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
