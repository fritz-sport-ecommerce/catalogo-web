// app/api/valid-products/route.ts

import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { products, ciudad, price } = await req.json();
    const validProducts = await productosTraidosSistemaFritzSport(
      products,
      ciudad
    );
    // Si se envía un price, incluirlo en la respuesta para comparar
    if (price !== undefined) {
      let allMatch = true;
      validProducts.forEach((p:any) => {
        p.priceRequest = price;
        p.priceMatch = Number(price) === Number(p.priceecommerce);
        if (!p.priceMatch) allMatch = false;
      });
      if (!allMatch) {
        return NextResponse.json({ error: "El precio enviado no coincide con el precio real del producto." }, { status: 400 });
      }
    }
    return NextResponse.json(validProducts);
  } catch (error) {
    console.error("Error en productosTraidosSistemaFritzSport:", error);
    return NextResponse.json({ error: "Ocurrió un error" }, { status: 500 });
  }
}
