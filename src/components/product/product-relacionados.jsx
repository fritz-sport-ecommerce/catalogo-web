import React, { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { usePathname } from "next/navigation";

import ImageReplaceEcommerceCatalogo from "../imageReplaceEcommerceCatalogo";
import { LimitarTexto } from "@/utils/limitarTexto";
import { ProductNameText } from "@/components/ui/texto-responsive";
import ProductPrecioDescuento from "./product-card/product-precio-descuento";
import QuickViewModal from "./quick-view-modal";

export default function ProductRelacionados({ products }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const pathname = usePathname();
  
  // Solo mostrar vista rápida en la página de tienda
  const showQuickView = pathname === '/tienda';

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
      <Link
        key={products?._id}
        href={`/products/${products?.slug}/${products?.sku}`}
        className={`group  text-sm border-y-[1px] border-l-[1px] p-2 border-blue-gray-300 dark:border-none  ${
          products?.stock <= 0 ? 'opacity-75' : ''
        }`}
      >
        <div className={`aspect-h-1 aspect-w-1 overflow-hidden rounded-md group-hover:opacity-75 relative ${
          products?.stock <= 0 ? 'grayscale' : ''
        }`}>
          <ImageReplaceEcommerceCatalogo products={products} />
          
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

          {/* <LoveFollow /> */}
          {/* {products.descuento ? (
         
          ) : (
            <>
              <div className="absolute right-0 top-4 bg-black px-3 py-1">
                <h4 className=" mt-1 text-xs text-white ">
                  {`-${products.descuento}%`}
                </h4>
              </div>
            </>
          )} */}
          
          {/* Mostrar "AGOTADO" si no hay stock - PRIORIDAD MÁXIMA */}
          {products?.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
              <div className="bg-red-600 px-3 py-2 rounded-lg shadow-lg">
                <div className="text-white font-bold text-sm uppercase tracking-wide">
                  AGOTADO
                </div>
              </div>
            </div>
          )}
          
          {/* Solo mostrar otros badges si hay stock */}
          {products?.stock > 0 && (
            <>
              {/* Mostrar "NUEVO" si el producto es nuevo */}
              {isNew && (
                <div className="absolute left-0 xl:top-4 top-1 bg-green-600 xl:px-2 px-2 py-1 z-10">
                  <div className=" xl:text-xs text-white text-[10px]  ">NEW</div>
                </div>
              )}
              
              {/* Mostrar "HOT" si el producto es popular */}
              {isHot && !isNew && (
                <div className="absolute left-0 xl:top-4 top-1 bg-red-600 xl:px-2 px-2 py-1 z-10">
                  <div className=" xl:text-xs text-white text-[10px]  ">HOT 🔥</div>
                </div>
              )}
              
              {/* Mostrar "HOT" si el producto es popular y está en posición diferente si también es nuevo */}
              {isNew && isHot && (
                <div className="absolute right-0 xl:top-4 top-1 bg-red-600 xl:px-2 px-2 py-1 z-10">
                  <div className=" xl:text-xs text-white text-[10px]  ">HOT</div>
                </div>
              )}
              
              {/* Mostrar badge de stock bajo si queda poco */}
              {products?.stock > 0 && products?.stock <= 5 && (
                <div className="absolute bottom-2 left-2 bg-orange-600 xl:px-2 px-2 py-1 rounded z-10">
                  <div className=" xl:text-xs text-white text-[10px] font-semibold ">
                    ¡Últimos {products.stock}!
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className=" ">
          <div className="flex justify-between items-center ">
            <div className="font-medium capitalize  text-xs py-1">
              {products?.genero}
            </div>
            <div className="flex flex-col items-end">
              <div className=" font-medium capitalize  text-xs my-1">
                {products?.sku}
              </div>
              {/* Mostrar información de stock */}
              {products?.stock !== undefined && (
                <div className={`text-xs font-semibold ${
                  products.stock <= 0 
                    ? 'text-red-600' 
                    : products.stock <= 5 
                      ? 'text-orange-600' 
                      : 'text-green-600'
                }`}>
                  {products.stock <= 0 
                    ? 'Sin stock' 
                    : products.stock <= 5 
                      ? `Solo ${products.stock}` 
                      : `Stock: ${products.stock > 10 ? '10+' : products.stock}`
                  }
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-around h-full items-start ">
            <div className=" font-semibold uppercase flex items-center xl:text-sm text-xs xl:h-full h-9 xl:mb-4">
              <ProductNameText className="font-semibold uppercase xl:text-sm text-xs">
                {products?.name}
              </ProductNameText>
            </div>
            <div className="flex xl:justify-start justify-end w-full">
              <ProductPrecioDescuento dataProduct={products} />
            </div>
          </div>
        </div>
        {/* <p className="mt-2 font-medium">S/{products.descuento}</p> */}
      </Link>
      
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
