import React from "react";

import PaginaPagar from "@/components/pagar/pagar";

import { Metadata } from "next";

import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export const metadata: Metadata = {
  openGraph: {
    title: " Fritz Sport Perú Tienda oficial | Zapatillas y ropa deportiva",
    description:
      "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra en esta tienda online zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
    url: `${process.env.URL_DOMINIO}`,
    siteName: "Fritz Sport",
    images: [
      {
        url: `/ecommerce-share.jpg`,
        width: 800,
        height: 600,
        alt: `Fritz Sport share Imagen`,
      },
      {
        url: `/ecommerce-share.jpg`,

        width: 1200,
        height: 630,
        alt: `Fritz Sport share Imagen`,
      },
    ],
  },
};
export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Authentication required", { status: 400 });
  }
  // Check if user is authorized to perform the action
  // if (userRole !== "admin") {
  //   throw new Error(
  //     "Unauthorized access: User does not have admin privileges."
  //   );
  // }
  return (
    <div className="overflow-x-hidden">
      <PaginaPagar></PaginaPagar>
    </div>
  );
}
