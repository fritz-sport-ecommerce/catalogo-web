"use client";

import { precioProduct } from "@/config/precio-product";
import ToggleUserRole from "@/context/cambiarRol";
import RoleContext from "@/context/roleContext";
import React, { useContext, useEffect, useState } from "react";
import ProductPrecioDescuento from "../product-card/product-precio-descuento";

export default function PrecioViewProductMovil({
  product,

}) {
  // scroll remove
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const navTopVisible = currentScrollTop < 80; // Ajusta 80 si tu NavTop tiene otra altura

      if (currentScrollTop > lastScrollTop) {
        // Scroll Down
        setShowHeader(false);
      } else {
        // Scroll Up
        if (navTopVisible) {
          setShowHeader(true);
        }
      }
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); // For Mobile or negative scrolling
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  const { userRole } = useContext(RoleContext);
  return (
    <div
      className={`${
        showHeader ? "top-[80px]" : "top-0"
      } sticky z-[588] border-b-[1px] border-blue-gray-300 bg-white text-black dark:bg-black dark:text-white xl:hidden transition-all duration-300`}
    >
      <div className=" flex w-full items-center justify-center  px-4 py-2 ">
        <h1 className="text-sm sm:text-lg font-bold uppercase tracking-tight 2xl:text-3xl ">
          {product?.name} - {product?.genero}
        </h1>
      </div>
      {/* precios */}
      <div className="px-4">
        <div className="mb-1 flex items-center justify-between w-ful gap-x-2 "></div>

        <div className="mb-1 flex items-center justify-between gap-x-2">
        

        <ProductPrecioDescuento dataProduct={product}/>
        </div>
      </div>
    </div>
  );
}
