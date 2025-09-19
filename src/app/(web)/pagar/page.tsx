import React from "react";

import PaginaPagar from "@/components/pagar/pagar";

import { Metadata } from "next";
import { paymentMetadata } from "@/config/seo-config";

import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { redirect } from "next/navigation";

export const metadata: Metadata = paymentMetadata;

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth?form=pagar");
  }

  // Verificar si es la primera compra del usuario
  const pedidosUsuario = await client.fetch(
    groq`count(*[_type == "pedidos" && userId == "${session?.user.id}" && estado != "pendiente"  ])`
  );


  // traer cambios
  


  const userInfo = await client.fetch(
    groq`
      {
        "userInfo": *[_type == "user" && _id == "${session?.user.id}"][0],
        "descuentoUser": *[_type == "descuento_users"][0]{
          bloque_descuentos_usuario{
            desc_user_fz_premium
          }
        }
      }
    `
  );

  if (!session) {
    return new NextResponse("Authentication required", { status: 400 });
  }
// traer cambios
  // Check if user is authorized to perform the action
  // if (userRole !== "admin") {
  //   throw new Error(
  //     "Unauthorized access: User does not have admin privileges."
  //   );
  // }

  return (
    <div className="overflow-x-hidden">
      <PaginaPagar 
        userInfo={userInfo} 
        isPrimeraCompra={pedidosUsuario === 0 ? true : false}
      />
    </div>
  );
}
