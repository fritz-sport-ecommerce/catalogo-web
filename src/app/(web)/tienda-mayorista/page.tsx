// export const fetchCache = "force-no-store";
// export const revalidate = 0; // seconds
// export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import { cn } from "@/lib/utils";
import { ProductFilters } from "@/components/product-filters";
import { ProductFiltersMayorista } from "@/components/product-filters-mayorista";
import ProductGrid from "@/components/product/product-card/product-grid";
import { MainSort } from "@/components/product-sort";

import { Metadata } from "next";
import { storeMetadata } from "@/config/seo-config";

import Descuentos from "@/config/descuentos";
import productosTraidosSistemaFritzSportMayorista from "@/config/productos-traidos-sistema-fritz-sport-mayorista";
import Pagination from "@/components/pagination/pagination";
import { FiltroGlobal } from "@/utils/filtro-products-slider-home";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoadingSpinner from "./loading";

interface Props {
  searchParams: {
    start?: string;
    fecha?: string;
    razonsocial?: string;
    priceecommerce?: string;
    precio?: string;
    price?: string; // Agregar soporte para 'price'
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
    rangoPrecio?: string; // Nuevo parámetro para rango de precios
    linea?: string; // Nuevo parámetro para filtro de línea/liquidación
    tipoproducto?: string; // Parámetro para tipo de producto
  };
}

export const metadata: Metadata = storeMetadata;

export default async function Page({ searchParams }: Props) {
  const {
    fecha: date = "desc",
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
    rangoPrecio: priceRange, // Nuevo parámetro
    linea, // Nuevo parámetro para filtro de línea/liquidación
    razonsocial: razonSocial, // Parámetro para razón social
    tipoproducto, // Parámetro para tipo de producto
  } = searchParams;

  // Usar 'price' o 'precio', dando prioridad a 'price'
  const priceSort = price || precio;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const itemsPerPage = 12;
  const start = (page - 1) * itemsPerPage;

  // 1. Fragmentos de orden sin incluir "| order(...)"
  const priceOrder = priceSort ? `priceecommerce ${priceSort}` : "";
  const dateOrder = date ? `_createAt ${date}` : "";

  // 2. Criterios personalizados de orden - usando valores numéricos para ordenamiento
  const orderCriteria = [
    'select(marca == "fritzsport" => 1, 0) desc',
    "select(popularidad > 1 => 1, 0) desc",
    priceOrder,
    dateOrder,
  ]
    .filter(Boolean)
    .join(", ");

  // 3. Concatenar todos los criterios en una única cláusula | order(...)
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
  // Filtro basado en razón social y tipo de producto
  const razonSocialFilter = razonSocial
    ? `&& razonsocial == "${razonSocial}"`
    : "";
  const tipoProductoFilter = tipoproducto
    ? `&& tipoproducto == "${tipoproducto}"`
    : "";
  
  const filter = `*[${productFilter}${generoFilter}${colorFilter}${categoryFilter}${searchFilter}${marcaFilter}${coleccionFilter}${tipoFilter}${razonSocialFilter}${tipoProductoFilter} && empresa == "fritz_sport"  ] `;
  // console.log(filter, "filtro de productos");

  // 1. Traer TODOS los productos que coincidan con el filtro (sin paginación)
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
      preciomanual,
      popularidad,
      fechaIngreso,
      "slug": slug.current
    }`
  );

  // 2. Procesar TODOS los productos con productosTraidosSistemaFritzSportMayorista (SOLO ALMACÉN 0009)
  let allProcessedProducts = [];
  if (talla) {
    const validProducts = (
      await productosTraidosSistemaFritzSportMayorista(productsRaw, "LIMA", razonSocial)
    ).filter((producto:any) => {
      return (
        producto.tallas &&
        producto.tallas.some((t:any) => String(t.talla) === talla)
      );
    });
    allProcessedProducts = validProducts;
  } else {
    allProcessedProducts = await productosTraidosSistemaFritzSportMayorista(
      productsRaw,
      "LIMA",
      razonSocial
    );
  }

  // 3. Aplicar filtro de rango de precios si existe
  let filteredProducts = allProcessedProducts;
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    filteredProducts = allProcessedProducts.filter((producto: any) => {
      const precio = producto.priceecommerce || 0;
      return precio >= minPrice && precio <= maxPrice;
    });
  }

  // 4. Ordenar productos: primero por stock, luego por precio si se especifica
  const sortedProducts = filteredProducts.sort((a: any, b: any) => {
    // Primero ordenar por stock (con stock primero)
    if (a.stock > 0 && b.stock === 0) return -1;
    if (a.stock === 0 && b.stock > 0) return 1;

    // Si ambos tienen el mismo estado de stock, aplicar ordenamiento por precio
    if (priceSort === "asc") {
      return (a.priceecommerce || 0) - (b.priceecommerce || 0);
    }
    if (priceSort === "desc") {
      return (b.priceecommerce || 0) - (a.priceecommerce || 0);
    }

    // Si no hay ordenamiento por precio, mantener el orden original
    return 0;
  });

  // 5. Aplicar paginación DESPUÉS del filtrado y ordenamiento
  const totalProducts = sortedProducts.length;
  const products = sortedProducts.slice(start, start + itemsPerPage);

  let descuentos = await Descuentos();

  // Verificar si la página actual es válida
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Si estamos en una página que no existe (mayor al total de páginas) y hay productos, redirigir a página 1
  if (page > totalPages && totalProducts > 0) {
    const params = new URLSearchParams();

    // Mantener todos los filtros pero resetear la página a 1
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        params.set(key, value);
      }
    });

    const redirectUrl = `/tienda${params.toString() ? `?${params.toString()}` : ""}`;
    redirect(redirectUrl);
  }

  // Generar una clave única basada en los parámetros de búsqueda
  const searchKey = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div key={searchKey}>
        {/* Banner de Tienda Mayorista */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Tienda Mayorista</h1>
                <p className="text-blue-100 text-sm mt-1">
                  Productos exclusivos del almacén Iquitos (0009) - Solo para mayoristas
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-blue-500 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium">Almacén 0009</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <MainSort />
        <div>
          <main className="w-full px-6">
            <section aria-labelledby="products-heading" className="pt-6">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>
              <div
                className={cn(
                  "grid grid-cols-1 gap-x-8 gap-y-10",
                  products.length > 0
                    ? "lg:grid-cols-[1fr_3fr]"
                    : "lg:grid-cols-[1fr_3fr]"
                )}
              >
                <div className="block">
                  <ProductFiltersMayorista mayorista={true} />
                </div>
                <div>
                  <ProductGrid
                    start={start}
                    descuentos={descuentos}
                    outlet={false}
                    products={products}
                    generoSku={true}
                    filter={filter}
                    order={order}
                  />
                </div>
              </div>
            </section>

            <Pagination
              currentPage={page}
              itemsPerPage={itemsPerPage}
              totalItems={totalProducts}
            />
          </main>
        </div>
      </div>
    </Suspense>
  );
}
