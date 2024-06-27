

import { NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"

// sanity.js

// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

async function updateDocumentTitle(preference_id, collection_id, items) {
  const resulta = await client
    .patch(preference_id)
    .set({ estado: "pagado", id_mercado_pago: collection_id })
    .commit()

  items.map(async (el) => {
    await client
      .patch(el.id)
      .dec({ [`tallas[_key == \"${el.key}\"].stock`]: el.stock })
      // .append("tallas", [{ talla: talla, stock: 5 - stock }])
      .commit()
  })
  console.log(resulta)

  return resulta
}

export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams
    const collection_id = searchParams.get("collection_id")
    const preference_id = searchParams.get("preference_id")
    // console.log(searchParams)
    // const filter = { id_payer: preference_id }
    // const update = {
    //   pedido_pagado: true,
    //   id_mercado_pago: collection_id,
    // }
    // let PedidoUpdate = await Pagos.findOneAndUpdate(filter, update)

    let mercadoPago = await fetch(
      `https://api.mercadopago.com/v1/payments/${collection_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN_MERCADO}`,
        },
      }
    )

    let resultado = await mercadoPago.json()

    // console.log(preference_id)

    let rest = await updateDocumentTitle(
      preference_id,
      collection_id,
      resultado.additional_info.items
    )
    console.log(rest)
    if (rest) {
      const url = req.nextUrl.clone()
      url.pathname = "/exito"
      return NextResponse.redirect(url)
    } else {
      return NextResponse.redirect(`/error`)
    }
  } catch (error) {
    console.log(error)
    return new Response(
      JSON.stringify({ error: `ocurrio un error ${error.message}` })
    )
  }
}

