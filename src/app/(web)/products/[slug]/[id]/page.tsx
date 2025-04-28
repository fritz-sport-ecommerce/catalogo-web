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
import {
  FiltroGlobal,
  FiltroViewProduct,
} from "@/utils/filtro-products-slider-home";
import { notFound } from "next/navigation";
import Descuentos from "@/config/descuentos";
import ContedorCarouselProduct from "@/components/carousel-product/contedor-carousel-product";
import PrecioViewProductMovil from "@/components/product/product-view/precio-view-product-movil";
import ToggleUserRole from "@/context/cambiarRol";
import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";
import CarouselProduct from "@/components/carousel-product/carousel-product";

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
    imgcatalogomain,
    currency,
    description,
    sizes,
    categories,
    detalles,
    colors,
    genero,
    tipo,
    descuentosobred,
    descuento,
    tallas,
    preciomanual,
    "slug":slug.current
  }`);
  // console.log(product);

  const productConPrecioSistema = await productosTraidosSistemaFritzSport(
    [product],
    "LIMA"
  );

  const singleProduct = productConPrecioSistema[0];
  if (!singleProduct) {
    return notFound();
  }
  const productosRelacionadosRopa = async () => {
    const order = `| order(_id) [0...20]`;

    const productFilter = FiltroGlobal();

    const generoFilterHombre = `${product?.genero}`
      ? `&& genero in ["${
          product?.genero
        }","unisex"] && tipo in ["ropa","accesorios"] && imgcatalogomain != undefined && sku != "${product?.sku?.trim()}"`
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
          description,
          descuento,
          imgcatalogomain,
          tipo,
          genero,
          detalles,
          descuento,
          preciomanual,
          "slug":slug.current
        }`);

    return await productosTraidosSistemaFritzSport(products, "LIMA");
  };
  const productosRelacionadosCalzado = async () => {
    const order = `| order(_id) [0...10]`;

    const productFilter = FiltroGlobal();

    const generoFilterHombre = `${product?.genero}`
      ? `&& genero in ["${
          product?.genero
        }","unisex"] && tipo in ["calzado","accesorios"] && imgcatalogomain != undefined && sku != "${product?.sku?.trim()}"`
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
          description,
          descuento,
          imgcatalogomain,
          tipo,
          genero,
          detalles,
          descuento,
          preciomanual,
          "slug":slug.current
        }`);

    return await productosTraidosSistemaFritzSport(products, "LIMA");
  };

  const productosRelacionadosVestuario = await productosRelacionadosRopa();
  const productosRelacionadosZapatillas = await productosRelacionadosCalzado();

  let descuentos = await Descuentos();
  let descuentoSobreD = product?.descuentosobred;

  return (
    <>
      <div className="absolute xl:flex hidden z-3 w-full justify-center items-center bg-transparent py-1">
        <ToggleUserRole />
      </div>
      <main className=" mb-0 xl:pt-16  z-[1]">
        <div className="">
          {/* Product */}
          {/* <PushIntereses users={user} product={product}></PushIntereses> */}
          <div className=" w-full xl:flex 2xl:pb-20">
            {/* precio y nombre */}
            <PrecioViewProductMovil
              product={singleProduct}
              descuentos={descuentos}
              descuentoSobreD={descuentoSobreD}
            />

            {/* Product gallery */}
            <div>
              {/* <div className="hidden border-b-[1px] border-blue-gray-300 text-black dark:text-white  xl:block  xl:border-none xl:border-transparent">
                <BreadcrumbsDefault product={product} />
              </div> */}
              <ProductGalleryDesk product={singleProduct} />

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
                        <AccordionDescription product={singleProduct} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {singleProduct?.detalles && (
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
                          <AccordionDetails product={singleProduct} />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>

            {/* Product info */}
            <ProductInfo product={singleProduct} descuentos={descuentos} />
          </div>
        </div>
      </main>

      {/* <RoomReview roomId={product._id}></RoomReview> */}
      <div>
        <div className="mt-10">
          <h5 className="text-center text-2xl uppercase">
            COMPLETA TU outfit{" "}
          </h5>

          <CarouselProduct
            products={productosRelacionadosVestuario}
            descuentos={descuentos}
            outlet={false}
          />
        </div>

        <div className="mt-10">
          <h5 className="text-center text-2xl uppercase">
            QUIZÁ TAMBIÉN TE GUSTE..
          </h5>

          <CarouselProduct
            products={productosRelacionadosZapatillas}
            descuentos={descuentos}
            outlet={false}
          />
        </div>
      </div>
    </>
  );
}
