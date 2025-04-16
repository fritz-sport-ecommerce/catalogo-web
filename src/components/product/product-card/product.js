import React, { useEffect, useState } from "react";

import { urlForImage } from "@/sanity/lib/image";

import LoveFollow from "../../love-follow/love-follow";

import ColoresProducts from "./product-colores";
import ProductOfertStyle from "./product-ofert-style";
import ProductInfo from "./product-info";
import ProductCarousel from "./product-carousel";

export default function Product({
  products,

  descuentos,
  outlet = false,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skuColor, setSkuColor] = useState(products.sku);

  const [loadedImages, setLoadedImages] = useState([
    products?.images ? products?.images[0] : products?.imgcatalogomain,
  ]);
  const [loading, setLoading] = useState(true);
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

  // }, [skuColor]);
  // al colocar filtro resetear card productos
  useEffect(() => {
    // setStock(!products.tallas || products.tallas.every((el) => el.stock === 0));
    // actualizamos el sku para que al filtro cambie
    setSkuColor(products.sku);
  }, [products]);

  const descuentoSobreD = products?.descuentosobred;

  return (
    <div className="flex h-full flex-col justify-center border-[1px] border-blue-gray-300 dark:border-blue-gray-800">
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

      <img
        width={2000}
        height={2000}
        className="w-full h-auto"
        src={
          products?.images?.asset?._ref || products.imgcatalogomain?.asset
            ? products?.images && products?.images[0]?.asset
              ? products.images[0]?.asset?._ref
                ? urlForImage(products.images[0]?.asset?._ref).url()
                : "https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png"
              : urlForImage(products.imgcatalogomain?.asset?._ref).url()
            : "https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png"
        }
        alt={`Imagen del producto ${products?.name}`}
      />

      {/* <LoveFollow product={products} /> */}
      {/* descuento y oferta ,stock*/}
      <ProductOfertStyle
        descuento={descuentos?.descuentofritzsport}
        products={products}
        descuentoSobreD={descuentoSobreD}
        stock={products.stock}
      />
      {/* Productos relacionados */}

      <ColoresProducts
        setSkuColor={setSkuColor}
        skuColor={skuColor}
        products={products}
        // data={data}
        urlForImage={urlForImage}
      />

      {/* Información del producto */}
      <ProductInfo
        dataProduct={products}
        descuento={descuentos.descuentofritzsport}
        products={products}
        descuentos={descuentos}
        descuentoSobreD={descuentoSobreD}
        outlet={outlet}
      />
    </div>
  );
}
