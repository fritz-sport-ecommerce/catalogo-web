"use client";

import { precioProduct } from '@/config/precio-product';
import ToggleUserRole from '@/context/cambiarRol';
import RoleContext from '@/context/roleContext';
import React, { useContext, useEffect, useState } from 'react'

export default function PrecioViewProductMovil({product,descuentos,descuentoSobreD}) {
   // scroll remove
   const [showHeader, setShowHeader] = useState(true);
   const [lastScrollTop, setLastScrollTop] = useState(0);
 
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollTop > lastScrollTop) {
        // Scroll Down
        setShowHeader(false);
      } else {
        // Scroll Up
        setShowHeader(true);
      }
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); // For Mobile or negative scrolling
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);


  const { userRole } = useContext(RoleContext);
  return (
    <div className={`${showHeader ? "top-[80px] " : "top-0 "}  sticky  z-[888] border-b-[1px]  border-blue-gray-300 bg-white text-black dark:bg-black dark:text-white xl:hidden`}>
     <div className=" border-y-[1px] flex z-3 w-full justify-center items-center bg-transparent py-1">

      <ToggleUserRole/>
      </div>
    <div className=" flex w-full items-center justify-center  px-4 py-2 ">
    <h1 className="text-sm sm:text-lg font-bold uppercase tracking-tight 2xl:text-3xl ">
      {product?.name} - {product?.genero}
    </h1>
  
  </div>
  {/* precios */}
  <div className='px-4'>

  <div className="mb-1 flex items-center justify-between w-ful gap-x-2 ">
    <span className='text-base'> {userRole === "emprendedor" ? "PRECIO EMPRENDEDOR:" :"PRECIO MAYORISTA:"}</span>
           
        
              <p className={`text-lg tracking-tight ${userRole === "emprendedor" ? "text-black dark:text-white " :"text-red-500"} font-semibold `}>
                S/
                {userRole === "emprendedor" ? product?.priceemprendedor : product?.pricemayorista}
              </p>
            </div>

            <div className="mb-1 flex items-center justify-between gap-x-2">
              <span className='text-normal'> PRECIO RETAIL:</span>
                  
        
              <p className="text-base tracking-tight ">
                S/
                { product?.priceecommerce.toFixed()}
              </p>
            </div>
  </div>
  </div>

  )
}
