"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import { Button } from "@/components/ui/button";
import { CardTitleText } from "@/components/ui/texto-responsive";
import AccesoriosCarousel from "@/components/carrito/AccesoriosCarousel";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";
import ProductPrecioDescuento from "@/components/product/product-card/product-precio-descuento";

// import "@/styles/carousel-productos-rapidos.css";
import { useProductosUnicos } from "@/hooks/useProductosUnicos";

function SkeletonCard() {
  return (
    <div className="flex flex-col items-center rounded-lg shadow-sm border   dark:border-gray-700 p-3 sm:p-4 min-h-[280px] sm:min-h-[320px] w-full max-w-[180px] sm:max-w-[220px] mx-auto justify-between ">
      {/* Imagen skeleton */}
      <div className="w-full h-32 sm:h-44 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 sm:mb-3" />

      {/* Contenido skeleton */}
      <div className="w-full text-center space-y-1 flex-grow">
        {/* Título */}
        <div className="h-3 sm:h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
        {/* Marca */}
        <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-600 rounded mx-auto" />
        {/* Precio */}
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mx-auto mt-2" />
        {/* Talla */}
        <div className="h-3 w-1/3 bg-gray-100 dark:bg-gray-600 rounded mx-auto" />
      </div>

      {/* Botón skeleton */}
      <div className="h-8 sm:h-9 w-full bg-gray-200 dark:bg-gray-700 rounded mt-2 sm:mt-3" />
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="w-full">
      {/* Grid simple que muestra exactamente lo que necesitamos */}
      <div className="grid grid-cols-2 min-[768px]:grid-cols-3 min-[1200px]:grid-cols-4 gap-3 sm:gap-4 px-2">
        {/* Móvil: 2 cards */}
        <SkeletonCard key="skeleton-1" />
        <SkeletonCard key="skeleton-2" />

        {/* Tablet: 1 card adicional (total 3) */}
        <div className="hidden min-[768px]:block">
          <SkeletonCard key="skeleton-3" />
        </div>

        {/* Desktop: 1 card adicional (total 4) */}
        <div className="hidden min-[1200px]:block">
          <SkeletonCard key="skeleton-4" />
        </div>
      </div>
    </div>
  );
}

export default function AccesoriosCarrito() {
  const [accesorios, setAccesorios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pageSize = 150; // Aumentar para obtener más productos
  const { addItem, items } = useCart();

  // Eliminar duplicados usando hook personalizado optimizado
  const accesoriosUnicos = useProductosUnicos(accesorios);

  useEffect(() => {
    async function getAccesorios() {
      setLoading(true);
      let accesorios: any[] = [];
      let start = 0;
      let intentos = 0;
      try {
        while (accesorios.length < pageSize && intentos < 20) {
          const res = await fetch(`/api/fetch-product?start=${start}`);
          const productos = await res.json();

          // Filtro más amplio para obtener más productos
          const encontrados = productos.filter((p: any) => {
            // Verificar que tenga stock disponible
            const tieneStock =
              Array.isArray(p.tallas) && p.tallas.some((t: any) => t.stock > 0);
            if (!tieneStock) return false;

            // Incluir accesorios
            if (p.tipo === "accesorios") return true;

            // Incluir productos baratos (menos de S/300)
            if (p.priceecommerce && p.priceecommerce < 300) return true;

            // Incluir productos de ciertas categorías que suelen ser compras rápidas
            const categoriasRapidas = [
              "medias",
              "mochilas",
              "gorros",
              "guantes",
              "pelotas",
              "billeteras",
            ];
            const nombreLower = (p.name || "").toLowerCase();
            if (categoriasRapidas.some((cat) => nombreLower.includes(cat)))
              return true;

            return false;
          });

          accesorios = accesorios.concat(encontrados);
          if (productos.length < 6) break;
          start += 6;
          intentos++;
        }
        // Filtrar duplicados inmediatamente al obtener los datos
        const accesoriosFinales = accesorios.slice(0, pageSize);

        // Debug: mostrar cuántos productos se obtuvieron
        console.log(
          `🛍️ Productos Rápidos obtenidos: ${accesoriosFinales.length} de ${pageSize} solicitados`
        );

        setAccesorios(accesoriosFinales);
      } catch (err) {
        setAccesorios([]);
      }
      setLoading(false);
    }
    getAccesorios();
  }, []);

  // Card visual para el carousel, con loader en el botón
  const CardAccesorio = ({ accesorio }: { accesorio: any }) => {
    const [addingLocal, setAddingLocal] = useState(false);
    // Calcular la talla con stock (la que se agregará)
    const tallaObj =
      Array.isArray(accesorio.tallas) && accesorio.tallas.length > 0
        ? accesorio.tallas.find((t: any) => t.stock > 0)
        : null;
    // Calcular cantidad en carrito para este SKU y talla
    const cantidadEnCarrito = tallaObj
      ? items
          .filter(
            (i: any) =>
              i.objectID === accesorio.sku && i.talla === tallaObj.talla
          )
          .reduce((acc: number, i: any) => acc + (i.quantity || 1), 0)
      : 0;
    // Stock disponible para la talla
    const stockDisponible = tallaObj ? tallaObj.stock : 0;
    // Si ya se llegó al tope de stock, desactivar botón y mostrar 'Agotado'
    const agotado =
      stockDisponible <= 0 || cantidadEnCarrito >= stockDisponible;
    const handleAdd = async () => {
      if (agotado) return;
      setAddingLocal(true);

      // Asegurar que el loader se muestre por al menos 1 segundo
      const startTime = Date.now();

      try {
        const requestBody = {
          products: [
            {
              sku: accesorio.sku,
              empresa: accesorio.empresa,
              genero: accesorio.genero,
              marca: accesorio.marca,
              tipo: accesorio.tipo,
            },
          ],
          ciudad: "LIMA",
          price: accesorio.priceecommerce,
        };
        const res = await fetch("/api/valid-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        if (!res.ok) {
          alert(
            "El precio o stock del producto ha cambiado. Actualiza la página."
          );
          setAddingLocal(false);
          return;
        }
        const validProducts = await res.json();
        const valid = validProducts.find((p: any) => p.sku === accesorio.sku);
        if (!valid) {
          alert("Este accesorio no está disponible actualmente.");
          setAddingLocal(false);
          return;
        }
        let tallaObjValid: any = null;
        if (Array.isArray(valid.tallas) && valid.tallas.length > 0) {
          tallaObjValid = valid.tallas.find((t: any) => t.stock > 0);
        }
        if (!tallaObjValid) {
          alert(
            "No hay stock disponible en ninguna talla para este accesorio."
          );
          setAddingLocal(false);
          return;
        }
        // Verificar nuevamente el stock contra el carrito
        const cantidadEnCarritoValid = items
          .filter(
            (i: any) =>
              i.objectID === accesorio.sku && i.talla === tallaObjValid.talla
          )
          .reduce((acc: number, i: any) => acc + (i.quantity || 1), 0);
        if (cantidadEnCarritoValid >= tallaObjValid.stock) {
          alert(
            "Ya tienes el máximo stock permitido en el carrito para este accesorio."
          );
          setAddingLocal(false);
          return;
        }
        // Crear ID único con timestamp para evitar conflictos
        const uniqueId = `${valid.sku}-${tallaObjValid._id}-${Date.now()}`;

        addItem({
          empresa: valid.empresa || "",
          genero: valid.genero || "",
          id: uniqueId,
          idsanity: accesorio._id || "",
          image: accesorio.images?.[0]?.asset?._ref || "",
          itemTotal: valid.priceecommerce || 0,
          marca: valid.marca || "",
          name: accesorio.name || "",
          objectID: valid.sku || "",
          price: valid.priceecommerce || 0,
          quantity: 1,
          slug: accesorio.slug || "",
          talla: tallaObjValid.talla || "",
          tipo: valid.tipo || "",
          title: accesorio.name || "",
        });

        // Asegurar que el loader se muestre por al menos 1 segundo
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 1000) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 - elapsedTime)
          );
        }
      } catch (err) {
        alert("Error al validar el producto. Intenta de nuevo.");
      }
      setAddingLocal(false);
    };
    return (
      <div className="flex flex-col items-center rounded-lg shadow-sm border   dark:border-gray-700 p-3 sm:p-4 min-h-[280px] sm:min-h-[320px] w-full max-w-[180px] sm:max-w-[220px] mx-auto justify-between product-card-hover dark:hover:shadow-gray-900/20">
        <Link
          href={`/products/${accesorio?.slug}/${accesorio?.sku}`}
          className="flex w-full justify-center flex-col items-center group"
        >
          <div className="w-full h-32 sm:h-44 flex items-center justify-center mb-2 sm:mb-3  rounded-md overflow-hidden">
            {accesorio.images ? (
              <img
                src={`${urlForImage(accesorio?.images[0].asset._ref)}`}
                alt={accesorio.name}
                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <img
                src={`${urlForImage(accesorio?.imgcatalogomain.asset._ref)}`}
                alt={accesorio.name}
                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
              />
            )}
          </div>

          <div className="w-full text-center space-y-1 flex-grow">
            <CardTitleText className="font-semibold text-xs sm:text-sm uppercase leading-tight line-clamp-2 text-gray-900 dark:text-gray-100">
              {accesorio.name}
            </CardTitleText>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              {accesorio.marca}
            </div>

            <div className="py-1">
              <ProductPrecioDescuento carrito={true} dataProduct={accesorio} />
            </div>

            {stockDisponible > 0 && stockDisponible <= 10 && (
              <div className="text-xs text-red-500 dark:text-red-400">
                {stockDisponible === 1
                  ? "Solo queda 1"
                  : `Quedan ${stockDisponible}`}
              </div>
            )}

            <div className="text-xs text-gray-400 dark:text-gray-500">
              Talla: {tallaObj?.talla || "-"}
            </div>
          </div>
        </Link>

        <Button
          size="sm"
          className="mt-2 sm:mt-3 w-full text-xs sm:text-sm h-8 sm:h-9"
          disabled={addingLocal || agotado}
          onClick={handleAdd}
        >
          {agotado ? (
            "Agotado"
          ) : addingLocal ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4 mr-1 text-white"
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
              <span className="hidden sm:inline">Agregando...</span>
              <span className="sm:hidden">...</span>
            </div>
          ) : (
            <>
              <span className="hidden sm:inline">Agregar al carrito</span>
              <span className="sm:hidden">Agregar</span>
            </>
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="mt-6 sm:mt-8 productos-rapidos-container">
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold mb-1 text-gray-900 dark:text-gray-100">
          Productos Rápidos
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Agrega rápido a tu compra
        </p>
      </div>
      {loading ? (
        <SkeletonLoader />
      ) : accesoriosUnicos.length === 0 ? (
        <div className="text-center text-gray-400 dark:text-gray-500 py-8">
          <div className="text-4xl mb-2">🛍️</div>
          <p>No se encontraron productos disponibles</p>
        </div>
      ) : (
        <div className="w-full">
          <AccesoriosCarousel>
            {accesoriosUnicos.map((accesorio, index) => (
              <CardAccesorio
                key={`${accesorio.sku}-${accesorio._id || index}`}
                accesorio={accesorio}
              />
            ))}
          </AccesoriosCarousel>
        </div>
      )}
    </div>
  );
}
