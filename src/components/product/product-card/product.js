"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { groq } from "next-sanity";

import LoveFollow from "../../love-follow/love-follow";


import ColoresProducts from "./product-colores";
import ProductOfertStyle from "./product-ofert-style";
import ProductInfo from "./product-info";
import ProductCarousel from "./product-carousel";

export default function Product({
  products,
  generoSku = false,
  relacionados = true,
  descuentos,
  outlet = false,
}) {
  const [dataProduct, setDataProduct] = useState(products);
  const [stock, setStock] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skuColor, setSkuColor] = useState(products.sku);

  const [loadedImages, setLoadedImages] = useState([dataProduct?.images && dataProduct?.images[0]]);
  const [loading, setLoading] = useState(true);
  // console.log(data);
  
  // useEffect(() => {
  //   setStock(!dataProduct.tallas || dataProduct.tallas.every((el) => el.stock === 0));
  //   // actualizamos el sku para que al filtro cambie
  //   setSkuColor(products.sku)
  // }, [dataProduct]);



  useEffect(() => {
    const filter = `*[_type == "product" && sku == "${skuColor}"][0]`;

    setLoading(true); // Activar el loader al cambiar el producto
    client.fetch(groq`${filter} {
      _id, _createdAt, name, sku, images, currency, priceecommerce,
           genero, marca, tallas, stock,
      descuento, razonsocial, priceemprendedor,pricemayorista, descuentosobred,
      "slug":slug.current
    }`).then((data) => {
  
      
      setCurrentIndex(0);
      setDataProduct(data);
       setStock(!data.tallas || data.tallas.every((el) => el.stock === 0));

      setLoadedImages([data.images && data.images[0]]);
      
        setLoading(false); // Desactivar el loader aquí si ya hay imágenes
        
 
    });

    
  }, [skuColor]);
// al colocar filtro resetear card productos
  useEffect(() => {
    // setStock(!products.tallas || products.tallas.every((el) => el.stock === 0));
    // actualizamos el sku para que al filtro cambie
    setSkuColor(products.sku)
  }, [products]);

  const descuentoSobreD = dataProduct?.descuentosobred;

  return (
    <div className="flex h-full flex-col justify-center border-[1px] border-blue-gray-300 dark:border-blue-gray-800">
      {/* Carrusel de imágenes */}
   <ProductCarousel setLoading={setLoading} loading={loading} dataProduct={dataProduct} setLoadedImages={setLoadedImages} loadedImages={loadedImages} setCurrentIndex={setCurrentIndex} currentIndex={currentIndex}></ProductCarousel>

      <LoveFollow product={dataProduct} />
      {/* descuento y oferta ,stock*/}
      <ProductOfertStyle descuento={descuentos?.descuentofritzsport} products={products} descuentoSobreD={descuentoSobreD} stock={stock}/>
      {/* Productos relacionados */}
   
        <ColoresProducts
          setSkuColor={setSkuColor}
          skuColor={skuColor}
          products={products}
          // data={data}
          urlForImage={urlForImage}
        />
  

      {/* Información del producto */}
     <ProductInfo dataProduct={dataProduct} descuento={descuentos.descuentofritzsport} products={products} descuentos={descuentos} descuentoSobreD={descuentoSobreD} outlet={outlet}/>
    </div>
  );
}
