import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// Endpoint de fallback rápido que solo usa Sanity (sin API externa)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const itemsPerPage = Math.min(Number(searchParams.get("limit") || "6"), 12);

    const date = searchParams.get("fecha") || undefined;
    const category = searchParams.get("category") || undefined;
    const genero = searchParams.get("genero") || undefined;
    const marca = searchParams.get("marca") || undefined;
    const tipo = searchParams.get("tipo") || undefined;
    const priceRange = searchParams.get("rangoPrecio") || undefined;

    // Order criteria
    const dateDir = date === 'asc' || date === 'desc' ? date : 'desc';
    const dateOrder = `coalesce(fecha_cuando_aparece, _createdAt) ${dateDir}`;
    const order = `| order(${dateOrder})`;

    // Filters
    const productFilter = "_type == 'product'";
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

    const filter = `*[${productFilter}${generoFilter}${categoryFilter}${marcaFilter}${tipoFilter} && empresa == "fritz_sport"][0...50] `;

    // Fetch datos de Sanity únicamente
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
        preciomanual,
        "slug": slug.current
      }`
    );

    // Procesar productos con precios de Sanity
    const productosProcesados = productsRaw.map((producto: any) => ({
      ...producto,
      priceecommerce: producto.preciomanual || 0,
      precio_retail: producto.preciomanual || 0,
      priceemprendedor: producto.preciomanual || 0,
      precio_emprendedor: producto.preciomanual || 0,
      mayorista_cd: producto.preciomanual || 0,
      precio_mayorista: producto.preciomanual || 0,
      stock: 1,
      stockDisponible: 1,
      tallas: [],
      tallascatalogo: "",
      talla_sistema: "",
      provincias: []
    }));

    // Filtrar por rango de precio si se especifica
    let productosFiltrados = productosProcesados;
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      productosFiltrados = productosProcesados.filter((producto: any) => {
        const precio = producto.priceecommerce || 0;
        return precio >= minPrice && precio <= maxPrice;
      });
    }

    // Paginación
    const totalProducts = productosFiltrados.length;
    const start = (page - 1) * itemsPerPage;
    const pageItems = productosFiltrados.slice(start, start + itemsPerPage);

    const result = {
      ok: true,
      total: totalProducts,
      page,
      pageSize: itemsPerPage,
      products: pageItems,
    };
    
    console.log('📋 Fallback endpoint - Respuesta:', {
      ok: result.ok,
      total: result.total,
      productsLength: result.products.length,
      firstProduct: result.products[0] ? {
        _id: result.products[0]._id,
        sku: result.products[0].sku,
        name: result.products[0].name
      } : null
    });
    
    return NextResponse.json(result);
  } catch (e: any) {
    console.error('📋 Fallback endpoint error:', e);
    return NextResponse.json({ ok: false, error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
