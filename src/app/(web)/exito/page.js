"use client";

import { client } from "@/sanity/lib/client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { useCart } from "react-use-cart";

import { groq } from "next-sanity";
import Link from "next/link";
import { useSession } from "next-auth/react";

// 
export default function Page() {
  const router = useRouter();
  const { emptyCart } = useCart();
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  const [dataProductosComprados, setDataProductosComprados] = useState({
    nombres: "",
    cart_total: "",
    productos: [],
    tipoEntrega: "",
    provincia: "",
  });
  useEffect(() => {
    emptyCart();
    const urlParams = new URLSearchParams(window.location.search);
    const collection_id = urlParams.get("collection_id");
    const preference_id = urlParams.get("preference_id");
    if (collection_id && preference_id) {
      fetch(`https://api.mercadopago.com/v1/payments/${collection_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN_MERCADO}`,
        },
      })
        .then((res) => res.json())
        .then(async (resultado) => {
          // setResultado(resultado)
          let resut = await resultado;
          const pedido = await client.fetch(
            groq`*[_type == "pedidos" && id_payer match "${preference_id}"][0]`
          );
          console.log(pedido);
          if (pedido.id_mercado_pago === "01") {
            let resulta = await client
              .patch(String(preference_id))
              .set({ estado: "pagado", id_mercado_pago: collection_id })
              .commit();

            // Actualizar popularidad y cantidad vendida de productos comprados
            if (pedido.productos && Array.isArray(pedido.productos)) {
              const productData = pedido.productos
                .map(producto => ({
                  sku: producto.productos?.sku || producto.sku,
                  cantidad: producto.productos?.cantidad || producto.cantidad || 1
                }))
                .filter(item => item.sku);
              
              if (productData.length > 0) {
                const productSkus = productData.map(item => item.sku);
                const quantities = productData.map(item => parseInt(item.cantidad) || 1);
                
                try {
                  const response = await fetch('/api/update-popularity', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productSkus, quantities }),
                  });
                  
                  if (response.ok) {
                    const result = await response.json();
                    console.log('Popularidad y cantidad vendida actualizada:', result);
                  } else {
                    console.error('Error al actualizar popularidad y cantidad vendida');
                  }
                } catch (error) {
                  console.error('Error llamando a update-popularity:', error);
                }
              }
            }

            // Actualizar el estado con los datos del pedido
            setDataProductosComprados({
              nombres: pedido.nombres || "",
              cart_total: pedido.cart_total || "",
              productos: pedido.productos || [],
              tipoEntrega: pedido.tipoEntrega || "",
              provincia: pedido.provincia || "",
            });
            setLoading(false);
          } else {
            router.push("/");
            return notFound();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  }, []);
  if (isLoading)
    return (
      <div className="flex h-[100vh] w-full items-center justify-center text-center">
        {" "}
        <p>{isLoading && "...Procesando tu Pago"}</p>
      </div>
    );

  return (
    <div className="flex  items-center justify-center bg-black">
      <div className="bg-black p-6  md:mx-auto">
        <svg
          viewBox="0 0 24 24"
          className="mx-auto my-6 h-16 w-16 text-green-600"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="text-center text-base font-semibold text-white md:text-2xl">
            ¡Pago Realizado con éxito!
          </h3>
          <p className="my-2 text-white">
            <span className="mr-1 font-bold uppercase text-white">
              {" "}
              {dataProductosComprados.nombres}
            </span>
            Gracias por completar su pago seguro en línea.{" "}
          </p>
          <p className="text-white">Detalles de tu pedido:</p>

          {/* <p className="text-white">
            Nos Estaremos comunicando contigo Para coordinar la entrega de tu
            pedido!
          </p> */}
          <p>
            <div className="mt-5 text-xl text-white">
              Total :S/{dataProductosComprados.cart_total}{" "}
            </div>

            <div className=" grid grid-cols-1 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-1 lg:col-span-3 lg:gap-x-8">
              {dataProductosComprados.productos.map((el) => (
                <div
                  key={el.productos?.sku || el.sku}
                  className="flex h-[700px] w-[500px] flex-col  justify-center p-1"
                >
                  <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md    group-hover:opacity-75 ">
                    {(el.productos?.picture_url || el.picture_url) && (
                      <img
                        width={500}
                        height={500}
                        className="relative "
                        src={el.productos?.picture_url || el.picture_url}
                        alt=""
                      />
                    )}
                  </div>
                  <div className="mt-2 text-lg font-medium uppercase xl:text-xl text-white">
                    {el.productos?.name || el.name}
                  </div>
                  <div className="ml-2 flex flex-col items-start justify-between ">
                    {/* <div className="mt-4 text-xs font-medium">
                        Sku: {el.productos?.sku || el.sku}
                      </div> */}
                    <div className="mt-4 text-sm font-medium text-white">
                      Cantidad: {el.productos?.cantidad || el.cantidad}
                    </div>
                    <div className="mt-4 text-sm font-medium text-white">
                      Talla: {el.productos?.talla || el.talla}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </p>
          <p className="my-5 text-xl uppercase tracking-widest text-white">
            {dataProductosComprados.tipoEntrega === "envio" ? (
              <span>
                NOS ESTAREMOS COMUNICANDO CONTIGO PARA ENVIAR TU PEDIDO , EL
                PLAZO MÁXIMO ES DE{" "}
                {dataProductosComprados.provincia === "3285" ? "3 " : "5 "}
                DIAS hábiles
              </span>
            ) : (
              <span>
                ACÉRCATE A NUESTRA SEDE: <br />
                Fritz Sport, Av. Miguel Grau 231, Lima 15001. <br />{" "}
                DESPUÉS DE 48 HORAS DE LUNES A VIERNES DE 10AM A 7PM Y SABADOS
                DE 9AM A 12PM PARA EL RECOJO DE TU PEDIDO
              </span>
            )}
          </p>
          <p className="text-white">¡Qué tengas un lindo día!</p>
          <div className="py-10 text-center flex justify-center">
            <div className="flex flex-col gap-y-5 container w-3/6">
              <Link
                href={`/tienda`}
                className="bg-indigo-600 uppercase xl:px-12 py-3 font-semibold text-white hover:bg-indigo-500"
              >
                Seguir Comprando
              </Link>
              <Link
                href={`/users/${session.user.id}`}
                className="bg-indigo-600 uppercase xl:px-12 py-3 font-semibold text-white hover:bg-indigo-500"
              >
                Ver Estado de Pedido
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
