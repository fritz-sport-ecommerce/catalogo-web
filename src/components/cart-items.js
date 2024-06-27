"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import { X } from "lucide-react";
import { useCart } from "react-use-cart";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItemsEmpty } from "@/components/cart-items-empty";

export function CartItems() {
  const [clientState, setClientState] = useState(false);
  useEffect(() => {
    setClientState(true);
  }, []);
  //test
  const { items, removeItem } = useCart();
  return (
    <>
      {clientState && (
        <div
          role="list"
          className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-500 dark:border-gray-500"
        >
          {items.length === 0 && <CartItemsEmpty />}
          {items.map((el) => (
            <div key={"key"} className="flex py-6 sm:py-10">
              <div className="shrink-0">
                {/* <Image
               src={urlForImage(el.image).url()}
                alt={"alt"}
                           width={150}
  
                height={0}
                className="h-24 w-24 rounded-md border-2 border-gray-200 object-cover object-center dark:border-gray-800 sm:h-48 sm:w-48"
              /> */}
                <img
                  className="h-24 w-24 rounded-md border-2 border-gray-200 object-cover object-center dark:border-gray-800 sm:h-48 sm:w-48"
                  src={urlForImage(el?.image).url()}
                  width={150}
                  alt="Polaroid camera"
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="relative justify-between sm:flex sm:gap-x-6  gap-x-0 sm:pr-0">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-sm">
                        <Link
                          href={`/products/${el.slug}/${el.objectID}`}
                          className="font-medium"
                        >
                          {el.name}
                        </Link>
                      </h3>
                    </div>
                    <p className="mt-1 text-sm font-medium">
                      Precio por unidad: S/{el.price}
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      Talla: {/* @ts-ignore */}
                      <strong>{el.talla}</strong>
                    </p>
                  </div>

                  <div className="mt-4 flex items-center  sm:mt-0 sm:pr-9">
                    <span className="mr-3"> Cantidad:</span>
                    <label htmlFor={`quantity-`} className="sr-only">
                      Quantity, Name
                    </label>
                    <Input
                      id={`quantity-`}
                      name={`quantity-`}
                      type="number"
                      className="w-16"
                      value={el.quantity}
                    />
                    <div className=" right-0 top-0  ">
                      <Button
                        onClick={() => removeItem(el.id)}
                        variant="ghost"
                        type="button"
                        className="-mr-2 inline-flex p-2"
                      >
                        <span className="sr-only">Remove</span>
                        <X className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* <p className="mt-4 flex space-x-2 text-sm">
                  <Clock className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>Se envía en 1 semana</span>
                </p> */}
                <p className="mt-4 flex space-x-2 text-sm">
                  {/* <Clock className="h-5 w-5 shrink-0" aria-hidden="true" /> */}
                  <span>Precio total: S/{el.itemTotal} </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
