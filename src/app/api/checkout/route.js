// import mercadopago from "mercadopago";

import { seedSanityData } from "@/lib/seed";

export async function POST(req) {
  // mercadopago.configure({
  //   access_token: `${process.env.ACCESS_TOKEN_MERCADO}`,
  // });
  // console.log(data)

  try {
    const data = await req.json();
  
    // console.log(data)
    // tes
    // let productosCantidad = data.productos.map((el) => {
    //   let productos = {
    //     id: el.idsanity,
    //     category_id: el.talla,
    //     title: el.name,
    //     description: el.id,
    //     picture_url: urlForImage(el.image).url(),
    //     quantity: el.quantity,
    //     unit_price: el.price,
    //   }

    //   return productos
    // })
    // let preference = {
    //   items: data.productos,
    //   payer: {
    //     first_name: data.nombres,
    //     last_name: data.apellido,
    //     email: data.email,
    //     phone: {
    //       area_code: "51",
    //       number: 987654321,
    //     },
    //     address: {},
    //   },
    //   identification: {
    //     number: data.documento,
    //     type: "DNI",
    //   },
    //   shipments: {
    //     receiver_address: {
    //       zip_code: "121212",
    //       state_name: data.distrito,
    //       city_name: "Lima",
    //       street_name: data.distrito,
    //       street_number: 3003,
    //     },
    //   },

    //   back_urls: {
    //     success: `https://www.fritzsport.pe/exito`,
    //     failure: `https://www.fritzsport.pe/`,
    //     pending: `https://www.fritzsport.pe/`,
    //   },

    //   // installments: 1,
    //   payment_methods: {
    //     excluded_payment_methods: [
    //       {
    //         id: "amex",
    //       },
    //     ],
    //     excluded_payment_types: [
    //       {
    //         id: "atm",
    //       },
    //     ],
    //     installments: 1,
    //   },
    //   auto_return: "approved",

    //   // notification_url: `${process.env.URL_DOMINIO}/api/exito`,
    // };

    // const response = await mercadopago.preferences.create(preference);
    // envio mongo db

    if (data) {
      // const newPedido = new NewPedido(dataEnvioMongoUser)
      // const savePedido = await newPedido.save()
      // console.log(savePedido)
    
      let dataEnvioMongoUser = {
        tipoEntrega: data.tipoEntrega,
        razon: data.razon,
        id_payer: "0",
        id_mercado_pago: "01",
        rol_compra:data.rol_compra,
        estado: data.estado,
        nombres: data.nombres,
        apellidos: data.apellido,
        email: data.email,
        documento: data.documento,
        cart_total: data.cartTotal,
        telefono: data.telefono,
        departamento: data.departamento,
        distrito: data.distrito,
        provincia: data.provincia,
        direccion: data.direccion,
        comprobante: data.comprobante,
        info_adicional: data.adicional,
        ruc: data.ruc,
        productos: data.productos,
        userId: data.userId,
      };

      const dato = await seedSanityData(dataEnvioMongoUser);
      console.log(dato);
      
      return new Response(
        JSON.stringify({
          url: "http://localhost:3000/nuevo-pedido",
          id_payer: "0",
        }),
        {
          // return new Response(JSON.stringify({ url: "test" }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      return new Response(JSON.stringify({ error: "ocurrio un error" }), {
        // return new Response(JSON.stringify({ url: "test" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.log(error.message);
    return new Response(JSON.stringify({ error: "ocurrio un error" }), {
      // return new Response(JSON.stringify({ url: "test" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
