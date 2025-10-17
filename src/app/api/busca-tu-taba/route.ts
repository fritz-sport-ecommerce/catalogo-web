import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { fetchProductosPrecios } from "@/lib/fetchProductosPrecios";
import productosTraidosSistemaFritzSport from "@/config/productos-sistema-busca-tu-taba";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const itemsPerPage = Number(searchParams.get("limit") || "10");

    const date = searchParams.get("fecha") || undefined;
    const precio = searchParams.get("precio") || undefined;
    const price = searchParams.get("price") || undefined;
    const color = searchParams.get("color") || undefined;
    const category = searchParams.get("category") || undefined;
    const size = searchParams.get("size") || undefined;
    const search = searchParams.get("search") || undefined;
    const subgenero = searchParams.get("subgenero") || undefined;
    const razonsocial = searchParams.get("razonsocial") || undefined;
    const genero = searchParams.get("genero") || undefined;
    const coleccion = searchParams.get("coleccion") || undefined;
    const talla = searchParams.get("talla") || undefined;
    const marca = searchParams.get("marca") || undefined;
    const tipo = searchParams.get("tipo") || undefined;
    const priceRange = searchParams.get("rangoPrecio") || undefined;
    const tipoproducto = searchParams.get("tipoproducto") || undefined;
    const populares = searchParams.get("populares") || undefined;

    // Order criteria (same as page)
    const priceSort = price || precio || undefined;
    const priceOrder = priceSort ? `priceecommerce ${priceSort}` : "";
    const dateOrder = date ? `_createAt ${date}` : "";
    const orderCriteria = [
      'select(marca == "fritzsport" => 1, 0) desc',
      "select(popularidad > 1 => 1, 0) desc",
      priceOrder,
      dateOrder,
    ]
      .filter(Boolean)
      .join(", ");
    const order = `| order(${orderCriteria})`;

    // Filters (subset replicated from page)
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
    const razonSocialFilter = razonsocial ? `&& razonsocial == "${razonsocial}"` : "";
    const tipoProductoFilter = tipoproducto ? `&& tipoproducto == "${tipoproducto}"` : "";
    const popularesFilter = populares === "true" ? "&& popularidad > 1" : "";

    const filter = `*[${productFilter}${generoFilter}${colorFilter}${categoryFilter}${searchFilter}${marcaFilter}${coleccionFilter}${tipoFilter}${razonSocialFilter}${tipoProductoFilter}${popularesFilter} && empresa == "fritz_sport"  ] `;

    // 1. Fetch products from Sanity (basic info)
    const productsRaw = await client.fetch(
      groq`${filter} ${order} {
        _id,
        _createdAt,
        name,
        empresa,
        sku,
        images,
        description,
        genero,
        tipo,
        marca,
        linea_liquidacion,
        color,
        imgcatalogomain,
        imagescatalogo,
        categories,
        razonsocial,
        popularidad,
        fechaIngreso,
        activo,
        ninos_talla_grande,
        fecha_cuando_aparece,
        "slug": slug.current
      }`
    );

    // 2. Fetch prices, sizes and stock from system API
    let productosSistema: any[] = [];
    try {
      const productosConPrecios = await fetchProductosPrecios(productsRaw, "01");
      productosSistema = productosTraidosSistemaFritzSport(
        productosConPrecios,
        undefined, // tipoproducto
        "LIMA", // provincia
        undefined, // razonsocial
        undefined // ninos_talla_grande
      );
    } catch (error) {
      console.error("Error fetching productos from sistema:", error);
    }

    // 3. Combine: Sanity info + System prices/sizes/stock
    const productosCombinados = productosSistema.map((productoSistema: any) => {
      const productoSanity = productsRaw.find((p: any) => p.sku === productoSistema.sku);
      
      return {
        // Basic info from Sanity
        ...productoSanity,
        
        // Prices, sizes and stock from System (override)
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
        
        // Keep processed fields from system
        razonsocial: productoSistema.razonsocial,
        tipoproducto: productoSistema.tipoproducto,
        subgenero_ninos: productoSistema.subgenero_ninos,
      };
    });

    let filteredProducts = productosCombinados as any[];
    // Keep only products that have all three prices > 0
    filteredProducts = filteredProducts.filter((p: any) => {
      const retail = Number(p.priceecommerce || 0);
      const mayorista = Number(p.mayorista_cd || 0);
      const emprendedor = Number(p.priceemprendedor || 0);
      return retail > 0 && mayorista > 0 && emprendedor > 0;
    });
    if (talla) {
      filteredProducts = filteredProducts.filter((producto: any) => {
        return producto.tallas && producto.tallas.some((t: any) => String(t.talla) === talla);
      });
    }
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      filteredProducts = filteredProducts.filter((producto: any) => {
        const p = producto.priceecommerce || 0;
        return p >= minPrice && p <= maxPrice;
      });
    }

    const priceSortDir = priceSort as "asc" | "desc" | undefined;
    const sortedProducts = filteredProducts.sort((a: any, b: any) => {
      if (a.stock > 0 && b.stock === 0) return -1;
      if (a.stock === 0 && b.stock > 0) return 1;
      if (priceSortDir === "asc") return (a.priceecommerce || 0) - (b.priceecommerce || 0);
      if (priceSortDir === "desc") return (b.priceecommerce || 0) - (a.priceecommerce || 0);
      return 0;
    });

    const totalProducts = sortedProducts.length;
    const start = (page - 1) * itemsPerPage;
    const pageItems = sortedProducts.slice(start, start + itemsPerPage);

    return NextResponse.json({
      ok: true,
      total: totalProducts,
      page,
      pageSize: itemsPerPage,
      products: pageItems,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
