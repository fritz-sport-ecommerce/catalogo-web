import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "4";
  const gender = searchParams.get("gender") || "unisex";

  try {
    // Construir filtro de género
    let genderFilter = "";
    switch (gender) {
      case "mujer":
        genderFilter = '&& (genero == "mujer" || genero == "unisex")';
        break;
      case "hombre":
        genderFilter = '&& (genero == "hombre" || genero == "unisex")';
        break;
      case "niños":
        genderFilter = '&& (genero == "niños")';
        break;
      case "unisex":
        genderFilter = '&& (genero == "hombre" || genero == "mujer")';
        break;
      default:
        genderFilter = "";
    }

    const query = groq`*[_type == "product" ${genderFilter} && empresa == "fritz_sport" ] | order(_createdAt desc) [0...${parseInt(limit)}] {
      _id,
      _createdAt,
      name,
      empresa,
      sku,
      images,
      description,
      genero,
       linea_liquidacion,
      tipo,
      marca,
      color,
      popularidad,
      "slug": slug.current
    }`;

    const products = await client.fetch(query);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products from Sanity:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
