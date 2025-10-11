"use client";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

type Product = {
  _id: string;
  _createdAt?: string;
  slug?: string;
  sku?: string;
  name?: string;
  images?: any[];
  imgcatalogomain?: any;
  priceecommerce?: number;
  mayorista_cd?: number;
  priceemprendedor?: number;
  preciomanual?: number;
  stock?: number;
};

function formatPrice(n?: number) {
  if (typeof n !== "number") return "----";
  return `S/${n.toFixed(2)}`;
}

export default function IndependentProductCard({ product, index }: { product: Product; index: number }) {
  const url = product?.sku
    ? `https://wa.me/51983478551?text=${encodeURIComponent(
        `Hola, me interesa el producto con SKU ${product?.sku}. ¿Me puedes asesorar?`
      )}`
    : "#";
  const mainImage = product?.imgcatalogomain?.asset?.url || product?.images?.[0]?.asset?.url;

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" className="group block border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:shadow-md transition">
      <div className="relative">
    

        {/* Stock badge */}
        {product?.stock !== undefined && product.stock <= 0 && (
          <div className="absolute right-2 top-2 z-10 bg-red-600 text-white text-xs font-semibold rounded px-2 py-1">
            Sin stock
          </div>
        )}

        {/* Image */}
        <div className="aspect-square bg-gray-50 dark:bg-zinc-900">
          {mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mainImage} alt={product?.name || "Producto"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="line-clamp-2 text-sm font-medium mb-2">{product?.name || "Producto"}</div>

        {/* Prices from Sanity */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Retail</span>
            <span className="text-sm font-semibold">{formatPrice(product?.priceecommerce ?? product?.preciomanual)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-xs text-gray-500">Emprendedor</span>
            <span className="text-xs">{formatPrice(product?.priceemprendedor)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-xs text-gray-500">Mayorista</span>
            <span className="text-xs">{formatPrice(product?.mayorista_cd)}</span>
          </div>
        </div>
        {/* CTA WhatsApp visual al final del contenido */}
        <div className="mt-3">
          <div className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm group-hover:bg-emerald-700">
            <MessageCircle className="w-4 h-4" />
            <span>Contactar a un asesor</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
