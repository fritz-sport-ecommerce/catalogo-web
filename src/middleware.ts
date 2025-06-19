import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { getMaintenanceMode } from "./utils/maintence-mode-cache";
import { track } from "@vercel/analytics";
async function fetchMaintenanceMode() {
  const data = await client.fetch(
    groq`*[_type == "catalogo"][0]{
       "modo_mantenimiento": modo_mantenimiento
    }`
  );
  return data.modo_mantenimiento || false;
}
// Mapeo completo de departamentos del Perú
const peruDepartments: Record<string, string> = {
  // Códigos comunes de APIs + nombres alternativos
  LIMA: "Lima",
  LIM: "Lima",
  ARE: "Arequipa",
  AQP: "Arequipa",
  ANC: "Áncash",
  APU: "Apurímac",
  AYA: "Ayacucho",
  CAJ: "Cajamarca",
  CAL: "Callao",
  CUS: "Cusco",
  CUZ: "Cusco",
  HUV: "Huancavelica",
  HUC: "Huánuco",
  ICA: "Ica",
  JUN: "Junín",
  LAL: "La Libertad",
  LAM: "Lambayeque",

  LOR: "Loreto",
  MDD: "Madre de Dios",
  MOQ: "Moquegua",
  PAS: "Pasco",
  PIU: "Piura",
  PUN: "Puno",
  SAM: "San Martín",
  TAC: "Tacna",
  TUM: "Tumbes",
  UCA: "Ucayali",

  // Nombres en español (por si la API los devuelve completos)
  amazonas: "Amazonas",
  ancash: "Áncash",
  apurimac: "Apurímac",
  arequipa: "Arequipa",
  ayacucho: "Ayacucho",
  cajamarca: "Cajamarca",
  callao: "Callao",
  cusco: "Cusco",
  cuzco: "Cusco",
  huancavelica: "Huancavelica",
  huanuco: "Huánuco",
  ica: "Ica",
  junin: "Junín",
  "la libertad": "La Libertad",
  lambayeque: "Lambayeque",
  lima: "Lima",
  loreto: "Loreto",
  "madre de dios": "Madre de Dios",
  moquegua: "Moquegua",
  pasco: "Pasco",
  piura: "Piura",
  puno: "Puno",
  "san martin": "San Martín",
  tacna: "Tacna",
  tumbes: "Tumbes",
  ucayali: "Ucayali",
};

export async function middleware(req: NextRequest) {
  // departamentos analytics
  console.log(req.geo);
  const country = req.geo?.country; // 'PE' para Perú
  const rawRegion = req.geo?.region; // Ej: 'LIM', 'Arequipa', 'cusco'

  if (country === "PE" && rawRegion) {
    const normalizedDepartment = normalizeDepartment(rawRegion);
    track("Visita Perú", {
      departamento: normalizedDepartment,
      ciudad: req.geo?.city || "Desconocida",
    });
  }
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

// api analitycs departamentos

function normalizeDepartment(rawRegion: string): string {
  // Limpia y estandariza el texto
  const cleaned = rawRegion.trim().toUpperCase();
  return peruDepartments[cleaned] || rawRegion;
}
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|mantenimiento).*)",
    "/users/:path*",
    "/pagar",
  ],
};
