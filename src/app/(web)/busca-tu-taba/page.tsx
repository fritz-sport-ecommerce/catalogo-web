import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import InfiniteProductGrid from "@/components/busca-tu-taba/InfiniteProductGrid";
import { FiltroGlobal } from "@/utils/filtro-products-slider-home";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoadingSpinner from "./loading";
import Descuentos from "@/config/descuentos";
import QuickFilters from "@/components/busca-tu-taba/quick-filters";

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
      <Suspense fallback={<LoadingSpinner />}>
        <div key={searchKey}>
          {/* <div className="bg-gradient-to-r from-yellow-500 to-red-500 text-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl md:text-3xl font-extrabold">Busca tu Taba</h1>
              <p className="text-yellow-100 text-sm mt-2">Paso 1: Elige un estilo. Paso 2: Selecciona género. Paso 3: Elige la marca. Paso 4: Define tu presupuesto.</p>
            </div>
          </div> */}
          <main className="w-full px-6">
         <div className="flex items-center justify-center">
          
            <div className="sticky xl:top-2 top-10 z-20 mb-4">
                  <a
                    href="/pdf"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-md bg-blue-100 text-blue-700 px-4 py-2 text-sm font-semibold border border-blue-200 shadow-sm hover:bg-blue-200"
                  >
                    Ver catálogo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
          </div> 
            <section className="min-h-[70vh] flex items-start justify-center py-8">
              <div className="max-w-3xl w-full">
                <div className="mb-6 p-4 rounded-lg bg-white dark:bg-gray-900 border text-gray-800 dark:text-gray-200">
                  <ol className="space-y-3 text-base md:text-lg">
                    <li><strong>1.</strong> Elige un estilo (Urbano, Running, Chimpunes). Se seleccionará automáticamente tipo "calzado".</li>
                    <li><strong>2.</strong> Selecciona el género.</li>
                    <li><strong>3.</strong> Elige la marca.</li>
                    <li><strong>4.</strong> Define el rango de precios.</li>
                  </ol>
                </div>
             
                <div className="flex items-center justify-between gap-3 mb-4">
                  <QuickFilters variant="onboarding" />
                </div>
              </div>
            </section>
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

  const filter = `*[${productFilter}${generoFilter}${colorFilter}${categoryFilter}${searchFilter}${marcaFilter}${coleccionFilter}${tipoFilter}${razonSocialFilter}${tipoProductoFilter}${popularesFilter} && empresa == "fritz_sport" && mayorista_cd > 0 && priceecommerce > 0 && priceemprendedor > 0  ] `;

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
      linea_liquidacion,
      imagescatalogo,
      categories,
      tallas,
      preciomanual,
      priceecommerce,
      mayorista_cd,
      "pricemayorista": mayorista_cd,
      priceemprendedor,
      stock,
      razonsocial,
      popularidad,
      fechaIngreso,
      "slug": slug.current
    }`
  );
  // Solo Sanity: aplicar filtros adicionales en servidor
  let filteredProducts = productsRaw as any[];
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
    const redirectUrl = `/busca-tu-taba${params.toString() ? `?${params.toString()}` : ""}`;
    redirect(redirectUrl);
  }

  const searchKey = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div key={searchKey}>
        {/* Banner */}
        {/* <div className="bg-gradient-to-r from-yellow-500 to-red-500 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold">Busca tu Taba</h1>
                <p className="text-yellow-100 text-sm mt-1">Encuentra rápido por estilos y precio</p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium">Simple e intuitivo</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div>
          <main className="w-full px-6">
            <section aria-labelledby="products-heading" className="pt-6">
              <h2 id="products-heading" className="sr-only">Products</h2>
              <div
                className={cn(
                  "grid grid-cols-1 gap-x-8 gap-y-10",
                  products.length > 0 ? "lg:grid-cols-[320px_1fr]" : "lg:grid-cols-[320px_1fr]"
                )}
              >
                <div className="hidden md:block lg:sticky lg:top-20 self-start space-y-4">
                  <div className="sticky top-0 z-20">
                    <a
                      href="/pdf"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-100 text-blue-700 px-4 py-2 text-sm font-semibold border border-blue-200 shadow-sm hover:bg-blue-200"
                    >
                      Ver catálogo
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <QuickFilters />
                </div>
                <div id="productos">
                  <InfiniteProductGrid initial={products} total={totalProducts} pageSize={itemsPerPage} />
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </Suspense>
  );
}
