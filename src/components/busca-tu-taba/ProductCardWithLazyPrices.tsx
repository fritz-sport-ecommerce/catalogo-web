"use client";
import convertUSSizeToEuropean from "@/utils/convertir-talla-usa-eu";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

type Product = {
  _id: string;
  sku?: string;
  name?: string;
  images?: any[];
  imgcatalogomain?: any;
  genero?: string;
  marca?: string;
  slug?: string;
  tipo?: string;
  // Estos se cargarán después
  priceecommerce?: number;
  precio_retail?: number;
  mayorista_cd?: number;
  priceemprendedor?: number;
  tallascatalogo?: string;
  tallas?: any[];
  stock?: number;
};

function formatPrice(n?: number) {
  if (typeof n !== "number") return "----";
  return `S/${n.toFixed(2)}`;
}

export default function ProductCardWithLazyPrices({ product }: { product: Product }) {
  const imageUrl = product.imgcatalogomain?.asset?.url || product.images?.[0]?.asset?.url || "/placeholder.png";
  const productUrl = `/product/${product.slug || product.sku}`;

  // Obtener tallas disponibles (igual que IndependentProductCard)
  const tallasDisponibles = product?.tallascatalogo 
    ? product.tallascatalogo.split(',').map(t => t.trim()).filter(Boolean).slice(0, 8)
    : product?.tallas?.map((t: any) => t.talla || t).slice(0, 8) || [];
  
  const totalTallas = product?.tallascatalogo 
    ? product.tallascatalogo.split(',').length 
    : product?.tallas?.length || 0;

  // Los productos ya vienen filtrados con stock > 0 desde el endpoint
  return (
    <div className="h-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
      {/* Imagen del producto */}
      <a href={productUrl} className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square">
        <Image
          src={imageUrl}
          alt={product.name || "Producto"}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
      </a>

      {/* Contenido del producto */}
      <div className="flex-1 flex flex-col p-3">
        {/* Género y SKU */}
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="text-gray-500 dark:text-gray-400 uppercase">{product.genero || "---"}</span>
          <span className="text-gray-400 dark:text-gray-500">{product.sku}</span>
        </div>

        {/* Nombre del producto */}
        <a href={productUrl} className="block mb-2.5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors min-h-[2.5rem]">
            {product.name || "Sin nombre"}
          </h3>
        </a>

        {/* Precios */}
        <div className="space-y-1 mb-2.5">
          <p className="text-xs text-gray-500 dark:text-gray-400">Precios:</p>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded font-medium">
              R: {formatPrice(product.priceecommerce)}
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded font-medium">
              E: {formatPrice(product.priceemprendedor)}
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded font-medium">
              M: {formatPrice(product.mayorista_cd)}
            </div>
          </div>
        </div>

        {/* Tallas */}
       {Array.isArray(product?.tallas) && product.tallas.length > 0 && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mb-3">
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">
                  Tallas disponibles (EU)
                </div>
                {(() => {
                  const converted = convertUSSizeToEuropean(
                    product.tallas,
                    product?.genero || "",
                    (product?.marca || "").toString(),
                    undefined,
                    product?.tipo || ""
                  );
                  
                  // Ordenar tallas numéricamente
                  const tallasOrdenadas = converted
                    .filter((t) => (t?.stock ?? 0) > 0)
                    .sort((a, b) => {
                      const numA = parseFloat(a.talla);
                      const numB = parseFloat(b.talla);
                      return numA - numB;
                    });
                  
                  return (
                    <div className="flex flex-wrap gap-1">
                      {tallasOrdenadas.map((t, idx) => (
                        <span 
                          key={`${t._id || idx}-${t.talla}`} 
                          className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600"
                        >
                          {t.talla}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

        {/* Botón WhatsApp */}
        <a
          href={`https://wa.me/51982827352?text=Hola, estoy interesado en el producto ${product.name} (SKU: ${product.sku})`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-3  flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          Consultar
        </a>
      </div>
    </div>
  );
}
