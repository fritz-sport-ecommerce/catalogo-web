"use client";

import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { SanityProduct } from "@/config/inventory";
import Product from "@/components/product/product-card/product";

interface ProductGridProps {
  products: SanityProduct[];
  start: number;
  generoSku: boolean;
  outlet: boolean | undefined;
  descuentos: any;
  filter: string;
  order: string;
}

const productCache: { [key: string]: SanityProduct[] } = {};

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  start,
  descuentos,
  outlet,
  generoSku,
  filter,
  order,
}) => {
  const searchParams = useSearchParams();
  const [productos, setProductos] = useState<SanityProduct[]>(products);
  const [loading, setLoading] = useState(false);
  const [currentStart, setCurrentStart] = useState(start);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);

  const fetchProducts = async (offset: number) => {
    const cacheKey = `${filter}-${order}-${offset}`;
    if (productCache[cacheKey]) {
      return productCache[cacheKey];
    }

    setLoading(true);
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

    const uniqueProducts = newProducts.filter(
      (newProduct, index, self) =>
        index === self.findIndex((p) => p.sku === newProduct.sku)
    );

    productCache[cacheKey] = uniqueProducts;

    setLoading(false);
    if (uniqueProducts.length === 0) setAllProductsLoaded(true);

    return uniqueProducts;
  };

  const addUniqueProducts = (newProducts: SanityProduct[]) => {
    const uniqueProducts = newProducts.filter(
      (newProduct) =>
        !productos.some(
          (existingProduct) => existingProduct._id === newProduct._id
        )
    );
    setProductos((prev) => [...prev, ...uniqueProducts]);
  };

  const loadPreviousProducts = async () => {
    if (currentStart <= 0 || loading) return; // Si ya estamos en el inicio, no hacemos nada.

    const newStart = Math.max(0, currentStart - 22); // Calcula el nuevo valor de inicio.
    const newProducts = await fetchProducts(newStart);

    if (newProducts.length > 0) {
      setProductos((prev) => [...newProducts, ...prev]); // Agrega los productos anteriores al inicio.
      setCurrentStart(newStart);

      // Actualiza el valor de "start" en la URL.
      const params = new URLSearchParams(searchParams.toString());
      params.set("start", newStart.toString());

      window.history.replaceState({}, "", `?${params.toString()}`);
    }
  };

  useEffect(() => {
    setProductos(products);
    setCurrentStart(start);
    setAllProductsLoaded(false);
  }, [products, start]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !allProductsLoaded) {
          const newStart = currentStart + 11;
          fetchProducts(newStart).then((newProducts) => {
            if (newProducts.length > 0) {
              addUniqueProducts(newProducts);
              setCurrentStart(newStart);
              const params = new URLSearchParams(searchParams.toString());
              params.set("start", newStart.toString());
              window.history.replaceState({}, "", `?${params.toString()}`);
            }
          });
        }
      },
      { threshold: 1.0 }
    );

    const target = document.getElementById("load-more-trigger");
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loading, currentStart, searchParams, allProductsLoaded]);

  return (
    <div className="flex flex-col w-full">
      {productos.length === 0 ? (
        <div className="mx-auto grid h-40 w-full place-items-center rounded-md border-2 border-dashed bg-gray-50 py-10 text-center dark:bg-gray-900">
          <XCircle className="mx-auto h-10 w-10 text-gray-500 dark:text-gray-200" />
          <h1 className="mt-2 p-5 text-xl font-bold tracking-tight text-gray-500 dark:text-gray-200 sm:text-2xl">
            No se encontraron productos
          </h1>
        </div>
      ) : (
        <>
          {currentStart > 0 && (
            <button
              onClick={loadPreviousProducts}
              className="mx-auto mb-4  xl:w-80 rounded-md bg-black px-4 py-2 text-white  dark:bg-white dark:text-black"
              disabled={loading || currentStart <= 0}
            >
              {loading ? "Cargando..." : "Ver productos anteriores"}
            </button>
          )}

          {/* {verStart != 0 && ( */}

          {/* )} */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 xl:gap-x-2 xl: 2xl:w-full xl:mx-auto sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-x-8">
            {productos.map((product, index) => (
              <Product
                key={product._id}
                outlet={outlet}
                products={product}
                generoSku={false}
                descuentos={descuentos}
              />
            ))}
          </div>
        </>
      )}
      <div id="load-more-trigger" className="h-20" />
    </div>
  );
};

export default ProductGrid;
