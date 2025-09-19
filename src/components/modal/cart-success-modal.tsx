"use client";
import { useEffect, useState } from "react";
import {
  ShoppingBag,
  ArrowRight,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import { useCart } from "react-use-cart";

interface RecommendedProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  priceecommerce: number;
  precio_original?: number;
  images?: any[];
  imgcatalogomain?: any;
  tipo: string;
  genero: string;
  marca: string;
  stock?: number;
  linea_liquidacion?: boolean;
}

interface CartSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    image?: any;
    images?: any[];
    imgcatalogomain?: any;
    priceecommerce: number;
    precio_original?: number;
    slug: string;
    genero?: string;
    tipo?: string;
  };
  selectedSize: string;
}

const CartSuccessModal = ({
  isOpen,
  onClose,
  product,
  selectedSize,
}: CartSuccessModalProps) => {
  const { items, cartTotal } = useCart();
  const [recommendedProducts, setRecommendedProducts] = useState<
    RecommendedProduct[]
  >([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  // Función para obtener productos recomendados usando API
  const fetchRecommendedProducts = async () => {
    if (!isOpen) return;

    setLoading(true);
    try {
      console.log("Fetching recommended products for:", {
        tipo: product.tipo,
        genero: product.genero,
        productName: product.name,
      });

      // Usar el API fetch-product con parámetros inteligentes
      let apiUrl = "/api/fetch-product?start=0&provincia=LIMA";

      // Agregar filtro de género si está disponible
      if (product.genero) {
        apiUrl += `&genero=${encodeURIComponent(product.genero)}`;
      }

      // Lógica inteligente según el tipo de producto
      if (product.tipo === "calzado") {
        // Para calzado: buscar accesorios principalmente del mismo género
        apiUrl += "&tipo=accesorios";
      } else if (product.tipo === "ropa") {
        // Para ropa: buscar accesorios del mismo género
        apiUrl += "&tipo=accesorios";
      } else {
        // Para accesorios: buscar cualquier producto del mismo género
        apiUrl += "&tipo=all";
      }

      console.log("API URL:", apiUrl);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const apiProducts = await response.json();
      console.log("API response:", apiProducts?.length || 0);

      if (apiProducts && apiProducts.length > 0) {
        // Filtrar productos válidos (con stock, precio y del mismo género)
        let validProducts = apiProducts.filter((p: any) => {
          const hasStock = p.stock > 0;
          const hasPrice = p.priceecommerce > 0;
          const sameGender =
            !product.genero ||
            !p.genero ||
            p.genero.toLowerCase() === product.genero?.toLowerCase();

          return hasStock && hasPrice && sameGender;
        });

        // Si no hay suficientes productos del mismo género, buscar productos similares
        if (validProducts.length < 4 && product.genero) {
          console.log(
            "Not enough products with same gender, expanding search..."
          );
          const expandedProducts = apiProducts.filter(
            (p: any) => p.stock > 0 && p.priceecommerce > 0
          );

          // Priorizar productos del mismo género pero incluir otros si es necesario
          const sameGenderProducts = expandedProducts.filter(
            (p: any) =>
              p.genero &&
              product.genero &&
              p.genero.toLowerCase() === product.genero.toLowerCase()
          );
          const otherProducts = expandedProducts.filter(
            (p: any) =>
              !p.genero ||
              !product.genero ||
              p.genero.toLowerCase() !== product.genero.toLowerCase()
          );

          validProducts = [...sameGenderProducts, ...otherProducts];
        }

        validProducts = validProducts.slice(0, 8);
        console.log(
          "Valid products with same gender:",
          validProducts?.length || 0
        );
        setRecommendedProducts(validProducts);
      } else {
        // Fallback: hacer una segunda llamada sin filtros específicos pero manteniendo género
        console.log("No products found, trying fallback...");
        let fallbackUrl = "/api/fetch-product?start=0&provincia=LIMA";
        if (product.genero) {
          fallbackUrl += `&genero=${encodeURIComponent(product.genero)}`;
        }

        const fallbackResponse = await fetch(fallbackUrl);

        if (fallbackResponse.ok) {
          const fallbackProducts = await fallbackResponse.json();
          console.log("Fallback products:", fallbackProducts?.length || 0);

          if (fallbackProducts && fallbackProducts.length > 0) {
            const validProducts = fallbackProducts
              .filter((p: any) => p.stock > 0 && p.priceecommerce > 0)
              .slice(0, 8);

            setRecommendedProducts(validProducts);
          } else {
            // Último fallback sin filtro de género
            const finalFallbackResponse = await fetch(
              "/api/fetch-product?start=0&provincia=LIMA"
            );
            if (finalFallbackResponse.ok) {
              const finalProducts = await finalFallbackResponse.json();
              if (finalProducts && finalProducts.length > 0) {
                const validProducts = finalProducts
                  .filter((p: any) => p.stock > 0 && p.priceecommerce > 0)
                  .slice(0, 8);
                setRecommendedProducts(validProducts);
              } else {
                setRecommendedProducts([]);
              }
            } else {
              setRecommendedProducts([]);
            }
          }
        } else {
          setRecommendedProducts([]);
        }
      }
    } catch (error) {
      console.error("Error fetching recommended products:", error);

      // Fallback final: intentar obtener productos sin filtros
      try {
        const fallbackResponse = await fetch(
          "/api/fetch-product?start=0&provincia=LIMA"
        );
        if (fallbackResponse.ok) {
          const fallbackProducts = await fallbackResponse.json();
          if (fallbackProducts && fallbackProducts.length > 0) {
            const validProducts = fallbackProducts
              .filter((p: any) => p.stock > 0 && p.priceecommerce > 0)
              .slice(0, 8);
            setRecommendedProducts(validProducts);
          } else {
            setRecommendedProducts([]);
          }
        } else {
          setRecommendedProducts([]);
        }
      } catch (finalError) {
        console.error("Final fallback failed:", finalError);
        setRecommendedProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened with product:", product);
      fetchRecommendedProducts();
      setCurrentSlide(0);
     
      document.body.classList.add("modal-open");
      document.body.classList.add("no-scroll");
    }else {
   
      document.body.classList.remove("modal-open");
      document.body.classList.remove("no-scroll");
    }
   
  }, [isOpen, product.genero, product.tipo]);

  if (!isOpen) return null;
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    
      document.body.classList.remove("modal-open");
    }
  };

  // Obtener la imagen del producto
  const getProductImage = () => {
    if (product.images && product.images[0]?.asset?._ref) {
      return urlForImage(product.images[0]).url();
    }
    if (product.imgcatalogomain?.asset?._ref) {
      return urlForImage(product.imgcatalogomain).url();
    }
    return "/placeholder-product.svg";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Función para obtener productos por slide según el tamaño de pantalla
  const getProductsPerSlide = () => {
    // Responsive: 1 en mobile, 2 en tablet, 3 en desktop
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3; // lg y superior
      if (window.innerWidth >= 640) return 2; // sm y md
    }
    return 1; // mobile
  };

  // Funciones para el carousel
  const nextSlide = () => {
    if (recommendedProducts.length > 0) {
      const productsPerSlide = getProductsPerSlide();
      setCurrentSlide(
        (prev) =>
          (prev + 1) % Math.ceil(recommendedProducts.length / productsPerSlide)
      );
    }
  };

  const prevSlide = () => {
    if (recommendedProducts.length > 0) {
      const productsPerSlide = getProductsPerSlide();
      setCurrentSlide(
        (prev) =>
          (prev -
            1 +
            Math.ceil(recommendedProducts.length / productsPerSlide)) %
          Math.ceil(recommendedProducts.length / productsPerSlide)
      );
    }
  };

  const getRecommendedProductImage = (product: RecommendedProduct) => {
    if (product.images && product.images[0]?.asset?._ref) {
      return urlForImage(product.images[0]).url();
    }
    if (product.imgcatalogomain?.asset?._ref) {
      return urlForImage(product.imgcatalogomain).url();
    }
    return "/placeholder-product.svg";
  };

  // Función para obtener el título dinámico según el tipo de producto y género
  const getRecommendationTitle = () => {
    const generoText = product.genero ? ` para ${product.genero}` : "";

    if (product.tipo === "calzado") {
      return `Complementa tu calzado${generoText}`;
    } else if (product.tipo === "ropa") {
      return `Accesorios perfectos${generoText}`;
    } else {
      return `También te puede interesar${generoText}`;
    }
  };

  // Función para obtener el subtítulo dinámico
  const getRecommendationSubtitle = () => {
    const generoText = product.genero ? ` ${product.genero}` : "";

    if (product.tipo === "calzado") {
      return `Productos${generoText} que combinan perfecto`;
    } else if (product.tipo === "ropa") {
      return `Completa tu look${generoText}`;
    } else {
      return `Productos${generoText} relacionados`;
    }
  };

  // Calcular el porcentaje de descuento
  const calcularPorcentajeDescuento = () => {
    if (!product.precio_original || !product.priceecommerce) return 0;
    const descuento =
      ((product.precio_original - product.priceecommerce) /
        product.precio_original) *
      100;
    return Math.round(descuento);
  };

  const porcentajeDescuento = calcularPorcentajeDescuento();
  const tieneDescuento = porcentajeDescuento > 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm modal-overlay"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white  dark:bg-black rounded-2xl shadow-2xl relative w-full max-w-sm mx-auto sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-4 fade-in-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con icono de éxito */}
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

          {/* Icono de éxito animado */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center  ">
                <ShoppingBag className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <svg
                  className="w-3 h-3 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
            ¡Producto Agregado!
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Tu producto se ha añadido correctamente al carrito
          </p>
        </div>

        {/* Información del producto */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda - Información del producto */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r   rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-start gap-4">
                  {/* Imagen del producto */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-gray-200 dark:ring-gray-600">
                    <img
                      src={getProductImage()}
                      alt={product.name}
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
                        {product.name}
                      </h3>
                      {tieneDescuento && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm flex-shrink-0">
                          -{porcentajeDescuento}%
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Talla:{" "}
                        <span className="font-semibold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                          {selectedSize}
                        </span>
                      </span>
                    </div>

                    {/* Precios */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatPrice(product.priceecommerce)}
                        </span>
                        {tieneDescuento && product.precio_original && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through font-medium">
                            {formatPrice(product.precio_original)}
                          </span>
                        )}
                      </div>
                      {tieneDescuento && product.precio_original && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                            Ahorras{" "}
                            {formatPrice(
                              product.precio_original - product.priceecommerce
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Link href="/carrito" className="block">
                  <Button
                    size="lg"
                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold py-4 h-auto transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    onClick={onClose}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Ir a Pagar
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold py-4 h-auto transition-all duration-300"
                  onClick={onClose}
                >
                  Seguir Comprando
                </Button>
              </div>
            </div>

            {/* Columna derecha - Resumen del carrito */}
            <div className="lg:col-span-1">
              {/* Resumen del carrito */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-6 border border-green-200 dark:border-green-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="xl:text-lg text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Resumen de tu orden
                  </h3>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                    {items.length}{" "}
                    {items.length === 1 ? "producto" : "productos"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Envío:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {cartTotal >= 500 ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          ¡Gratis!
                        </span>
                      ) : (
                        formatPrice(20)
                      )}
                    </span>
                  </div>

                  <div className="border-t border-green-200 dark:border-green-700 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="xl:text-lg text-sm font-semibold text-gray-900 dark:text-white">
                        Total:
                      </span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatPrice(
                          cartTotal >= 500 ? cartTotal : cartTotal + 15
                        )}
                      </span>
                    </div>
                  </div>

                  {cartTotal < 500 && (
                    <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                      <p className="text-xs text-amber-800 dark:text-amber-200 text-center">
                        💡 Agrega {formatPrice(500 - cartTotal)} más para envío
                        gratis
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mensaje adicional */}
              {cartTotal < 500 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold mb-1">
                        🚚 ¡Envío gratis en compras mayores a S/500.00!
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        Te faltan solo {formatPrice(500 - cartTotal)} para envío
                        gratis
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {cartTotal >= 500 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-green-800 dark:text-green-200 font-semibold mb-1">
                        🎉 ¡Felicidades! Tienes envío gratis
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-300">
                        Tu pedido califica para envío sin costo adicional
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección de productos relacionados - Fila completa independiente */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Header del carousel - siempre visible */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  {loading ? (
                    <>
                      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-48 mb-2  "></div>
                      <div
                        className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-32  "
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {getRecommendationTitle()}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {getRecommendationSubtitle()}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Botones de navegación */}
              <div className="flex gap-2">
                {loading ? (
                  <>
                    <div
                      className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full  "
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                    <div
                      className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full  "
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </>
                ) : recommendedProducts.length > getProductsPerSlide() ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={prevSlide}
                      className="w-10 h-10 p-0 rounded-full border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        recommendedProducts.length <= getProductsPerSlide() ||
                        currentSlide === 0
                      }
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={nextSlide}
                      className="w-10 h-10 p-0 rounded-full border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        recommendedProducts.length <= getProductsPerSlide() ||
                        currentSlide >=
                          Math.ceil(
                            recommendedProducts.length / getProductsPerSlide()
                          ) -
                            1
                      }
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                ) : null}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(getProductsPerSlide())].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    {/* Skeleton de imagen */}
                    <div className="relative w-full h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700  ">
                      {/* Skeleton de badges */}
                      <div
                        className="absolute top-2 left-2 w-12 h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full  "
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="absolute top-2 right-2 w-16 h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full  "
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>

                    {/* Skeleton de contenido */}
                    <div className="p-4 space-y-3">
                      {/* Skeleton de título y marca */}
                      <div>
                        <div
                          className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded mb-2  "
                          style={{ animationDelay: "0.3s" }}
                        ></div>
                        <div
                          className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-2/3  "
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>

                      {/* Skeleton de badges de tipo */}
                      <div className="flex items-center gap-2">
                        <div
                          className="w-16 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full  "
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div
                          className="w-12 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full  "
                          style={{ animationDelay: "0.6s" }}
                        ></div>
                      </div>

                      {/* Skeleton de precios */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-20  "
                              style={{ animationDelay: "0.7s" }}
                            ></div>
                            <div
                              className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-16  "
                              style={{ animationDelay: "0.8s" }}
                            ></div>
                          </div>
                        </div>

                        {/* Skeleton de información de ahorro */}
                        <div className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full  "
                            style={{ animationDelay: "0.9s" }}
                          ></div>
                          <div
                            className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-24  "
                            style={{ animationDelay: "1s" }}
                          ></div>
                        </div>
                      </div>

                      {/* Skeleton de stock */}
                      <div className="flex items-center justify-between">
                        <div
                          className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-20  "
                          style={{ animationDelay: "1.1s" }}
                        ></div>
                        <div
                          className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-16  "
                          style={{ animationDelay: "1.2s" }}
                        ></div>
                      </div>

                      {/* Skeleton de botón */}
                      <div className="pt-2">
                        <div
                          className="w-full h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg  "
                          style={{ animationDelay: "1.3s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden">
                {recommendedProducts
                  .slice(
                    currentSlide * getProductsPerSlide(),
                    currentSlide * getProductsPerSlide() + getProductsPerSlide()
                  )
                  .map((recommendedProduct) => {
                    // Calcular descuento - usar precio original del producto o simular uno
                    const precioOriginal =
                      recommendedProduct.precio_original ||
                      (recommendedProduct.linea_liquidacion
                        ? recommendedProduct.priceecommerce * 1.4
                        : recommendedProduct.priceecommerce * 1.2);

                    const tieneDescuentoProduct =
                      precioOriginal > recommendedProduct.priceecommerce;
                    const porcentajeDescuentoProduct = tieneDescuentoProduct
                      ? Math.round(
                          ((precioOriginal -
                            recommendedProduct.priceecommerce) /
                            precioOriginal) *
                            100
                        )
                      : 0;

                    return (
                      <Link
                        key={recommendedProduct._id}
                        href={`/products/${recommendedProduct.slug}/${recommendedProduct.sku}`}
                        onClick={onClose}
                        className="group  rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Imagen del producto */}
                        <div className="relative w-full h-80 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <img
                            src={getRecommendedProductImage(recommendedProduct)}
                            alt={recommendedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-product.svg";
                            }}
                          />

                          {/* Badge de descuento */}
                          {tieneDescuentoProduct &&
                            porcentajeDescuentoProduct > 0 && (
                              <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg  ">
                                -{porcentajeDescuentoProduct}%
                              </div>
                            )}

                          {/* Badge de liquidación */}
                          {recommendedProduct.linea_liquidacion && (
                            <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              OUTLET
                            </div>
                          )}

                          {/* Badge de stock bajo */}
                          {/* {recommendedProduct.stock &&
                            recommendedProduct.stock <= 5 && (
                              <div className="absolute bottom-2 right-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                ¡Últimos {recommendedProduct.stock}!
                              </div>
                            )} */}

                          {/* Overlay de hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                            <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                Ver producto
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Información del producto */}
                        <div className="p-4 space-y-3">
                          {/* Título y marca */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                              {recommendedProduct.name}
                            </h4>
                            {recommendedProduct.marca && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                                {recommendedProduct.marca}
                              </p>
                            )}
                          </div>

                          {/* Tipo de producto */}
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                              {recommendedProduct.tipo}
                            </span>
                            {recommendedProduct.genero && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 capitalize">
                                {recommendedProduct.genero}
                              </span>
                            )}
                          </div>

                          {/* Precios */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                  {formatPrice(
                                    recommendedProduct.priceecommerce
                                  )}
                                </span>
                                {tieneDescuentoProduct && (
                                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                    {formatPrice(precioOriginal)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Información de ahorro */}
                            {tieneDescuentoProduct && (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3 text-green-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                                  Ahorras{" "}
                                  {formatPrice(
                                    precioOriginal -
                                      recommendedProduct.priceecommerce
                                  )}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Stock disponible */}
                          {recommendedProduct.stock && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">
                                Stock disponible:
                              </span>
                              <span
                                className={`font-semibold ${
                                  recommendedProduct.stock > 10
                                    ? "text-green-600 dark:text-green-400"
                                    : recommendedProduct.stock > 5
                                    ? "text-yellow-600 dark:text-yellow-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {recommendedProduct.stock > 10
                                  ? "10+"
                                  : recommendedProduct.stock}{" "}
                                unidades
                              </span>
                            </div>
                          )}

                          {/* Botón de acción */}
                          <div className="pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold transition-all duration-300 transform group-hover:scale-105"
                            >
                              Agregar al carrito
                            </Button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  ¡Explora más productos!
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  No encontramos productos relacionados en este momento, pero
                  tenemos muchas otras opciones esperándote
                </p>
                <Link href="/tienda" onClick={onClose}>
                  <Button
                    variant="outline"
                    className="border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Ver toda la tienda
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Indicadores de navegación */}
            {loading ? (
              <div className="flex justify-center items-center mt-6 gap-4">
                <div
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-16  "
                  style={{ animationDelay: "1.4s" }}
                ></div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700  "
                      style={{ animationDelay: `${1.5 + i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              recommendedProducts.length > getProductsPerSlide() && (
                <div className="flex justify-center items-center mt-6 gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {currentSlide + 1} de{" "}
                    {Math.ceil(
                      recommendedProducts.length / getProductsPerSlide()
                    )}
                  </span>
                  <div className="flex gap-2">
                    {Array.from({
                      length: Math.ceil(
                        recommendedProducts.length / getProductsPerSlide()
                      ),
                    }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 border ${
                          i === currentSlide
                            ? "bg-black dark:bg-white border-black dark:border-white scale-125 shadow-lg"
                            : "bg-white dark:bg-black border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-900"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSuccessModal;
