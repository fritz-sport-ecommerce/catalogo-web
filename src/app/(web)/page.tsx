// export const fetchCache = "force-no-store";
export const revalidate = 10; // seconds
// export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { SanitySlider } from "@/config/inventory";
import Carousel from "@/components/carousel-home/Carousel";
import CarouselProductRelacionados from "@/components/carousel-product/carousel-product-relacionados";
import Descuentos from "@/config/descuentos";
import { FiltroGlobal } from "@/utilits/filtro-products";
import ContedorCarouselProduct from "@/components/carousel-product/contedor-carousel-product";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
        url: `${process.env.URL_DOMINIO}/ecommerce-share.jpeg`,

        width: 800,
        height: 600,
        alt: `Fritz Sport share Imagen`,
      },
      {
        url: `${process.env.URL_DOMINIO}/ecommerce-share.jpeg`,

        width: 1200,
        height: 630,
        alt: `Fritz Sport share Imagen`,
      },
    ],
  },
};

interface Props {
  searchParams: {
    date?: string;
    priceecommerce?: string;
    color?: string;
    category?: string;
    size?: string;
    genero?: string;
    search?: string;
    sku?: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const slider = await client.fetch<SanitySlider[]>(
    groq`*[_type == "catalogo"] [0] {
      slider
    }`
  );

  const productFilter = FiltroGlobal();
  const newProducts = await client.fetch<
    SanitySlider[]
  >(groq`*[${productFilter} && genero != "niños"] | order(_createdAt desc)[0..100] {
      _id,
      _createdAt,
      name,
      sku,
      images,
      currency,
      priceecommerce,
      pricemayorista,
      priceemprendedor,
      tipoproducto,
      description,
      genero,
      categories,
      marca,
      tallas,
      stock,
      descuento,
      preciomanual,
      "slug":slug.current
  }`);

  let descuentos = await Descuentos();

  return (
    <div>
      {/* <DialogSizes promoHome={promoHome}></DialogSizes> */}
      <div className="conta">
        <Carousel dataSlider={slider} />
        {/* <VideoHome url={homeVideo[0]} /> */}
        {/* nuevos ingresos */}
        <div className="my-10 xl:my-20">
          <div className="text-center text-xl uppercase xl:text-4xl">
            nuevos ingresos
          </div>
          <ContedorCarouselProduct
            nuevo={true}
            genero={"unisex"}
            cantidad={"20"}
            descuentos={descuentos}
            tipoCategoria={`&& tipo == "calzado" `}
            outlet={false}
          />
        </div>
        <div className="my-10 xl:my-20">
          <div className="text-center text-xl uppercase xl:text-4xl">
            Adidas linea
          </div>
          <ContedorCarouselProduct
            genero={"unisex"}
            cantidad={"20"}
            descuentos={descuentos}
            tipoCategoria={`&& marca == "adidas" && razonsocial == "fritzsport"`}
            outlet={false}
          />
          <div className="flex justify-center w-full">
            <Link href={"/productos?razonsocial=fritzsport&marca=adidas"}>
              <Button className="rounded-none">VER MAS</Button>
            </Link>
          </div>
        </div>

        <div className="my-10 xl:my-20">
          <div className="text-center text-xl uppercase xl:text-4xl">
            Adidas liquidación
          </div>
          <ContedorCarouselProduct
            genero={"unisex"}
            cantidad={"20"}
            descuentos={descuentos}
            tipoCategoria={`&& marca == "adidas"&& razonsocial == "fritzduran"  `}
            outlet={true}
          />
          <div className="flex justify-center w-full">
            <Link href={"/productos?razonsocial=fritzduran&marca=adidas"}>
              <Button className="rounded-none">VER MAS</Button>
            </Link>
          </div>
        </div>

        {/* <PromoImage bannerhome={bannerhome} bottom={false} /> */}

        <div className="my-10 xl:my-20">
          <div className="text-center text-xl uppercase xl:text-4xl">Nike</div>
          <ContedorCarouselProduct
            genero={"hombre"}
            cantidad={"20"}
            descuentos={descuentos}
            tipoCategoria={`&& marca == "nike"  `}
            outlet={false}
          />
          <div className="flex justify-center w-full">
            <Link href={"/productos?&marca=nike"}>
              <Button className="rounded-none">VER MAS</Button>
            </Link>
          </div>
        </div>
        {/* <Carousel dataSlider={slider[0]} /> */}

        {/* <HombreMujer bannerGenero={bannerGenero[0]} /> */}
      </div>
    </div>
  );
}
