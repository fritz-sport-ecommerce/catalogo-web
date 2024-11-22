// Archivo: app/api/fetchProducts/route.ts

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const start = parseInt(searchParams.get("start") || "0", 10);

  const productos = await client.fetch(
    groq`*[_type == "product"] [${start}..${start + 5}]`
  );

  return NextResponse.json(productos);
}
