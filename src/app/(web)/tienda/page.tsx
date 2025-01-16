

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { FiltroProducts } from "@/utilits/filtro-products";
import { SanityProduct } from "@/config/inventory";
import { cn } from "@/lib/utils";
import { ProductFilters } from "@/components/product-filters";
import  ProductGrid  from "@/components/product/product-card/product-grid";
import { MainSort } from "@/components/product-sort";

import { Metadata } from "next";
import { FiltroGlobal } from "@/utilits/filtro-products";
import Descuentos from "@/config/descuentos";




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
  const start = searchParams.start ? parseInt(searchParams.start) : 0;

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
  const subgeneroFilter = subgenero ? `&& subgenero_ninos match "${subgenero}"` : "";

  const coleccionFilter = coleccion
    ? `&& coleccion match "${coleccion}"`
    : "";
  const searchFilter = search
    ? `&& name match "${search}" || sku match "${search}" || genero match "${search}"|| marca match "${search}"|| tipo match "${search}"|| category match "${search}"|| color match "${search}" || coleccion match "${search}" && categories != "originals" `
    : "";

    const filter = `*[${productFilter}${colorFilter}${categoryFilter}${sizeFilter}${searchFilter}${generoFilter}${tipoFilter}${marcaFilter}${coleccionFilter}${tallaFilter}${subgeneroFilter}&& pricemayorista != 0 && priceemprendedor != 0] | order(_createdAt desc)`;
 
    
  async function fetchNextPage() {


    // Función para obtener productos y productos similares
     const fetchProducts = async (filter: string, order: string) => {
      // Obtener productos principales

      const products = await client.fetch<SanityProduct[]>(
        groq`${filter} ${order} {
          _id,
          _createdAt,
          name,
          sku,
          images,
          priceecommerce,
           priceemprendedor,pricemayorista,
          description,
          genero,
          subgenero_ninos,
          tipo,
          coleccion,
          marca,
          descuento,
          color,
          razonsocial,
          descuentosobred,
          tallas,
          preciomanual,
          "slug": slug.current
        }[${start}..${start + 11}]`
      );
      const AllProducts = products.filter(
        (newProduct, index, self) =>
          index === self.findIndex((p) => p.sku === newProduct.sku)
      );
      
      // Para cada producto, obtener productos similares basados en el nombre
      // const productsWithSimilar = await Promise.all(
      //   products.map(async (product) => {
      //     const filtroProduct = FiltroProducts(product)
      //     const allProducts = await client.fetch<SanityProduct[]>(
      //       groq`*[${filtroProduct}] {
      //         _id,
      //         name,
      //         sku,
      //         images,
      //         marca,
      //         genero,
      //         priceecommerce,
      //         "slug": slug.current
      //       }[0..4]` // Limitar a 5 productos similares
      //     );
      //    // Filtra productos duplicados
      //    const similarProducts = allProducts.filter(
      //     (newProduct, index, self) =>
      //       index === self.findIndex((p) => p.sku === newProduct.sku)
      //   );
      //     return {
      //       ...product,
      //       similarProducts, // Agregar los productos similares
      //     };
      //   })
      // );
      //     // Filtra productos duplicados
      //     const uniqueProducts = productsWithSimilar.filter(
      //       (newProduct, index, self) =>
      //         index === self.findIndex((p) => p.sku === newProduct.sku)
      //     );
    
          return AllProducts;
      // return productsWithSimilar;
    };

    const products = await fetchProducts(filter,order)



    if(searchFilter){
        if (products.length == 2 )  {
           return [products[0]]
         }else{
          // if(search === "IF1347"){
          //   return []
          // }else{

          //   return products
          // }
       
      
             return products
           
          
         }

    
    }else{
  
      return products;

    }
  }
  const products = await fetchNextPage();
 
  let descuentos = await Descuentos();


  return (
    <div>

  <MainSort/>
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
        </main>
      </div>
    </div>
  );
}
