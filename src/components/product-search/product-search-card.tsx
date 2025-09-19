"use client";

import { urlForImage } from "@/sanity/lib/image";

import ProductOfertStyle from "@/components/product/product-card/product-ofert-style";
import ProductInfo from "./product-search-info";
import Link from "next/link";

interface Props {
  products: any;
  stock: boolean;
  outlet: boolean;
  descuentos: any;
}
type Product = {
  _createdAt?: string;
  popularidad?: number;
};

const products: Product = {
  // tu objeto producto aquí
};
export default function ProductSearchCard({
  products,
  stock = false,
  descuentos,
  outlet = false,
}: Props) {

  
  const isProductNew = (product: Product): boolean => {
    if (!product._createdAt) return false;
  
    const createdAt = new Date(product._createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    return diffDays <= 30; // Producto es nuevo si tiene 30 días o menos
  };
  
  const isProductHot = (product: Product): boolean => {
    return typeof product.popularidad === 'number' && product.popularidad > 1;
  };
  
  // Llamadas
  const isNew = isProductNew(products);
  const isHot = isProductHot(products);
  
  // console.log(data);

  // useEffect(() => {
  //   setStock(!dataProduct.tallas || dataProduct.tallas.every((el) => el.stock === 0));
  //   // actualizamos el sku para que al filtro cambie
  //   setSkuColor(products.sku)
  // }, [dataProduct]);

  const descuentoSobreD = products?.descuentosobred;

  return (
    <Link href={`/products/${products?.slug}/${products?.sku}`}>
      <div className="flex h-full flex-col justify-center border-[1px] border-blue-gray-300 dark:border-blue-gray-800">
        {/* Carrusel de imágenes */}
        <div className="relative overflow-hidden">
          {products.images && products.images[0] && products.images[0]?.asset && (
            <img
              src={
                products.images[0]?.asset?._ref && products.images[0]?.asset
                  ? urlForImage(products.images[0]?.asset?._ref).url()
                  : "https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png"
              }
              width={500}
              height={500}
              className=" inline-block h-auto"
            />
          )}
          
          {/* Mostrar "NUEVO" si el producto es nuevo */}
          {isNew && (
            <div className="absolute left-0 xl:top-4 top-1 bg-green-600 xl:px-2 px-2 py-1">
              <div className=" xl:text-xs text-white text-[10px]  ">NEW</div>
            </div>
          )}
          
          {/* Mostrar "HOT" si el producto es popular */}
          {isHot && (
            <div className="absolute left-0 xl:top-4 top-1 bg-red-600 xl:px-2 px-2 py-1">
              <div className=" xl:text-xs text-white text-[10px]  ">HOT</div>
            </div>
          )}
          
          {/* Mostrar "HOT" si el producto es popular y está en posición diferente si también es nuevo */}
          {isNew && isHot && (
            <div className="absolute right-0 xl:top-4 top-1 bg-red-600 xl:px-2 px-2 py-1">
              <div className=" xl:text-xs text-white text-[10px]  ">HOT</div>
            </div>
          )}
        </div>

        {/* descuento y oferta ,stock*/}
        <ProductOfertStyle
          descuento={descuentos?.descuentofritzsport}
          products={products}
          descuentoSobreD={descuentoSobreD}
          stock={products.stock}
        />
        {/* Productos relacionados */}

        {/* Información del producto */}
        <ProductInfo dataProduct={products} />
      </div>
    </Link>
  );
}
