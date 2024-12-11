import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No se proporcionó ningún archivo." }, { status: 400 });
  }

  // Simular subida a Sanity (modifica según tu lógica)
  const fileUrl = `https://example.com/uploads/${file.name}`;

  return NextResponse.json({ fileUrl });
}
