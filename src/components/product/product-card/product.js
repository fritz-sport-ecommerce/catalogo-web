import ProductOfertStyle from "./product-ofert-style";
import ProductInfo from "./product-info";
import LoveFollow from "@/components/love-follow/love-follow";
import QuickViewModal from "../quick-view-modal";

import ImageReplaceEcommerceCatalogo from "@/components/imageReplaceEcommerceCatalogo";
import convertUSSizeToEuropean from "@/utils/convertir-talla-usa-eu";
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
  const isBuscaTuTaba = pathname === '/busca-tu-taba' || pathname?.startsWith('/busca-tu-taba');
  const whatsappHref = `https://wa.me/51983478551?text=${encodeURIComponent(`Hola, me interesa el producto con SKU ${products?.sku}. ¿Me puedes asesorar?`)}`;
  const cardHref = isBuscaTuTaba
    ? whatsappHref
    : `/products/${products?.slug}/${products?.sku}`;

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
      href={cardHref}
      className="group z-10 text-sm xl:px-2 3xl:p-8 2xl:text-lg"
    >
      <div className=" h-full flex-col justify-center border-[1px] border-blue-gray-300 dark:border-blue-gray-800 2xl:min-h-[400px] 2xl:min-w-[320px]">
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
       

        />

        {/* Tallas convertidas y precios */}
        {Array.isArray(products?.tallas) && products.tallas.length > 0 && (
          <div className="px-2 mt-2">
            <div className="text-[11px] text-gray-600 dark:text-gray-400 mb-1">Tallas disponibles (EU)</div>
            {(() => {
              const converted = convertUSSizeToEuropean(
                products.tallas,
                products?.genero || "",
                (products?.marca || "").toString(),
                undefined,
                products?.tipo || ""
              );
              const retail = products?.priceecommerce;
              const emprendedor = products?.priceemprendedor;
              const mayorista = products?.pricemayorista ?? products?.mayorista_cd;
              return (
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-1 max-h-14 overflow-y-auto">
                    {converted
                      .filter((t) => (t?.stock ?? 0) > 0)
                      .slice(0, 12)
                      .map((t, idx) => (
                        <span key={`${t._id || idx}-${t.talla}`} className="px-2 py-0.5 rounded border text-[11px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                          {t.talla}
                        </span>
                      ))}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-700 dark:text-gray-300">
                    <span>Retail: <b>S/{retail?.toFixed ? retail.toFixed(2) : Number(retail || 0).toFixed(2)}</b></span>
                    <span>Emprend.: <b>S/{emprendedor?.toFixed ? emprendedor.toFixed(2) : Number(emprendedor || 0).toFixed(2)}</b></span>
                    <span className="text-blue-700 dark:text-blue-300">Mayor.: <b>S/{mayorista?.toFixed ? mayorista.toFixed(2) : Number(mayorista || 0).toFixed(2)}</b></span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

    </Link>
    {/* CTA WhatsApp */}
    <div className="mt-2 px-2">
      <a
        href={`https://wa.me/51983478551?text=${encodeURIComponent(`Hola, me interesa el producto con SKU ${products?.sku}. ¿Me puedes asesorar?`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        Contactar a un asesor
      </a>
    </div>
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
