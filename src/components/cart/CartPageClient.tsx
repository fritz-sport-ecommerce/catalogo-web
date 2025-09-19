"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItems } from "@/components/cart-items";
import { CartSummary } from "@/components/cart-summary";
import AccesoriosCarrito from "@/components/carrito/accesorios-carrito";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { QuoteDocument } from "@/components/quote-pdf";
import { useCart } from "react-use-cart";

export default function CartPageClient() {
  const [quoteMode, setQuoteMode] = useState<boolean>(true);
  const { items, cartTotal } = useCart();

  const title = quoteMode ? "Cotización" : "Carrito de Compras";
  const subtitle = quoteMode
    ? "Arma tu cotización y compártela en PDF"
    : "Revisa tus productos antes de continuar";
  const sectionTitle = quoteMode ? "Productos en tu cotización" : "Productos en tu carrito";

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link href="/tienda">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 xl:py-0 py-7 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Seguir comprando
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                </div>
              </div>
            </div>

            {/* Exportar PDF en modo cotización */}
            {/* {quoteMode && items.length > 0 && (
              <PDFDownloadLink
                document={<QuoteDocument items={items} subtotal={cartTotal} />}
                fileName={`cotizacion-fritz-sport.pdf`}
                className="inline-flex"
              >
                {({ loading }) => (
                  <Button variant="outline" className="border-2">
                    <FileDown className="w-4 h-4 mr-2" />
                    {loading ? "Generando PDF..." : "Exportar PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )} */}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Sección de productos */}
          <section aria-labelledby="cart-heading" className="lg:col-span-8">
            <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{sectionTitle}</h2>
              </div>
              <CartItems />
            </div>

            {/* Accesorios sugeridos en mobile */}
            <div className="lg:hidden mt-8">
              <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Productos recomendados</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Completa tu compra con estos productos</p>
                </div>
                <AccesoriosCarrito />
              </div>
            </div>
          </section>

          {/* Resumen del carrito */}
          <aside className="lg:col-span-4 mt-8 lg:mt-0">
            <CartSummary quoteMode={quoteMode} onToggleQuoteMode={setQuoteMode} />
          </aside>
        </div>

        {/* Accesorios sugeridos en desktop */}
        <div className="hidden lg:block mt-12">
          <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Productos recomendados</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completa tu outfit con estos productos seleccionados</p>
                </div>
              </div>
            </div>
            <AccesoriosCarrito />
          </div>
        </div>
      </main>
    </div>
  );
}
