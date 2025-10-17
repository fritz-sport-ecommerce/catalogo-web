import ProductOfertStyle from "./product-ofert-style";
import ProductInfo from "./product-info";
import LoveFollow from "@/components/love-follow/love-follow";
import QuickViewModal from "../quick-view-modal";

import ImageReplaceEcommerceCatalogo from "@/components/imageReplaceEcommerceCatalogo";
import convertUSSizeToEuropean from "@/utils/convertir-talla-usa-eu";
import Link from "next/link";
import { useState } from "react";
import { Eye } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Product({
  products,

}) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const pathname = usePathname();
  
  // Solo mostrar vista rápida en la página de tienda
  const showQuickView = pathname === '/tienda' || pathname === '/tienda-mayorista';
  const isBuscaTuTaba = pathname === '/busca-tu-taba' || pathname?.startsWith('/busca-tu-taba');
  const whatsappHref = `https://wa.me/51983478551?text=${encodeURIComponent(`Hola, me interesa el producto con SKU ${products?.sku}. ¿Me puedes asesorar?`)}`;
  const cardHref = isBuscaTuTaba
    ? whatsappHref
    : `/products/${products?.slug}/${products?.sku}`;

  // Función para detectar si el producto es nuevo (menos de 30 días)
  const isProductNew = () => {
    if (!products?._createdAt) return false;
    
    const createdAt = new Date(products._createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 30; // Producto es nuevo si tiene menos de 30 días
  };

  // Función para detectar si el producto es popular
  const isProductHot = () => {
    return products?.popularidad && products.popularidad > 1;
  };

  const isNew = isProductNew();
  const isHot = isProductHot();

  return (
    <>
    <div className="group z-10">
      <div className="h-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Imagen del producto */}
        <Link href={cardHref} className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 block">
          <ImageReplaceEcommerceCatalogo products={products} />
          <LoveFollow product={products} view={true} />
          
          {/* Botón de Vista Rápida - Solo en /tienda */}
          {showQuickView && products?.stock > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
              title="Vista Rápida"
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </button>
          )}
          
          {/* Badge NUEVO */}
          {isNew && (
            <div className="absolute top-2 right-2 bg-green-600 px-2 py-1 rounded shadow-md z-10">
              <span className="text-white text-xs font-semibold">NUEVO</span>
            </div>
          )}
          
          {/* Badge de stock */}
          {products?.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded font-bold">SIN STOCK</span>
            </div>
          )}
        </Link>
        
        {/* Contenido del producto */}
        <div className="flex-1 flex flex-col p-3 space-y-2.5">
          {/* Descuento y oferta */}
          <ProductOfertStyle
            products={products}
            stock={products.stock}
          />

          {/* Información básica */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium capitalize">{products?.genero}</span>
            <span className="font-semibold text-gray-600 dark:text-gray-400">{products?.sku}</span>
          </div>
          
          {/* Nombre del producto */}
          <Link href={cardHref}>
            <h3 className="text-sm font-bold capitalize text-gray-900 dark:text-white line-clamp-2 min-h-[2.8rem] hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer leading-snug">
              {products?.name}
            </h3>
          </Link>

          {/* Precios */}
          <ProductInfo dataProduct={products} />

          {/* Tallas disponibles */}
          {Array.isArray(products?.tallas) && products.tallas.length > 0 && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">
                Tallas disponibles (EU)
              </div>
              {(() => {
                const converted = convertUSSizeToEuropean(
                  products.tallas,
                  products?.genero || "",
                  (products?.marca || "").toString(),
                  undefined,
                  products?.tipo || ""
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

          {/* CTA WhatsApp */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 hover:shadow-md transition-all mt-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Contactar asesor
          </a>
        </div>
      </div>
    </div>
    {/* Modal de Vista Rápida - Solo en /tienda */}
    {showQuickView && (
      <QuickViewModal
        product={products}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    )}
    </>
  );
}
