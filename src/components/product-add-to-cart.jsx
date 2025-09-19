import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import { useCart } from "react-use-cart";

import { useToast } from "@/components/ui/use-toast";
import GiaDeTallasMain from "@/components/guia-tallas/GiaDeTallasMain";
import DisponibilidadAlmacenSimple from "./product/disponibilidad-almacen-simple";
// import TallaAlmacenInfo from "./talla-almacen-info";

import { Button } from "./ui/button";
import ModalDesk from "./modal/Modal";
import CartSuccessModal from "./modal/cart-success-modal";
import LoveFollow from "./love-follow/love-follow";
import { aplicarDescuentoStockPorTallaUnitario } from "@/config/productos-traidos-sistema-fritz-sport";
import { client } from "@/sanity/lib/client";

export default function ProductAddToCart({ product }) {
  const { toast } = useToast();
  const { addItem, items } = useCart();
  const [selectSize, setSelectSize] = useState({
    talla: "",
    stock: 0,
    _id: "",
  });

  const [activeAddProduct, setActiveAddProduct] = useState(true);
  const [quantityStock, setQuantityStock] = useState(0);
  const [stockTotalApi, setStockTotalApi] = useState(null);
  const [loadingTallas, setLoadingTallas] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [cliente, setCliente] = useState(false);
  const [productoConStock, setProductoConStock] = useState(product);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Efecto para manejar la clase CSS cuando el modal está abierto
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("modal-open");
      document.body.classList.remove("no-scroll");
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove("modal-open");
      document.body.classList.remove("no-scroll");
    };
  }, [isModalOpen]);
  const [showConsejos, setShowConsejos] = useState(true);
  const [showCartSuccessModal, setShowCartSuccessModal] = useState(false);

  // Consulta la API solo una vez al montar o cuando cambie el SKU
  useEffect(() => {
    setLoadingTallas(true);
    setSelectSize({ talla: "", stock: 0, _id: "" });
    (async () => {
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
        const valid = validProducts.find((p) => p.sku === product.sku);
        setStockTotalApi(valid ? valid.tallas : []);
        const totalApi = valid
          ? valid.tallas.reduce((acc, t) => acc + (t.stock || 0), 0)
          : 0;
        const enCarritoTotal = items
          .filter((i) => i.objectID === product.sku)
          .reduce((acc, i) => acc + (i.quantity || 1), 0);
        setQuantityStock(totalApi - enCarritoTotal);
        setActiveAddProduct(true);
      } catch (err) {
        setStockTotalApi([]);
        setQuantityStock(0);
        setActiveAddProduct(true);
      } finally {
        setLoadingTallas(false);
      }
    })();
    setCliente(true);
    // eslint-disable-next-line
  }, [product.sku]);

  // Actualiza el stock global disponible cada vez que cambie el carrito
  useEffect(() => {
    if (!stockTotalApi) return;
    const totalApi = stockTotalApi.reduce((acc, t) => acc + (t.stock || 0), 0);
    const enCarritoTotal = items
      .filter((i) => i.objectID === product.sku)
      .reduce((acc, i) => acc + (i.quantity || 1), 0);
    setQuantityStock(totalApi - enCarritoTotal);
    // Si la talla seleccionada ya no tiene stock, desactiva el botón
    if (selectSize.talla) {
      const tallaApi = stockTotalApi.find((t) => t.talla === selectSize.talla);
      const enCarritoTalla = items
        .filter(
          (i) => i.objectID === product.sku && i.talla === selectSize.talla
        )
        .reduce((acc, i) => acc + (i.quantity || 1), 0);
      if (!tallaApi || tallaApi.stock - enCarritoTalla <= 0) {
        setActiveAddProduct(true);
      }
    }
    // eslint-disable-next-line
  }, [items, stockTotalApi]);

  // Calcula el stock por talla (API - carrito) para la talla seleccionada
  const stockTallaApi = (() => {
    if (!selectSize.talla || !stockTotalApi) return 0;
    if (Array.isArray(stockTotalApi) && stockTotalApi.length > 0) {
      const apiTalla = stockTotalApi.find((t) => t.talla === selectSize.talla);
      return apiTalla?.stock || 0;
    }
    return 0;
  })();
  const enCarritoTalla = items
    .filter((i) => i.objectID === product.sku && i.talla === selectSize.talla)
    .reduce((acc, i) => acc + (i.quantity || 1), 0);
  const stockDisponibleTalla = stockTallaApi - enCarritoTalla;

  // El botón se deshabilita si el stock global o el de la talla seleccionada es 0 o menos
  const enCarritoTotal = items
    .filter((i) => i.objectID === product.sku)
    .reduce((acc, i) => acc + (i.quantity || 1), 0);
  const stockDisponibleGlobal =
    Array.isArray(stockTotalApi) && stockTotalApi.length > 0
      ? stockTotalApi.reduce((acc, t) => acc + (t.stock || 0), 0) -
        enCarritoTotal
      : quantityStock;
  const botonDeshabilitado =
    !selectSize.talla ||
    stockDisponibleGlobal <= 0 ||
    stockDisponibleTalla <= 0 ||
    loadingTallas ||
    loadingAdd;

  // Selección de talla (solo actualiza el estado, no consulta la API)
  const selectTalla = (talla, _id, stock) => {
    setSelectSize({ talla, _id, stock });
    setActiveAddProduct(false);
  };

  // add to cart con validación final (consulta la API solo aquí)
  const addToCart = async () => {
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
      const valid = validProducts.find(
        (p) =>
          p.sku === product.sku &&
          p.tallas?.some((t) => t.talla === selectSize.talla && t.stock > 0)
      );
      if (!valid) {
        toast({
          title: "Error",
          description: "No hay stock suficiente o el producto ha cambiado.",
        });
        setLoadingAdd(false);
        return;
      }
      // Stock global
      const totalApi = valid.tallas.reduce((acc, t) => acc + (t.stock || 0), 0);
      const enCarritoTotal = items
        .filter((i) => i.objectID === product.sku)
        .reduce((acc, i) => acc + (i.quantity || 1), 0);
      const stockDisponibleGlobal = totalApi - enCarritoTotal;
      // Stock por talla
      const stockTallaApi =
        valid.tallas.find((t) => t.talla === selectSize.talla)?.stock || 0;
      const enCarritoTalla = items
        .filter(
          (i) => i.objectID === product.sku && i.talla === selectSize.talla
        )
        .reduce((acc, i) => acc + (i.quantity || 1), 0);
      const stockDisponibleTalla = stockTallaApi - enCarritoTalla;
      if (stockDisponibleGlobal <= 0 || stockDisponibleTalla <= 0) {
        toast({
          title: "Stock insuficiente",
          description: "No puedes agregar más de esta talla o del producto.",
        });
        setActiveAddProduct(true);
        setQuantityStock(0);
        setLoadingAdd(false);
        return;
      }
      // Obtener información de todos los almacenes disponibles para la talla seleccionada
      const tallaSeleccionada = valid.tallas.find(
        (t) => t.talla === selectSize.talla
      );

      let almacenesDisponibles = [];
      if (tallaSeleccionada?.almacenes?.length > 0) {
        // Agrupar almacenes por código para evitar duplicados
        const almacenesAgrupados = new Map();

        tallaSeleccionada.almacenes.forEach((alm) => {
          if (alm.stock > 0) {
            if (almacenesAgrupados.has(alm.codigoAlmacen)) {
              const existente = almacenesAgrupados.get(alm.codigoAlmacen);
              existente.stock_disponible += alm.stock;
            } else {
              almacenesAgrupados.set(alm.codigoAlmacen, {
                codigo_almacen: alm.codigoAlmacen,
                nombre_almacen: alm.nombreAlmacen,
                almacen_tabla: alm.almacen,
                provincia: alm.provincia,
                stock_disponible: alm.stock,
              });
            }
          }
        });

        almacenesDisponibles = Array.from(almacenesAgrupados.values());
      }

      // Agrega al carrito con id único por talla
      addItem({
        id: `${product.sku}-${selectSize._id}`,
        name: product?.name,
        idsanity: product?.id,
        genero: product?.genero,
        empresa: product?.empresa,
        marca: product?.marca,
        tipo: product?.tipo,
        img: product.image,
        title: product.name,
        image: product?.images
          ? product?.images[0]?.asset?._ref
          : product?.imgcatalogomain?.asset?._ref,
        objectID: product.sku,
        price: product.priceecommerce,
        talla: String(`${selectSize.talla}`),
        slug: product.slug,
        // Información de almacenes disponibles
        almacenes_disponibles: almacenesDisponibles,
      });
      // document.body.style.overflow = "hidden";
      // Mostrar el modal de éxito en lugar del toast
      setShowCartSuccessModal(true);
      setActiveAddProduct(true);
    } finally {
      setLoadingAdd(false);
    }
  };

  useEffect(() => {
    async function fetchPedidosYDescuento() {
      // 1. Traer pedidos pagados
      const pedidosPagados = await client.fetch(
        `*[_type == "pedidos" && estado == "pagado"]{ productos[] }`
      );
      // 2. Construir stockDescontado
      const stockDescontado = {};
      for (const pedido of pedidosPagados) {
        if (!pedido.productos) continue;
        for (const prod of pedido.productos) {
          if (!prod.sku || !prod.talla || !prod.cantidad) continue;
          if (!stockDescontado[prod.sku]) stockDescontado[prod.sku] = {};
          if (!stockDescontado[prod.sku][prod.talla])
            stockDescontado[prod.sku][prod.talla] = 0;
          stockDescontado[prod.sku][prod.talla] += prod.cantidad;
        }
      }
      // 3. Aplica el descuento unitario
      const productoActualizado = aplicarDescuentoStockPorTallaUnitario(
        product,
        stockDescontado
      );
      setProductoConStock(productoActualizado);
    }
    fetchPedidosYDescuento();
  }, [product.sku]);

  return (
    <div>
      <div className="mt-4">
        <p>
          Tallas: <strong>{selectSize.talla || ""}</strong>
        </p>
        {loadingTallas ? (
          <div className="flex gap-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="   bg-gray-200 dark:bg-gray-700 rounded w-12 h-10"
              />
            ))}
          </div>
        ) : (
          cliente &&
          productoConStock.tallas.map(({ talla, stock, _id, almacenes }) => {
            // Calcula el stock disponible para esta talla
            const enCarrito = items
              .filter((i) => i.objectID === product.sku && i.talla === talla)
              .reduce((acc, i) => acc + (i.quantity || 1), 0);
            const stockDisponible = (stock || 0) - enCarrito;
            return (
              <div key={_id} className="inline-block mr-2 mt-4 mb-2">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Button
                      onClick={() => selectTalla(talla, _id, stock)}
                      disabled={stockDisponible <= 0}
                      variant={
                        selectSize.talla === talla && !activeAddProduct
                          ? "default"
                          : "outline"
                      }
                      className={`mr-1 px-4 py-2 rounded border text-sm font-medium transition-colors duration-150 ${
                        stockDisponible <= 0 ? "opacity-50 line-through" : ""
                      }`}
                    >
                      {talla}
                    </Button>
                    <span className="text-xs text-gray-500 align-middle ml-1">
                      {stockDisponible > 0 ? `(${stockDisponible})` : "Agotado"}
                    </span>
                  </div>
                  {/* Información de almacenes */}
                  {/* <TallaAlmacenInfo
                    talla={talla}
                    almacenes={almacenes}
                    stockTotal={stockDisponible}
                  /> */}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Información de disponibilidad por almacén */}
      {!loadingTallas && productoConStock.tallas && productoConStock.tallas.length > 0 && (
        <div className="mt-6">
          <DisponibilidadAlmacenSimple 
            tallas={productoConStock.tallas} 
            className="w-full"
          />
        </div>
      )}
      
      {stockDisponibleTalla > 0 && stockDisponibleTalla <= 10 && (
        <p className="text-red-400 text-sm mt-2">
          Solo quedan {stockDisponibleTalla} de esta talla en nuestros almacenes
        </p>
      )}
      <form
        className="flex items-center mt-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="w-full">
          {stockDisponibleGlobal <= 0 ? (
            <div className="flex w-full flex-col items-center">
              <Link href={"/tienda"} className="w-full">
                <Button
                  disabled
                  type="button"
                  className="w-full bg-black py-6 text-base font-medium focus:outline-none focus:ring-2 dark:bg-white"
                >
                  Producto Agotado
                </Button>
              </Link>
            </div>
          ) : (
            <Button
              disabled={botonDeshabilitado}
              onClick={addToCart}
              type="button"
              className="w-full rounded-none uppercase bg-black py-6 text-base font-medium focus:outline-none focus:ring-2 dark:bg-white flex items-center justify-center gap-2"
            >
              {loadingAdd && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white dark:text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              )}
              {!selectSize.talla
                ? "Seleccione una talla"
                : stockDisponibleGlobal <= 0
                ? "Stock máximo en carrito"
                : stockDisponibleTalla <= 0
                ? "Stock agotado para esta talla"
                : loadingAdd
                ? "Agregando..."
                : "Agregar al Carrito"}
            </Button>
          )}
        </div>
        <div className="px-2  flex items-center justify-center">
          <LoveFollow view={false} product={product} />
        </div>
      </form>
      {product.tipo === "calzado" && (
        <>
          <div className="mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center justify-center gap-3 w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full group-hover:bg-gray-300 dark:group-hover:bg-gray-500 transition-colors duration-200">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-600 dark:text-gray-300"
                >
                  <path
                    d="M2 18h20v2H2v-2zM13.5 16c-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5 2.5 1 2.5 2.5-1 2.5-2.5 2.5zm0-3c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1z"
                    fill="currentColor"
                  />
                  <path
                    d="M21 4H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 10H3V6h18v8z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  Guía de Tallas
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Encuentra tu talla perfecta
                </span>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 ml-auto"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <ModalDesk isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
              {/* Header mejorado - Responsive */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-0 w-full sm:w-auto">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 18h20v2H2v-2zM13.5 16c-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5 2.5 1 2.5 2.5-1 2.5-2.5 2.5zm0-3c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1z"
                        fill="currentColor"
                      />
                      <path
                        d="M21 4H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 10H3V6h18v8z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                      Guía de Tallas
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 sm:mt-1">
                      {product.genero === "hombre"
                        ? "Calzado para Hombre"
                        : product.genero === "mujer"
                        ? "Calzado para Mujer"
                        : product.genero === "niños"
                        ? "Calzado para Niños"
                        : "Calzado Unisex"}{" "}
                      - Conversión USA ↔ EU
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 flex-shrink-0 sm:hidden"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
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
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="hidden sm:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 flex-shrink-0"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
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
              </div>

              {/* Información adicional - Responsive */}
              <div className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-amber-100 dark:bg-amber-900 rounded-full flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    {showConsejos && (
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                          💡 Consejos para elegir tu talla
                        </h3>
                        <ul className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 space-y-0.5 sm:space-y-1">
                          <li className="break-words">
                            • Las tallas pueden variar entre marcas y modelos
                          </li>
                          <li className="break-words">
                            • Si estás entre dos tallas, elige la mayor para
                            mayor comodidad
                          </li>
                          <li className="break-words hidden sm:block">
                            • Consulta nuestra política de cambios y
                            devoluciones
                          </li>
                          <li className="break-words">
                            • Revisa las medidas antes de realizar tu compra
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowConsejos(!showConsejos)}
                    className="flex items-center justify-center w-6 h-6 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors duration-200 flex-shrink-0 mt-0.5"
                    aria-label={
                      showConsejos ? "Ocultar consejos" : "Mostrar consejos"
                    }
                  >
                    {showConsejos ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Contenido de la tabla - Responsive */}
              <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-800">
                <div className="p-2 sm:p-4 lg:p-6">
                  <GiaDeTallasMain
                    gender={product.genero}
                    product_type={product.tipo}
                  />
                </div>
              </div>

              {/* Footer - Responsive */}
              <div className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-1 min-w-0">
                    Revisa cuidadosamente la tabla antes de seleccionar tu talla
                  </p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 flex-shrink-0 w-full sm:w-auto"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </ModalDesk>
        </>
      )}

      {/* Modal de éxito al agregar al carrito */}
      {/* Modal de éxito al agregar al carrito */}
      <CartSuccessModal
        isOpen={showCartSuccessModal}
        onClose={() => setShowCartSuccessModal(false)}
        product={product}
        selectedSize={selectSize.talla}
      />
    </div>
  );
}
