"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CartItemsEmpty() {
  return (
    <div className="flex min-h-[500px] items-center justify-center p-8">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
        {/* Icono animado */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Contenido */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Tu carrito está vacío
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          ¡Es hora de llenarlo! Explora nuestra increíble colección de productos
          deportivos y encuentra lo que necesitas.
        </p>

        {/* Botones */}
        <div className="space-y-3 w-full">
          <Link href="/tienda" className="block">
            <Button
              size="lg"
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold py-4 h-auto transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Explorar productos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <Link href="/outlet" className="block">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold py-4 h-auto transition-all duration-300"
            >
              Ver ofertas especiales
            </Button>
          </Link>
        </div>

        {/* Características */}
        <div className="mt-8 grid grid-cols-1 gap-4 w-full">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Envío gratis en compras mayores a S/500</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Productos de las mejores marcas</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Garantía de calidad en todos los productos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
