import mercadopago from "mercadopago";
import { seedSanityData } from "@/lib/seed";

export async function POST(req) {
  mercadopago.configure({
    access_token: `${process.env.ACCESS_TOKEN_MERCADO}`,
  });

  try {
    const data = await req.json();

    console.log(data.productos);
    
    // Crear un solo ítem que represente el total con descuento y delivery
    let preference = {
      items: [
        {
          title: "Total de la compra",
          quantity: 1,
          unit_price: data.deliveryPrice > 0 ? data.cartTotal + data.deliveryPrice : data.cartTotal, // Total final con descuento y delivery
        },
      ],
      payer: {
        first_name: data.nombres,
        last_name: data.apellido,
        email: data.email,
        phone: {
          area_code: "51",
          number: 987654321,
        },
        address: {},
      },
      identification: {
        number: data.documento,
        type: "DNI",
      },
      shipments: {
        receiver_address: {
          zip_code: "121212",
          state_name: data.distrito,
          city_name: "Lima",
          street_name: data.distrito,
          street_number: 3003,
        },
      },
      back_urls: {
        success: `https://www.fritzsport.pe/exito`,
        failure: `https://www.fritzsport.pe/`,
        pending: `https://www.fritzsport.pe/`,
      },
      payment_methods: {
        excluded_payment_methods: [
          {
            id: "amex",
          },
        ],
        excluded_payment_types: [
          {
            id: "atm",
          },
        ],
        installments: 1,
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);

    if (response.status === 201) {
      let dataEnvioMongoUser = {
        tipoEntrega: data.tipoEntrega,
        razon: data.razon,
        id_payer: response.body.id,
        id_mercado_pago: "01",
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
        deliveryPrice: data.deliveryPrice,
        descuentoUser: data.descuentoUser,
        isPrimeraCompra: data.isPrimeraCompra,
      };

      const dato = await seedSanityData(dataEnvioMongoUser);
      console.log(dato, "dato");
      
      return new Response(
        JSON.stringify({
          url: response.body.init_point,
          id_payer: response.body.id,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      return new Response(JSON.stringify({ error: "ocurrio un error" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "ocurrio un error" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
