import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";
import { FiltroGlobal } from "./filtro-products-slider-home";
import { client } from "@/sanity/lib/client";

export const getProductRazonSocial = async (
  marca: string | undefined,
  razonsocial: string | undefined,
  all: boolean
) => {
  console.log(`🔍 getProductRazonSocial - Parámetros: marca=${marca}, razonsocial=${razonsocial}, all=${all}`);
  
  const order = `| order(_createdAt desc) ${
    all ? "[0...100]" : "[100...200]"
  } `;

  const productFilter = FiltroGlobal();

  // CORREGIDO: Lógica de filtrado por marca invertida
  const filtroRazon = `&& tipo in ["ropa","calzado"] && imgcatalogomain != null && empresa == "fritz_sport" ${
    marca ? `&& marca == "${marca}"` : ""
  } `;

  const filter = `*[${productFilter}${filtroRazon}]`;
  
  console.log(`📋 Query Sanity: ${filter} ${order}`);

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
           linea_liquidacion,
          tipo,
          genero,
          detalles,
          descuento,
          preciomanual,
          popularidad,
          empresa,
          "slug":slug.current
        }`);

  console.log(`📦 Productos obtenidos de Sanity: ${products?.length || 0}`);

  let productosConPrecioDeSistemaFritzSport =
    await productosTraidosSistemaFritzSport(products, "LIMA");
  
  console.log(`💰 Productos con precios del sistema: ${productosConPrecioDeSistemaFritzSport?.length || 0}`);
  
  let productosFiltrados = [];
  if (razonsocial) {
    productosFiltrados = productosConPrecioDeSistemaFritzSport.filter(
      (item:any) =>
        item?.razonsocial == razonsocial && 
        item?.empresa == "fritz_sport" &&
        item?.stock > 0 // ✅ FILTRAR PRODUCTOS AGOTADOS
    );
    console.log(`🎯 Productos filtrados por razonsocial "${razonsocial}": ${productosFiltrados?.length || 0}`);
  } else {
    productosFiltrados = productosConPrecioDeSistemaFritzSport.filter(
      (item:any) => 
        item?.empresa == "fritz_sport" &&
        item?.stock > 0 // ✅ FILTRAR PRODUCTOS AGOTADOS
    );
    console.log(`🎯 Productos filtrados (sin razonsocial): ${productosFiltrados?.length || 0}`);
  }

  console.log(`✅ Productos finales retornados (sin agotados): ${productosFiltrados?.length || 0}`);
  return productosFiltrados;
};
