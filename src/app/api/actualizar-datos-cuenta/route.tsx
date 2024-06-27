import { client } from "@/sanity/lib/client";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(data);

    client
      .patch(data.userId) // Document ID to patch
      .set({
        name: data.nombres,
        apellidos: data.apellido,
        documento: data.documento,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,

        ruc: data.factura,
        departamento: data.departamento,
        provincia: data.provincia,
        distrito: data.distrito,
        infadi: data.adicional,
      }) // Shallow merge
      .commit() // Perform the patch and return a promise
      .then((updatedBike) => {
        console.log(updatedBike);
      })
      .catch((err) => {
        console.error("Oh no, the update failed: ", err.message);
        return err.message;
      });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      data,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
