import ProductOfertStyle from "./product-ofert-style";
import ProductInfo from "./product-info";
import LoveFollow from "@/components/love-follow/love-follow";
import QuickViewModal from "../quick-view-modal";

import ImageReplaceEcommerceCatalogo from "@/components/imageReplaceEcommerceCatalogo";
import Link from "next/link";
import { useState } from "react";
import { Eye } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Product({
  products,

}) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const pathname = usePathname();
  
  // Solo mostrar vista rápida en la página de tienda
  const showQuickView = pathname === '/tienda' || pathname === '/tienda-mayorista';

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

  // console.log(data);

  // useEffect(() => {
  //   setStock(!dataProduct.tallas || dataProduct.tallas.every((el) => el.stock === 0));
  //   // actualizamos el sku para que al filtro cambie
  //   setSkuColor(products.sku)
  // }, [dataProduct]);

  // useEffect(() => {
  //   const filter = `*[_type == "product" && sku == "${skuColor}"][0]`;

  //   setLoading(true); // Activar el loader al cambiar el producto
  //   client.fetch(groq`${filter} {
  //     _id, _createdAt, name, sku, images, currency, priceecommerce,
  //          genero, marca, tallas, stock,
  //     descuento, razonsocial, priceemprendedor,pricemayorista, descuentosobred,
  //     "slug":slug.current
  //   }`).then((data) => {

  //     setCurrentIndex(0);
  //     setDataProduct(data);
  //      setStock(!data?.tallas || data?.tallas?.every((el) => el.stock === 0));

  //     setLoadedImages([data?.images && data.images[0]]);

  //       setLoading(false); // Desactivar el loader aquí si ya hay imágenes

  //   });





  return (
    <>
    <Link
      href={`/products/${products?.slug}/${products?.sku}`}
      className="group z-10 text-sm xl:px-2 3xl:p-8 2xl:text-lg"
    >
      <div className="flex h-full flex-col justify-center border-[1px] border-blue-gray-300 dark:border-blue-gray-800 2xl:min-h-[420px] 2xl:min-w-[320px]">
        {/* Carrusel de imágenes */}
        {/* <ProductCarousel
        setLoading={setLoading}
        loading={loading}
        dataProduct={products}
        setLoadedImages={setLoadedImages}
        loadedImages={loadedImages}
        setCurrentIndex={setCurrentIndex}
        currentIndex={currentIndex}
      /> */}

        <div className="relative overflow-hidden">
          <ImageReplaceEcommerceCatalogo products={products} />
          <LoveFollow product={products} view={true} />
          
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
          
          {/* Mostrar "NUEVO" si el producto es nuevo */}
          {isNew && (
            <div className="absolute right-0 xl:top-4 top-1 bg-green-600 xl:px-2 px-2 py-1">
              <div className=" xl:text-xs text-white text-[10px]  ">NEW</div>
            </div>
          )}
          
          {/* Mostrar "HOT" si el producto es popular */}
          {/* {isHot && (
            <div className="absolute right-0 xl:top-4 top-1 bg-red-600 xl:px-2 px-2 py-1">
              <div className=" xl:text-xs text-white text-[10px]  ">HOT 🔥</div>
            </div>
          )} */}
          
          {/* Mostrar "HOT" si el producto es popular y está en posición diferente si también es nuevo */}
          {/* {isNew && isHot && (
            <div className="absolute right-0 xl:top-4 top-1 bg-red-600 xl:px-2 px-2 py-1">
              <div className=" xl:text-xs text-white text-[10px]  ">HOT</div>
            </div>
          )} */}
        </div>
        
        {/* descuento y oferta ,stock*/}
        <ProductOfertStyle
         
          products={products}
      
          stock={products.stock}
        />
        {/* Productos relacionados */}

        {/* <ColoresProducts
        setSkuColor={setSkuColor}
        skuColor={skuColor}
        products={products}
        // data={data}
        urlForImage={urlForImage}
      /> */}

        {/* Información del producto */}
        <ProductInfo
          dataProduct={products}
       
          products={products}
    
       

        />
      </div>
 
    
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
