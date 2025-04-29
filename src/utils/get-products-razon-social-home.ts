import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";
import { FiltroGlobal } from "./filtro-products-slider-home";
import { client } from "@/sanity/lib/client";

export const getProductRazonSocial = async (
  marca: string | undefined,
  razonsocial: string | undefined,
  all: boolean
) => {
  const order = `| order(_createdAt desc) ${
    all ? "[0...100]" : "[100...200]"
  } `;

  const productFilter = FiltroGlobal();

  const filtroRazon = `&& tipo in ["ropa","calzado"] && imgcatalogomain != null && empresa != "fz_premium" ${
    marca ? "" : `&& marca == "${marca}" `
  } `;

  const filter = `*[${productFilter}${filtroRazon}]`;

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

  let productosConPrecioDeSistemaFritzSport =
    await productosTraidosSistemaFritzSport(products, "LIMA");
  // console.log(productosConPrecioDeSistemaFritzSport);
  let productosFiltrados = [];
  if (razonsocial) {
    productosFiltrados = productosConPrecioDeSistemaFritzSport.filter(
      (item) =>
        item?.razonsocial == razonsocial && item?.empresa != "fz_premium"
    );
  } else {
    productosFiltrados = productosConPrecioDeSistemaFritzSport.filter(
      (item) => item?.empresa != "fz_premium"
    );
  }

  return productosFiltrados;
};
