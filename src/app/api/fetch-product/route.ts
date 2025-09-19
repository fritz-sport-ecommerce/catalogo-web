// Archivo: app/api/fetchProducts/route.ts

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";
import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const start = parseInt(searchParams.get("start") || "0", 10);
  const provincia = searchParams.get("provincia") || "LIMA";
  const razonsocial = searchParams.get("razonsocial") || undefined;
  const tipo = searchParams.get("tipo") || "accesorios";

  // Construir el filtro de tipo dinámicamente
  let tipoFilter = "";
  if (tipo === "all") {
    // Si es "all", no filtrar por tipo específico
    tipoFilter = "";
  } else if (tipo === "accesorios") {
    tipoFilter = `&& tipo == "accesorios"`;
  } else if (tipo === "calzado") {
    tipoFilter = `&& tipo == "calzado"`;
  } else if (tipo === "ropa") {
    tipoFilter = `&& tipo == "ropa"`;
  } else {
    // Por defecto, buscar accesorios
    tipoFilter = `&& tipo == "accesorios"`;
  }

  const query = groq`*[_type == "product" ${tipoFilter} && empresa == "fritz_sport"] | order(_createdAt desc) {
    _id,
    _createdAt,
    name,
    empresa,
    sku,
    images,
    description,
    genero,
    tipo,
    marca,
    linea_liquidacion,
    color,
    imgcatalogomain,
    imagescatalogo,
    categories,
    preciomanual,
    popularidad,
    fechaIngreso,
    "slug": slug.current
  } [${start}..${start + 20}]`;

  console.log("API Query:", query);
  console.log("Tipo solicitado:", tipo);

  const productos = await client.fetch(query);
  console.log("Productos encontrados:", productos?.length || 0);

  const productosProcesados = await productosTraidosSistemaFritzSport(
    productos,
    provincia,
    razonsocial
  );
  
  console.log("Productos procesados:", productosProcesados?.length || 0);

  return NextResponse.json(productosProcesados);
}
