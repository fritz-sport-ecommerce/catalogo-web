import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";
import { FiltroGlobal } from "./filtro-products";
import { client } from "@/sanity/lib/client";

export const getProductRazonSocial = async (
  marca = "adidas",
  razonsocial: string
) => {
  const order = `| order(_id) [0...50]`;

  const productFilter = FiltroGlobal();

  const filtroRazon = `&& tipo in ["ropa","calzado"] && imgcatalogomain != undefined  && marca == "${marca}"`;

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

  let productosFiltrados = productosConPrecioDeSistemaFritzSport.filter(
    (item) => item?.razonsocial == razonsocial
  );
  return productosFiltrados;
};
