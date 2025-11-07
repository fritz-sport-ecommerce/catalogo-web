"use client";
import convertUSSizeToEuropean from "@/utils/convertir-talla-usa-eu";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { track } from "@vercel/analytics"; // ✅ para registrar clicks
import { urlForImage } from "@/sanity/lib/image";

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
  _createdAt?: string | Date;
  fecha_cuando_aparece?: string | null;
  priceecommerce?: number;
  precio_retail?: number;
  mayorista_cd?: number;
  priceemprendedor?: number;
  tallascatalogo?: string;
  tallas?: any[];
  stock?: number;
  hasMatchingSize?: boolean;
};

function formatPrice(n?: number) {
  if (typeof n !== "number") return "----";
  return `S/${n.toFixed(2)}`;
}

export default function ProductCardWithLazyPrices({
  product,
  index,
  isHighlighted = false,
}: {
  product: Product;
  index?: number;
  isHighlighted?: boolean;
}) {
  console.log("📋 ProductCardWithLazyPrices - Renderizando producto:", {
    _id: product._id,
    sku: product.sku,
    name: product.name,
    hasImages: !!(product.imgcatalogomain || product.images),
    hasPrices: !!(
      product.priceecommerce ||
      product.mayorista_cd ||
      product.priceemprendedor
    ),
  });

  const getImageUrl = () => {
    const catalogoRef = product?.imgcatalogomain?.asset?._ref as string | undefined;
    const catalogoDirect = product?.imgcatalogomain?.asset?.url as string | undefined;
    const firstRef = product?.images?.[0]?.asset?._ref as string | undefined;
    const firstDirect = product?.images?.[0]?.asset?.url as string | undefined;

    const catalogoImg = catalogoRef ? urlForImage(catalogoRef as any).url() : catalogoDirect;
    const firstImg = firstRef ? urlForImage(firstRef as any).url() : firstDirect;
    
    // Fallback: imagen SVG en data URL
    const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%239ca3af'%3ESin Imagen%3C/text%3E%3C/svg%3E";

    const finalUrl = catalogoImg || firstImg || fallback;

    if (product.sku && (Math.random() < 0.1 || !catalogoImg && !firstImg)) {
      console.log("🖼️ IMG DEBUG:", {
        sku: product.sku,
        catalogoImg,
        firstImg,
        finalUrl,
      });
    }

    return finalUrl;
  };

  const imageUrl = getImageUrl();
  const productUrl = `/product/${product.slug || product.sku}`;
  const now = new Date();
  const refDateStr =
    (product?.fecha_cuando_aparece as string) ||
    (product?._createdAt as string) ||
    "";
  const refDate = refDateStr ? new Date(refDateStr) : null;
  const isNew = refDate
    ? (now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24) <= 21
    : false;

  const tallasDisponibles = product?.tallascatalogo
    ? product.tallascatalogo
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 8)
    : product?.tallas?.map((t: any) => t.talla || t).slice(0, 8) || [];

  const totalTallas = product?.tallascatalogo
    ? product.tallascatalogo.split(",").length
    : product?.tallas?.length || 0;

  const whatsappUrl = `https://wa.me/51983478551?text=Hola, estoy interesado en el producto ${product.name} (SKU: ${product.sku})`;

  return (
    <div className={`h-full flex flex-col border rounded-lg overflow-hidden transition-all ${
      isHighlighted 
        ? 'border-green-500 dark:border-green-400 shadow-lg ring-2 ring-green-500/20 dark:ring-green-400/20' 
        : 'border-gray-200 dark:border-gray-700 hover:shadow-lg'
    }`}>
      {/* Imagen del producto - sin link; el click lo maneja el contenedor padre para abrir modal */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        {isHighlighted && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded bg-green-600 text-white shadow">
              ✓ Tu talla
            </span>
          </div>
        )}
        {isNew && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded bg-red-600 text-white shadow">
              Nuevo
            </span>
          </div>
        )}
        <Image
          src={imageUrl}
          alt={product.name || "Producto"}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
      </div>

      {/* Contenido del producto */}
      <div className="flex-1 flex flex-col xl:p-3 p-2">
        {/* Género y SKU */}
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="text-gray-500 dark:text-gray-400 uppercase text-sm xl:text-base">
            {product.genero || "---"}
          </span>
          <span className="text-gray-400 dark:text-gray-500 text-sm xl:text-base">
            {product.sku}
          </span>
        </div>

        {/* Nombre */}
        <div className="block mb-2.5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[2.5rem]">
            {product.name || "Sin nombre"}
          </h3>
        </div>

        {/* Precios */}
        <div className="space-y-1 mb-2.5">
          <div className="flex flex-wrap flex-col gap-y-2 gap-1.5 text-xs">
            <div className="text-red-600 pl-2 py-1.5 rounded-lg font-bold text-sm">
              Mayorista: {formatPrice(product.mayorista_cd)}
            </div>
            <div className="text-green-700 dark:text-green-400 px-2 py-1 rounded font-medium">
              Emprendedor: {formatPrice(product.priceemprendedor)}
            </div>
            <div className="text-blue-700 dark:text-blue-400 px-2 py-1 rounded font-medium">
              Retail: {formatPrice(product.priceecommerce)}
            </div>
          </div>
        </div>
        <div className="min-h-[100px]">


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
              ) as any[];

              const tallasOrdenadas = converted
                .filter((t: any) => (t?.stock ?? 0) > 0)
                .sort((a: any, b: any) => {
                  const numA = parseFloat(a.talla);
                  const numB = parseFloat(b.talla);
                  return numA - numB;
                });

              return (
                <div className="flex flex-wrap gap-1">
                  {tallasOrdenadas.map((t: any, idx: number) => (
                    <span
                      key={`${t._id || idx}-${t.talla}`}
                      className="px-1.5 py-0.5 text-[12px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600"
                    >
                      {t.talla}
                    </span>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        </div>

        {/* ✅ Botón WhatsApp con tracking completo (no abre modal) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            track("contactar_asesor_click", {
              sku: product?.sku ?? "",
              nombre: product?.name ?? "",
              genero: product?.genero ?? "",
              marca: product?.marca ?? "",
              precio_mayorista: product?.mayorista_cd ?? 0,
              precio_emprendedor: product?.priceemprendedor ?? 0,
              precio_retail: product?.priceecommerce ?? 0,
              tiene_talla_buscada: isHighlighted,
              posicion: index ?? 0,
              timestamp: new Date().toISOString(),
            });
          }}
          className="mt-auto pt-3 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          Consultar
        </a>
      </div>
    </div>
  );
}
