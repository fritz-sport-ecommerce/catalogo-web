"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useCart } from "react-use-cart";

import { Button } from "@/components/ui/button";

export function CartSummary() {
  function onCheckout() {}
  const { cartTotal } = useCart();

  const [clientState, setClientState] = useState(false);
  useEffect(() => {
    setClientState(true);
  }, []);
  return (
    <>
      {clientState && (
        <section
          aria-labelledby="summary-heading"
          className="sticky bottom-0 mt-16 rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-6 shadow-md dark:border-gray-900 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 xl:top-36"
        >
          <h2 id="summary-heading" className="text-lg font-medium">
            Resumen de Pedido
          </h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm">Subtotal</dt>
              <dd className="text-sm font-medium">S/{cartTotal.toFixed(0)}</dd>
            </div>
            {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
                <dt className="flex items-center text-sm">
                  <span>Costo de Envió</span>
                </dt>
                <dd className="text-sm font-medium">S/5</dd>
              </div> */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
              <dt className="text-base font-medium">Total a Pagar</dt>
              <dd className="text-base font-medium">
                S/{cartTotal.toFixed(0)}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <Link href={"/pagar"}>
              <Button className="w-full font-semibold rounded-none uppercase">
                {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
                Pagar
              </Button>
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
