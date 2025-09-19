"use client";

import React, { useState } from "react";
import { Eye, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductPrecioDescuento from "./product-card/product-precio-descuento";
import AlmacenesPorTalla from "./almacenes-por-talla";
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
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [selectedAlmacen, setSelectedAlmacen] = useState<any>(null);
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

  // Función para obtener la imagen del producto
  const getProductImage = () => {
    if (mainImage?.asset?._ref) {
      return urlForImage(mainImage.asset._ref).url();
    }
    if (product?.imgcatalogomain?.asset?._ref) {
      return urlForImage(product.imgcatalogomain.asset._ref).url();
    }
    return "/placeholder-product.svg";
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
    setSelectedAlmacen(null);
  };

  const addToCartQuick = async () => {
    if (!selectedSize) {
      toast({ title: "Selecciona una talla" });
      return;
    }
    setLoadingAdd(true);
    try {
      const res = await fetch("/api/valid-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: [
            {
              sku: product.sku,
              empresa: product.empresa,
              genero: product.genero,
              marca: product.marca,
              tipo: product.tipo,
            },
          ],
          ciudad: "LIMA",
        }),
      });
      const validProducts = await res.json();
      const valid = validProducts.find((p: any) => p.sku === product.sku);
      if (!valid) throw new Error("Producto no válido");

      const tallaApi = valid.tallas.find((t: any) => t.talla === selectedSize.talla);
      if (!tallaApi || tallaApi.stock <= 0) {
        toast({ title: "Sin stock", description: "La talla seleccionada no tiene stock" });
        return;
      }

      // Validar almacén
      let almacenSel = selectedAlmacen;
      const opciones = warehouseOptions;
      if (opciones.length === 1) {
        almacenSel = opciones[0];
      }
      if (opciones.length > 1 && !almacenSel) {
        toast({ title: "Selecciona un almacén", description: "Elige el almacén de despacho" });
        return;
      }

      // Validar stock en carrito
      const enCarritoTotal = items.filter((i: any) => i.objectID === product.sku).reduce((acc: number, i: any) => acc + (i.quantity || 1), 0);
      const totalApi = valid.tallas.reduce((acc: number, t: any) => acc + (t.stock || 0), 0);
      if (totalApi - enCarritoTotal <= 0) {
        toast({ title: "Stock máximo en carrito" });
        return;
      }

      addItem({
        id: `${product.sku}-${selectedSize._id}`,
        name: product?.name,
        idsanity: product?.id,
        genero: product?.genero,
        empresa: product?.empresa,
        marca: product?.marca,
        tipo: product?.tipo,
        img: product.image,
        title: product.name,
        image: product?.images ? product?.images[0]?.asset?._ref : product?.imgcatalogomain?.asset?._ref,
        objectID: product.sku,
        price: product.priceecommerce,
        talla: String(`${selectedSize.talla}`),
        slug: product.slug,
        almacenes_disponibles: opciones,
        almacen_seleccionado: almacenSel || null,
      });
      toast({ title: "Agregado", description: "Producto agregado a la cotización" });
      onClose();
    } finally {
      setLoadingAdd(false);
    }
  };

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

          {/* Icono de vista rápida */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Vista Rápida
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Información completa del producto
          </p>
        </div>

        {/* Contenido principal */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda - Imágenes */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-600">
                <div className="relative">
                  {/* Imagen principal */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
                    <img
                      src={getProductImage()}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-product.svg";
                      }}
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {isNew && (
                        <div className="bg-green-600 px-2 py-1 rounded">
                          <span className="text-white text-xs font-semibold">
                            NEW
                          </span>
                        </div>
                      )}
                      {isHot && !isNew && (
                        <div className="bg-red-600 px-2 py-1 rounded">
                          <span className="text-white text-xs font-semibold">
                            HOT 🔥
                          </span>
                        </div>
                      )}
                      {isNew && isHot && (
                        <div className="bg-red-600 px-2 py-1 rounded">
                          <span className="text-white text-xs font-semibold">
                            HOT
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stock badge */}
                    {product?.stock > 0 && product?.stock <= 5 && (
                      <div className="absolute bottom-2 right-2 bg-orange-600 px-2 py-1 rounded">
                        <span className="text-white text-xs font-semibold">
                          ¡Últimos {product.stock}!
                        </span>
                      </div>
                    )}

                    {/* Navegación de imágenes */}
                    {product?.images && product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-700" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {product?.images && product.images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {product.images
                        .slice(0, 4)
                        .map((image: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                              selectedImageIndex === index
                                ? "border-blue-500"
                                : "border-gray-200 dark:border-gray-600"
                            }`}
                          >
                            {image?.asset?._ref ? (
                              <img
                                src={urlForImage(image.asset._ref).url()}
                                alt={`${product?.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <Eye className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha - Información del producto */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-start gap-4">
                  {/* Imagen pequeña del producto */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-gray-200 dark:ring-gray-600">
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

                  {/* Detalles del producto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight line-clamp-2 pr-2">
                        {product?.name}
                      </h3>
                    </div>

                    <div className="mb-3">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        SKU: {product?.sku}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                        • {product?.genero}
                      </span>
                    </div>

                    {/* Precio */}
                    <div className="mb-4">
                      <ProductPrecioDescuento dataProduct={product} />
                    </div>

                    {/* Stock total */}
                    <div className="mb-4">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Stock Total:{" "}
                      </span>
                      <span
                        className={`font-semibold ${
                          product?.stock <= 0
                            ? "text-red-600"
                            : product?.stock <= 5
                              ? "text-orange-600"
                              : "text-green-600"
                        }`}
                      >
                        {product?.stock <= 0
                          ? "Sin stock"
                          : product?.stock <= 5
                            ? `Solo ${product.stock}`
                            : `${product.stock > 10 ? "10+" : product.stock} disponibles`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tallas disponibles */}
              <div className="bg-gradient-to-r rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tallas Disponibles
                </h3>
                {availableSizes.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                    {availableSizes.map((talla: any, index: number) => {
                      const isSelected = selectedSize?.talla === talla.talla;
                      return (
                        <button
                          type="button"
                          key={index}
                          onClick={() => onSelectSize(talla)}
                          className={`p-3 text-center border rounded-lg transition-colors ${
                            isSelected ? 'border-blue-500 ring-2 ring-blue-200' : talla.stock <= 3
                              ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-gray-300 bg-white dark:bg-gray-700 hover:border-blue-500'
                          }`}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white">{talla.talla}</div>
                          <div className={`text-xs ${talla.stock <= 3 ? 'text-orange-600' : 'text-gray-500 dark:text-gray-400'}`}>
                            {talla.stock <= 3 ? `Solo ${talla.stock}` : `${talla.stock} disponibles`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No hay tallas disponibles</p>
                  </div>
                )}

                {/* Selección de almacén si hay talla elegida */}
                {selectedSize && warehouseOptions.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Selecciona almacén</label>
                    <select
                      value={selectedAlmacen?.codigo_almacen || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const obj = warehouseOptions.find((o: any) => String(o.codigo_almacen) === String(val));
                        setSelectedAlmacen(obj || null);
                      }}
                      className="w-full border rounded-md px-3 py-2 bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm"
                    >
                      <option value="">{warehouseOptions.length > 1 ? 'Elige un almacén' : 'Único almacén disponible'}</option>
                      {warehouseOptions.map((o: any) => (
                        <option key={o.codigo_almacen} value={o.codigo_almacen}>
                          {o.nombre_almacen} ({o.provincia}) · Stock: {o.stock_disponible}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {/* Información de almacenes por talla */}
                {availableSizes.length > 0 && (
                  <AlmacenesPorTalla
                    tallas={product?.tallas || []}
                    className="mt-4"
                  />
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/products/${product?.slug}/${product?.sku}`} className="flex-1">
                  <Button className="w-full rounded-none">Ver Detalles</Button>
                </Link>
                {product?.stock > 0 && (
                  <Button
                    variant="outline"
                    className="flex-1 rounded-none"
                    disabled={loadingAdd}
                    onClick={addToCartQuick}
                  >
                    {loadingAdd ? (
                      <span className="inline-flex items-center"><svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" /><span>Agregando...</span></span>
                    ) : (
                      <span className="inline-flex items-center"><ShoppingCart className="w-4 h-4 mr-2" />Agregar a cotización</span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
