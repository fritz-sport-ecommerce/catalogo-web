export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import { SanityProduct } from "@/config/inventory";
import { cn } from "@/lib/utils";
import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import { ProductSort } from "@/components/product-sort";

import { Metadata } from "next";
import { FiltroGlobal } from "@/utilits/filtro-products";
import Descuentos from "@/config/descuentos";

interface Props {
  searchParams: {
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
    tipoproducto?: string;
    genero?: string;
    razonsocial?: string;
    search?: string;
    sku?: string;
  };
}
export const metadata: Metadata = {
  title: "Fritz Sport Perú Tienda oficial | Zapatillas y ropa deportiva",
  description:
    "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra en esta tienda online zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
  openGraph: {
    title: " Fritz Sport Perú Tienda oficial | Zapatillas y ropa deportiva",
    description:
      "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra en esta tienda online zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
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
  async function fetchNextPage() {
    const {
      date = "desc",
      price,
      priceecommerce,
      color,
      category,
      size,
      search,
      razonsocial,
      genero,
      coleccion,

      tipoproducto,
      talla,
      marca,
      tipo,
    } = searchParams;

    const priceOrder = price ? `| order(priceecommerce ${price}) ` : "";

    const dateOrder = date ? `| order(_createAt ${date})` : "";

    const order = `${priceOrder}${dateOrder}`;

    const productFilter = FiltroGlobal();
    const colorFilter = color ? `&& color match "${color}"` : "";
    const tipoFilter = tipo ? `&& tipo match "${tipo}"` : "";
    const marcaFilter = marca ? `&& marca match "${marca}"` : "";
    const razon = razonsocial ? `&& razonsocial match "${razonsocial}"` : "";
    const tipo_producto = tipoproducto ? `&& tipoproducto match "${tipoproducto}"` : "";
    const tallaFilter = talla ? `&& count(tallas[talla == "${talla}"])>0` : "";

    const categoryFilter = category ? `&& "${category}" match categories` : "";

    const sizeFilter = size ? `&& tallas match "tallas"` : "";
    const generoFilter = genero ? `&& genero in ["${genero}","unisex"] ` : "";
    const coleccionFilter = coleccion
      ? `&& coleccion match "${coleccion}"`
      : "";
    const searchFilter = search
      ? `&& name match "${search}" || sku match "${search}" || genero match "${search}"|| marca match "${search}"|| tipo match "${search}"|| category match "${search}"|| color match "${search}" || coleccion match "${search}" && categories != "originals" `
      : "";

    const filter = `*[${productFilter}${colorFilter}${categoryFilter}${sizeFilter}${searchFilter}${generoFilter}${tipoFilter}${marcaFilter}${coleccionFilter}${tallaFilter}${razon}${tipo_producto}] | order(_createdAt desc)`;

    // await seedSanityData()

    const products = await client.fetch<SanityProduct[]>(
      groq`${filter} ${order} {
      _id,
      _createdAt,
      name,
      sku,
      images,
      priceecommerce,
      description,
      stock,
      genero,
      tipo,
      coleccion,
      marca,
      descuento,
      color,
      priceemprendedor,
      tipoproducto,
      pricemayorista,
      razonsocial,
      tallas,
      preciomanual,
      "slug":slug.current
    } `
    );
    // console.log(priceecommerce)
    if(searchFilter){
      if (products[0].stock === 0) {
        return [];
      }else{
        return [products[0]]

      }
    }else{
      return products;

    }
  
  }
  const products = await fetchNextPage();
  // console.log(products[0].tallas)

  // console.log(productos);
  let descuentos = await Descuentos();

  return (
    <div>
      <div className="sticky top-[80px] z-20 h-full w-full  xl:top-[101px] border-b-[1px] border-blue-gray-700/20">
        <div className=" flex  w-full items-center justify-between bg-white  px-6 py-4   dark:bg-background">
          <h1 className="text-xl font-bold tracking-tight sm:text-xl">
            {/* {products.length}
            <span className="ml-2 ">
              Producto{products.length > 1 && "s"}
            </span> */}
            <span>Filtrar por:</span>
          </h1>
          {/* Product Sort */}
          <ProductSort />
        </div>
      </div>
      <div>
        <main className=" w-full px-6">
          <section
            aria-labelledby="products-heading"
            className="flex pb-24 pt-6"
          >
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
              descuentos={descuentos}
              outlet={false}
              products={products}
              generoSku={true}
            />
            {/* Product grid */}
          </section>
        </main>
      </div>
    </div>
  );
}
