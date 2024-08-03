import React from "react";
import { client } from "@/sanity/lib/client";

import CarouselProduct from "@/components/carousel-product/carousel-product";
import { FiltroGlobal } from "@/utilits/filtro-products";

export default async function ContedorCarouselProduct({
  genero,
  cantidad = "80",
  descuentos,

  tipoCategoria,
  outlet,
}) {
  const productosGenero = async (genero, cantidad, tipoCategoria) => {
    const order = `| order(_id) [0...${cantidad}]`;

    const productFilter = FiltroGlobal("fritzduran");

    const generoFilterHombre = genero ? `&& genero match "${genero}"  ` : "";
    const categoria = tipoCategoria
      ?  tipoCategoria
      : generoFilterHombre;

    const filter = `*[${productFilter}${categoria}] | order(_createdAt desc)[0..100]`;
    console.log(filter);
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
          genero,
          descuento,
          tallas,
          tipo,
          categories,
          stock,
          preciomanual,
          pricemayorista,
          priceemprendedor,
          "slug":slug.current
        }`);

    return products;
  };
  const products = await productosGenero(genero, cantidad, tipoCategoria);
  // console.log(products)

  return (
    <div className="">
      <CarouselProduct
        products={products}
        descuentos={descuentos}
        outlet={outlet}
      />
    </div>
  );
}
