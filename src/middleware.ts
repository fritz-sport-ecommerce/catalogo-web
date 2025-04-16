import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { getMaintenanceMode } from "./utils/maintence-mode-cache";

async function fetchMaintenanceMode() {
  const data = await client.fetch(
    groq`*[_type == "catalogo"][0]{
       "modo_mantenimiento": modo_mantenimiento
    }`
  );
  return data.modo_mantenimiento || false;
}

export async function middleware(req: Request) {
  const url = req.url;

  // Obtener el estado de mantenimiento (cacheado) s
  const modo_mantenimiento = await getMaintenanceMode(fetchMaintenanceMode);
  // Redirigir si está en modo mantenimientoo

  if (modo_mantenimiento) {
    if (
      !url.includes("/mantenimiento") &&
      !url.includes("/studio") &&
      !url.includes("/emprende") &&
      !url.includes("/nuestras-tiendas") &&
      !url.includes("/pdf") &&
      !url.includes("/tyc") &&
      !url.includes("/pyp") &&
      !url.includes("-pdf/")
    ) {
      const redirectUrl = new URL("/pdf", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|mantenimiento).*)",
    "/users/:path*",
    "/pagar",
  ],
};
