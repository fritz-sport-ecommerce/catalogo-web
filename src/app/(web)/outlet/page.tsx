import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { cn } from "@/lib/utils";
import { ProductFilters } from "@/components/product-filters";
import ProductGridOutlet from "@/components/product/product-card/product-grid-outlet";
import { MainSort } from "@/components/product-sort";
import { Metadata } from "next";
import Descuentos from "@/config/descuentos";
import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";
import Pagination from "@/components/pagination/pagination";
import { FiltroGlobal } from "@/utils/filtro-products-slider-home";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoadingSpinner from "../tienda/loading";

interface Props {
  searchParams: {
    start?: string;
    date?: string;
    fecha?: string; // Agregar soporte para 'fecha'
    razonsocial?: string;
    priceecommerce?: string;
    price?: string;
    precio?: string; // Agregar soporte para 'precio'
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
    priceRange?: string;
    rangoPrecio?: string; // Agregar soporte para 'rangoPrecio'
    discount?: string;
  };
}

export const metadata: Metadata = {
  title: "Super Outlet - HASTA 70% OFF | Fritz Sport",
  description:
    "Descubre los mejores descuentos en productos Fritz Sport. Ofertas exclusivas con descuentos del 30% o más. ¡Precios nunca vistos!",
  keywords:
    "outlet, descuentos, ofertas, Fritz Sport, calzado deportivo, ropa deportiva",
  openGraph: {
    title: "Super Outlet - HASTA 70% OFF | Fritz Sport",
    description:
      "Los mejores descuentos en productos Fritz Sport. Ofertas exclusivas con descuentos del 30% o más.",
    type: "website",
  },
};

// Función para filtrar productos con descuentos >= 50%
function filterProductsWithHighDiscounts(
  products: any[],
  discountRange?: string
) {
  return products.filter((producto) => {
    // Calcular el porcentaje de descuento igual que en ProductPrecioDescuento
    if (!producto?.pricemayorista || !producto?.precio_original) return false;

    const descuento =
      ((producto.precio_original - producto.pricemayorista) /
        producto.precio_original) *
      100;
    const porcentajeDescuento = Math.round(descuento);

    // Filtro base: mínimo 30% de descuento
    if (porcentajeDescuento < 30) return false;

    // Filtro por stock: solo productos con stock > 0
    if (producto.stock <= 0) return false;

    // Filtro por rango específico si se proporciona
    if (discountRange) {
      const [min, max] = discountRange.split("-").map(Number);
      return porcentajeDescuento >= min && porcentajeDescuento <= max;
    }

    return true;
  });
}

export default async function OutletPage({ searchParams }: Props) {
  const {
    date,
    fecha,
    price,
    precio,
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
    priceRange,
    rangoPrecio,
    discount,
  } = searchParams;

  // Usar 'date' o 'fecha', dando prioridad a 'date'
  const dateSort = date || fecha || "desc";
  // Usar 'price' o 'precio', dando prioridad a 'price'
  const priceSort = price || precio;
  // Usar 'priceRange' o 'rangoPrecio', dando prioridad a 'priceRange'
  const priceRangeFilter = priceRange || rangoPrecio;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const itemsPerPage = 12;
  const start = (page - 1) * itemsPerPage;

  // Orden personalizado priorizando descuentos más altos
  const priceOrder = priceSort ? `priceecommerce ${priceSort}` : "";
  const dateOrder = dateSort ? `_createAt ${dateSort}` : "";

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
  // Filtro base para productos Fritz Sport (empresa != "fz_premium")
  const filter = `*[${productFilter}${generoFilter}${colorFilter}${categoryFilter}${searchFilter}${marcaFilter}${coleccionFilter}${tipoFilter} && empresa == "fritz_sport"  ] `;

  // Obtener más productos para filtrar por descuentos
  const productsRaw = await client.fetch(
    groq`${filter} ${order}[0...200] {
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
      color,
      linea_liquidacion,
      imgcatalogomain,
      imagescatalogo,
      categories,
      preciomanual,
      popularidad,
      fechaIngreso,
      "slug": slug.current
    }`
  );

  // Procesar productos con precios del sistema Fritz Sport
  let allProductsWithPrices = [];
  if (talla) {
    const validProducts = (
      await productosTraidosSistemaFritzSport(productsRaw, "LIMA", razonsocial)
    ).filter((producto: any) => {
      return (
        producto.tallas &&
        producto.tallas.some((t: any) => String(t.talla) === talla)
      );
    });
    allProductsWithPrices = validProducts;
  } else {
    allProductsWithPrices = await productosTraidosSistemaFritzSport(
      productsRaw,
      "LIMA",
      razonsocial
    );
  }

  // Filtrar productos con descuentos >= 30% y por rango específico
  let filteredProducts = filterProductsWithHighDiscounts(
    allProductsWithPrices,
    discount
  );

  // Aplicar filtro de rango de precios si existe
  if (priceRangeFilter) {
    const [minPrice, maxPrice] = priceRangeFilter.split("-").map(Number);
    filteredProducts = filteredProducts.filter((producto) => {
      const precio = producto.priceecommerce || 0;
      return precio >= minPrice && precio <= maxPrice;
    });
  }

  // Ordenar productos: primero por stock, luego por precio si se especifica
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

  // Paginación de productos filtrados y ordenados
  const totalProducts = sortedProducts.length;
  const products = sortedProducts.slice(start, start + itemsPerPage);

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

    const redirectUrl = `/outlet${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    redirect(redirectUrl);
  }

  let descuentos = await Descuentos();

  // Generar una clave única basada en los parámetros de búsqueda
  const searchKey = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div key={searchKey}>
        {/* Header especial para Outlet */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-8 mb-6">
          <div className="container mx-auto text-center">
            <h1 className="text-xl md:text-6xl font-black mb-4">
              {" "}
              HASTA 70% OFF{" "}
            </h1>
            {/* <p className="text-xl mb-4">
              Solo productos Fritz Sport con descuentos del 30% o más
            </p> */}
            <div className="text-sm font-medium">
              {totalProducts} productos encontrados con súper descuentos
            </div>
          </div>
        </div>

        <MainSort />
        <div>
          <main className="w-full px-6">
            <section aria-labelledby="products-heading" className="flex pt-6">
              <h2 id="products-heading" className="sr-only">
                Productos Outlet
              </h2>
              <div
                className={cn(
                  "grid-cols-1 gap-x-8 gap-y-10 hidden",
                  products.length > 0
                    ? "lg:grid-cols-[1fr_3fr]"
                    : "lg:grid-cols-[1fr_3fr]"
                )}
              >
                <div className="hidden lg:block">
                  <ProductFilters />
                </div>
              </div>
              <ProductGridOutlet
                start={start}
                descuentos={descuentos}
                outlet={true}
                products={products}
                generoSku={true}
                filter={filter}
                order={order}
              />
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
