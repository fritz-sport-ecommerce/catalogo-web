"use client";

import React, { useState } from "react";
import { Eye, MessageCircle } from "lucide-react";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import convertUSSizeToEuropean from "@/utils/convertir-talla-usa-eu";
import { useCart } from "react-use-cart";
import { useToast } from "@/components/ui/use-toast";

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<{ talla: string; _id?: string } | null>(null);
  const { addItem, items } = useCart();
  const { toast } = useToast();

  if (!isOpen || !product) return null;

  // Función para detectar si el producto es nuevo (menos de 30 días)
  const isProductNew = (product?: { _createdAt?: string }): boolean => {
    if (!product?._createdAt) return false;

    const createdAt = new Date(product._createdAt).getTime(); // milisegundos
    const now = Date.now(); // milisegundos actuales
    const diffTime = Math.abs(now - createdAt); // diferencia en ms
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // ms → días

    return diffDays <= 30;
  };

  // Función para detectar si el producto es popular
  const isProductHot = () => {
    return product?.popularidad && product.popularidad > 1;
  };

  const isNew = isProductNew();
  const isHot = isProductHot();

  // Filtrar tallas disponibles (con stock > 0)
  const availableSizes =
    product?.tallas?.filter((talla: any) => talla?.stock > 0) || [];

  // Obtener la imagen principal
  const mainImage =
    product?.images?.[selectedImageIndex] || product?.images?.[0];

  // Función para obtener la imagen del producto (con fallback y log)
  const getProductImage = () => {
    const mainRef = mainImage?.asset?._ref as string | undefined;
    const mainDirect = (mainImage as any)?.asset?.url as string | undefined;
    const catalogoRef = product?.imgcatalogomain?.asset?._ref as string | undefined;
    const catalogoDirect = product?.imgcatalogomain?.asset?.url as string | undefined;

    const mainUrl = mainRef ? urlForImage(mainRef as any).url() : mainDirect;
    const catalogoUrl = catalogoRef ? urlForImage(catalogoRef as any).url() : catalogoDirect;
    const finalUrl = mainUrl || catalogoUrl || "/placeholder-product.svg";

    if (typeof window !== 'undefined' && (Math.random() < 0.15 || !mainUrl && !catalogoUrl)) {
      console.log('🖼️ QuickView IMG DEBUG:', {
        sku: product?.sku,
        mainUrl,
        catalogoUrl,
        finalUrl,
      });
    }

    return finalUrl;
  };

  // Función para manejar el clic en el overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Navegación de imágenes
  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  // Opciones de almacén agregadas en base a talla seleccionada
  const warehouseOptions = (() => {
    if (!selectedSize) return [] as any[];
    const tallaSel = (product?.tallas || []).find((t: any) => t.talla === selectedSize.talla);
    const almacenes = (tallaSel?.almacenes || []).filter((a: any) => a.stock > 0);
    const agrupados = new Map();
    almacenes.forEach((alm: any) => {
      if (agrupados.has(alm.codigoAlmacen)) {
        const existent = agrupados.get(alm.codigoAlmacen);
        existent.stock_disponible += alm.stock;
      } else {
        agrupados.set(alm.codigoAlmacen, {
          codigo_almacen: alm.codigoAlmacen,
          nombre_almacen: alm.nombreAlmacen,
          almacen_tabla: alm.almacen,
          provincia: alm.provincia,
          stock_disponible: alm.stock,
        });
      }
    });
    return Array.from(agrupados.values());
  })();

  const onSelectSize = (talla: any) => {
    setSelectedSize({ talla: talla.talla, _id: talla._id });
  };

  // addToCartQuick removido en vista previa simplificada

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm modal-overlay"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white dark:bg-black rounded-2xl shadow-2xl relative w-full max-w-sm mx-auto sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-4 fade-in-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute z-50 top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 text-gray-600 dark:text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Vista previa
          </h2>
        </div>

        {/* Contenido principal */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda - Imagen principal (simple, igual que card) */}
            <div className="lg:col-span-1">
              <div className="rounded-xl mb-6 border border-gray-200 dark:border-gray-600">
                <div className="relative">
                  {/* Imagen principal */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-white">
                    <img
                      src={getProductImage()}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-product.svg";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Información simplificada */}
            <div className="lg:col-span-1">
              <div className="rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight mb-1">
                  {product?.name}
                </h3>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  SKU: {product?.sku} • {product?.genero}
                </div>

                {/* Precios - una sola columna en mobile */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="text-red-600 font-bold text-sm">Mayorista: {typeof product?.mayorista_cd === 'number' ? `S/${product.mayorista_cd.toFixed(2)}` : '----'}</div>
                  <div className="text-green-700 dark:text-green-400 font-medium">Emprendedor: {typeof product?.priceemprendedor === 'number' ? `S/${product.priceemprendedor.toFixed(2)}` : '----'}</div>
                  <div className="text-blue-700 dark:text-blue-400 font-medium">Retail: {typeof product?.priceecommerce === 'number' ? `S/${product.priceecommerce.toFixed(2)}` : '----'}</div>
                </div>

                {/* Tallas convertidas (EU) */}
                {Array.isArray(product?.tallas) && product.tallas.length > 0 && (
                  <div className="mb-2">
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 font-semibold uppercase tracking-wide">
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
                        .sort((a: any, b: any) => parseFloat(a.talla) - parseFloat(b.talla));
                      return (
                        <div className="flex flex-wrap gap-1">
                          {tallasOrdenadas.map((t: any, idx: number) => (
                            <span key={`${t._id || idx}-${t.talla}`} className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600">
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
                  href={`https://wa.me/51983478551?text=Hola, estoy interesado en el producto ${product?.name} (SKU: ${product?.sku})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contactar asesor
                </a>
              </div>

              {/* Sección de detalles removida para vista previa simplificada */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
