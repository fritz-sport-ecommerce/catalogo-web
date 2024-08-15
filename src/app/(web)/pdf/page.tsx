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
import MainPdf from "@/components/pdf/MainPdf";
import { urlForImage } from "@/sanity/lib/image";
import DescargarPdf from "@/components/pdf/DescargarPdf";
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

    const filter = `*[${productFilter}${colorFilter}${categoryFilter}${sizeFilter}${searchFilter}${generoFilter}${tipoFilter}${marcaFilter}${coleccionFilter}${tallaFilter}${razon}${tipo_producto}]| order(_createdAt desc)[0..200]`;

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
      imgcatalogomain,
      imagescatalogo,
      categories,
      coleccion,
      marca,
      descuento,
      color,
      priceemprendedor,
      tipoproducto,
      pricemayorista,
      tallascatalogo,
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
  const catalogo = await client.fetch<SanityProduct[]>(
    groq`*[_type == "catalogo"] {
    catalogospdf
    }[0].catalogospdf`
  );
  const pdf = await client.fetch<SanityProduct[]>(
    groq`*[_type == "catalogo"]{
  
  pdf
  ,
  _id
    }[0].pdf.asset._ref`
  );
  // const getUrlFromId = () => {
  //   // Example ref: file-207fd9951e759130053d37cf0a558ffe84ddd1c9-mp3
  //   // We don't need the first part, unless we're using the same function for files and images
  //   const [_file, id, extension] = pdf.split('-');
  //   return `https://cdn.sanity.io/files/ibvmpbc1/production/${id}.${extension}`
  // }
  
  console.log(catalogo);

  // console.log(getUrlFromId());

  
  return (
    <div>
        {/* <object className='w-[100vw] h-[100vh]' data={getUrlFromId()} type="application/pdf"></object> */}


      <div>
      <div className="flex justify-center w-full 2xl:text-2xl xl:text-2xl mt-10 text-xl font-semibold">
              CATALOGO
              </div>
      {/* <MainPdf catalogo={catalogo} items={products} /> */}
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

        
              </div>
            </div>
        
            {/* Product grid */}
            <DescargarPdf catalogo={catalogo}></DescargarPdf>
          </section>
        </main>
      </div>
    </div>
  );
}
