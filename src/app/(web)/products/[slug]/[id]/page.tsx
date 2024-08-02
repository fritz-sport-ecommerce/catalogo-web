// import { Metadata } from "next";
// import { Metadata } from "next";
// export const fetchCache = "force-no-store";
// export const revalidate = 0; // seconds
// export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// import { metadataPage } from "@/config/generateMetadata";
import { SanityProduct } from "@/config/inventory";
import { precioProduct } from "@/config/precio-product";

import CarouselProductRelacionados from "@/components/carousel-product/carousel-product-relacionados";

import { ProductGalleryDesk } from "@/components/product-gallery-desk";
import { ProductInfo } from "@/components/product-info";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionDescription } from "@/components/acordion-details/acordion-description";
import { AccordionDetails } from "@/components/acordion-details/acordion-details";
import { FiltroGlobal, FiltroViewProduct } from "@/utilits/filtro-products";
import { notFound } from "next/navigation";
import Descuentos from "@/config/descuentos";

interface Props {
  params: {
    slug: string;
    id: string;
  };
}

// export const generateMetadata = async ({
//   params,
// }: Props): Promise<Metadata> => {
//   let meta = await metadataPage({ params });
//   return meta;
// };

export default async function Page({ params }: Props) {
  const productFilter = FiltroViewProduct(params);
  const product = await client.fetch<SanityProduct>(groq`${productFilter} {
    _id,
    _createAt,
    "id":_id,
    name,
    sku,
    marca,
    images,
    priceecommerce,
              priceemprendedor,
          pricemayorista,
    currency,
    description,
    sizes,
    categories,
    detalles,
    colors,
    genero,
    tipo,
    descuento,
    tallas,
    preciomanual,
    "slug":slug.current
  }`);

  if (!product) {
    return notFound();
  }
  const productosGenero = async () => {
    const order = `| order(_id) [0...10]`;

    const productFilter = FiltroGlobal();

    const generoFilterHombre = `${product?.genero}`
      ? `&& genero in ["${product?.genero}","unisex"] && marca match "${
          product?.marca
        }" && images != undefined && sku != "${product?.sku.trim()}"`
      : "";
    const filter = `*[${productFilter}${generoFilterHombre}]`;

    // await seedSanityData()
    const products = await client.fetch(`${filter} ${order} {
          _id,
          _createdAt,
          name,
          sku,
          images,
          marca,
          priceecommerce,
          description,
          priceemprendedor,
          pricemayorista,
          descuento,
          tipo,
          genero,
          detalles,
          descuento,
          preciomanual,
          "slug":slug.current
        }`);

    return products;
  };

  const products = await productosGenero();
  let descuentos = await Descuentos();
  return (
    <>
      <main className=" mb-0 xl:pt-16  z-[1]">
        <div className="">
          {/* Product */}
          {/* <PushIntereses users={user} product={product}></PushIntereses> */}
          <div className=" w-full xl:flex 2xl:pb-20">
            {/* precio y nombre */}
            <div className=" sticky top-20  z-10 border-b-[1px]  border-blue-gray-300 bg-white text-black dark:bg-black dark:text-white xl:hidden">
              {/* <div className=" xl:block">
                <BreadcrumbsDefault product={product} />
              </div> */}
              <div className=" flex w-full items-center justify-center  px-4 py-2 ">
                <h1 className="text-sm sm:text-lg font-bold text-center uppercase tracking-tight 2xl:text-3xl">
                  {product?.name} - {product?.genero}
                </h1>
              </div>
                <div className="">
                  <p className=" mr-2 font-semibold  tracking-tight   text-xs p-0 text-center">
                 P. Ecommerce:   S/{product?.priceecommerce}
                  </p>
                  <br />
                      <p className=" mr-2 font-semibold  tracking-tight   text-xs p-0 text-center">
                 P. Mayorista:   S/{product?.pricemayorista}
                  </p>
                  <br />
                           <p className=" mr-2 font-semibold  tracking-tight   text-xs p-0 text-center">
                 P. Emprendedor:   S/{product?.priceemprendedor}
                  </p>
                  {/* <p className="tracking-tight 2xl:text-3xl ">
                    S/
                    {precioProduct(
                      product?.descuento,
                      product?.priceecommerce,
                      product?.preciomanual,
                      descuentos
                    )}
                  </p> */}
                </div>
            </div>
            {/* Product gallery */}
            <div>
              {/* <div className="hidden border-b-[1px] border-blue-gray-300 text-black dark:text-white  xl:block  xl:border-none xl:border-transparent">
                <BreadcrumbsDefault product={product} />
              </div> */}
              <ProductGalleryDesk product={product} />

              {/* acordion */}

              <Accordion type="single" collapsible className="my-10">
                <AccordionItem value={`item-}`}>
                  <AccordionTrigger>
                    <span className="w-full ">
                      <span className="ml-1 text-xs xl:text-base   uppercase text-black dark:text-gray-400">
                        Descripción
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className=" space-y-4  ">
                      <div
                        className={`flex items-center justify-center space-x-2 py-10`}
                      >
                        <AccordionDescription product={product} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {product.detalles && (
                  <AccordionItem value={`items-}`}>
                    <AccordionTrigger>
                      <span className="w-full">
                        <span className="ml-1 text-xs xl:text-base   uppercase text-black dark:text-gray-400">
                          Detalles
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className=" space-y-4  ">
                        <div
                          className={`flex items-center justify-center space-x-2 py-10 `}
                        >
                          <AccordionDetails product={product} />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>

            {/* Product info */}
            <ProductInfo product={product} descuentos={descuentos} />
          </div>
        </div>
      </main>

      {/* <RoomReview roomId={product._id}></RoomReview> */}
      <div className="mt-10">
        <h5 className="text-center text-2xl uppercase">MAS PRODUCTOS</h5>

        <CarouselProductRelacionados
          descuentos={descuentos}
          products={products}
        />
      </div>
    </>
  );
}
