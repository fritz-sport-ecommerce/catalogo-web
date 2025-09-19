import React from "react";
import {   ExternalLink, MapPin, Phone, Tag } from "lucide-react";
import Link from "next/link";

const HeaderSubMenu = () => {
  return (
    <div className="w-full px-4 py-1">
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4 text-xs text-gray-500">
        {/* Columna 1: Horarios y Teléfono */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-2 sm:gap-4">
          <span className="flex items-center gap-1 text-center">
            {/* Icono reloj */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Lunes a Domingo de: 9am a 9pm</span>
            <span className="sm:hidden">9am - 10pm</span>
          </span>
          
              <Link href="tel:+51983478551">
            
            <div className="sm:hidden items-center gap-1 flex  bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium hover:bg-green-600 transition-colors">
              <Phone className="w-3 h-3" />
              <span className="">Call Center</span>
          
            </div>
        </Link>
        </div>

        {/* Columna 2: Envío Gratis y Call Center */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-2 sm:gap-4">
          {/* <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Envío Gratis a Lima</span>
            <span className="sm:hidden">Envío Gratis a Lima</span>
          </span> */}
         <Link href="https://www.fritzsportcatalogo.pe">
          <div className="flex xl:hidden  items-center gap-1 bg-emerald-500  px-2 py-1 rounded-full text-xs font-medium hover:bg-emerald-600 transition-colors">
            <Tag size={16} />
            <span>Catálogo</span>
            <ExternalLink size={14} className="" />
          </div>
        </Link>

          {/* Call Center en Verde */}
        
          <Link href="tel:+51983478551">
        
              <div className="sm:flex items-center gap-1 hidden  bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium hover:bg-green-600 transition-colors">
                <Phone className="w-3 h-3" />
                <span className="">Call Center</span>
            
              </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderSubMenu; 