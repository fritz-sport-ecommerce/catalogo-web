"use client";

import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { SanityProduct } from "@/config/inventory";
import Product from "@/components/product/product-card/product";
import { FiltroProducts } from "@/utilits/filtro-products";

interface ProductGridProps {
  products: SanityProduct[];
  start: number;
  generoSku: boolean;
  outlet: boolean | undefined;
  descuentos: any;
  filter: string;
  order: string;
}

const Loading = () => (
  // Componente que muestra un esqueleto de carga mientras los productos se están cargando
  <div className="flex flex-col xl:py-20 py-10 px-0">
    <div className="xl:gap-x-2 w-full grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:col-span-3 lg:gap-x-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-4 animate-pulse">
          <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded-md mb-4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-md mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4"></div>
        </div>
      ))}
    </div>
  </div>
);

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  start,
  descuentos,
  outlet,
  generoSku,
  filter,
  order,
}) => {
  const searchParams = useSearchParams();  // Para manejar los parámetros de búsqueda en la URL
  const [productos, setProductos] = useState<SanityProduct[]>(products); // Estado para los productos cargados
  const [loading, setLoading] = useState(false); // Estado de carga para mostrar el spinner
  const [currentStart, setCurrentStart] = useState(start); // Estado que mantiene el índice actual de productos cargados
  const [hasPrevious, setHasPrevious] = useState(start > 0); // Estado para saber si hay productos anteriores disponibles
  const [allProductsLoaded, setAllProductsLoaded] = useState(false); // Estado que indica si todos los productos han sido cargados

  // Función que obtiene productos de Sanity en base a un offset (paginación)
  const fetchProducts = async (offset: number) => {
    setLoading(true); // Activa el estado de carga
    const newProducts = await client.fetch<SanityProduct[]>(
      groq`${filter} ${order} {
        _id,
        _createdAt,
        name,
        sku,
        images,
        priceecommerce,
        pricemayorista,
        priceemprendedor,

        description,
        genero,
        subgenero_ninos,
        tipo,
        coleccion,
        marca,
        descuento,
        color,
        razonsocial,
        descuentosobred,
        tallas,
        preciomanual,
        "slug": slug.current
      }[${offset}..${offset + 22}] | order(_createdAt desc)`
    );
    const productosPorScroll = newProducts.filter(
      (newProduct, index, self) =>
        index === self.findIndex((p) => p.sku === newProduct.sku)
    );
    // Filtro de productos similares basado en cada producto nuevo


    setLoading(false); // Desactiva el estado de carga

    // Verifica si ya no hay más productos para cargar
    if (newProducts.length === 0) {
      setAllProductsLoaded(true);
    }

    return productosPorScroll;
  };

  // Función que añade productos nuevos a la lista, evitando duplicados
  const addUniqueProducts = (newProducts: SanityProduct[]) => {
    const uniqueProducts = newProducts.filter(
      (newProduct) =>
        !productos.some((existingProduct) => existingProduct._id === newProduct._id) // Evita productos repetidos
    );
    setProductos((prev) => [...prev, ...uniqueProducts]); // Actualiza el estado con los productos únicos
  };

  // Efecto que actualiza los productos al recibir nuevas props o al cambiar el índice de inicio
  useEffect(() => {
    setProductos(products);
    setCurrentStart(start);
    setHasPrevious(start > 0);
    setAllProductsLoaded(false); // Restablece el estado de "todos cargados" cuando se reciben nuevos productos
  }, [products, start]);

  // Efecto que maneja el scroll infinito para cargar más productos cuando se llega al final de la página
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && !allProductsLoaded) {
        const newStart = currentStart + 11;
        fetchProducts(newStart).then((newProducts) => {
          if (newProducts.length > 0) {
            addUniqueProducts(newProducts); // Añadir productos nuevos y únicos
            setCurrentStart(newStart); // Actualiza el estado con el nuevo índice
            setHasPrevious(newProducts.length > 0);

            // Mantener otros parámetros en la URL
            const params = new URLSearchParams(searchParams.toString());
            params.set("start", newStart.toString());

            window.history.replaceState({}, "", `?${params.toString()}`);
          }
        });
      }
    }, { threshold: 1.0 }); // El umbral del observador se establece en 1.0 para detectar cuando un elemento está completamente visible

    const target = document.getElementById("load-more-trigger"); // Elemento que dispara la carga de más productos
    if (target) observer.observe(target); // Inicia el observador

    return () => {
      if (target) observer.unobserve(target); // Limpia el observador cuando el componente se desmonta
    };
  }, [loading, currentStart, searchParams, allProductsLoaded]);

  // Función que carga productos anteriores cuando el usuario hace clic en el botón
  const loadPreviousProducts = () => {
    if (currentStart > 0) {
      const previousStart = Math.max(0, currentStart - 11);
      fetchProducts(previousStart).then((newProducts) => {
        setProductos(newProducts);
        setCurrentStart(previousStart);
        setHasPrevious(previousStart > 0);

        const params = new URLSearchParams(searchParams.toString());
        params.set("start", previousStart.toString());

        window.history.replaceState({}, "", `?${params.toString()}`);
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {hasPrevious && productos.length > 0 && (
      <div className="w-full flex justify-center">
        {/* Botón que carga productos anteriores */}
        <button
          onClick={loadPreviousProducts}
          className="mb-4 p-2 dark:bg-white dark:text-black bg-white tex-white rounded-md xl:w-2/6 w-full" 
        >
          Ver productos anteriores
        </button>
      </div>
      )}
      {productos.length === 0 ? (
        // Muestra un mensaje si no se encuentran productos
        <div className="mx-auto grid h-40 w-full place-items-center rounded-md border-2 border-dashed bg-gray-50 py-10 text-center dark:bg-gray-900">
          <XCircle className="mx-auto h-10 w-10 text-gray-500 dark:text-gray-200" />
          <h1 className="mt-2 p-5 text-xl font-bold tracking-tight text-gray-500 dark:text-gray-200 sm:text-2xl">
            No se encontraron productos
          </h1>
        </div>
      ) : (
        // Muestra los productos en un grid
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 xl:gap-x-2 xl: 2xl:w-full xl:mx-auto sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-x-8">
          {productos.map((product, index) => (
            <div key={index} className="w-full">
              <Product
                outlet={outlet}
                products={product}
                generoSku={false}
                descuentos={descuentos}
              />
            </div>
          ))}
        </div>
      )}
      {loading && productos.length > 0 && <Loading />} {/* Muestra el componente de carga mientras se están cargando los productos */}

      {/* Mensaje que indica que todos los productos han sido cargados */}
      {allProductsLoaded && (
        <div className="text-center py-10 text-lg font-bold">
          Todos los productos han sido cargados. Total: {productos.length < start ? start : productos.length} productos.
        </div>
      )}

      <div id="load-more-trigger" className="h-20" /> {/* Elemento que activa la carga de más productos al hacer scroll */}
    </div>
  );
};

export default ProductGrid;
