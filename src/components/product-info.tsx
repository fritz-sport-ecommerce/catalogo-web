"use client";

import { Key, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { groq } from "next-sanity";

import { SanityProduct } from "@/config/inventory";
import { precioProduct } from "@/config/precio-product";

import ProductAddToCart from "./product-add-to-cart";
import { FiltroProducts } from "@/utils/filtro-products-slider-home";
import RoleContext from "@/context/roleContext";
import { useGuardarProductoVisto } from "./carousel-product/guardarProductoVisto";
import ProductPrecioDescuento from "./product/product-card/product-precio-descuento";

interface Props {
  product: SanityProduct;
}

interface ValidProduct {
  sku: string;
  tallas: Array<{
    talla: string;
    stock: number;
  }>;
}

export function ProductInfo({ product }: Props) {
  useGuardarProductoVisto(product?.sku, product?.priceecommerce);
  const [data, setData] = useState<SanityProduct[]>([]);
  const [validProducts, setValidProducts] = useState<ValidProduct[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingValidProducts, setIsLoadingValidProducts] = useState(true);

  useEffect(() => {
    const productFilter = FiltroProducts(product);

    const filter = `*[${productFilter} && empresa == "fritz_sport" ][0..5]`;
    client
      .fetch(
        groq`${filter} {
          _id,
          _createdAt,
          sku,
          images,
          empresa,
          genero,
          marca,
          tipo,
          popularidad,
          "slug": slug.current
        }`
      )
      .then((fetchedData) => {
        // Filtrar productos que tengan el mismo SKU que el producto principal
        const uniqueProducts = fetchedData.filter(
          (relatedProduct: any) => relatedProduct.sku !== product.sku
        );

        setData(uniqueProducts);
        setLoading(false);

        // Obtener datos de stock para estos productos
        if (uniqueProducts.length > 0) {
          fetchValidProducts(uniqueProducts);
        } else {
          setIsLoadingValidProducts(false);
        }
      });
  }, [product?.sku]);

  const fetchValidProducts = async (products: SanityProduct[]) => {
    try {
      const response = await fetch("/api/valid-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: products.map((p) => ({
            sku: p.sku,
            empresa: (p as any).empresa || "fz_premium",
            genero: p.genero || "unisex",
            marca: p.marca || "adidas",
            tipo: (p as any).tipo || "calzado",
          })),
          ciudad: "LIMA",
        }),
      });
      const validProductsData = await response.json();
      setValidProducts(validProductsData);
    } catch (error) {
      console.error("Error fetching valid products:", error);
    } finally {
      setIsLoadingValidProducts(false);
    }
  };

  // Filtrar productos que tienen stock
  const productsWithStock = data.filter((product) => {
    const validProduct = validProducts.find((vp) => vp.sku === product.sku);
    if (!validProduct) return false;

    // Verificar si tiene stock en alguna talla
    return (
      validProduct.tallas &&
      validProduct.tallas.some((talla) => talla.stock > 0)
    );
  });

  // Skeleton para los colores
  const ColorSkeleton = () => (
    <div className="mt-2 flex gap-1">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="w-[70px] h-[70px] bg-gray-200 dark:bg-gray-700 rounded   "
        />
      ))}
    </div>
  );

  return (
    <div className="h-full w-full px-5 lg:mt-0 lg:px-2 xl:mt-0 xl:px-3 2xl:sticky 2xl:top-44 2xl:mt-0 2xl:max-w-lg 2xl:px-5">
      <div className="w-full">
        <div className="">
          <h1 className="hidden text-3xl font-bold uppercase w-full tracking-tight xl:block">
            {product?.name} - {product?.genero}
          </h1>
          <div className="mt-3 hidden xl:block">
            <h2 className="sr-only">Product information</h2>

            <div className="mb-5 flex items-center justify-between gap-x-2">
              <ProductPrecioDescuento dataProduct={product} />
            </div>
          </div>

          <h6 className="text-md tracking-tight">Marca: {product?.marca}</h6>
          <h5 className="text-md tracking-tight">Sku: {product?.sku}</h5>

          {/* Sección de colores */}
          {isLoading || isLoadingValidProducts ? (
            <>
              <div className="mt-5">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16    mb-2"></div>
                <ColorSkeleton />
              </div>
            </>
          ) : productsWithStock.length > 0 ? (
            <>
              <div className="mt-5 font-bold">Colores disponibles:</div>
              <div className="mt-2 flex gap-1">
                {productsWithStock.map(
                  (el: {
                    _id: Key | null | undefined;
                    slug: any;
                    sku: any;
                    images: any;
                  }) => (
                    <Link key={el._id} href={`/products/${el.slug}/${el.sku}`}>
                      {el.images && el.images[0] && el.images[0]?.asset && (
                        <img
                          width={70}
                          height={70}
                          className="relative border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 rounded"
                          src={urlForImage(el.images[0]?.asset._ref).url()}
                          alt={`Color alternativo de ${product?.name}`}
                        />
                      )}
                    </Link>
                  )
                )}
              </div>
            </>
          ) : null}
        </div>
        <ProductAddToCart product={product} />
      </div>
    </div>
  );
}
