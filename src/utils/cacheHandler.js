import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

async function fetchSanityData(filterProducts, CACHE_KEY) {
  const filtros = {
    razonsocial: filterProducts?.razonsocial || "",
    genero: filterProducts?.genero || "",
    marca: filterProducts?.marca || "",
    tipoproducto: filterProducts?.tipoproducto || "",
  };
  console.log("⏳ Obteniendo nuevos datos desde Sanity...");

  // Condición para incluir productos de género "unisex" si el filtro es "hombre" o "mujer"
  const generoFiltro = filtros.genero
    ? filtros.genero === "hombre" || filtros.genero === "mujer"
      ? `genero in ["${filtros.genero}", "unisex"]`
      : `genero == "${filtros.genero}"`
    : "";

  // Validar si razonsocial y genero no están definidos
  const razonsocialFiltro = filtros.razonsocial
    ? `razonsocial == "${filtros.razonsocial}"`
    : "";

  // Construir la consulta dinámicamente
  const query = groq`*[ _type == "product" && categories != "originals" 
        ${razonsocialFiltro ? `&& ${razonsocialFiltro}` : ""}
        ${generoFiltro ? `&& ${generoFiltro}` : ""}
        && marca == ${filtros.marca ? `"${filtros.marca}"` : "null"}
        && tipoproducto == ${
          filtros.tipoproducto ? `"${filtros.tipoproducto}"` : "null"
        }
    && imgcatalogomain != null] | order(_createdAt desc) {
      _id, _createdAt, name, sku, images, priceecommerce, description,
      genero, subgenero, tipo, marca, descuento, color, imgcatalogomain,
      imagescatalogo, priceemprendedor, tallascatalogo, categories,
      preciomanual, fechaIngreso, "slug": slug.current
    }`;

  // Consultar productos
  const productos = await client.fetch(query);

  // Consultar catálogo
  const catalogo = await client.fetch(
    groq`*[_type == "catalogo"]{ catalogoclient, catalogo }[0]`
  );

  // Guardar en caché con timestamp
  globalThis[CACHE_KEY] = {
    productos,
    catalogo,
    lastUpdated: Date.now(),
  };

  return { productos, catalogo };
}

// Función para obtener caché o actualizarlo si han pasado 24 horas
export async function fetchSanityCache(filterProducts, CACHE_KEY) {
  const cache = globalThis[CACHE_KEY];

  if (cache && Date.now() - cache.lastUpdated < CACHE_DURATION) {
    console.log("✅ Datos obtenidos desde caché");
    return cache;
  }

  return fetchSanityData(filterProducts, CACHE_KEY);
}
