"use client";

import { urlForImage } from "@/sanity/lib/image";






import ProductOfertStyle from "@/components/product/product-card/product-ofert-style";
import ProductInfo from "./product-search-info";
import Link from "next/link";

interface Props {
  products:any,
  stock:boolean
  outlet:boolean
  descuentos:any
}
export default function ProductSearchCard({
  products,
    stock = false ,
  descuentos,
  outlet = false,

}: Props) {



  // console.log(data);
  
  // useEffect(() => {
  //   setStock(!dataProduct.tallas || dataProduct.tallas.every((el) => el.stock === 0));
  //   // actualizamos el sku para que al filtro cambie
  //   setSkuColor(products.sku)
  // }, [dataProduct]);





  const descuentoSobreD = products?.descuentosobred;

  return (
    <Link
    href={products.razonsocial === "fritzsport" ? `/products/${products?.slug}/${products?.sku}` : `https://www.fritzsportoutlet.pe/products/${products?.slug}/${products?.sku}`}
    >

    <div className="flex h-full flex-col justify-center border-[1px] border-blue-gray-300 dark:border-blue-gray-800">
      {/* Carrusel de imágenes */}
      {products.images && products.images[0] && products.images[0]?.asset && (
              <img src={products.images[0]?.asset?._ref && products.images[0]?.asset
                ? urlForImage(products.images[0]?.asset?._ref).url()
                : "https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png"
              }     
              width={500}
              height={500} 
              
              className=" inline-block h-auto" />
              )}

   
      {/* descuento y oferta ,stock*/}
      <ProductOfertStyle descuento={descuentos?.descuentofritzsport} products={products} descuentoSobreD={descuentoSobreD} stock={stock}/>
      {/* Productos relacionados */}

  

      {/* Información del producto */}
     <ProductInfo dataProduct={products} descuento={descuentos.descuentofritzsport} products={products} descuentos={descuentos} descuentoSobreD={descuentoSobreD} outlet={outlet}/>
    </div>

    </Link>
  );
}
