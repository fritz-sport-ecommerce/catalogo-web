"use client";
import { MessageCircle } from "lucide-react";
import { track } from "@vercel/analytics/react"; // ← Importa el tracker

type Product = {
  _id: string;
  _createdAt?: string;
  slug?: string;
  sku?: string;
  name?: string;
  images?: any[];
  imgcatalogomain?: any;
  priceecommerce?: number;
  precio_retail?: number;
  mayorista_cd?: number;
  precio_mayorista?: number;
  priceemprendedor?: number;
  precio_emprendedor?: number;
  preciomanual?: number;
  stock?: number;
  stockDisponible?: number;
  tallas?: any[];
  tallascatalogo?: string;
};

function formatPrice(n?: number) {
  if (typeof n !== "number") return "----";
  return `S/${n.toFixed(2)}`;
}

export default function IndependentProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const url = product?.sku
    ? `https://wa.me/51983478551?text=${encodeURIComponent(
        `Hola, me interesa el producto con SKU ${product?.sku}. ¿Me puedes asesorar?`
      )}`
    : "#";

  const mainImage =
    product?.imgcatalogomain?.asset?.url || product?.images?.[0]?.asset?.url;

  const precioRetail =
    product?.precio_retail ?? product?.priceecommerce ?? product?.preciomanual;
  const precioEmprendedor =
    product?.precio_emprendedor ?? product?.priceemprendedor;
  const precioMayorista =
    product?.precio_mayorista ?? product?.mayorista_cd;
  const stockTotal = product?.stockDisponible ?? product?.stock;

  const tallasDisponibles = product?.tallascatalogo
    ? product.tallascatalogo
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 8)
    : product?.tallas?.map((t: any) => t.talla || t).slice(0, 8) || [];

  // ✅ Handler para tracking + redirección
  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // 1️⃣ Enviar evento a Vercel Analytics
    track("contactar_asesor_click", {
      sku: product?.sku || "",
      nombre: product?.name || "",
      index,
    });

    // 2️⃣ Redirigir a WhatsApp
    window.open(url, "_blank");
  };

  return (
    <div className="group block border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:shadow-lg transition-all">
      {/* Botón superior de contacto */}
      <a
        href={url}
        onClick={handleContactClick}
        className="block bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all"
      >
        <div className="flex items-center justify-center gap-2 px-3 py-2.5 text-white">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-semibold">Contactar Asesor</span>
        </div>
      </a>

      <div className="relative">
        {stockTotal !== undefined && stockTotal <= 0 && (
          <div className="absolute right-2 top-2 z-10 bg-red-600 text-white text-xs font-semibold rounded px-2 py-1">
            Sin stock
          </div>
        )}
        {stockTotal !== undefined && stockTotal > 0 && (
          <div className="absolute right-2 top-2 z-10 bg-green-600 text-white text-xs font-semibold rounded px-2 py-1">
            Stock: {stockTotal}
          </div>
        )}

        <div className="aspect-square bg-gray-50 dark:bg-zinc-900">
          {mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mainImage}
              alt={product?.name || "Producto"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin imagen
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="line-clamp-2 text-sm font-medium mb-3 min-h-[2.5rem]">
          {product?.name || "Producto"}
        </div>

        {tallasDisponibles.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
              Tallas disponibles:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tallasDisponibles.map((talla: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded border border-gray-200 dark:border-gray-700"
                >
                  {talla}
                </span>
              ))}
              {(product?.tallascatalogo?.split(",").length ||
                product?.tallas?.length ||
                0) > 8 && (
                <span className="inline-block px-2 py-0.5 text-xs font-medium text-gray-500">
                  +
                  {(product?.tallascatalogo?.split(",").length ||
                    product?.tallas?.length ||
                    0) - 8}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Retail
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {formatPrice(precioRetail)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Emprendedor
            </span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {formatPrice(precioEmprendedor)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Mayorista
            </span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {formatPrice(precioMayorista)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
