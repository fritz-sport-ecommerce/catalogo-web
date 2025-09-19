"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { urlForImage } from "@/sanity/lib/image";
import { useCart } from "react-use-cart";
import FormPagar from "./form-pagar";
import { CartItemsEmpty } from "../cart-items-empty";
import { useToast } from "@/components/ui/use-toast";

export default function Pagar({ userInfo, isPrimeraCompra }) {
  const { items, removeItem } = useCart();
  const { toast } = useToast();
  const [domLoaded, setDomLoaded] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState("envio");
  const [invalidItems, setInvalidItems] = useState({});
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  // Validación de stock y precio en pago
  useEffect(() => {
    if (!domLoaded || items.length === 0) return;
    const validateCart = async () => {
      const skus = [...new Set(items.map((item) => item.objectID))];
      const res = await fetch("/api/valid-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: skus.map((sku) => {
            const prod = items.find((i) => i.objectID === sku);
            return {
              sku,
              empresa: prod.empresa,
              genero: prod.genero,
              marca: prod.marca,
              tipo: prod.tipo,
            };
          }),
          ciudad: "LIMA",
        }),
      });
      const validProducts = await res.json();
      let invalid = {};
      for (const item of items) {
        const valid = validProducts.find((p) => p.sku === item.objectID);
        if (!valid) {
          invalid[item.id] = { reason: "eliminado" };
          toast({
            title: "Producto eliminado",
            description: `${item.name} ya no está disponible y será eliminado del carrito en 4 segundos.`,
          });
          continue;
        }
        // Stock por talla
        const tallaApi = valid.tallas.find((t) => t.talla === item.talla);
        if (!tallaApi) {
          invalid[item.id] = { reason: "talla no disponible" };
          toast({
            title: "Talla no disponible",
            description: `${item.name} (${item.talla}) ya no está disponible y será eliminado del carrito en 4 segundos.`,
          });
          continue;
        }
        if (tallaApi.stock < item.quantity) {
          invalid[item.id] = { reason: "sin stock", stockDisponible: tallaApi.stock };
          toast({
            title: "Stock insuficiente",
            description: `${item.name} (${item.talla}) ya no tiene stock suficiente y será eliminado del carrito en 4 segundos.`,
          });
          continue;
        }
        // Validar precio
        if (typeof item.price === "number" && typeof valid.priceecommerce === "number" && item.price !== valid.priceecommerce) {
          invalid[item.id] = { reason: "precio cambiado", newPrice: valid.priceecommerce };
          toast({
            title: "Precio actualizado",
            description: `${item.name} (${item.talla}) cambió de precio. Actualiza tu carrito antes de pagar.`,
          });
        }
      }
      setInvalidItems(invalid);
    };
    validateCart();
    // eslint-disable-next-line
  }, [domLoaded, items]);

  return (
    <div className=" xl:pt-20">
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Resumen del pedido</p>
          <p className="">
            Revisa tus artículos. Y seleccione un método de envío adecuado.
          </p>
          <div className="mt-8 space-y-3 rounded-lg border  px-2 py-4  sm:px-6">
            {domLoaded && items.length === 0 && <CartItemsEmpty />}
            {domLoaded &&
              items?.map((el, i) => (
                <Link key={i} href={`/products/${el.slug}/${el.objectID}`}>
                  <li
                    key={el.id}
                    className={`flex flex-col items-center py-6 sm:flex-row sm:justify-between ${
                      invalidItems[el.id] ? "bg-red-100 border border-red-400" : ""
                    }`}
                  >
                    <div className="flex w-full items-center space-x-2 sm:space-x-4">
                      <img
                        className="shrink-0 rounded object-cover outline-none dark:border-transparent dark:bg-gray-500 w-24 sm:h-32 sm:w-32"
                        src={el?.image && urlForImage(el?.image).url()}
                        width={150}
                        alt="Polaroid camera"
                      />
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="flex w-full flex-col justify-between">
                          <div className="flex w-full justify-between space-x-2 pb-2">
                            <div className="space-y-1">
                              <h2 className="laptop:text-base text-xs font-bold sm:pr-8   xl:text-lg">
                                {el?.title}
                                {invalidItems[el.id]?.reason === "sin stock" && (
                                  <span className="ml-2 text-xs text-red-600 font-bold">Sin stock</span>
                                )}
                                {invalidItems[el.id]?.reason === "talla no disponible" && (
                                  <span className="ml-2 text-xs text-red-600 font-bold">Talla no disponible</span>
                                )}
                                {invalidItems[el.id]?.reason === "eliminado" && (
                                  <span className="ml-2 text-xs text-red-600 font-bold">Eliminado</span>
                                )}
                                {invalidItems[el.id]?.reason === "precio cambiado" && (
                                  <span className="ml-2 text-xs text-orange-600 font-bold">Precio actualizado</span>
                                )}
                              </h2>
                              <p className="text-sm dark:text-gray-400">
                                <p className="text-sm font-bold">
                                  Cantidad : ({el.quantity})
                                </p>
                                <p className="text-sm font-bold">
                                  Talla : {el.talla}
                                </p>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm sm:text-base font-semibold xl:text-lg">
                                S/{invalidItems[el.id]?.newPrice ? (invalidItems[el.id].newPrice * el.quantity).toFixed(2) : el.itemTotal?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex divide-x text-sm"></div>
                        </div>
                      </div>
                    </div>
                  </li>
                </Link>
              ))}
          </div>

          <p className="mt-8 text-lg font-medium">Métodos de envío</p>
          <form className="mt-5 ">
            <div className="relative ">
              <div className="flex flex-col gap-y-2 ">
                {/* envio */}
                <label>
                  <input
                    checked={tipoEntrega === "envio"}
                    onChange={(e) => setTipoEntrega(e.target.value)}
                    type="radio"
                    value="envio"
                    class="peer hidden"
                    name="framework"
                  />

                  <div class="flex items-center justify-between px-4 py-2 border-2 rounded-lg cursor-pointer text-sm  group peer-checked:border-green-300">
                    <h2 class="font-medium uppercase ">
                      {" "}
                      ENVÍO A DESTINO
                      <br />
                      <span>plazo máximo en 3 dias</span>
                    </h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      class="w-9 h-9 text-green-300  invisible group-[.peer:checked+&]:visible"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </label>
                {/* recojo */}
                <label>
                  <input
                    checked={tipoEntrega === "recojo"}
                    onChange={(e) => setTipoEntrega(e.target.value)}
                    type="radio"
                    value="recojo"
                    class="peer hidden"
                    name="framework"
                  />

                  <div class="flex items-center justify-between px-4 py-2 border-2 rounded-lg cursor-pointer text-sm  group peer-checked:border-green-300">
                    <h2 class="font-medium uppercase ">
                      {" "}
                      Recojo en tienda
                      <br />
                      <span>
                        {" "}
                        Fritz Sport, Av. Miguel Grau 231, Lima 15001
                      </span>
                    </h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      class="w-9 h-9 text-green-300  invisible group-[.peer:checked+&]:visible"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </label>
                {/* recojo en tienda */}
                {/* <label>
                    <input
                      checked={tipoEntrega === "recojo"}
                      onChange={(e) => setTipoEntrega(e.target.value)}
                      type="radio"
                      value="recojo"
                      class="peer hidden"
                      name="framework"
                    />

                    <div class="flex items-center justify-between px-4 py-2 border-2 rounded-lg cursor-pointer text-sm  group peer-checked:border-green-300">
                      <h2 class="font-medium max-w-2xl ">
                        {" "}
                        RECOJO EN TIENDA
                        <br />
                        <span>
                          Recojo en Tienda Fritz Sport, Av. Miguel Grau 231, Lima
                          15001
                        </span>
                      </h2>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        class="w-9 h-9 text-green-300 invisible group-[.peer:checked+&]:visible"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </label> */}
              </div>
            </div>
          </form>
        </div>
        <div className="mt-8 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 xl:px-16 2xl:ml-[1px]">
          <FormPagar 
            tipoEntrega={tipoEntrega} 
            userInfo={userInfo} 
            isPrimeraCompra={isPrimeraCompra}
            invalidItems={invalidItems}
            setInvalidItems={setInvalidItems}
          />
        </div>
      </div>
    </div>
  );
}
