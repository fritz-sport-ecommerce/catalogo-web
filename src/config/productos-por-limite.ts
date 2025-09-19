// productService.ts

import { client } from "@/sanity/lib/client";
import { SanityProduct } from "./inventory";
import productosTraidosSistemaFritzSport from "./productos-traidos-sistema-fritz-sport";

const DEFAULT_LIMIT = 12;
const MAX_RETRIES = 3;
const MAX_FETCH_LIMIT = 100;

// Función auxiliar para construir el filtro de género
function buildGenderFilter(gender: any): string {
  switch (gender) {
    case "mujer":
      return '&& (genero == "mujer" || genero == "unisex")';
    case "hombre":
      return '&& (genero == "hombre" || genero == "unisex")';
    case "niños":
      return '&& (genero == "niños" )';
    case "unisex":
      return '&& (genero == "hombre" || genero == "mujer")';
    case "todos":
    default:
      return "";
  }
}

export interface FetchProductsOptions {
  limit?: number;
  gender?: "hombre" | "mujer" | "unisex" | string;
  order?: string;
  empresa?: string;
  location?: string;
  system?: string;
  tipo?: string;
}

export async function fetchProducts(
  options: FetchProductsOptions = {}
): Promise<SanityProduct[]> {
  const {
    limit = DEFAULT_LIMIT,
    gender = "todos",
    order = "order(_createdAt desc)",
    empresa = "fz_premium",
    location = "LIMA",
    system = "fritzsport",
    tipo,
  } = options;

  if (limit <= 0 || limit > 1000) {
    console.error("Invalid limit value:", limit);
    return [];
  }

  let totalValidProducts: SanityProduct[] = [];
  let currentStart = 0;
  let retries = 0;

  // Función para construir el filtro de género según las especificaciones
  const genderFilter = buildGenderFilter(gender);

  while (totalValidProducts.length < limit) {
    try {
      const remaining = limit - totalValidProducts.length;
      const itemsToFetch = Math.min(remaining + 5, MAX_FETCH_LIMIT);

      // Construir query con el filtro de género mejorado
      const tipoFilter = tipo ? `&& tipo == "${tipo}"` : "";
      const rangeFilter = `[${currentStart}...${currentStart + itemsToFetch}]`;


      const query = `*[_type == "product" ${genderFilter} && empresa == "${empresa}" && images != null && count(images) > 0] | ${order} {


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
        color,
        imgcatalogomain,
         linea_liquidacion,
        imagescatalogo,
        categories,
        preciomanual,
        popularidad,
        cantidadVendidos,
        fechaIngreso,
        "slug": slug.current
      }${rangeFilter}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const products = await client.fetch<SanityProduct[]>(query, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (products.length === 0) break;

      const validProducts = await productosTraidosSistemaFritzSport(
        products,
        location,
        system
      ).catch((error) => {
        console.error("Validation error:", error);
        return [];
      });

      totalValidProducts = [...totalValidProducts, ...validProducts];
      currentStart += itemsToFetch;
      retries = 0;
    } catch (error) {
      retries++;
      console.error(`Attempt ${retries} failed:`, error);

      if (retries >= MAX_RETRIES) {
        console.error("Max retries reached. Returning partial results.");
        break;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, retries))
      );
    }
  }

  return totalValidProducts.slice(0, limit);
}

export async function fetchBestSellingProducts(
  options: FetchProductsOptions = {}
): Promise<SanityProduct[]> {
  const {
    limit = DEFAULT_LIMIT,
    gender = "todos",
    empresa = "fritz_sport",
    location = "LIMA",
    system = "fritzsport",
  } = options;

  if (limit <= 0 || limit > 1000) {
    console.error("Invalid limit value:", limit);
    return [];
  }

  try {
    // Obtener los productos de Sanity basándose en popularidad
    const genderFilter = buildGenderFilter(gender);
    
    const productosQuery = `*[_type == "product"  ${genderFilter} && empresa == "${empresa}" && images != null && count(images) > 0 && popularidad > 0] | order(popularidad desc) {
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
      color,
       linea_liquidacion,
      imgcatalogomain,
      imagescatalogo,
      categories,
      preciomanual,
      popularidad,
      cantidadVendidos,
      fechaIngreso,
      "slug": slug.current
    }`;

    const productos = await client.fetch<SanityProduct[]>(productosQuery);

    // Validar productos con el sistema Fritz Sport
    const validProducts = await productosTraidosSistemaFritzSport(
      productos,
      location,
      system
    ).catch((error) => {
      console.error("Validation error:", error);
      return [];
    });

    return validProducts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    return [];
  }
}

export async function fetchMostSoldProducts(
  options: FetchProductsOptions = {}
): Promise<SanityProduct[]> {
  const {
    limit = DEFAULT_LIMIT,
    gender = "todos",
    empresa = "fritz_sport",
    location = "LIMA",
    system = "fritzsport",
  } = options;

  if (limit <= 0 || limit > 1000) {
    console.error("Invalid limit value:", limit);
    return [];
  }

  try {
    // Obtener los productos de Sanity basándose en cantidad vendida
    const genderFilter = buildGenderFilter(gender);
    
    const productosQuery = `*[_type == "product"  ${genderFilter} && empresa == "${empresa}" && images != null && count(images) > 0 && cantidadVendidos > 0] | order(cantidadVendidos desc) {
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
      color,
       linea_liquidacion,
      imgcatalogomain,
      imagescatalogo,
      categories,
      preciomanual,
      popularidad,
      cantidadVendidos,
      fechaIngreso,
      "slug": slug.current
    }`;

    const productos = await client.fetch<SanityProduct[]>(productosQuery);

    // Validar productos con el sistema Fritz Sport
    const validProducts = await productosTraidosSistemaFritzSport(
      productos,
      location,
      system
    ).catch((error) => {
      console.error("Validation error:", error);
      return [];
    });

    return validProducts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching most sold products:", error);
    return [];
  }
}
