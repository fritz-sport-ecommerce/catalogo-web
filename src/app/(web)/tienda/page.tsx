export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { FiltroProducts } from "@/utils/filtro-products";
import { SanityProduct } from "@/config/inventory";
import { cn } from "@/lib/utils";
import { ProductFilters } from "@/components/product-filters";
import ProductGrid from "@/components/product/product-card/product-grid";
import { MainSort } from "@/components/product-sort";

import { Metadata } from "next";
import { FiltroGlobal } from "@/utils/filtro-products";
import Descuentos from "@/config/descuentos";
import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";
import Pagination from "@/components/pagination/pagination";

interface Props {
  searchParams: {
    start?: string;
    date?: string;
    priceecommerce?: string;
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
    page?: string; // Añadimos parámetro de página
  };
}
export const metadata: Metadata = {
  title: "Fritz Sport Perú Sitio Web ofical | Zapatillas y ropa deportiva",
  description:
    "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra Nuestro catalogo digital de zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
  openGraph: {
    title: " Fritz Sport Perú Sitio Web ofical | Zapatillas y ropa deportiva",
    description:
      "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra Nuestro catalogo digital de zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
    url: `${process.env.URL_DOMINIO}`,
    siteName: "Fritz Sport",
    images: [
      {
        url: `${process.env.URL_DOMINIO}/ecommerce-share.jpg`,
        width: 800,
        height: 600,
        alt: `Fritz Sport share Imagen`,
      },
      {
        url: `${process.env.URL_DOMINIO}/ecommerce-share.jpg`,

        width: 1200,
        height: 630,
        alt: `Fritz Sport share Imagen`,
      },
    ],
  },
};
export default async function Page({ searchParams }: Props) {
  const {
    date = "desc",
    price,
    priceecommerce,
    color,
    category,
    size,
    search,
    subgenero,
    genero,
    coleccion,
    talla,
    marca,

    tipo,
  } = searchParams;
  const page = searchParams.page ? parseInt(searchParams.page) : 1; // Nueva variable de página
  const itemsPerPage = 12; // Cantidad de items por página

  // Calculamos el start correctamente
  const start = (page - 1) * itemsPerPage;

  const priceOrder = price ? `| order(priceecommerce ${price}) ` : "";

  const dateOrder = date ? `| order(_createAt ${date})` : "";

  const order = `${priceOrder}${dateOrder}`;

  const productFilter = FiltroGlobal();
  const colorFilter = color ? `&& color match "${color}"` : "";
  const tipoFilter = tipo ? `&& tipo match "${tipo}"` : "";
  const marcaFilter = marca ? `&& marca match "${marca}"` : "";
  const tallaFilter = talla ? `&& count(tallas[talla == "${talla}"])>0` : "";

  const categoryFilter = category ? `&& "${category}" match categories` : "";

  const sizeFilter = size ? `&& tallas match "tallas"` : "";
  const generoFilter = genero ? `&& genero in ["${genero}","unisex"] ` : "";
  const subgeneroFilter = subgenero
    ? `&& subgenero_ninos match "${subgenero}"`
    : "";

  const coleccionFilter = coleccion ? `&& coleccion match "${coleccion}"` : "";
  const searchFilter = search
    ? `&& name match "${search}" || sku match "${search}" || genero match "${search}"|| marca match "${search}"|| tipo match "${search}"|| category match "${search}"|| color match "${search}" || coleccion match "${search}" && categories != "originals" `
    : "";

  const filter = `*[${productFilter}${colorFilter}${categoryFilter}${sizeFilter}${searchFilter}${generoFilter}${marcaFilter}${coleccionFilter} && empresa != "fz_premium"] | order(_createdAt desc)`;

  async function fetchNextPage(itemsPerPage: number, start: number) {
    let totalValidProducts: SanityProduct[] = [];

    const fetchProducts = async (
      filter: string,
      order: string,
      start: number
    ) => {
      const products = await client.fetch<SanityProduct[]>(
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
          color,
          imgcatalogomain,
          imagescatalogo,
          categories,
          preciomanual,
          fechaIngreso,
          "slug": slug.current
        }[${start}...${start + itemsPerPage}]`
      );
      return products;
    };

    while (totalValidProducts.length < itemsPerPage) {
      const products = await fetchProducts(filter, order, start);

      // Si ya no hay más productos para traer desde Sanity, salimos
      if (products.length === 0) break;

      const validProducts = await productosTraidosSistemaFritzSport(
        products,
        "LIMA"
      );
      totalValidProducts = [...totalValidProducts, ...validProducts];

      start += itemsPerPage; // avanzar al siguiente bloque de productos
    }

    // Devolver solo los primeros 12 válidos (por si obtuvimos más)
    return totalValidProducts.slice(0, itemsPerPage);
  }
  const products = await fetchNextPage(itemsPerPage, start);

  // console.log(products, "productos traidos sanity");

  let descuentos = await Descuentos();
  // NUEVO: obtenemos el total de productos para la paginaciónn
  const totalProducts = await client.fetch<number>(groq`count(${filter})`);

  return (
    <div>
      <MainSort />
      <div>
        <main className=" w-full px-6">
          <section aria-labelledby="products-heading" className="flex  pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>
            <div
              className={cn(
                " grid-cols-1 gap-x-8 gap-y-10 hidden",
                products.length > 0
                  ? "lg:grid-cols-[1fr_3fr]"
                  : "lg:grid-cols-[1fr_3fr]"
              )}
            >
              <div className="hidden lg:block">
                {/*Product filters */}

                <ProductFilters />
              </div>
            </div>
            <ProductGrid
              start={start}
              descuentos={descuentos}
              outlet={false}
              products={products}
              generoSku={true}
              filter={filter}
              order={order}
            />

            {/* Product grid */}
          </section>

          <Pagination
            currentPage={page}
            itemsPerPage={itemsPerPage}
            totalItems={totalProducts}
          />
        </main>
      </div>
    </div>
  );
}
