// app/api/products/route.ts
import { NextResponse } from "next/server";
import { fetchProducts } from "@/config/productos-por-limite";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const gender = searchParams.get("gender");

  if (!limit || !gender) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const products = await fetchProducts({
      limit: parseInt(limit),
      gender,
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
