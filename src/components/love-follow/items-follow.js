"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import { X, Heart, ShoppingBag, AlertCircle } from "lucide-react";

import { client } from "@/sanity/lib/client";

import { groq } from "next-sanity";
import { precioProduct } from "@/config/precio-product";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function ItemsFollow({ sku, id, ind }) {
  const [follows, setFollows] = useState([]);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [reload, setReload] = useState(false);
  const [descuento, setDescuento] = useState({});
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [validProduct, setValidProduct] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    setLoadingFollow(true);
    
    // Obtener datos del producto desde Sanity
    client
      .fetch(
        groq`*[_type == "product" && sku match "${sku}"][0]{
          images,
          name,
          sku,
          descuento,
          genero,
          priceecommerce,
          preciomanual,
          stock,
          tallas,
          empresa,
          marca,
          tipo,
          "slug":slug.current
        }`
      )
      .then((el) => {
        setFollows(el);
        setLoadingFollow(false);
        router.refresh();
      })
      .catch((error) => {
        setLoadingFollow(false);
        console.error("Error fetching product:", error);
      });

    // Obtener datos validados desde valid-products
    const fetchValidProduct = async () => {
      try {
        const response = await fetch("/api/valid-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: [{
              sku: sku,
              empresa: "fz_premium",
              genero: "unisex",
              marca: "adidas",
              tipo: "calzado"
            }],
            ciudad: "LIMA",
          }),
        });
        const validProducts = await response.json();
        const product = validProducts.find(p => p.sku === sku);
        setValidProduct(product);
        
        // Verificar si está agotado usando datos validados
        if (product) {
          if (product.stock !== undefined) {
            setIsOutOfStock(product.stock <= 0);
          } else if (product.tallas) {
            const hasStock = product.tallas.some(talla => talla.stock > 0);
            setIsOutOfStock(!hasStock);
          }
        }
      } catch (error) {
        console.error("Error fetching valid product:", error);
      }
    };

    fetchValidProduct();

    // Obtener descuentos
    client
      .fetch(
        groq`*[_type == "descuentos"][0] {
          descuentofritzsport,
          descuentooutlet,
          descuentofz
      }`
      )
      .then((el) => {
        setDescuento(el);
      })
      .catch((error) => {
        console.error("Error fetching discounts:", error);
      });
  }, [reload, sku, router]);

  const handleRemoveFollow = async (sku, id, ind) => {
    try {
      const res = await client
        .patch(id)
        .unset([`intereses[${ind}]`])
        .commit();
      
      setReload(!reload);
      console.log("Producto removido de favoritos");
    } catch (err) {
      console.error("Error removing from follows:", err.message);
    }
  };

  if (loadingFollow) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4   ">
        <div className="flex space-x-4">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-24 h-24"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!follows) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
        <p className="text-gray-500 dark:text-gray-400">Producto no encontrado</p>
      </div>
    );
  }

  // Usar precio validado si está disponible, sino usar el de Sanity
  const finalPrice = validProduct?.priceecommerce || follows?.priceecommerce;
  const finalStock = validProduct?.stock || follows?.stock;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <Link href={`/products/${follows?.slug}/${follows?.sku}`}>
        <div className="relative">
          {/* Imagen del producto */}
          <div className="aspect-square overflow-hidden">
            <img
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              src={
                follows?.images
                  ? urlForImage(follows.images[0]?.asset._ref).url()
                  : ""
              }
              alt={follows?.name}
            />
          </div>
          
          {/* Indicador de agotado */}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Agotado</span>
            </div>
          )}
          
          {/* Botón de eliminar */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemoveFollow(follows?.sku, id, ind);
            }}
            className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </Link>
      
      {/* Información del producto */}
      <div className="p-4">
        <Link href={`/products/${follows?.slug}/${follows?.sku}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2">
            {follows?.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 capitalize">
          {follows?.genero}
        </p>
        
        {/* Precios */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            S/{finalPrice ? precioProduct(
              follows?.descuento,
              finalPrice,
              follows?.preciomanual,
              descuento
            ) : 'N/A'}
          </span>
          {finalPrice && follows?.priceecommerce && finalPrice !== follows.priceecommerce && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              S/{follows.priceecommerce}
            </span>
          )}
        </div>
        
        {/* Botón de acción */}
        <div className="flex space-x-2">
          <Link href={`/products/${follows?.slug}/${follows?.sku}`} className="flex-1">
            <Button 
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              disabled={isOutOfStock}
            >
              {isOutOfStock ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Agotado
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Ver producto
                </>
              )}
            </Button>
          </Link>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemoveFollow(follows?.sku, id, ind);
            }}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors duration-200"
            title="Eliminar de favoritos"
          >
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
