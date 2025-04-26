import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";
import { FiltroGlobal } from "./filtro-products";
import { client } from "@/sanity/lib/client";

export const getProductRazonSocial = async (
  marca = "adidas",
  razonsocial: string
) => {
  const order = `| order(_createdAt asc) [0...100]`;

  const productFilter = FiltroGlobal();

  const filtroRazon = `&& tipo in ["ropa","calzado"] && imgcatalogomain != undefined && empresa != "fz_premium" `;

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

  let productosFiltrados = productosConPrecioDeSistemaFritzSport.filter(
    (item) => item?.razonsocial == razonsocial && item?.empresa != "fz_premium"
  );
  return productosFiltrados;
};
