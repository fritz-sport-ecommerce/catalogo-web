import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { getMaintenanceMode } from "./utilits/maintence-mode-cache";

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
      !url.includes("catalogo/mantenimiento") &&
      !url.includes("catalogo/studio") &&
      !url.includes("catalogo/emprende") &&
      !url.includes("catalogo/nuestras-tiendas") &&
      !url.includes("catalogo/pdf") &&
      !url.includes("catalogo/tyc") &&
      !url.includes("catalogo/pyp") &&
      !url.includes("catalogo-pdf/")
    ) {
      const redirectUrl = new URL("catalogo/pdf", req.url);
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
