
export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

import UploadPayment from '@/components/upload-comprobante/upload-comprobante';
import { SanityProduct } from '@/config/inventory';
import { authOptions } from '@/libs/auth';
import { client } from '@/sanity/lib/client';
import { getServerSession } from 'next-auth';
import { groq } from 'next-sanity';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import React from 'react'

interface Props {
  searchParams : {
    id_p:string
    user:string
  }
}
export default async function page({searchParams}:Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Authentication required", { status: 400 });
  }



  const pedido = await client.fetch(
    groq`*[_type == "pedidos" && id_payer == "${searchParams.id_p}" && userId == "${session.user.id}"]{comprobante_img,cart_total,id_payer,productos,cart_total}[0]`
  );

  
  const cuentasBancarias = await client.fetch(
    groq`*[_type == "catalogo"]{
    cuenta
  }[0]`
  );


  if (pedido === null) {
    return notFound();
  }
  
  return (
    <UploadPayment cuentasBancarias={cuentasBancarias.cuenta} pedido={pedido}/>
  )
}
