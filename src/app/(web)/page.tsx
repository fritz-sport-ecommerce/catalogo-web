import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import InfiniteProductGrid from "@/components/busca-tu-taba/InfiniteProductGrid";
import ProductGridSkeleton from "@/components/busca-tu-taba/ProductGridSkeleton";
import OnboardingSkeleton from "@/components/busca-tu-taba/OnboardingSkeleton";
import { FiltroGlobal } from "@/utils/filtro-products-slider-home";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoadingSpinner from "./loading";
import Descuentos from "@/config/descuentos";
import QuickFilters from "@/components/busca-tu-taba/quick-filters";
import { fetchProductosPrecios } from "@/lib/fetchProductosPrecios";
import productosTraidosSistemaFritzSport from "@/config/productos-sistema-busca-tu-taba";

interface Props {
  searchParams: {
    start?: string;
    fecha?: string;
    razonsocial?: string;
    priceecommerce?: string;
    precio?: string;
    price?: string;
    talla?: string;
    coleccion?: string;
    color?: string;
    category?: string;
    tipo?: string;
    marca?: string;
    size?: string;
    genero?: string;
    subgenero?: string;
    search?: string;
    sku?: string;
    page?: string;
    rangoPrecio?: string;
    tipoproducto?: string;
    populares?: string; // "true" to filter by popularidad > 1
  };
}

export default async function Page({ searchParams }: Props) {
  const {
    fecha: date,
    precio,
    price,
    color,
    category,
    size,
    search,
    subgenero,
    razonsocial,
    genero,
    coleccion,
    talla,
    marca,
    tipo,
    rangoPrecio: priceRange,
    razonsocial: razonSocial,
    tipoproducto,
    populares,
  } = searchParams;

  const hasStyleSelected = Boolean(category || tipo || populares === "true" || date === "desc");
  const hasGenero = Boolean(genero);
  const hasMarca = Boolean(marca);
  const hasRangoPrecio = Boolean(priceRange);
  const canShowProducts = hasStyleSelected && hasGenero && hasMarca && hasRangoPrecio;

  // Si no hay estilo seleccionado aún, mostrar onboarding y no traer productos
  if (!canShowProducts) {
    const searchKey = JSON.stringify(searchParams);
    return (
      <Suspense fallback={<OnboardingSkeleton />}>
        <div key={searchKey}>
          <main className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center py-6">
                <div className="sticky xl:top-2 top-10 z-20">
                  <a
                    href="/pdf"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-6 py-3 text-base font-semibold shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl"
                  >
                    Ver catálogo completo
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <section className="min-h-[70vh] flex items-start justify-center py-8 lg:py-12">
                <div className="max-w-5xl w-full">
                  <div className="mb-8 lg:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
                      Busca tu Producto
                    </h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-8">
                      Encuentra tus productos ideales en 5 pasos simples
                    </p>
                  </div>
                  
                  <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">¿Cómo funciona?</h2>
                    <ol className="space-y-4 text-base sm:text-lg">
                      <li className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center text-lg">1</span>
                        <span className="pt-1"><strong className="text-gray-900 dark:text-white">Selecciona el tipo:</strong> <span className="text-gray-700 dark:text-gray-300">Calzado, Ropa o Accesorios</span></span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center text-lg">2</span>
                        <span className="pt-1"><strong className="text-gray-900 dark:text-white">Selecciona el género:</strong> <span className="text-gray-700 dark:text-gray-300">Hombre, Mujer, Unisex o Niños</span></span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center text-lg">3</span>
                        <span className="pt-1"><strong className="text-gray-900 dark:text-white">Elige un estilo:</strong> <span className="text-gray-700 dark:text-gray-300">Urbano, Running o Chimpunes</span></span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center text-lg">4</span>
                        <span className="pt-1"><strong className="text-gray-900 dark:text-white">Elige la marca:</strong> <span className="text-gray-700 dark:text-gray-300">Adidas, Nike, Reebok o Fritz Sport</span></span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center text-lg">5</span>
                        <span className="pt-1"><strong className="text-gray-900 dark:text-white">Define tu presupuesto:</strong> <span className="text-gray-700 dark:text-gray-300">Establece el rango de precios</span></span>
                      </li>
                    </ol>
                  </div>
               
                  <div className="flex items-center justify-center">
                    <QuickFilters variant="onboarding" />
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </Suspense>
    );
  }

  const priceSort = price || precio;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const itemsPerPage = 12;
  const start = (page - 1) * itemsPerPage;

  const priceOrder = priceSort ? `mayorista_cd ${priceSort}` : "";
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

  const productFilter = FiltroGlobal();
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
  const razonSocialFilter = razonSocial ? `&& razonsocial == "${razonSocial}"` : "";
  const tipoProductoFilter = tipoproducto ? `&& tipoproducto == "${tipoproducto}"` : "";
  const popularesFilter = populares === "true" ? "&& popularidad > 1" : "";

  const filter = `*[${productFilter}${generoFilter}${colorFilter}${categoryFilter}${searchFilter}${marcaFilter}${coleccionFilter}${tipoFilter}${razonSocialFilter}${tipoProductoFilter}${popularesFilter} && empresa == "fritz_sport"] `;

  // 1. Obtener productos de Sanity (información básica: nombre, imágenes, marca, etc.)
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

  // 2. Obtener precios, tallas y stock del sistema (API)
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

  // 3. Combinar: Información de Sanity + Precios/Tallas/Stock del Sistema
  const productosCombinados = productosSistema.map((productoSistema: any) => {
    const productoSanity = productsRaw.find((p: any) => p.sku === productoSistema.sku);
    
    return {
      // Información básica de Sanity
      ...productoSanity,
      
      // Precios, tallas y stock del Sistema (sobrescribir)
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
      
      // Mantener campos procesados del sistema
      razonsocial: productoSistema.razonsocial,
      tipoproducto: productoSistema.tipoproducto,
      subgenero_ninos: productoSistema.subgenero_ninos,
    };
  });

  let filteredProducts = productosCombinados as any[];
  // Mantener solo productos con precios mayorista, retail y emprendedor
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
      const precio = producto.priceecommerce || 0;
      return precio >= minPrice && precio <= maxPrice;
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
  const products = sortedProducts.slice(start, start + itemsPerPage);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  if (page > totalPages && totalProducts > 0) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) params.set(key, value);
    });
    const redirectUrl = `/?${params.toString()}`;
    redirect(redirectUrl);
  }

  const searchKey = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div key={searchKey}>
        <div>
          <main className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1920px] mx-auto">
              <section aria-labelledby="products-heading" className="pt-6 lg:pt-8">
                <h2 id="products-heading" className="sr-only">Products</h2>
                <div
                  className={cn(
                    "grid grid-cols-1 gap-x-6 lg:gap-x-8 gap-y-8 items-start",
                    products.length > 0 ? "lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]" : "lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]"
                  )}
                >
                  {/* Sidebar Desktop con Filtros */}
                  <div className="hidden lg:block sticky top-20 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
                    <a
                      href="/pdf"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-5 py-3 text-base font-semibold shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl"
                    >
                      Ver catálogo completo
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <QuickFilters />
                  </div>
                  
                  <div id="productos">
                    <Suspense fallback={<ProductGridSkeleton count={12} />}>
                      <InfiniteProductGrid initial={products} total={totalProducts} pageSize={itemsPerPage} />
                    </Suspense>
                  </div>
                </div>
                
                {/* Botón flotante mobile - Solo visible en mobile */}
                <div className="lg:hidden">
                  <QuickFilters />
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
}
