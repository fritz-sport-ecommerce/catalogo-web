import React from "react";
import { client } from "@/sanity/lib/client";

import CarouselProduct from "@/components/carousel-product/carousel-product";
import { FiltroGlobal } from "@/utils/filtro-products-slider-home";

export default async function ContedorCarouselProduct({
  genero,
  cantidad = "80",
  descuentos,
  nuevo = false,
  tipoCategoria,
  outlet,
}) {
  const productosGenero = async (genero, cantidad, tipoCategoria) => {
    const order = `| order(_id) [0...${cantidad}]`;

    const productFilter = FiltroGlobal(outlet ? "fritzduran" : "fritzsport");

    const generoFilterHombre = genero ? `&& genero match "${genero}"  ` : "";
    const categoria = tipoCategoria ? tipoCategoria : generoFilterHombre;

    const filter = `*[${productFilter}${categoria} && categories != "originals"] | order(_createdAt desc)[0..100]`;
    console.log(filter);
    // await seedSanityData()
    const products = await client.fetch(`${filter} ${order} {
          _id,
          _createdAt,
          name,
          sku,
          images,
          imgcatalogomain,
          marca,
          description,
          genero,
          descuento,
          tallas,
          tipo,
          categories,
          stock,
          preciomanual,
          razonsocial,
          descuentosobred,
          "slug":slug.current
        }`);

    return products;
  };
  const products = await productosGenero(genero, cantidad, tipoCategoria);
  // console.log(products)s

  return (
    <div className="">
      <CarouselProduct
        products={products}
        descuentos={descuentos}
        outlet={outlet}
        nuevo={nuevo}
      />
    </div>
  );
}
