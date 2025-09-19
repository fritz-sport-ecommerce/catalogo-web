"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useCart } from "react-use-cart";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, Truck, Shield, ArrowRight } from "lucide-react";

export function CartSummary() {
  const { cartTotal, items } = useCart();
  const { data: session } = useSession();
  const [clientState, setClientState] = useState(false);
  
  useEffect(() => {
    setClientState(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const shippingCost = cartTotal >= 500 ? 0 : 20;
  const totalWithShipping = cartTotal + shippingCost;

  return (
    <>
      {clientState && (
        <div className="sticky top-8">
          <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r ">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Resumen del pedido
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {items.length} {items.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* Desglose de precios */}
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatPrice(cartTotal)}
                  </dd>
                </div>
                
                <div className="flex items-center justify-between">
                  <dt className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Truck className="w-4 h-4 mr-2" />
                    Envío
                  </dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {shippingCost === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">¡Gratis!</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </dd>
                </div>

                {/* Mensaje de envío gratis */}
                {cartTotal < 500 && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                    <p className="text-xs text-amber-800 dark:text-amber-200 text-center">
                      💡 Agrega {formatPrice(500 - cartTotal)} más para envío gratis
                    </p>
                  </div>
                )}

                {cartTotal >= 500 && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <p className="text-xs text-green-800 dark:text-green-200 font-semibold">
                        ¡Felicidades! Tienes envío gratis
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-lg font-semibold text-gray-900 dark:text-white">Total</dt>
                    <dd className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatPrice(totalWithShipping)}
                    </dd>
                  </div>
                </div>
              </dl>

              {/* Botón de pago */}
              <div className="space-y-3">
                <Link href={session ? "/pagar" : "/auth?form=pagar"} className="block">
                  <Button 
                    size="lg"
                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold py-4 h-auto transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceder al pago
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                {!session && (
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Necesitas iniciar sesión para continuar
                  </p>
                )}
              </div>

              {/* Garantías */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Envío rápido y confiable</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <CreditCard className="w-4 h-4 text-purple-500" />
                  <span>Múltiples métodos de pago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
